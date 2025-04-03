import { BadRequestException, Body, Controller, Delete, Get, Headers, Logger, Param, Post, Put } from '@nestjs/common';
import { BalanceService } from './balance.service';
import { AssetDto } from './dto/asset.dto';
import { BalanceDto } from './dto';
import { Balance } from '@app/database/models';

/**
 *  We should implement a guard to check if the user is authenticated and authorized to access this endpoint
 */
@Controller('balance')
export class BalanceController {
  private readonly logger = new Logger(BalanceController.name);

  constructor(private readonly balanceService: BalanceService) { }

  @Post()
  async createBalance(
    @Headers('X-User-ID') userId: string,
    @Body() balanceDto: BalanceDto
  ): Promise<BalanceDto> {
    try {
      this.logger.log(`Creating balance for user ${userId}`);
      this.validateUserId(userId);

      const balance = await this.balanceService.createBalance(userId, Balance.fromBalanceDto(balanceDto));
      return BalanceDto.fromBalance(balance);
    } catch (error) {
      this.logger.error(`Error creating balance for user ${userId}: ${error.message}`);
      throw error;
    }
  }

  @Get()
  async getBalances(@Headers('X-User-ID') userId: string): Promise<BalanceDto> {
    try {
      this.logger.log(`Fetching balances for user ${userId}`);
      this.validateUserId(userId);

      return await this.balanceService.getBalances(userId);
    } catch (error) {
      this.logger.error(`Error fetching balances for user ${userId}: ${error.message}`);
      throw error;
    }
  }

  @Put()
  async updateBalance(
    @Headers('X-User-ID') userId: string,
    @Body() balanceDto: BalanceDto
  ): Promise<BalanceDto> {
    try {
      this.logger.log(`Updating balance for user ${userId}`);
      this.validateUserId(userId);

      const balance = await this.balanceService.updateBalance(userId, Balance.fromBalanceDto(balanceDto));
      return BalanceDto.fromBalance(balance);
    } catch (error) {
      this.logger.error(`Error updating balance for user ${userId}: ${error.message}`);
      throw error;
    }
  }

  @Delete()
  async deleteBalance(@Headers('X-User-ID') userId: string): Promise<void> {
    try {
      this.logger.log(`Deleting balance for user ${userId}`);
      this.validateUserId(userId);

      return await this.balanceService.deleteBalance(userId);
    } catch (error) {
      this.logger.error(`Error deleting balance for user ${userId}: ${error.message}`);
      throw error;
    }
  }

  @Put()
  async AddOrRemoveBalance(
    @Headers('X-User-ID') userId: string,
    @Body() asset: AssetDto
  ) {
    try {
      this.logger.log(`Updating balance for user ${userId} with asset ${JSON.stringify(asset)}`);
      this.validateUserId(userId);

      return await this.balanceService.addOrRemoveBalance(userId, asset);
    } catch (error) {
      this.logger.error(`Error updating balance for user ${userId}: ${error.message}`);
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
      this.validateUserId(userId);

      return await this.balanceService.getTotalBalance(userId, currency);
    } catch (error) {
      this.logger.error(`Error fetching total balance for user ${userId} in currency ${currency}: ${error.message}`);
      throw error;
    }
  }

  @Put('rebalance')
  async rebalance(
    @Headers('X-User-ID') userId: string,
    @Body() targetPercentages: Record<string, number>
  ): Promise<BalanceDto> {
    try {
      this.logger.log(`Rebalancing holdings for user ${userId} with target percentages: ${JSON.stringify(targetPercentages)}`);
      this.validateUserId(userId);

      // Validate that the percentages add up to 100
      const totalPercentage = Object.values(targetPercentages).reduce((sum, percentage) => sum + percentage, 0);
      if (totalPercentage !== 100) {
        throw new BadRequestException('Target percentages must add up to 100');
      }

      // Call the service to perform the rebalance
      return await this.balanceService.rebalance(userId, targetPercentages);
    } catch (error) {
      this.logger.error(`Error rebalancing holdings for user ${userId}: ${error.message}`);
      throw error;
    }
  }

  private validateUserId(userId: string) {
    if (!userId) {
      throw new BadRequestException('User ID is required');
    }
  }
}
