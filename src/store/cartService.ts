import { Product } from './productService';

//typescript interface for CartItem
export interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl: string;
    product: Product;
}

export class CartService {
    //private static property, consistent key for localStorage operations
    private static CART_KEY = 'shopping_cart';

    static getCart(): CartItem[] {
        //static method to retrieve cart
        try {
            const cart = localStorage.getItem(this.CART_KEY); //get cart from local storage
            return cart ? JSON.parse(cart) as CartItem[] : [];// parse JSON or return empty array
        } catch (error) {
            console.error('Error getting cart:', error);
            return []; //return empty array on error
        }
    }

    static addToCart(product: Product, quantity: number = 1): void {
        // get current cart
        try {
            const cart = this.getCart();
            //check if product already exists in cart
            const existingItem = cart.find(item => item.id === product.id);

            if (existingItem) {
                //if exists, increase quantity
                existingItem.quantity += quantity;
            } else {
                //if new, add new cart item
                cart.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    quantity,
                    imageUrl: product.imageUrl,
                    product
                });
            }
            //save updated cart to localStorage
            localStorage.setItem(this.CART_KEY, JSON.stringify(cart));
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    }

    static clearCart(): void {
        localStorage.removeItem(this.CART_KEY);//clear cart when cart key matches
    }

    static calculateTotal(): number {
        return this.getCart().reduce((total, item) => //returns number representing total cart value
            total + (item.price * item.quantity), 0); // starts with value of 0, multiplies item price by quantity, adds result to running total
    }
}

export default CartService;