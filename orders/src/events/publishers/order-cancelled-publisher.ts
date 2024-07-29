import { OrderCancelledEvent, Pubisher, Subject } from "@hamatotickets/common";

export class OrderCancelledPublisher extends Pubisher<OrderCancelledEvent> {
  readonly subject = Subject.OrderCancelled;
}
