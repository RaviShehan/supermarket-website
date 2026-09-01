'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { createOrder } from '@/app/actions/checkout';
import Link from 'next/link';

export default function CheckoutPage() {
    const { cart, totalPrice, clearCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [submittedOrderId, setSubmittedOrderId] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState('');

    const [formData, setFormData] = useState({
        customerName: '',
        email: '',
        address: '',
        city: '',
        zipCode: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage('');

        const res = await createOrder({
            ...formData,
            items: cart,
            totalPrice,
        });

        setLoading(false);

        if (res.success && res.orderId) {
            setSubmittedOrderId(res.orderId);
            clearCart();
        } else {
            setErrorMessage(res.error || 'Something went wrong.');
        }
    };

    if (submittedOrderId) {
        return (
            <main className="max-w-2xl mx-auto py-16 px-4 text-center">
                <div className="bg-white p-8 rounded-xl shadow-sm border space-y-4">
                    <div className="text-green-600 text-5xl">✓</div>
                    <h1 className="text-3xl font-bold text-gray-900">Order Confirmed!</h1>
                    <p className="text-gray-600">
                        Thank you for your order. Your order ID is <span className="font-semibold text-gray-800">#{submittedOrderId}</span>.
                    </p>
                    <Link
                        href="/"
                        className="inline-block mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </main>
        );
    }

    if (cart.length === 0) {
        return (
            <main className="max-w-2xl mx-auto py-16 px-4 text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
                <p className="text-gray-500 mb-6">Add items to your cart before proceeding to checkout.</p>
                <Link
                    href="/"
                    className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                    Browse Supermarket
                </Link>
            </main>
        );
    }

    return (
        <main className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

            {errorMessage && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
                    {errorMessage}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
                    <h2 className="text-xl font-semibold border-b pb-2">Shipping Information</h2>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                            required
                            type="text"
                            name="customerName"
                            value={formData.customerName}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                            required
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                        <input
                            required
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                            <input
                                required
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>
                            <input
                                required
                                type="text"
                                name="zipCode"
                                value={formData.zipCode}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Processing Order...' : `Place Order ($${totalPrice.toFixed(2)})`}
                    </button>
                </form>

                {/* Order Summary */}
                <div className="bg-white p-6 rounded-xl border shadow-sm h-fit space-y-4">
                    <h2 className="text-xl font-semibold border-b pb-2">Order Summary</h2>
                    <div className="divide-y max-h-80 overflow-y-auto">
                        {cart.map((item) => (
                            <div key={item.id} className="py-3 flex justify-between items-center text-sm">
                                <div>
                                    <p className="font-medium text-gray-800">{item.name}</p>
                                    <p className="text-gray-500">Qty: {item.quantity}</p>
                                </div>
                                <p className="font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                        ))}
                    </div>

                    <div className="border-t pt-4 flex justify-between font-bold text-lg">
                        <span>Total:</span>
                        <span className="text-green-600">${totalPrice.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </main>
    );
}