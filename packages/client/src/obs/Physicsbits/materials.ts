import { ContactMaterial, Material } from "p2";

export const floorMaterial = new Material();
export const objectMaterial = new Material();
export const bitsMaterial = new Material();

export const Collide = new ContactMaterial(floorMaterial, objectMaterial, {
  stiffness: 100000,
  relaxation: 0.5,
  friction: 1,
});

export const ObjCollide = new ContactMaterial(objectMaterial, objectMaterial, {
  stiffness: 100000,
  relaxation: 0.5,
});

export const BitsBox = new ContactMaterial(floorMaterial, bitsMaterial, {
  stiffness: 100000,
  relaxation: 0.5,
  friction: 1,
});

export const BitsCollide = new ContactMaterial(bitsMaterial, bitsMaterial, {
  stiffness: 100000,
  relaxation: 0.5,
  friction: 1,
});
