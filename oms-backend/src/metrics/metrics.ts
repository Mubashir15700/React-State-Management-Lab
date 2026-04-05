import * as client from 'prom-client'; // Change this line

client.collectDefaultMetrics();

export const httpRequestCounter = new client.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status']
});
