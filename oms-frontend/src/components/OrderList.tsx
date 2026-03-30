import React from 'react';
import { useGetOrdersQuery } from '../features/api/orderSlice';

const OrderList: React.FC = () => {
    const { data: orders, isLoading, isError, refetch } = useGetOrdersQuery();

    if (isLoading) return <div className="p-4">Loading warehouse data...</div>;
    if (isError) return <div className="p-4 text-red-500">Error fetching orders. Check backend connection.</div>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Recent Orders</h2>
                <button
                    onClick={() => refetch()}
                    className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                >
                    Refresh
                </button>
            </div>

            <div className="grid gap-4">
                {orders?.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4 shadow-sm bg-white">
                        <div className="flex justify-between border-b pb-2 mb-2">
                            <span className="font-mono font-bold text-blue-600">ORDER #{order.id}</span>
                            <span className="text-gray-500 text-sm">
                                {new Date(order.createdAt).toLocaleString()}
                            </span>
                        </div>

                        <div className="mb-2">
                            <p className="text-sm text-gray-600">Customer: <span className="text-black font-medium">{order.user.email}</span></p>
                        </div>

                        <table className="w-full text-sm text-left">
                            <thead>
                                <tr className="text-gray-400">
                                    <th>Product</th>
                                    <th>Qty</th>
                                    <th className="text-right">Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.items.map((item: any) => (
                                    <tr key={item.id} className="border-t">
                                        <td className="py-1">{item.product.name}</td>
                                        <td>{item.quantity}</td>
                                        <td className="text-right">${(item.product.price * item.quantity).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderList;