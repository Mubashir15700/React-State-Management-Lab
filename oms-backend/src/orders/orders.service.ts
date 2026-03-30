import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrdersService {
    constructor(
        private prisma: PrismaService,
        private eventEmitter: EventEmitter2,
    ) { }

    async findAll() {
        return this.prisma.order.findMany({
            include: {
                user: {
                    select: {
                        email: true, // Only fetch email, not the whole user object
                    },
                },
                items: {
                    include: {
                        product: true, // Fetch product details (name, price) for each item
                    },
                },
            },
            orderBy: {
                createdAt: 'desc', // Newest orders at the top
            },
        });
    }

    async createOrder(
        userId: number,
        items: { productId: number; quantity: number }[],
    ) {
        return this.prisma.$transaction(async (tx) => {
            // 1. validate user
            const user = await tx.user.findUnique({
                where: { id: userId },
            });

            if (!user) {
                throw new NotFoundException('User not found');
            }

            // 2. fetch products
            const products = await tx.product.findMany({
                where: {
                    id: { in: items.map((i) => i.productId) },
                },
            });

            if (products.length !== items.length) {
                throw new BadRequestException('One or more products are invalid');
            }

            // 3. calculate total
            let total = 0;

            const orderItemsData = items.map((item) => {
                const product = products.find((p) => p.id === item.productId)!;

                if (item.quantity <= 0) {
                    throw new BadRequestException('Quantity must be greater than zero');
                }

                total += product.price * item.quantity;

                return {
                    productId: item.productId,
                    quantity: item.quantity,
                };
            });

            // 4. create order
            const order = await tx.order.create({
                data: {
                    userId,
                    items: {
                        create: orderItemsData,
                    },
                },
                include: { items: true },
            });

            // 5. Emit the Event (Event-Driven Architecture)
            // We don't 'await' this. We just throw it into the wind.
            this.eventEmitter.emit('order.placed', {
                orderId: order.id,
                email: user.email,
            });

            return { order, total };
        });
    }
}