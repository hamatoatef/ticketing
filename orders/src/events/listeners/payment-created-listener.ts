import {
  Listener,
  OrderStatus,
  PaymentCreatedEvent,
  Subject,
} from "@hamatotickets/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  readonly subject = Subject.PaymentCreated;
  queueGroup = queueGroupName;

  async onMessage(data: PaymentCreatedEvent["data"], msg: Message) {
    const order = await Order.findById(data.orderId);

    if (!order) throw new Error("Order not found");

    order.set({ status: OrderStatus.Complete });

    await order.save();
    msg.ack();
  }
}
