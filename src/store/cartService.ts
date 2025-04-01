import { Product } from './productService';

export interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl: string;
    product: Product;
}

export class CartService {
    private static CART_KEY = 'shopping_cart';

    static getCart(): CartItem[] {
        try {
            const cart = localStorage.getItem(this.CART_KEY);
            return cart ? JSON.parse(cart) as CartItem[] : [];
        } catch (error) {
            console.error('Error getting cart:', error);
            return [];
        }
    }

    static addToCart(product: Product, quantity: number = 1): void {
        try {
            const cart = this.getCart();
            const existingItem = cart.find(item => item.id === product.id);

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    quantity,
                    imageUrl: product.imageUrl,
                    product
                });
            }

            localStorage.setItem(this.CART_KEY, JSON.stringify(cart));
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    }

    static clearCart(): void {
        localStorage.removeItem(this.CART_KEY);
    }

    static calculateTotal(): number {
        return this.getCart().reduce((total, item) =>
            total + (item.price * item.quantity), 0);
    }
}