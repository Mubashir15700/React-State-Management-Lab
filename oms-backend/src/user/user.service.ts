import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) { }

    create(email: string) {
        return this.prisma.user.create({
            data: { email },
        });
    }

    findAll() {
        return this.prisma.user.findMany();
    }
}