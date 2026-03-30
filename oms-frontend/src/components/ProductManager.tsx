import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchProducts, createProduct } from '../features/api/productsApi';

const ProductManager: React.FC = () => {
    const queryClient = useQueryClient();

    const [name, setName] = useState('');
    const [price, setPrice] = useState('');

    // 1. Fetching Logic (useQuery)
    const { data: products, isLoading, isError, refetch } = useQuery({
        queryKey: ['products'],
        queryFn: fetchProducts,
        // Options:
        // refetchOnWindowFocus: true, // Refetch when user switches back to the tab
        // refetchOnReconnect: true,   // Refetch when Ubuntu regains internet connection
        // refetchOnMount: true,       // Refetch every time the component loads
        // refetchInterval: 5000, // Fetch every 5 seconds
        // refetchIntervalInBackground: true, // Keep fetching even if the tab is hidden
        // staleTime: 1000 * 60 * 5,    // Data stays "fresh" for 5 minutes (won't auto-refetch)
    });

    // 2. Creation Logic (useMutation)
    const mutation = useMutation({
        mutationFn: createProduct,
        onSuccess: () => {
            // Refresh the list immediately after Prisma creates the record
            queryClient.invalidateQueries({ queryKey: ['products'] });
            setName('');
            setPrice('');
        },
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!name || !price) return;
        mutation.mutate({ name, price: Number(price) });
    };

    if (isLoading) return <div className="p-10">Loading Products...</div>;

    if (isError) return <div className="p-10 text-red-500">Error fetching products.</div>;

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold mb-8 text-slate-800">Product Inventory</h1>

                <button
                    onClick={() => refetch()}
                    className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                >
                    Refresh
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* --- FORM SECTION --- */}
                <section className="bg-white p-6 rounded-xl shadow-md border border-slate-100 h-fit">
                    <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-600">Product Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="e.g. Wireless Mouse"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-600">Price ($)</label>
                            <input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="0.00"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={mutation.isPending}
                            className="w-full bg-blue-600 text-white py-2 rounded-md font-bold hover:bg-blue-700 transition-colors disabled:bg-slate-400"
                        >
                            {mutation.isPending ? 'Saving to Database...' : 'Create Product'}
                        </button>
                    </form>
                </section>

                {/* --- LIST SECTION --- */}
                <section>
                    <h2 className="text-xl font-semibold mb-4">Current Stock</h2>
                    <div className="space-y-3">
                        {products?.map((product: any) => (
                            <div
                                key={product.id}
                                className="flex justify-between items-center p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-blue-300 transition-colors"
                            >
                                <div>
                                    <p className="font-bold text-slate-700">{product.name}</p>
                                    <p className="text-xs text-slate-400 font-mono">ID: {product.id}</p>
                                </div>
                                <span className="text-lg font-semibold text-green-600">
                                    ${product.price.toFixed(2)}
                                </span>
                            </div>
                        ))}
                        {products?.length === 0 && <p className="text-slate-400">No products found in Prisma.</p>}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default ProductManager;