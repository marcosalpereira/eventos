export type ID = number | string;

let seed = new Date().getTime();

export function id(): string {
  return String(seed++);
}

export function compareFn(c1: {id: ID}, c2: {id: ID}): boolean {
  return c1 && c2 ? c1.id === c2.id : c1 === c2;
}
