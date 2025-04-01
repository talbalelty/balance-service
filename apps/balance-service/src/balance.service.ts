import { Injectable } from '@nestjs/common';
import { AssetDto } from './dto/asset.dto';
import { DatabaseService } from '@app/database';
import { NegativeBalanceException } from '@app/error/custom-errors';
import { Asset, Balance } from '@app/database/models';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { BalanceDto } from './dto';


@Injectable()
export class BalanceService {

  private readonly TABLE_NAME = 'balance';
  private readonly RATE_SERVICE_URL: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly databaseService: DatabaseService
  ) {
    this.RATE_SERVICE_URL = this.configService.getOrThrow<string>('RATE_SERVICE_URL');
  }

  async createBalance(userId: string, balanceDto: BalanceDto) {
    balanceDto.userId = userId; // override the userId in the balance object
    const userBalance: Balance = new Balance();
    userBalance.userId = userId;
    userBalance.assets = balanceDto.assets.reduce((acc, asset) => {
      acc[asset.name] = asset.value;
      return acc;
    }, {} as Asset);
    await this.databaseService.create(this.TABLE_NAME, userId, userBalance);
    return balanceDto;
  }

  async updateBalance(userId: string, asset: AssetDto) {
    // get the user balance from the database
    const userBalance: Balance = await this.databaseService.queryById(this.TABLE_NAME, userId);
    // In this service we don't allow debts, so we check if the asset value is negative
    const newValue = userBalance.assets[asset.name] + asset.value;
    if (newValue < 0) {
      throw new NegativeBalanceException(userId, asset.name, newValue);
    }

    userBalance.assets[asset.name] = newValue;
    this.databaseService.updateById(this.TABLE_NAME, userId, userBalance);
  }

  async getTotalBalance(userId: string, currency: string): Promise<number> {
    const balance: Balance = await this.databaseService.queryById(this.TABLE_NAME, userId);
    const coins = Object.keys(balance.assets).join(',');
    const url = new URL('rate', this.RATE_SERVICE_URL);
    url.searchParams.append('coins', coins);
    url.searchParams.append('currency', currency);
    const response = await this.httpService.axiosRef.get(url.toString());
    if (response.status !== 200) {
      throw new Error('Error fetching rates from the service');
    }
    const rates = response.data;
    return this.calculateTotalBalance(balance.assets, rates, currency);
  }

  async getBalances(userId: string): Promise<AssetDto[]> {
    const balance: Balance = await this.databaseService.queryById(this.TABLE_NAME, userId);
    const assets: AssetDto[] = Object.entries(balance.assets).map(([name, value]) => {
      return { name, value };
    });
    return assets;
  }

  private calculateTotalBalance(assets: Asset, rates: object, currency: string): number {
    let total = 0;
    for (const [name, value] of Object.entries(assets)) {
      if (rates[name]) {
        total += value * rates[name][currency];
      }
    }
    return total;
  }

}
