import { Ticket } from "../ticket";

it("Implements optimistic concurrency control", async () => {
  // create an instance of a ticket
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
    userId: "123",
  });

  // save the ticket to the database
  await ticket.save();

  // fetch the ticket twice
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  // make two separate changes to the ticket we fetched
  firstInstance!.set({ price: 30 });
  secondInstance!.set({ price: 15 });
  // save the first fetch
  await firstInstance!.save();
  // save the second fetch and expect the error
  try {
    await secondInstance!.save();
  } catch (err) {
    return;
  }

  throw new Error("should not reach this point");
});

it("increments the version number when multiple saves", async () => {
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
    userId: "123",
  });

  await ticket.save();

  expect(ticket.version).toEqual(0);
  await ticket.save();
  expect(ticket.version).toEqual(1);
  await ticket.save();
  expect(ticket.version).toEqual(2);
});
