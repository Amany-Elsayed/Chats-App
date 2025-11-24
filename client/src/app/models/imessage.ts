import { IChat } from "./ichat"
import { IUser } from "./iuser"

export interface IMessage {
    _id: string
    sender: IUser
    content: string
    chat: IChat
    createdAt: string
    updatedAt: string
}
