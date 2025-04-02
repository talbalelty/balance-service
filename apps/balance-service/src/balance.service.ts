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

  /**
   * add or remove balance for a user. If the user doesn't have a balance, it will be created.
   * If the user has a balance, it will be updated.
   * 
   * @param userId 
   * @param asset 
   * @returns 
   */
  async addOrRemoveBalance(userId: string, asset: AssetDto): Promise<BalanceDto> {
    const balance: Balance = await this.readBalance(userId);
    balance.assets[asset.name] = (balance.assets[asset.name] || 0) + asset.value;
    // In my app I don't allow customers to go into debt.
    if (balance.assets[asset.name] < 0) {
      throw new NegativeBalanceException(userId, asset.name, balance.assets[asset.name]);
    }

    await this.updateBalance(userId, balance);
    const balanceDto: BalanceDto = new BalanceDto();
    balanceDto.assets = this.convertObjToArray(balance.assets);
    return balanceDto;
  }

  async getBalances(userId: string): Promise<BalanceDto> {
    const balance: Balance = await this.readBalance(userId);
    const balanceDto: BalanceDto = new BalanceDto();
    balanceDto.assets = this.convertObjToArray(balance.assets);
    return balanceDto;
  }

  async getTotalBalance(userId: string, currency: string): Promise<number> {
    const balance: Balance = await this.readBalance(userId);
    const coins = Object.keys(balance.assets).join(',');
    const url = new URL('rate', this.RATE_SERVICE_URL);
    url.searchParams.append('coins', coins);
    url.searchParams.append('currency', currency);
    console.log(url.toString());
    const response = await this.httpService.axiosRef.get(url.toString());
    if (response.status !== 200) {
      throw new Error('Error fetching rates from the service');
    }
    const rates = response.data;
    return this.calculateTotalBalance(balance.assets, rates, currency);
  }

  async createBalance(userId: string, balance: Balance): Promise<Balance> {
    balance.userId = userId;
    await this.databaseService.create(this.TABLE_NAME, userId, balance);
    return balance;
  }

  async readBalance(userId: string): Promise<Balance> {
    return await this.databaseService.queryById(this.TABLE_NAME, userId);
  }

  async updateBalance(userId: string, balance: Balance): Promise<Balance> {
    return await this.databaseService.updateById(this.TABLE_NAME, userId, balance);
  }

  async deleteBalance(userId: string): Promise<void> {
    return await this.databaseService.deleteById(this.TABLE_NAME, userId);
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

  private convertObjToArray(obj: object): any[] {
    return Object.entries(obj).map(([name, value]) => ({ name, value }));
  }
}
