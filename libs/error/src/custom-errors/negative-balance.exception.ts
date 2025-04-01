export class NegativeBalanceException extends Error {
  constructor(userId: string, assetName: string, amount: number) {
    super(`User ${userId} has a negative balance for asset ${assetName}: ${amount}`);
    this.name = 'NegativeBalanceException';
  }
}