import { Module } from '@nestjs/common';
import { RateServiceController } from './rate-service.controller';
import { RateServiceCoinGecko } from './rate-service-coin-gecko.service';
import { UtilityModule } from '@app/utility';
import { CacheModule } from '@nestjs/cache-manager';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    UtilityModule,
    CacheModule.register({
      ttl: 120000, // 2 minute
    }),
    ScheduleModule.forRoot()
  ],
  controllers: [RateServiceController],
  providers: [RateServiceCoinGecko],
})
export class RateServiceModule { }
