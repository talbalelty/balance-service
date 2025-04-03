import { Test, TestingModule } from '@nestjs/testing';
import { BalanceController } from './balance.controller';
import { BalanceService } from './balance.service';
import { AssetDto } from './dto/asset.dto';
import { DatabaseModule } from '@app/database';
import { BalanceDto } from './dto';
import { UtilityModule } from '@app/utility';
import { RecordNotFoundException } from '@app/error/custom-errors';
import { BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';

describe('BalanceController', () => {
  let balanceController: BalanceController;
  let balanceService: BalanceService;
  const userId = '0000';

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, UtilityModule],
      controllers: [BalanceController],
      providers: [BalanceService],
    }).compile();

    balanceController = app.get<BalanceController>(BalanceController);
    balanceService = app.get<BalanceService>(BalanceService);
    // Write a test balance for the userId
    await balanceService.createBalance(userId, {
      "userId": userId,
      "assets": {
        "bitcoin": 50,
        "ethereum": 100
      }
    })
  });

  describe('root', () => {
    it('should add or remove balance', async () => {
      const assetDto: AssetDto = { name: 'bitcoin', value: 1000 };
      await balanceController.AddOrRemoveBalance(userId, assetDto);
      const balanceDto: BalanceDto = await balanceController.getBalances(userId);
      expect(balanceDto).toBeDefined();
      expect(balanceDto.assets).toBeInstanceOf(Array);
      const asset = balanceDto.assets.find((b) => b.name === assetDto.name);
      expect(asset).toBeDefined();
      expect(asset.name).toEqual(assetDto.name);
      expect(asset.value).toEqual(assetDto.value + 50);
    });

    it('should not update balance', async () => {
      const asset: AssetDto = { name: 'bitcoin', value: 1000 };
      await expect(balanceController.AddOrRemoveBalance('XXXX', asset)).rejects.toThrow(RecordNotFoundException);
    });

    it('should not add or remove balance', async () => {
      const asset: AssetDto = new AssetDto(); // must initialize the object to validate it
      asset.name = 'bitcoinZZ';
      asset.value = -1000;
      const errors = await validate(asset);
      expect(errors.length).not.toBe(0);
    });

    it('should return balances', async () => {
      const balanceDto: BalanceDto = await balanceController.getBalances(userId);
      expect(balanceDto).toBeDefined();
      expect(balanceDto.assets).toBeInstanceOf(Array);
      // check asset properties
      expect(balanceDto.assets[0]).toHaveProperty('name');
      expect(balanceDto.assets[0]).toHaveProperty('value');
    });

    it('should return userId does not exist', async () => {
      await expect(balanceController.getBalances('XXXXX')).rejects.toThrow(RecordNotFoundException);
    });

    it('should return bad request', async () => {
      await expect(balanceController.getBalances('')).rejects.toThrow(BadRequestException);
    });

    it('should return total balance', async () => {
      const total = await balanceController.getTotal(userId, 'usd');
      expect(total).toBeDefined();
      expect(typeof total).toBe('number');
    });

    it('should not return total balance', async () => {
      await expect(balanceController.getTotal(userId, 'XXX')).rejects.toThrow("Request failed with status code 400");
    });
  });
});
