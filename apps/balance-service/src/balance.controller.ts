import { Body, Controller, Get, Headers, Logger, Param, Put } from '@nestjs/common';
import { BalanceService } from './balance.service';
import { AssetDto } from './dto/asset.dto';
import { BalanceDto } from './dto';

@Controller('balance')
export class BalanceController {
  private readonly logger = new Logger(BalanceController.name);

  constructor(private readonly balanceService: BalanceService) { }

  @Put()
  async updateBalance(
    @Headers('X-User-ID') userId: string,
    @Body() asset: AssetDto
  ) {
    try {
      this.logger.log(`Updating balance for user ${userId} with asset ${JSON.stringify(asset)}`);
      return await this.balanceService.addOrRemoveBalance(userId, asset);
    } catch (error) {
      this.logger.error(`Error updating balance for user ${userId}: ${error.message}`);
      throw error;
    }
  }

  @Get()
  async getBalances(@Headers('X-User-ID') userId: string): Promise<BalanceDto> {
    try {
      this.logger.log(`Fetching balances for user ${userId}`);
      return await this.balanceService.getBalances(userId);
    } catch (error) {
      this.logger.error(`Error fetching balances for user ${userId}: ${error.message}`);
      throw error;
    }
  }

  @Get('total/:currency')
  async getTotal(
    @Headers('X-User-ID') userId: string,
    @Param('currency') currency: string
  ): Promise<number> {
    try {
      this.logger.log(`Fetching total balance for user ${userId} in currency ${currency}`);
      return await this.balanceService.getTotalBalance(userId, currency);
    } catch (error) {
      this.logger.error(`Error fetching total balance for user ${userId} in currency ${currency}: ${error.message}`);
      throw error;
    }
  }
}
