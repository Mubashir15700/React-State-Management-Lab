import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define types based on your Prisma/NestJS logic
interface OrderItemInput {
    productId: number;
    quantity: number;
}

interface CreateOrderRequest {
    userId: number;
    items: OrderItemInput[];
}

export const orderSlice = createApi({
    reducerPath: 'order', // Cache key for the API slice in the Redux store
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000' }),
    tagTypes: ['Order'], // Tags for cache invalidation
    endpoints: (builder) => ({

        // 1. GET ORDERS API
        // Fetches the list of orders to display in your Management System
        getOrders: builder.query<any[], void>({
            query: () => '/orders',
            providesTags: ['Order'],
        }),

        // 2. CREATE ORDER MUTATION
        // Matches your NestJS Service: async createOrder(userId, items)
        createOrder: builder.mutation<{ order: any; total: number }, CreateOrderRequest>({
            query: (newOrder) => ({
                url: '/orders',
                method: 'POST',
                body: newOrder, // Sends { userId: X, items: [...] }
            }),
            // 'invalidatesTags' tells RTK Query that the 'Order' list is now "old"
            // It will automatically re-fetch getOrders to show the new order.
            invalidatesTags: ['Order'],
        }),

    }),
});

export const { useGetOrdersQuery, useCreateOrderMutation } = orderSlice;