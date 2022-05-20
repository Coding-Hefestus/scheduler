
import { Timeslot } from "./timeslot"

export class ReservationRequest{
    user!: number
    paymentIntent!: string
    courtId!: number
    paymentMethod!: string
    total!: number
    reservationDtos!: Timeslot[]
}