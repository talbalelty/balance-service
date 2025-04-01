import { Test, TestingModule } from '@nestjs/testing';
import { RateServiceController } from './rate-service.controller';
import { RateServiceCoinGecko } from './rate-service-coin-gecko.service';
import { RateServiceModule } from './rate-service.module';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';

describe('RateServiceController', () => {
  let rateServiceController: RateServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [RateServiceModule, HttpModule, CacheModule.register()],
      controllers: [RateServiceController],
      providers: [RateServiceCoinGecko],
    }).compile();

    rateServiceController = app.get<RateServiceController>(RateServiceController);
  });

  describe('root', () => {
    it('should return rates', async () => {
      const coins = 'bitcoin,ethereum';
      const currency = 'usd';
      const result = await rateServiceController.getRates(coins, currency);
      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
      expect(result).toHaveProperty('bitcoin');
      expect(result).toHaveProperty('ethereum');
    });

    it('should throw an error if coins or currency are missing', async () => {
      await expect(rateServiceController.getRates('', '')).rejects.toThrow(
        'Coins and currency parameters are required'
      );
    });
  });
});
