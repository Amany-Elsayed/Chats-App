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
  private socketSub?: Subscription

  @ViewChild('scrollContainer')
  scrollContainer!: ElementRef<HTMLDivElement>;
  
  
  constructor(private chatService: ChatService, private socketService: SocketService, private authService: AuthService) {}
  
  ngOnInit(): void {
    this.currentUserId = this.authService.getUserId()
    this.loadUsers()

    this.socketService.onOnlineUsers().subscribe(ids => {
      this.users.forEach(user => {
        user.online = ids.includes(user._id)
      })
    })

    this.socketService.onUserStatus().subscribe(({userId, online}) => {
      const user = this.users.find(u => u._id === userId)
      if (user) {
        user.online = online
      }
    })

    this.socketService.onTyping().subscribe(userId => {
      if (this.selectedUser && userId === this.selectedUser._id) {
        this.typingUsers.add(userId)     
      }
    })

    this.socketService.onStopTyping().subscribe(userId => {
      if (this.selectedUser && userId === this.selectedUser._id) {
        this.typingUsers.delete(userId)
      }
    })

    this.socketService.onMessageStatusUpdate().subscribe(({ messageId, delivered }) => {
      const msg = this.messages.find(m => m._id === messageId)
      if (msg) {
        msg.delivered = delivered
      }
    })

    this.socketService.onMessageRead().subscribe(({ readerId }) => {
      this.messages.forEach(msg => {
        if (
          String(msg.sender) === String(this.currentUserId) &&
          String(msg.receiver) === String(readerId)
        ) {
          msg.read = true
          msg.delivered = true
        }
      })
    })

    this.socketSub = this.socketService.onMessage().subscribe((msg: Message) => {
      if (!this.selectedUser || !this.currentUserId) return

      const sender = String(msg.sender)
      const receiver = String(msg.receiver)
      const selectedUserId = String(this.selectedUser._id)
      const currentUserId = String(this.currentUserId)

      const isRelevant = 
      (sender === selectedUserId && receiver === currentUserId) ||
      (sender === currentUserId && receiver === selectedUserId)

      if (!isRelevant) return

      if (this.messages.some(m => String(m._id) === String(msg._id))) return

      this.messages.push(msg)
      this.scrollToBottom()

      if (msg.sender !== currentUserId) {
        this.socketService.sendDelivered(msg._id)
      }
    })
  }

  ngOnDestroy(): void {
    this.socketSub?.unsubscribe()
  }

  loadUsers(): void {
    this.chatService.getUsers().subscribe({
      next: users => this.users = users,
      error: () => alert('Failed to load users')
    })
  }

  selectUser(user: User): void {
    this.selectedUser = user
    this.messages = []
    this.loadMessages()

    this.socketService.emitMessageRead(user._id)
    this.chatService.markAsRead(user._id).subscribe()
  }

  loadMessages(): void {
    if (!this.selectedUser) return

    this.chatService.getMessages(this.selectedUser._id).subscribe({
      next: msgs => {
        this.messages = msgs
      },
      error: () => alert('Failed to load messages')
    })
  }

  sendMessage(): void {
    if (!this.newMessage.trim() || !this.selectedUser) return
    this.socketService.emitStopTyping(this.selectedUser._id)

    const content = this.newMessage
    this.newMessage = ''

    this.socketService.sendMessage(this.selectedUser._id, content)

    this.chatService.sendMessage(this.selectedUser._id, content).subscribe({
      error: () => alert('Failed to send message')
    })
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
      if (!this.scrollContainer) return
      this.scrollContainer.nativeElement.scrollTop =
        this.scrollContainer.nativeElement.scrollHeight
    })
  }

  toString(value: any): string {
    return String(value)
  }
}
