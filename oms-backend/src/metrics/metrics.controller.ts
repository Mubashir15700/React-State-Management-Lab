import { Controller, Get, Res } from "@nestjs/common";
import * as client from 'prom-client';

@Controller()
export class MetricsController {
    @Get('metrics')
    async getMetrics(@Res() res) {
        res.set('Content-Type', client.register.contentType);
        res.end(await client.register.metrics());
    }
}
