import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from '../../services/message.service';
import { IMessage } from '../../models/imessage';
import { IChat } from '../../models/ichat';
import { DatePipe } from '@angular/common';


@Component({
selector: 'app-chat-window',
standalone: true,
imports: [DatePipe],
templateUrl: './chat-window.html',
styleUrls: ['./chat-window.css']
})
export class ChatWindow implements OnInit {
@Input() selectedChat!: IChat;
messages: IMessage[] = [];
loading = false;
currentUserId: any;


constructor(private messageService: MessageService) {}


ngOnInit() {
if (this.selectedChat?._id) {
this.loadMessages();
}
}


loadMessages() {
this.loading = true;
this.messageService.getMessages(this.selectedChat._id).subscribe({
next: (res) => {
this.messages = res;
this.loading = false;
},
error: () => {
this.loading = false;
}
});
}


sendMessage(text: string) {
if (!text.trim() || !this.selectedChat) return;


this.messageService.sendMessage(text, this.selectedChat._id).subscribe({
next: (msg) => {
this.messages.push(msg);
}
});
}
}