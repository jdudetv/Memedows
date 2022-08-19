import { EventPayloadMap } from "@memedows/types";
import { eventsStore } from "../stores/events";

interface CreateHandlerArgs<T extends keyof EventPayloadMap> {
  event: T;
  handler: (data: EventPayloadMap[T]) => void;
}
export const createHandler = <T extends keyof EventPayloadMap>(
  args: CreateHandlerArgs<T>
) => {
  eventsStore.on(args.event, (e) => args.handler(e));
};
