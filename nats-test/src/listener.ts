import { randomBytes } from "crypto";
import nats from "node-nats-streaming";

import { TicketCreatedListener } from "./events/ticket-created-listener";

console.clear();

const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "nats://localhost:4222",
});

stan.on("connect", () => {
  console.log("Connected to NATS");

  stan.on("close", () => {
    console.log("NATS connection closed");
    process.exit();
  });

  /**
   * set manuall ack mode
   * ---------------------
   * this is make nats waiting for like 30 seconds to
   * if not getting an acknowledgement it's going to automatically decide
   * to take this event and send to other memeber
   */

  new TicketCreatedListener(stan).listen();
});

process.on("SIGINT", () => stan.close());
process.on("SIGTERM", () => stan.close());
