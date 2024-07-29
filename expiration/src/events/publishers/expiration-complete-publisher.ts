import {
  ExpirationCompletedEvent,
  Pubisher,
  Subject,
} from "@hamatotickets/common";

export class ExpirationCompletePublisher extends Pubisher<ExpirationCompletedEvent> {
  readonly subject = Subject.ExpirationComplete;
}
