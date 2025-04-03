import { Controller, Get, Logger, Query } from '@nestjs/common';
import { RateServiceCoinGecko } from './rate-service-coin-gecko.service';

@Controller('rate')
export class RateServiceController {
  private readonly logger = new Logger(RateServiceController.name);

  constructor(
    private readonly rateServiceService: RateServiceCoinGecko
  ) { }

  /**
   * endpoint example: /rate?coins=bitcoin,ethereum&currency=usd
   * @param coins 
   * @param currency 
   * @returns 
   */
  @Get()
  async getRates(
    @Query('coins') coins: string,
    @Query('currency') currency: string
  ): Promise<object> {
    try {
      this.logger.log(`Received request for rates with coins: ${coins} and currency: ${currency}`);
      // Validate the coins and currency parameters
      coins = this.rateServiceService.validateCoins(coins);
      currency = this.rateServiceService.validateCurrency(currency);

      const res = await this.rateServiceService.getRates(coins, currency);
      this.logger.log(`Returning rates: ${JSON.stringify(res)}`);
      return res;
    } catch (error) {
      this.logger.error('Error fetching rates:', error.message);
      throw error;
    }
  }
}
