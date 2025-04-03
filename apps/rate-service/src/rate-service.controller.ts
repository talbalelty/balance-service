import { BadRequestException, Controller, Get, Logger, Query } from '@nestjs/common';
import { RateServiceCoinGecko } from './rate-service-coin-gecko.service';

@Controller('rate')
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
    try {
      if (!this.rateServiceService.validateCoins(coins) || !this.rateServiceService.validateCurrency(currency)) {
        throw new BadRequestException('Coins and currency parameters are not valid');
      }
      const res = await this.rateServiceService.getRates(coins.toLowerCase(), currency.toLowerCase());
      this.logger.log(`Returning rates: ${JSON.stringify(res)}`);
      return res;
    } catch (error) {
      this.logger.error('Error fetching rates:', error.message);
      throw error;
    }
  }
}
