import { Pubisher, Subject, TicketUpdatedEvent } from "@hamatotickets/common";

export class TicketUpdatedPublisher extends Pubisher<TicketUpdatedEvent> {
  readonly subject = Subject.TicketUpdated;
}
