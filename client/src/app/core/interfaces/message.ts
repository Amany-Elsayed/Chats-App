export interface Message {
   _id: string;
  sender: string;
  receiver: string;
  content: string;
  createdAt: string;
  delivered: boolean;
  read: boolean;
  isEdited: boolean;
  deleted: boolean;
}
