import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateSessionRequest {
  @IsNumber()
  @IsNotEmpty()
  productId: number;
}
