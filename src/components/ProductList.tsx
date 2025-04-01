import React, { useEffect, useState } from 'react';
import { productService, Product } from '../store/productService';
import { addToCart } from '../store/cartSlice';
import { useDispatch } from 'react-redux';

export const ProductList: React.FC = () => {
    const dispatch = useDispatch();

    const [products, setProducts] = useState<(Product & { id: string })[]>([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const loadProducts = async () => {
            try {
                const products = await productService.getAllProducts();
                setProducts(products);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };
        void loadProducts();
    }, []);

    if (loading) return <div>Loading...</div>

    return (
        <div>
            <h1 className='p-4' >Product List</h1>
            <div className="container grid-cols-3 md:grid-cols-3 gap-5 content">
                {products.map((product) => (
                    <div key={product.id} className="border p-4 rounded bg-gradient">
                        <img className='img-fluid rounded' src={product.imageUrl} alt={product.name} />
                        <h3>{product.name}</h3>
                        <p>{product.description}</p>
                        <p>&quot;{product.category}&quot;</p>
                        <p>Price: ${product.price}</p>
                        <p>Stock: {product.stock}</p>
                        <button
                            onClick={() => dispatch(addToCart(product))}
                            className="mt-2 px-4 py-2 rounded bg-gradient"
                        >
                            Add to Cart
                        </button>

                    </div>
                ))}
            </div>
        </div>
    );
};