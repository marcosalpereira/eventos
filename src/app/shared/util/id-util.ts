let seed = new Date().getTime();

export function id(): string {
  return String(seed++);
}
