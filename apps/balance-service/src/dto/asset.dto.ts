import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AssetDto {
    @IsString()
    @IsNotEmpty()
    @IsEnum(['bitcoin', 'ethereum', 'oobit'])
    name: string;

    @IsNumber()
    @IsNotEmpty()
    value: number;
}

