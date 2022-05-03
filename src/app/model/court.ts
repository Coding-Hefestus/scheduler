import { Reservations } from "./reservations"

export class Court{
    id!: Number
    courtName!: String
    image!: string
    reservations!: Reservations[]
}