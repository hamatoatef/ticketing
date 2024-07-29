import { Listener, Subject, TicketUpdatedEvent } from "@hamatotickets/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subject.TicketUpdated;
  queueGroup = queueGroupName;
  async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
    const { title, price } = data;
    const ticket = await Ticket.findByEvent(data);

    if (!ticket) throw new Error("Ticket not found");

    ticket.set({ title, price });
    await ticket.save();

    msg.ack();
  }
}
