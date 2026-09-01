'use client';

import { useCart } from '@/context/CartContext';
import Image from 'next/image';

interface ProductProps {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
}

export default function ProductCard({ id, name, description, price, imageUrl }: ProductProps) {
    const { addToCart } = useCart();

    return (
        <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between">
            <div className="relative h-48 w-full bg-gray-100">
                {imageUrl ? (
                    <Image src={imageUrl} alt={name} fill className="object-cover" />
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                )}
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                    <h3 className="font-semibold text-lg text-gray-900">{name}</h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{description}</p>
                </div>

                <div className="mt-4 flex items-center justify-between">
                    <span className="text-xl font-bold text-green-600">${price.toFixed(2)}</span>
                    <button
                        onClick={() => addToCart({ id, name, price, imageUrl })}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
}