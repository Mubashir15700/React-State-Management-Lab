import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class EmailListener {
    @OnEvent('order.placed')
    async handleOrderPlacedEvent(payload: any) {
        console.log(`Sending receipt to ${payload.email}...`);
        // Logic for Nodemailer or SendGrid goes here
    }
}

@Injectable()
export class WarehouseListener {
    @OnEvent('order.placed')
    async handleInventoryUpdate(payload: any) {
        console.log(`Alerting warehouse for Order #${payload.orderId}`);
        // Logic to update external shipping systems
    }
}