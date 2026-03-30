import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { PrismaService } from '../prisma/prisma.service';

describe('OrdersService (System Test)', () => {
  let service: OrdersService;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrdersService, PrismaService],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  // CLEANUP: Always clear the DB before each test
  beforeEach(async () => {
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();
    await prisma.user.deleteMany();
  });

  it('should create an order and calculate total correctly (Happy Path)', async () => {
    // 1. SEED: Create data in real Postgres
    const user = await prisma.user.create({ data: { email: 'test@test.com' } });
    const product = await prisma.product.create({ data: { name: 'Laptop', price: 1000 } });

    // 2. ACT: Call the service
    const result = await service.createOrder(user.id, [
      { productId: product.id, quantity: 2 },
    ]);

    // 3. ASSERT: Logical checks
    expect(result.total).toBe(2000);
    expect(result.order.userId).toBe(user.id);
    expect(result.order.items).toHaveLength(1);

    // 4. VERIFY: Check the DB directly
    const orderInDb = await prisma.order.findUnique({ where: { id: result.order.id } });
    expect(orderInDb).toBeDefined();
  });

  it('should ROLLBACK and create nothing if a product is invalid', async () => {
    const user = await prisma.user.create({ data: { email: 'fail@test.com' } });

    // Try to order a product ID that doesn't exist (999)
    await expect(
      service.createOrder(user.id, [{ productId: 999, quantity: 1 }])
    ).rejects.toThrow('One or more products are invalid');

    // VERIFY: Ensure no order was accidentally created
    const orderCount = await prisma.order.count();
    expect(orderCount).toBe(0);
  });
});