import { Entity } from "./entity";

export interface PaymentSlot extends Entity<string> {
        numberOfClasses: number,
        price: number
        attendeeId: string;
}