'use server';

import { prisma } from '@/lib/prisma';

interface CheckoutItem {
    id: string;
    quantity: number;
    price: number;
}

interface CheckoutData {
    customerName: string;
    email: string;
    address: string;
    city: string;
    zipCode: string;
    items: CheckoutItem[];
    totalPrice: number;
}

export async function createOrder(data: CheckoutData) {
    try {
        if (!data.items || data.items.length === 0) {
            return { success: false, error: 'Your cart is empty.' };
        }

        // Find or create user by email
        let user = await prisma.user.findUnique({
            where: { email: data.email },
        });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    email: data.email,
                    name: data.customerName,
                },
            });
        }

        // Save order & order items in database transaction
        const order = await prisma.order.create({
            data: {
                userId: user.id,
                totalAmount: data.totalPrice,
                status: 'PENDING',
                orderItems: {
                    create: data.items.map((item) => ({
                        productId: item.id,
                        quantity: item.quantity,
                        price: item.price,
                    })),
                },
            },
        });

        return { success: true, orderId: order.id };
    } catch (error) {
        console.error('Checkout error:', error);
        return { success: false, error: 'Failed to process order. Please try again.' };
    }
}