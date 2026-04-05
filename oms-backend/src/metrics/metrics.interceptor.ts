import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { httpRequestCounter } from './metrics';

@Injectable()
export class MetricsInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const httpContext = context.switchToHttp(); // Switch to HTTP context to access request and response
        const request = httpContext.getRequest(); // Get the request object here
        const response = httpContext.getResponse(); // Get the response object here

        const method = request.method;
        const route = request.route ? request.route.path : 'unknown';

        return next.handle().pipe(
            tap({
                next: () => {
                    // Pull the status code from the actual HTTP response object
                    const status = response.statusCode;
                    httpRequestCounter.inc({ method, route, status }); // Increment the counter with method, route, and status labels
                },
                error: (error) => {
                    // For errors, NestJS attaches the status to the error object
                    const status = error.status || 500;
                    httpRequestCounter.inc({ method, route, status }); // Increment the counter with method, route, and status labels for errors as well
                }
            })
        );
    }
}
