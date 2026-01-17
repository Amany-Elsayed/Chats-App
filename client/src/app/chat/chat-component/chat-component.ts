import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, OnDestroy, ViewChild} from '@angular/core';
import { User } from '../../core/interfaces/user';
import { ChatService } from '../../core/services/chat-service';
import { Message } from '../../core/interfaces/message';
import { FormsModule } from '@angular/forms';
import { SocketService } from '../../core/services/socket-service';
import { AuthService } from '../../core/services/auth-service';

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
  private pollingInterval: any = null

  @ViewChild('scrollContainer')
  scrollContainer!: ElementRef<HTMLDivElement>;
  
  currentUserId: string | null = null
  
  constructor(private chatService: ChatService, private socketService: SocketService, private authService: AuthService) {}
  
  ngOnInit(): void {
    this.currentUserId = this.authService.getUserId()
    this.loadUsers()

    this.socketService.onMessage().subscribe(msg => {
      if (this.selectedUser) {
        const msgSender = String(msg.sender)
        const msgReceiver = String(msg.receiver)
        const selectedUserId = String(this.selectedUser._id)
        const currentUserIdStr = String(this.currentUserId)

        if (msgSender === selectedUserId || msgReceiver === selectedUserId) {
          this.loadMessages()
        }
      }
  })

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
    this.startPolling()
  }

  startPolling(): void {
    this.stopPolling()
    this.pollingInterval = setInterval(() => {
      if (this.selectedUser) {
        this.loadMessages()
      }
    }, 2000)
  }

  stopPolling(): void {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval)
      this.pollingInterval = null
    }
  }

  ngOnDestroy(): void {
    this.stopPolling()
  }

  loadMessages(): void {
    if (!this.selectedUser) {
      this.stopPolling()
      return
    }

    this.chatService.getMessages(this.selectedUser._id).subscribe({
      next: msgs => {
        const previousCount = this.messages.length
        this.messages = msgs
        if (msgs.length > previousCount) {
          this.scrollToBottom()
        }
      },
      error: () => alert('Failed to load messages')
    })
  }

  sendMessage(): void {
    if (!this.newMessage.trim() || !this.selectedUser) return

    this.chatService.sendMessage(this.selectedUser._id, this.newMessage).subscribe({
      next: msg => {
        this.messages.push(msg)
        this.scrollToBottom()
      },
      error: () => alert('Failed to send message')
    })

    this.newMessage = ''
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
