import { Pubisher, Subject, TicketCreatedEvent } from "@hamatotickets/common";

export class TicketCreatedPublisher extends Pubisher<TicketCreatedEvent> {
  readonly subject = Subject.TicketCreated;
}
