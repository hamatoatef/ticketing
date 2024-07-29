import { PaymentCreatedEvent, Pubisher, Subject } from "@hamatotickets/common";

export class PaymentCreatedPublisher extends Pubisher<PaymentCreatedEvent> {
  readonly subject = Subject.PaymentCreated;
}
