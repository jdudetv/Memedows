import { hex } from "color-convert";

export function toRadians(value: number) {
  return value * (Math.PI / 180);
}

export function toDegrees(value: number) {
  return value * (180 / Math.PI);
}

export function HEXtoLED(value: string) {
  let number = hex.hsv(value);
  return (
    ("0000" + number[0].toString(16)).slice(-4) +
    ("0000" + (number[1] * 10).toString(16)).slice(-4) +
    "03e8"
  );
}

export function HSVtoLED(number: any) {
  return (
    ("0000" + number[0].toString(16)).slice(-4) +
    ("0000" + number[1].toString(16)).slice(-4) +
    "03e8"
  );
}
