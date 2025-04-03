import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AssetDto {
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value.toLowerCase().trim())
    @IsEnum(['bitcoin', 'ethereum'], { message: 'Invalid asset type' })
    name: string;

    @IsNumber({
        allowNaN: false,
        allowInfinity: false,
    })
    @IsNotEmpty()
    value: number;
}

