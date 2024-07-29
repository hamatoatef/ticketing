import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { OrderStatus } from "@hamatotickets/common";
import { Order } from "../../models/order";
import mongoose from "mongoose";

it("marks an order as cancelled", async () => {
  // create a new ticket
  const ticket = await Ticket.build({
    title: "concert",
    price: 10,
    id: new mongoose.Types.ObjectId().toHexString(),
  }).save();

  const user = global.signin();

  // create order
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  //canel the order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .expect(204);

  // check if the ticket is marked as cancelled
  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});
