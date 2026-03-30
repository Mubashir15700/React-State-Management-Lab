import React, { useState } from 'react';
import { useCreateOrderMutation } from '../features/api/orderSlice';

const CreateOrderForm: React.FC = () => {
    const [createOrder, { isLoading }] = useCreateOrderMutation();

    // Local state for the form
    const [userId, setUserId] = useState<number>(1);
    const [productId, setProductId] = useState<number>(0);
    const [quantity, setQuantity] = useState<number>(1);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Data shape matches your NestJS service: { userId, items: [{ productId, quantity }] }
            await createOrder({
                userId,
                items: [{ productId, quantity }]
            }).unwrap();

            alert('Order Created Successfully!');
            // Reset form
            setProductId(0);
            setQuantity(1);
        } catch (err: any) {
            alert(`Failed to create order: ${err.data?.message || 'Server Error'}`);
        }
    };

    return (
        <div className="p-6 bg-gray-50 rounded-xl border m-6">
            <h2 className="text-xl font-bold mb-4">Create New Order</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium">User ID</label>
                    <input
                        type="number"
                        value={userId}
                        onChange={(e) => setUserId(Number(e.target.value))}
                        className="w-full p-2 border rounded"
                    />
                </div>

                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium">Product ID</label>
                        <input
                            type="number"
                            placeholder="e.g. 101"
                            value={productId || ''}
                            onChange={(e) => setProductId(Number(e.target.value))}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div className="w-32">
                        <label className="block text-sm font-medium">Quantity</label>
                        <input
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-2 rounded text-white font-bold ${isLoading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
                        }`}
                >
                    {isLoading ? 'Processing...' : 'Submit Order'}
                </button>
            </form>
        </div>
    );
};

export default CreateOrderForm;