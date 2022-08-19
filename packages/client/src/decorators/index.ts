import { registerStorePersist } from "../metadata";

export const persist = (target: any, propertyName: string): void => {
  registerStorePersist(target, propertyName);
};
