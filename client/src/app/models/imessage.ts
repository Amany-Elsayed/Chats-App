import { Ichat } from "./ichat"
import { Iuser } from "./iuser"

export interface Imessage {
    _id: string
    sender: Iuser
    content: string
    chat: Ichat
    createdAt: string
    updatedAt: string
}
