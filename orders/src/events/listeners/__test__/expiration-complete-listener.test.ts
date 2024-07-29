import mongoose from "mongoose";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { ExpirationCompleteListener } from "../expiration-complete-listener";
import { Order } from "../../../models/order";
import { ExpirationCompletedEvent, OrderStatus } from "@hamatotickets/common";
import { Message } from "node-nats-streaming";

const setup = async () => {
  const listener = new ExpirationCompleteListener(natsWrapper.client);

  // create a save a ticket
  const ticket = await Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "updated concert",
    price: 25,
  }).save();

  const order = Order.build({
    status: OrderStatus.Created,
    userId: "asddgsfsh",
    expiresAt: new Date(),
    ticket,
  });

  await order.save();

  const data: ExpirationCompletedEvent["data"] = {
    orderId: order.id,
  };

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, data, msg, order };
};

it("update the order status to canncelled", async () => {
  const { listener, ticket, data, msg, order } = await setup();

  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("emit an orderCancelled event", async () => {
  const { listener, ticket, data, msg, order } = await setup();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const eventData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );

  expect(eventData.id).toEqual(order.id);
});

it("ack the message", async () => {
  const { listener, ticket, data, msg, order } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
