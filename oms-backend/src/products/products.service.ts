import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
    constructor(private prisma: PrismaService) { }

    create(name: string, price: number) {
        return this.prisma.product.create({
            data: { name, price },
        });
    }

    // async test() {
    //     await this.prisma.product.upsert({
    //         create: productsData,
    //         update: productsData,
    //     })
    // }

    async findAll() {
        const plan = await this.prisma.$queryRaw`
            EXPLAIN ANALYZE
            SELECT *
            FROM "OrderItem" oi
            JOIN "Product" p ON oi."productId" = p.id
            WHERE oi."orderId" = 1    
        `;

        console.log(plan);

        return this.prisma.product.findMany();
    }
}