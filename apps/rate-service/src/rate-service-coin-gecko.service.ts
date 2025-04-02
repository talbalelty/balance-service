import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RateServiceInterface } from './rate-service.interface';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class RateServiceCoinGecko implements RateServiceInterface {
  private readonly logger = new Logger(RateServiceCoinGecko.name);
  private readonly COIN_GECKO_API_URL: string;
  private readonly COIN_GECKO_API_KEY: string;
  private readonly SUPPORTED_COINS: Set<string>;
  private readonly SUPPORTED_CURRENCIES: Set<string>;

  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.COIN_GECKO_API_URL = this.configService.getOrThrow<string>('COIN_GECKO_URL');
    this.COIN_GECKO_API_KEY = this.configService.getOrThrow<string>('COIN_GECKO_API_KEY');
    this.SUPPORTED_COINS = new Set<string>(this.configService.getOrThrow<string>('SUPPORTED_COINS').toLowerCase().split(',').map(coin => coin.trim()));
    this.SUPPORTED_CURRENCIES = new Set<string>(this.configService.getOrThrow<string>('SUPPORTED_CURRENCIES').toLowerCase().split(',').map(coin => coin.trim()));
  }

  // 1 minute interval
  @Cron('*/1 * * * *')
  async updateRates() {
    const rates = await this.getRatesRequest(Array.from(this.SUPPORTED_COINS).join(','), Array.from(this.SUPPORTED_CURRENCIES).join(','));
    this.logger.log(`Updating rates in cache: ${JSON.stringify(rates)}`);
    const ratesCache = this.ratesToCache(rates);
    this.logger.log(`Setting rates in cache: ${JSON.stringify(ratesCache)}`);
    if (ratesCache.length) {
      await this.cacheManager.mset(ratesCache);
    }
  }

  async getRates(coins: string, currency: string): Promise<object> {
    const sanitizedCoins = coins.split(',').map(coin => coin.trim());
    const cachedRates = await this.cacheManager.mget(sanitizedCoins);
    if (sanitizedCoins.length === cachedRates.length) {
      this.logger.log(`Returning cached rates: ${JSON.stringify(cachedRates)}`);
      return cachedRates;
    }

    const rates = await this.getRatesRequest(coins, currency);
    const ratesCache = this.ratesToCache(rates);
    this.logger.log(`Setting rates in cache: ${JSON.stringify(ratesCache)}`);
    if (ratesCache.length) {
      await this.cacheManager.mset(ratesCache);
    }
    return rates;
  }

  validateCoins(coins: string): boolean {
    const coinsArray = coins.split(',').map(coin => coin.trim().toLowerCase());
    return coinsArray.every(coin => this.SUPPORTED_COINS.has(coin));
  }

  validateCurrency(currency: string): boolean {
    return this.SUPPORTED_CURRENCIES.has(currency.toLowerCase());
  }

  private async getRatesRequest(coins: string, currency: string): Promise<{ [coin: string]: { [currency: string]: number } }> {
    const url = new URL(this.COIN_GECKO_API_URL + '/v3/simple/price');
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

  private ratesToCache(rates: { [coin: string]: { [currency: string]: number } }): Array<{ key: string, value: { [currency: string]: number } }> {
    return Object.entries(rates).map(([coin, currencies]) => {
      return {
        key: coin,
        value: currencies,
      };
    });
  }
}
