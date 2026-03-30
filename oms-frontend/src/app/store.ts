import { configureStore } from '@reduxjs/toolkit';
import { orderSlice } from '../features/api/orderSlice';

export const store = configureStore({
    reducer: {
        // The API slice (standard RTK Query setup)
        [orderSlice.reducerPath]: orderSlice.reducer,

        // 2. Add your regular slices here
        // auth: authReducer,
    },
    // Adding the api middleware enables caching, invalidation, polling, and other useful features of rtk-query.
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(orderSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
