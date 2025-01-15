import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Max, Min } from 'class-validator';

export class PurchaseBalanceDto {
  @ApiProperty({
    description: 'Cantidad a ingresar',
    type: 'number',
    minimum: 1,
    maximum: 999.99,
    example: 5.58,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1)
  @Max(9999.99)
  amount: number;
}
