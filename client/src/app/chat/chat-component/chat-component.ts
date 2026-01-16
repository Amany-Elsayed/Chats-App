import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { User } from '../../core/interfaces/user';
import { ChatService } from '../../core/services/chat-service';
import { Message } from '../../core/interfaces/message';
import { FormsModule } from '@angular/forms';
import { SocketService } from '../../core/services/socket-service';

@Component({
  selector: 'app-chat-component',
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-component.html',
  styleUrl: './chat-component.css',
})
export class ChatComponent implements OnInit{
  users: User[] = []
  selectedUser: User | null = null
  messages: Message[] = []
  newMessage = ''

  @ViewChild('scrollContainer')
  scrollContainer!: ElementRef<HTMLDivElement>;
  
  constructor(private chatService: ChatService, private socketService: SocketService) {}

  ngOnInit(): void {
    this.loadUsers()

    this.socketService.onMessage().subscribe(msg => {
      if (this.selectedUser && (msg.sender === this.selectedUser._id || msg.receiver === this.selectedUser._id)) {
        this.messages.push(msg)
        this.scrollToBottom()
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
  }

  loadMessages(): void {
    if (!this.selectedUser) return

    this.chatService.getMessages(this.selectedUser._id).subscribe({
      next: msgs => {
        this.messages = msgs
        this.scrollToBottom()
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

    this.socketService.sendMessage(this.selectedUser._id, this.newMessage)
    this.newMessage = ''
  }

  scrollToBottom(): void {
    setTimeout(() => {
      this.scrollContainer.nativeElement.scrollTop = 
        this.scrollContainer.nativeElement.scrollHeight
    })
  }
}
