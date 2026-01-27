import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, OnDestroy, ViewChild} from '@angular/core';
import { User } from '../../core/interfaces/user';
import { ChatService } from '../../core/services/chat-service';
import { Message } from '../../core/interfaces/message';
import { FormsModule } from '@angular/forms';
import { SocketService } from '../../core/services/socket-service';
import { AuthService } from '../../core/services/auth-service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat-component',
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-component.html',
  styleUrl: './chat-component.css',
})
export class ChatComponent implements OnInit, OnDestroy{
  users: User[] = []
  selectedUser: User | null = null
  messages: (Message & { senderId?: string; receiverId?: string })[] = []
  newMessage = ''
  currentUserId: string | null = null

  isUserNearBottom = true
  showNewMessageBtn = false

  typingUsers = new Set<string>()
  typingTimeout: any

  private subs: Subscription[] = []

  @ViewChild('scrollContainer')
  scrollContainer!: ElementRef<HTMLDivElement>;
  
  
  constructor(private chatService: ChatService, private socketService: SocketService, private authService: AuthService) {}
  
  ngOnInit(): void {
    this.currentUserId = this.authService.getUserId()
    this.loadUsers()

    this.subs.push(
      this.socketService.onOnlineUsers().subscribe(ids => {
        this.users.forEach(u => (u.online = ids.includes(u._id)))
      }),

      this.socketService.onUserStatus().subscribe(({userId, online}) => {
        const user = this.users.find(u => u._id === userId)
        if (user) {
          user.online = online
        }
      }),

      this.socketService.onTyping().subscribe(userId => {
        if (this.selectedUser?._id === userId) {
          this.typingUsers.add(userId)     
        }
      }),

      this.socketService.onStopTyping().subscribe(userId => {
        this.typingUsers.delete(userId)
      }),

      this.socketService.onMessageStatusUpdate().subscribe(({ messageId, delivered }) => {
        const msg = this.messages.find(m => m._id === messageId)
        if (msg) {
          msg.delivered = delivered
        }
      }),

      this.socketService.onMessageReadUpdate().subscribe(({ messageId }) => {
        const msg = this.messages.find(m => m._id === messageId)
        if (msg) {
          msg.read = true
          msg.delivered = true
        }
      }),

      this.socketService.onMessage().subscribe(msg => this.handleIncomingMessage(msg))
    )
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe())
  }

  private normalizeMessage(msg: Message) {
    return {
      ...msg,
      senderId: String(msg.sender),
      receiverId: String(msg.receiver)
    }
  }

  private handleIncomingMessage(msg: Message) {
    if (!this.selectedUser || !this.currentUserId) return

    const normalized = this.normalizeMessage(msg)

    const isRelevant = 
      (normalized.senderId === this.selectedUser._id && normalized.receiverId === this.currentUserId) ||
      (normalized.senderId === this.currentUserId && normalized.receiverId === this.selectedUser._id)

    if (!isRelevant) return
    if (this.messages.some(m => m._id === normalized._id)) return

    this.messages.push(normalized)
    if (this.isUserNearBottom) {
      this.scrollToBottom(true)
    } else {
      this.showNewMessageBtn = true
    }

    if (normalized.senderId !== this.currentUserId) {
      this.socketService.sendDelivered(normalized._id)

      if (this.selectedUser?._id === normalized.senderId) {
        setTimeout(() => {
          this.socketService.emitMessageRead([normalized._id])
        }, 0)
      }
    }
  }

  loadUsers(): void {
    this.chatService.getUsers().subscribe(users => (this.users = users))
  }

  selectUser(user: User): void {
    this.selectedUser = user
    this.typingUsers.clear()
    this.messages = []
    this.loadMessages()
  }

  loadMessages(): void {
    if (!this.selectedUser || !this.currentUserId) return

    this.chatService.getMessages(this.selectedUser._id).subscribe(msgs => {
      this.messages = msgs.map(m => this.normalizeMessage(m))

      const unreadIds = this.messages
        .filter(m => !m.read && m.receiverId === this.currentUserId)
        .map(m => m._id)

      if (unreadIds.length) {
        this.socketService.emitMessageRead(unreadIds)
        this.chatService.markAsRead(this.selectedUser!._id).subscribe()
      }

      this.scrollToBottom(true)
    })
  }

  sendMessage(): void {
    if (!this.newMessage.trim() || !this.selectedUser) return

    const content = this.newMessage
    this.newMessage = ''

    this.socketService.emitStopTyping(this.selectedUser._id)
    this.socketService.sendMessage(this.selectedUser._id, content)
  }

  onTypingInput(): void {
    if (!this.selectedUser) return

    this.socketService.emitTyping(this.selectedUser._id)
    clearTimeout(this.typingTimeout)

    this.typingTimeout = setTimeout(() => {
      this.socketService.emitStopTyping(this.selectedUser!._id)
    }, 800)
  }

  isSelectedUserTyping(): boolean {
    return !!this.selectedUser && this.typingUsers.has(this.selectedUser._id)
  }

  formatTime(dataString: string): string {
    const date = new Date(dataString)

    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  scrollToBottom(force: boolean = false): void {
    setTimeout(() => {
      if (!this.scrollContainer) return

      const el = this.scrollContainer.nativeElement

      if (force || this.isUserNearBottom) {
        el.scrollTop = el.scrollHeight
        this.showNewMessageBtn = false
        this.isUserNearBottom = true
      }
    })
  }

  onScroll() {
    if (!this.scrollContainer) return

    const el = this.scrollContainer.nativeElement

    console.log({
      scrollTop: el.scrollTop,
      scrollHeight: el.scrollHeight,
      clientHeight: el.clientHeight
    });
    
    const threshold = 150

    this.isUserNearBottom = 
      el.scrollHeight - (el.scrollTop + el.clientHeight) < threshold

    this.showNewMessageBtn = !this.isUserNearBottom
  }

  trackByMessageId(index: number, msg: Message) {
    return msg._id
  }

}
