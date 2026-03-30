import { Body, Controller, Get, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
    constructor(private ordersService: OrdersService) { }

    @Get()
    async getOrders() {
        return this.ordersService.findAll();
    }

    @Post()
    create(@Body() body: any) {
        return this.ordersService.createOrder(body.userId, body.items);
    }
}