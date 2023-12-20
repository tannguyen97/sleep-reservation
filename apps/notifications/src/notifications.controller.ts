import {
   NotificationsServiceController,
   NotificationsServiceControllerMethods,
   NotifyEmailDto,
} from '@app/common';
import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Controller()
@NotificationsServiceControllerMethods()
export class NotificationsController implements NotificationsServiceController {
   constructor(private readonly notificationsService: NotificationsService) {}

   @UsePipes(new ValidationPipe())
   async notifyEmail(data: NotifyEmailDto) {
      this.notificationsService.sendEmail(data);
   }
}
