import { Pubisher } from "./base-publisher";
import { Subject } from "./subjects";
import { TicketCreatedEvent } from "./ticket-created-event";

export class TicketCreatedPublisher extends Pubisher<TicketCreatedEvent> {
  readonly subject = Subject.TicketCreated;
}
