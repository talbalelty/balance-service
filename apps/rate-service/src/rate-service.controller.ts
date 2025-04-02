import { Controller, Get, Logger, Query, UseInterceptors } from '@nestjs/common';
import { RateServiceCoinGecko } from './rate-service-coin-gecko.service';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('rate')
@UseInterceptors(CacheInterceptor)
export class RateServiceController {
  private readonly logger = new Logger(RateServiceController.name);
  constructor(private readonly rateServiceService: RateServiceCoinGecko) { }

  @Get()
  async getRates(
    @Query('coins') coins: string,
    @Query('currency') currency: string
  ): Promise<object> {
    this.logger.log(`Received request for rates with coins: ${coins} and currency: ${currency}`);
    // Validate the coins and currency parameters
    if (!coins || !currency) {
      throw new Error('Coins and currency parameters are required');
    }
    try {
      return await this.rateServiceService.getRates(coins, currency);
    } catch (error) {
      this.logger.error('Error fetching rates:', error);
      throw error;
    }
  }
}
