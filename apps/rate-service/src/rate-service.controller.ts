import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { RateServiceCoinGecko } from './rate-service-coin-gecko.service';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('rate')
@UseInterceptors(CacheInterceptor)
export class RateServiceController {
  constructor(private readonly rateServiceService: RateServiceCoinGecko) {}

  @Get()
  async getRates(
    @Query('coins') coins: string,
    @Query('currency') currency: string
  ): Promise<object> {
    // Validate the coins and currency parameters
    if (!coins || !currency) {
      throw new Error('Coins and currency parameters are required');
    }
    try {
      return await this.rateServiceService.getRates(coins, currency);
    } catch (error) {
      console.error('Error fetching rates:', error);
      throw new Error('Error fetching rates from the service');
    }
  }


}
