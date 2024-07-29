import mongoose from "mongoose";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCancelledListener } from "../order-cancelled-listener";
import { OrderCancelledEvent, OrderStatus } from "@hamatotickets/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../../models/order";

const setup = async () => {
  // create an instance of the listener
  const listener = new OrderCancelledListener(natsWrapper.client);

  // create and save a ticket
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 10,
    status: OrderStatus.Created,
    userId: "123",
    version: 0,
  });

  // save the order
  await order.save();

  // create the fake data event
  const data: OrderCancelledEvent["data"] = {
    id: order.id,
    version: 1,
    ticket: {
      id: "asfagg",
    },
  };

  // create a fake message object
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, order, data, msg };
};

it("update the ticket , publishes an event, and acks the message", async () => {
  const { listener, order, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Order.findById(order.id);

  expect(updatedTicket!.status).toEqual(OrderStatus.Cancelled);

  expect(msg.ack).toHaveBeenCalled();
});
