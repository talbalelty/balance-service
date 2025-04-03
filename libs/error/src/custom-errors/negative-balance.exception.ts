import { HttpException, HttpStatus } from "@nestjs/common";

export class NegativeBalanceException extends HttpException {
  constructor(userId: string, assetName: string, amount: number) {
    super(`User ${userId} has a negative balance for asset ${assetName}: ${amount}`, HttpStatus.BAD_REQUEST);
    this.name = 'NegativeBalanceException';
  }
}