import * as React from 'react';
import { useState } from 'react';
import { productService, Product } from '../store/productService';

//variable for Product Form
const ProductForm: React.FC = () => {
    const [product, setProduct] = useState<Omit<Product, 'productId' | 'id'>>({ //omits product id 
        name: '',
        price: 0,
        description: '',
        stock: 0,
        imageUrl: '',
        category: '',
    });

    //takes an event parameter that works with both input and textarea elements
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target; //destructures the event target to get the inputs name and value
        setProduct(prev => ({
            ...prev,// uses spread operator to maintain existing values
            [name]: name === 'price' || name === 'stock' ? Number(value) : value //checks if field being updated is either "price" or "stock"
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        void (async () => {
            try {
                //creates new product using productService
                await productService.createProduct({
                    name: product.name,
                    price: product.price,
                    description: product.description,
                    stock: product.stock,
                    imageUrl: product.imageUrl,
                    category: product.category
                });
                //resets form to initial state after successful submission
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

    //renders product form 
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