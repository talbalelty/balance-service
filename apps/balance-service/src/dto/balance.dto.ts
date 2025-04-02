import { IsArray, IsNotEmpty, ValidateNested } from "class-validator";
import { AssetDto } from "./asset.dto";
import { Type } from "class-transformer";

export class BalanceDto {
    @IsArray()
    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => AssetDto)
    assets: AssetDto[];
}