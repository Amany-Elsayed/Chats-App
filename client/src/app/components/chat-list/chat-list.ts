import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { IChat } from '../../models/ichat';

@Component({
  selector: 'app-chat-list',
  standalone: true,
  templateUrl: './chat-list.html',
  styleUrls: ['./chat-list.css']
})
export class ChatList implements OnInit {

  chats: IChat[] = [];
  loading = false;
select: any;

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.loadChats()
  }

  loadChats() {
    this.loading = true;
    this.chatService.fetchChats().subscribe({
      next: (res) => {
        this.chats = res
        this.loading = false
      },
      error: () => {
        this.loading = false
      }
    })
  }

  accessChat(userId: string) {
    this.chatService.accessChat(userId).subscribe({
      next: (chat) => {
        console.log("Opened chat:", chat)
      }
    })
  }
}
