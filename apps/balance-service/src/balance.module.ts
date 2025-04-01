import { Module } from '@nestjs/common';
import { BalanceController } from './balance.controller';
import { BalanceService } from './balance.service';
import { DatabaseModule } from '@app/database';
import { UtilityModule } from '@app/utility';

@Module({
  imports: [DatabaseModule, UtilityModule],
  controllers: [BalanceController],
  providers: [BalanceService],
})
export class BalanceModule {}
