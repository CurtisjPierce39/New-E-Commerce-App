import * as React from 'react';
import { useState } from 'react';
import { productService, Product } from '../store/productService';

const ProductForm: React.FC = () => {
    const [product, setProduct] = useState<Omit<Product, 'productId' | 'id'>>({
        name: '',
        price: 0,
        description: '',
        stock: 0,
        imageUrl: '',
        category: '',
    });


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProduct(prev => ({
            ...prev,
            [name]: name === 'price' || name === 'stock' ? Number(value) : value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        void (async () => {
            try {
                await productService.createProduct({
                    name: product.name,
                    price: product.price,
                    description: product.description,
                    stock: product.stock,
                    imageUrl: product.imageUrl,
                    category: product.category
                });
                setProduct({
                    name: '',
                    price: 0,
                    description: '',
                    stock: 0,
                    imageUrl: '',
                    category: '',
                });
                alert('Product added successfully!');
            } catch (error) {
                console.error('Error adding product:', error);
            }
        })();
    };

    return (
        <form onSubmit={handleSubmit} role="form" className='container'>
            <div>
                <label htmlFor="name">Product Name</label><br></br>
                <input
                    className='m-2'
                    type="text"
                    id="name"
                    name="name"
                    placeholder='Enter Price Here'
                    value={product.name}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="price">Price</label><br></br>
                <input
                    className='m-2'
                    type="number"
                    id="price"
                    name="price"
                    value={product.price}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="description">Description</label><br></br>
                <textarea
                    className='m-2 p-4 rounded'
                    id="description"
                    name="description"
                    placeholder='Enter Description Here'
                    value={product.description}
                    onChange={handleChange}
                    required
                />
            </div><br></br>
            <div>
                <label htmlFor="stock">Stock</label><br></br>
                <input
                    className='m-2'
                    type="number"
                    id="stock"
                    name="stock"
                    value={product.stock}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="imageUrl">Image URL</label><br></br>
                <input
                    className='m-2'
                    type="text"
                    id="imageUrl"
                    name="imageUrl"
                    placeholder='Enter Image URL Here'
                    value={product.imageUrl}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="category">Category</label><br></br>
                <input
                    className='m-2'
                    type="text"
                    id="category"
                    name="category"
                    placeholder='Enter Category Here'
                    value={product.category}
                    onChange={handleChange}
                    required
                />
            </div><br></br>
            <button className='m-2 bg-gradient rounded'
                type="submit">Add Product</button>
        </form>
    );
};

export default ProductForm;