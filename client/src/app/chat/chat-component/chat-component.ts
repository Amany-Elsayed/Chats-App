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
  messages: Message[] = []
  newMessage = ''
  currentUserId: string | null = null

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

  private handleIncomingMessage(msg: Message) {
    if (!this.selectedUser || !this.currentUserId) return

    const sender = String(msg.sender)
    const receiver = String(msg.receiver)

    const isRelevant = 
      (sender === this.selectedUser._id && receiver === this.currentUserId) ||
      (sender === this.currentUserId && receiver === this.selectedUser._id)

    if (!isRelevant) return
    if (this.messages.some(m => m._id === msg._id)) return

    this.messages.push(msg)
    this.scrollToBottom()

    if (sender !== this.currentUserId) {
      this.socketService.sendDelivered(msg._id)

      if (this.selectedUser && sender === String(this.selectedUser._id)) {
        this.socketService.emitMessageRead([msg._id])
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
    if (!this.selectedUser) return

    this.chatService.getMessages(this.selectedUser._id).subscribe(msgs => {
      this.messages = msgs

      const unreadIds = msgs
        .filter(m => !m.read && String(m.receiver) === String(this.currentUserId))
        .map(m => m._id)

      if (unreadIds.length) {
        this.socketService.emitMessageRead(unreadIds)
        this.chatService.markAsRead(this.selectedUser!._id).subscribe()
      }
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

  scrollToBottom(): void {
    setTimeout(() => {
      this.scrollContainer.nativeElement.scrollTop =
        this.scrollContainer.nativeElement.scrollHeight
    })
  }

  toString(value: any): string {
    return String(value)
  }
}
