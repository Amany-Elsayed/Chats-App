import { IMessage } from "./imessage"
import { IUser } from "./iuser"

export interface IChat {
    _id: string
    chatName: string
    isGroupChat: boolean
    users: IUser[]
    latestMessage?: IMessage
    groupAdmin?: IUser
}
