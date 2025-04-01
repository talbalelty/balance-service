import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AssetDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNumber()
    @IsNotEmpty()
    value: number;
}

