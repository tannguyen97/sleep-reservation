import { NOTIFICATIONS_SERVICE } from '@app/common';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import Stripe from 'stripe';
import { PaymentsCreateChargeDto } from './dto/payment-create-charge.dto';
import { NotifyEmailDto } from '@app/common';

@Injectable()
export class PaymentsService {
  private readonly stripe = new Stripe(
    this.configService.get('STRIPE_SECRET_KEY'), 
    {
      apiVersion: '2023-10-16'
    }
  )
  constructor(
    private readonly configService: ConfigService,
    @Inject(NOTIFICATIONS_SERVICE)
    private readonly notificationService: ClientProxy
  ) {}

  async createCharge({ amount, email }: PaymentsCreateChargeDto) {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: amount * 100,
      confirm: true,
      payment_method: "pm_card_visa",
      currency: 'usd',
      automatic_payment_methods: { 
        enabled: true,
        allow_redirects: 'never'
      }
    })

    this.notificationService.emit<string, NotifyEmailDto>('notify_email', {
      email,
      text: `Your payment of $${amount} has completed successfully.`
    });

    return paymentIntent;
  }
}
