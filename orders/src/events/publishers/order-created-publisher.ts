import { OrderCreatedEvent, Pubisher, Subject } from "@hamatotickets/common";

export class OrderCreatedPublisher extends Pubisher<OrderCreatedEvent> {
  readonly subject = Subject.OrderCreated;
}
