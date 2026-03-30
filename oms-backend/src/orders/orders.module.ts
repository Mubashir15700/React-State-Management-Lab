import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { EmailListener, WarehouseListener } from 'src/notifications/listeners/email.listener';

@Module({
  imports: [EventEmitterModule.forRoot()], // Required to enable events
  providers: [
    OrdersService,
    EmailListener,
    WarehouseListener
  ],
  controllers: [OrdersController]
})
export class OrdersModule { }
