import { Controller, Get, UsePipes, ValidationPipe } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PaymentsCreateChargeDto } from './dto/payment-create-charge.dto';
import { PaymentsServiceControllerMethods } from '@app/common';

@Controller()
@PaymentsServiceControllerMethods()
export class PaymentsController {
   constructor(private readonly paymentsService: PaymentsService) {}

   @MessagePattern('create_charge')
   @UsePipes(new ValidationPipe())
   async createCharge(@Payload() data: PaymentsCreateChargeDto) {
      return this.paymentsService.createCharge(data);
   }
}
