import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RateServiceInterface } from './rate-service.interface';

@Injectable()
export class RateServiceCoinGecko implements RateServiceInterface {
  private readonly COIN_GECKO_API_URL: string;
  private readonly COIN_GECKO_API_KEY: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.COIN_GECKO_API_URL = this.configService.getOrThrow<string>('COIN_GECKO_URL');
    this.COIN_GECKO_API_KEY = this.configService.getOrThrow<string>('COIN_GECKO_API_KEY');
  }

  async getRates(coins: string, currency: string): Promise<object> {
    const url = new URL(this.COIN_GECKO_API_URL + '/simple/price');
    url.searchParams.append('ids', coins);
    url.searchParams.append('vs_currencies', currency);
    const response = await this.httpService.axiosRef({
      method: 'GET',
      url: url.toString(),
      headers: { accept: 'application/json', 'x-cg-demo-api-key': this.COIN_GECKO_API_KEY }
    });

    if (response.status !== 200) {
      throw new Error(`Error fetching rates: ${response.statusText}`);
    }
    
    return response.data;
  }
}
