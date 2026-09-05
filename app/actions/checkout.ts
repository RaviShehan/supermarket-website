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
    phoneNumber?: string;
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
                    username: data.email, // Required by schema (falls back to email)
                    password: '',         // Required by schema (empty string for guest checkout)
                },
            });
        }

        // Save order & order items in database
        const subtotal = data.totalPrice - 2.0; // Subtracting default $2.00 delivery fee

        const order = await prisma.order.create({
            data: {
                userId: user.id,
                fullName: data.customerName,
                phoneNumber: data.phoneNumber || 'N/A',
                address: data.address,
                city: data.city,
                subtotal: subtotal > 0 ? subtotal : data.totalPrice,
                totalAmount: data.totalPrice,
                status: 'PENDING',
                items: { // Schema uses 'items', not 'orderItems'
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