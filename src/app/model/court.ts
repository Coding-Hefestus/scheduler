import { Reservations } from "./reservations"

export class Court{
    courtId!: number
    name!: String
    url!: string
    dimension!: string
    type: string
    covered: boolean
    reservationCourtInfos!: Reservations[]
}