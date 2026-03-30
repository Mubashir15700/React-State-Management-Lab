import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
    constructor(private userService: UserService) { }

    @Post()
    create(@Body() body: { email: string }) {
        return this.userService.create(body.email);
    }

    @Get()
    findAll() {
        return this.userService.findAll();
    }
}