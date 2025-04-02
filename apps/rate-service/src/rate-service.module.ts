import { Module } from '@nestjs/common';
import { RateServiceController } from './rate-service.controller';
import { RateServiceCoinGecko } from './rate-service-coin-gecko.service';
import { UtilityModule } from '@app/utility';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [UtilityModule, CacheModule.register({
    ttl: 10000, // 10 seconds
  })],
  controllers: [RateServiceController],
  providers: [RateServiceCoinGecko],
})
export class RateServiceModule { }
