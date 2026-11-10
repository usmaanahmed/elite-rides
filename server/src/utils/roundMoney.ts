// Paisa 2 decimals par round karta hai (e.g. 8.925 -> 8.93)
export function roundMoney(amount: number): number {
  return Math.round((amount + Number.EPSILON) * 100) / 100;
}
