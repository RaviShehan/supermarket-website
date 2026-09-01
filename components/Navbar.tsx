'use client';

import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
    const { cart, totalItems, totalPrice, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart } = useCart();

    return (
        <>
            {/* Sticky Top Header */}
            <header className="sticky top-0 z-40 bg-white border-b shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link href="/" className="text-2xl font-bold text-green-700 hover:opacity-90">
                        Fresh Supermarket
                    </Link>

                    <button
                        onClick={() => setIsCartOpen(true)}
                        className="relative bg-green-50 text-green-700 px-4 py-2 rounded-full font-medium hover:bg-green-100 transition-colors flex items-center gap-2"
                    >
                        <span>Cart</span>
                        {totalItems > 0 && (
                            <span className="bg-green-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                                {totalItems}
                            </span>
                        )}
                    </button>
                </div>
            </header>

            {/* Cart Drawer Overlay */}
            {isCartOpen && (
                <div className="fixed inset-0 z-50 overflow-hidden">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsCartOpen(false)}
                    />

                    <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
                        <div className="w-screen max-w-md bg-white shadow-xl flex flex-col justify-between">

                            {/* Drawer Header */}
                            <div className="p-6 border-b flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-800">Your Cart</h2>
                                <button
                                    onClick={() => setIsCartOpen(false)}
                                    className="text-gray-400 hover:text-gray-600 text-2xl font-semibold"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Items List */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                {cart.length === 0 ? (
                                    <p className="text-gray-500 text-center py-10">Your cart is empty.</p>
                                ) : (
                                    cart.map((item) => (
                                        <div key={item.id} className="flex items-center justify-between border-b pb-4 gap-4">
                                            <div className="relative h-16 w-16 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                                                {item.imageUrl && (
                                                    <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-gray-900 text-sm">{item.name}</h4>
                                                <p className="text-green-600 font-bold text-sm">${item.price.toFixed(2)}</p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="bg-gray-200 px-2 rounded text-xs font-bold hover:bg-gray-300"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="text-sm font-medium">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="bg-gray-200 px-2 rounded text-xs font-bold hover:bg-gray-300"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-red-500 text-xs font-medium hover:underline"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Drawer Footer */}
                            {cart.length > 0 && (
                                <div className="p-6 border-t bg-gray-50 space-y-4">
                                    <div className="flex justify-between text-lg font-bold">
                                        <span>Total:</span>
                                        <span className="text-green-700">${totalPrice.toFixed(2)}</span>
                                    </div>
                                    <Link
                                        href="/checkout"
                                        onClick={() => setIsCartOpen(false)}
                                        className="block w-full text-center bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-colors"
                                    >
                                        Proceed to Checkout
                                    </Link>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            )}
        </>
    );
}