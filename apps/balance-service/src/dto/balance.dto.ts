import { IsArray, IsNotEmpty, ValidateNested } from "class-validator";
import { AssetDto } from "./asset.dto";
import { Type } from "class-transformer";
import { Balance } from "@app/database/models";

export class BalanceDto {
    userId: string;

    @IsArray()
    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => AssetDto)
    assets: AssetDto[];

    constructor() { }

    static fromBalance(balance: Balance): BalanceDto {
        const balanceDto = new BalanceDto();
        balanceDto.userId = balance.userId;
        balanceDto.assets = Object.entries(balance.assets).map(([name, value]) => {
            const asset = new AssetDto();
            asset.name = name;
            asset.value = value;
            return asset;
        });
        return balanceDto;
    }
}