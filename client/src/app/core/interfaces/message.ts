export interface Message {
  _id: string;
  sender: string;
  receiver: string;
  type: 'text' | 'audio';
  content: string;
  audioUrl: string;
  duration: number;
  createdAt: string;
  delivered: boolean;
  read: boolean;
  isEdited: boolean;
  deleted: boolean;
}
