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
    const [editingProduct, setEditingProduct] = useState<(Product & { id: string }) | null>(null);
    const [editFormData, setEditFormData] = useState<Partial<Product>>({});
// useEffect hook used to fetch products
    useEffect(() => {
        const loadProducts = async () => {
            try {
                const products = await productService.getAllProducts(); //fetches products using productService
                setProducts(products as (Product & { id: string })[]); //updates products state
                const uniqueCategories = [...new Set(products.map(product => product.category))]; //extracts unique categories. Uses "Set" to remove duplicates
                setCategories(uniqueCategories); //updates state of categories
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };
        void loadProducts(); //calls async function. "void" handles the promise
    }, []);// empty dependency array ensures effect runs only once on mount

    const handleEdit = (product: Product & { id: string }) => { //handles editing of product data
        setEditingProduct(product);
        setEditFormData(product);
    };

    const handleDelete = async (productId: string) => {// handles the deletion of product
        try {
            await productService.deleteProduct(productId);
            setProducts(products.filter(p => p.id !== productId));
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const handleSaveEdit = async () => {
        if (!editingProduct?.id || !editFormData) return;

        try {
            await productService.updateProduct(editingProduct.id, editFormData);
            setProducts(products.map(p => 
                p.id === editingProduct.id 
                    ? { ...p, ...editFormData, id: p.id } 
                    : p
            ));
            setEditingProduct(null);
            setEditFormData({});
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({
            ...prev,
            [name]: name === 'price' || name === 'stock' ? Number(value) : value
        }));
    };

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
                        <div className="flex gap-2">
                            <button
                                onClick={() => dispatch(addToCart(product))}
                                className="mt-2 px-4 py-2 rounded bg-gradient"
                            >
                                Add to Cart
                            </button>
                            <button
                                onClick={() => handleEdit(product)}
                                className="mt-2 px-4 py-2 rounded bg-gradient text-white"
                                style={{ backgroundColor: 'blue' }}
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(product.id)}
                                className="mt-2 px-4 py-2 rounded bg-gradient text-white"
                                style={{ backgroundColor: 'red' }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            {editingProduct && ( //if editing, render forms to edit product data
                <div className="fixed bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="p-6 rounded-lg w-96">
                        <h2 className="text-xl mb-4">Edit Product</h2>
                        <input
                            type="text"
                            name="name"
                            value={editFormData.name || ''}
                            onChange={handleInputChange}
                            placeholder="Product Name"
                            className="w-full p-2 mb-2 border rounded"
                        />
                        <input
                            type="number"
                            name="price"
                            value={editFormData.price || ''}
                            onChange={handleInputChange}
                            placeholder="Price"
                            className="w-full p-2 mb-2 border rounded"
                        />
                        <input
                            type="text"
                            name="description"
                            value={editFormData.description || ''}
                            onChange={handleInputChange}
                            placeholder="Description"
                            className="w-full p-2 mb-2 border rounded"
                        />
                        <input
                            type="number"
                            name="stock"
                            value={editFormData.stock || ''}
                            onChange={handleInputChange}
                            placeholder="Stock"
                            className="w-full p-2 mb-2 border rounded"
                        />
                        <input
                            type="text"
                            name="imageUrl"
                            value={editFormData.imageUrl || ''}
                            onChange={handleInputChange}
                            placeholder="Image URL"
                            className="w-full p-2 mb-2 border rounded"
                        />
                        <input
                            type="text"
                            name="category"
                            value={editFormData.category || ''}
                            onChange={handleInputChange}
                            placeholder="Category"
                            className="w-full p-2 mb-2 border rounded"
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setEditingProduct(null)}
                                className="px-4 py-2 rounded text-white"
                                style={{ backgroundColor: 'gray' }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveEdit}
                                className="px-4 py-2 rounded text-white"
                                style={{ backgroundColor: 'green' }}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};