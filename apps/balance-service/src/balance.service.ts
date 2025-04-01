import { Injectable } from '@nestjs/common';
import { AssetDto } from './dto/asset.dto';

@Injectable()
export class BalanceService {
  getHello(): string {
    return 'Hello World!';
  }

  updateBalance(userId: string, asset: AssetDto) {
    throw new Error('Method not implemented.');
  }

  getTotalBalance(userId: string, currency: string): number {
    throw new Error('Method not implemented.');
  }
  
  getBalances(userId: string): AssetDto[] {
    throw new Error('Method not implemented.');
  }
}
