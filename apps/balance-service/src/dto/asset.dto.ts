import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AssetDto {
    @IsString()
    @IsNotEmpty()
    @IsEnum(['bitcoin', 'ethereum', 'oobit'], { message: 'Invalid asset type' })
    name: string;

    @IsNumber({
        allowNaN: false,
        allowInfinity: false,
    })
    @IsNotEmpty()
    value: number;
}

