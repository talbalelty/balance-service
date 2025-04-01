import { Body, Controller, Get, Headers, Param, Put, Query } from '@nestjs/common';
import { BalanceService } from './balance.service';
import { AssetDto } from './dto/asset.dto';

@Controller('balance')
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) { }

  @Put()
  updateBalance(
    @Headers('X-User-ID') userId: string, 
    @Body() asset: AssetDto
  ): void {
    this.balanceService.updateBalance(userId, asset);
  }

  @Get()
  getBalances(@Headers('X-User-ID') userId: string): AssetDto[] {
    return this.balanceService.getBalances(userId);
  }

  @Get('total/:currency')
  async getTotal(
    @Headers('X-User-ID') userId: string, 
    @Param('currency') currency: string
  ): Promise<number> {
    return await this.balanceService.getTotalBalance(userId, currency);
  }
}
