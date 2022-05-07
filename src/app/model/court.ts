import { Reservations } from "./reservations"

export class Court{
    id!: Number
    name!: String
    url!: string
    reservations!: Reservations[]
}