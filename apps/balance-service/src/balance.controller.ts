import { Body, Controller, Get, Headers, Param, Post, Put } from '@nestjs/common';
import { BalanceService } from './balance.service';
import { AssetDto } from './dto/asset.dto';
import { BalanceDto } from './dto';

@Controller('balance')
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) { }

  @Post()
  async createBalance(
    @Headers('X-User-ID') userId: string, 
    @Body() balance: BalanceDto
  )  {
    return await this.balanceService.createBalance(userId, balance);
  }

  @Put()
  async updateBalance(
    @Headers('X-User-ID') userId: string, 
    @Body() asset: AssetDto
  ) {
    return await this.balanceService.updateBalance(userId, asset);
  }

  @Get()
  async getBalances(@Headers('X-User-ID') userId: string): Promise<AssetDto[]> {
    return await this.balanceService.getBalances(userId);
  }

  @Get('total/:currency')
  async getTotal(
    @Headers('X-User-ID') userId: string, 
    @Param('currency') currency: string
  ): Promise<number> {
    return await this.balanceService.getTotalBalance(userId, currency);
  }
}
