import { BalanceDto } from "apps/balance-service/src/dto";
import { Asset } from "./asset.model";

export class Balance {
    userId: string;
    assets: Asset;

    constructor() { }

    static fromBalanceDto(balanceDto: BalanceDto): Balance {
        const balance = new Balance();
        balance.userId = balanceDto.userId;
        balance.assets = balanceDto.assets.reduce((acc, asset) => {
            acc[asset.name] = asset.value;
            return acc;
        }, {});
        return balance;
    }
}