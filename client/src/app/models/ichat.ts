import { Imessage } from "./imessage"
import { Iuser } from "./iuser"

export interface Ichat {
    _id: string
    chatName: string
    isGroupChat: boolean
    users: Iuser[]
    latestMessage?: Imessage
    groupAdmin?: Iuser
}
