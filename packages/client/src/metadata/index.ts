const persists = new Map<Object, string[]>();

export const registerStorePersist = (
  { constructor }: Object,
  property: string
) => {
  if (!persists.has(constructor)) persists.set(constructor, []);
  persists.get(constructor)?.push(property);
};

export const getStorePersists = (target: Function) =>
  persists.get(target) ?? [];
