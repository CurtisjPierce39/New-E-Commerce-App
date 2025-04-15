import React, { useEffect, useState } from 'react';
import { productService, Product } from '../store/productService';
import { addToCart } from '../store/cartSlice';
import { useDispatch } from 'react-redux';

export const ProductList: React.FC = () => {
    const dispatch = useDispatch();
// Sets state
    const [products, setProducts] = useState<(Product & { id: string })[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [categories, setCategories] = useState<string[]>([]);
// useEffect hook used to fetch products
    useEffect(() => {
        const loadProducts = async () => {
            try {
                const products = await productService.getAllProducts();
                setProducts(products);
                const uniqueCategories = [...new Set(products.map(product => product.category))];
                setCategories(uniqueCategories);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };
        void loadProducts();
    }, []);

    const filteredProducts = selectedCategory === 'all'
        ? products
        : products.filter(product => product.category === selectedCategory);

    if (loading) return <div>Loading...</div>
// Renders list of products
    return (
        <div>
            <h1 className='p-4'>Product List</h1>
            <div className="mb-4 px-4">
                {/* dropdown list of categories */}
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="p-2 border rounded bg-gradient"
                >
                    <option value="all">All Categories</option>
                    {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                    ))}
                </select>
            </div>
            <div className="container content">
                {filteredProducts.map((product) => (
                    <div key={product.id} className="border p-4 rounded bg-gradient">
                        <img className='img-fluid rounded' src={product.imageUrl} alt={product.name} />
                        <h3>{product.name}</h3>
                        <p>{product.description}</p>
                        <p>&quot;{product.category}&quot;</p>
                        <p><strong>Price:</strong> ${product.price}</p>
                        <p><strong>Stock:</strong> {product.stock}</p>
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