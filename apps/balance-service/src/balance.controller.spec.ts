import { Test, TestingModule } from '@nestjs/testing';
import { BalanceController } from './balance.controller';
import { BalanceService } from './balance.service';
import { AssetDto } from './dto/asset.dto';

describe('BalanceController', () => {
  let balanceController: BalanceController;
  const userId = '0000';

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [BalanceController],
      providers: [BalanceService],
    }).compile();

    balanceController = app.get<BalanceController>(BalanceController);
  });

  describe('root', () => {
    it('should update balance', () => {
      const asset: AssetDto = { name: 'bitcoin', value: 1000 };
      balanceController.updateBalance(userId, asset);
      // TODO : check if the balance was updated correctly

    });

    it('should not update balance', () => {
      const asset: AssetDto = { name: 'XXXXX', value: 1000 };
      balanceController.updateBalance(userId, asset);
      // TODO : check if the balance was not updated

    });

    it('should return balances', () => {
      const assets = balanceController.getBalances(userId);
      expect(assets).toBeInstanceOf(Array);
      // check asset properties
      expect(assets[0]).toHaveProperty('name');
      expect(assets[0]).toHaveProperty('value');
    });

    it('should return userId does not exist', () => {
      balanceController.getBalances('XXXXX');
      // TODO : check if the userId does not exist
    });

    it('should return total balance', () => {
      const currency = 'usd';
      const total = balanceController.getTotal(userId, currency);
      expect(total).toBeDefined();
      expect(typeof total).toBe('number');
    });

    // TODO: check if the currency is not supported
  });
});
