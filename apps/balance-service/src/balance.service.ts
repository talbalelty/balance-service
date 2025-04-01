import { Injectable } from '@nestjs/common';
import { AssetDto } from './dto/asset.dto';
import { DatabaseService } from '@app/database';
import { NegativeBalanceException } from '@app/error/custom-errors';
import { Balance } from '@app/database/models';


@Injectable()
export class BalanceService {
  private readonly TABLE_NAME = 'balance';

  constructor(private readonly databaseService: DatabaseService) { }

  getHello(): string {
    return 'Hello World!';
  }

  updateBalance(userId: string, asset: AssetDto) {
    // get the user balance from the database
    const userBalance: Balance = this.databaseService.queryById(this.TABLE_NAME, userId);
    // In this service we don't allow depts, so we check if the asset value is negative
    const newValue = userBalance.assets[asset.name] + asset.value;
    if (newValue < 0) {
      throw new NegativeBalanceException(userId, asset.name, newValue);
    }
    
    userBalance.assets[asset.name] = newValue;
    this.databaseService.updateById(this.TABLE_NAME, userId, userBalance);
  }

  getTotalBalance(userId: string, currency: string): number {
    throw new Error('Method not implemented.');
  }

  getBalances(userId: string): AssetDto[] {
    throw new Error('Method not implemented.');
  }
}
