import { Listener, Subject, TicketCreatedEvent } from "@hamatotickets/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subject.TicketCreated;
  queueGroup = queueGroupName;
  async onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    const { id, title, price } = data;

    const ticket = await Ticket.build({ id, title, price }).save();

    msg.ack();
  }
}
