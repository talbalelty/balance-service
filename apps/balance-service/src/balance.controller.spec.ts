import { Test, TestingModule } from '@nestjs/testing';
import { BalanceController } from './balance.controller';
import { BalanceService } from './balance.service';
import { AssetDto } from './dto/asset.dto';
import { DatabaseModule } from '@app/database';
import { BalanceDto } from './dto';
import { UtilityModule } from '@app/utility';

describe('BalanceController', () => {
  let balanceController: BalanceController;
  const userId = '0000';

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, UtilityModule],
      controllers: [BalanceController],
      providers: [BalanceService],
    }).compile();

    balanceController = app.get<BalanceController>(BalanceController);
  });

  describe('root', () => {
    it('should add or remove balance', async () => {
      const assetDto: AssetDto = { name: 'bitcoin', value: 1000 };
      await balanceController.updateBalance(userId, assetDto);
      const balanceDto: BalanceDto = await balanceController.getBalances(userId);
      expect(balanceDto).toBeDefined();
      expect(balanceDto.assets).toBeInstanceOf(Array);
      const asset = balanceDto.assets.find((b) => b.name === assetDto.name);
      expect(asset).toBeDefined();
      expect(asset.name).toEqual(assetDto.name);
      expect(asset.value).toEqual(assetDto.value + 50);
    });

    // it('should not update balance', () => {
    //   const asset: AssetDto = { name: 'XXXXX', value: 1000 };
    //   expect(() => balanceController.updateBalance(userId, asset)).toThrow();
    //   // TODO : check if the balance was not updated

    // });

    it('should return balances', async () => {
      const balanceDto: BalanceDto = await balanceController.getBalances(userId);
      expect(balanceDto).toBeDefined();
      expect(balanceDto.assets).toBeInstanceOf(Array);
      // check asset properties
      expect(balanceDto.assets[0]).toHaveProperty('name');
      expect(balanceDto.assets[0]).toHaveProperty('value');
    });

    it('should return userId does not exist', () => {
      balanceController.getBalances('XXXXX');
      // TODO : check if the userId does not exist
    });

    it('should return total balance', async () => {
      const currency = 'usd';
      const total = await balanceController.getTotal(userId, currency);
      expect(total).toBeDefined();
      expect(typeof total).toBe('number');
    });

    // TODO: check if the currency is not supported
  });
});
