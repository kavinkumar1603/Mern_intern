import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

const AdminPage = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);

    const [formData, setFormData] = useState({
        name: "",
        price: "",
        category: "",
        stock: "",
        description: "",
        image: ""
    });

    // Load products from backend on component mount
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products`);
                if (response.ok) {
                    const data = await response.json();
                    setProducts(data);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };
        fetchProducts();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.price || !formData.category || !formData.stock) {
            alert("Please fill all required fields");
            return;
        }

        const newProduct = {
            name: formData.name,
            price: parseFloat(formData.price),
            category: formData.category,
            stock: parseInt(formData.stock),
            description: formData.description,
            image: formData.image
        };

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newProduct)
            });

            if (!response.ok) {
                throw new Error('Failed to add product');
            }

            const addedProduct = await response.json();
            setProducts([...products, addedProduct]);
            setFormData({ name: "", price: "", category: "", stock: "", description: "", image: "" });
            alert("Product added successfully!");
        } catch (error) {
            console.error('Error adding product:', error);
            alert("Failed to add product. Please try again.");
        }
    };

    const handleDeleteProduct = async (id) => {
        if (!confirm('Are you sure you want to delete this product?')) {
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete product');
            }

            setProducts(products.filter(product => product.id !== id));
            alert("Product deleted successfully!");
        } catch (error) {
            console.error('Error deleting product:', error);
            alert("Failed to delete product. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Admin Header */}
            <div className="bg-black text-white p-4 shadow-lg">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Admin Dashboard - Product Management</h1>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition"
                    >
                        Back to Home
                    </button>
                </div>
            </div>

            <div className="container mx-auto p-6">
                {/* Add Product Form */}
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl p-8 mb-8 border border-gray-200">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="bg-black text-white p-3 rounded-xl">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800">Add New Product</h2>
                    </div>

                    <form onSubmit={handleAddProduct} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Product Name */}
                            <div className="group">
                                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                    <span className="text-black">*</span> Product Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-black focus:ring-2 focus:ring-black/20 transition-all duration-200 bg-white"
                                    placeholder="e.g., Wireless Headphones"
                                    required
                                />
                            </div>

                            {/* Price */}
                            <div className="group">
                                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                    <span className="text-black">*</span> Price
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">$</span>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        step="0.01"
                                        min="0"
                                        className="w-full pl-8 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-black focus:ring-2 focus:ring-black/20 transition-all duration-200 bg-white"
                                        placeholder="0.00"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Category */}
                            <div className="group">
                                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                    <span className="text-black">*</span> Category
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-black focus:ring-2 focus:ring-black/20 transition-all duration-200 bg-white"
                                    required
                                >
                                    <option value="">Select a category</option>
                                    <option value="Electronics">Electronics</option>
                                    <option value="Clothing">Clothing</option>
                                    <option value="Home & Kitchen">Home & Kitchen</option>
                                    <option value="Books">Books</option>
                                    <option value="Sports">Sports</option>
                                    <option value="Beauty">Beauty</option>
                                    <option value="Toys">Toys</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            {/* Stock */}
                            <div className="group">
                                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                    <span className="text-black">*</span> Stock Quantity
                                </label>
                                <input
                                    type="number"
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleInputChange}
                                    min="0"
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-black focus:ring-2 focus:ring-black/20 transition-all duration-200 bg-white"
                                    placeholder="Enter stock quantity"
                                    required
                                />
                            </div>
                        </div>

                        {/* Image URL */}
                        <div className="group">
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Product Image URL
                            </label>
                            <input
                                type="url"
                                name="image"
                                value={formData.image}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-black focus:ring-2 focus:ring-black/20 transition-all duration-200 bg-white"
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>

                        {/* Description */}
                        <div className="group">
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Product Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows="4"
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-black focus:ring-2 focus:ring-black/20 transition-all duration-200 resize-none bg-white"
                                placeholder="Enter a detailed description of the product..."
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                className="w-full bg-black hover:bg-gray-800 text-white font-bold py-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Add Product to Inventory
                            </button>
                        </div>
                    </form>
                </div>

                {/* Products List */}

                <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl p-8 border border-gray-200">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="bg-black text-white p-3 rounded-xl">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-gray-800">Products Inventory</h2>
                            <p className="text-gray-500 text-sm mt-1">Total Products: {products.length}</p>
                        </div>
                    </div>

                    {products.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="inline-block p-8 bg-gray-100 rounded-full mb-4">
                                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Products Yet</h3>
                            <p className="text-gray-500">Add your first product using the form above</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-black text-white">
                                    <tr>
                                        <th className="px-6 py-4 text-left font-bold">Name</th>
                                        <th className="px-6 py-4 text-left font-bold">Price</th>
                                        <th className="px-6 py-4 text-left font-bold">Category</th>
                                        <th className="px-6 py-4 text-left font-bold">Stock</th>
                                        <th className="px-6 py-4 text-left font-bold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((product, index) => (
                                        <tr key={product.id} className={`border-b hover:bg-gray-100 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    {product.image && (
                                                        <img
                                                            src={product.image}
                                                            alt={product.name}
                                                            className="w-12 h-12 object-cover rounded-lg grayscale"
                                                            onError={(e) => e.target.style.display = 'none'}
                                                        />
                                                    )}
                                                    <div>
                                                        <div className="font-semibold text-gray-900">{product.name}</div>
                                                        {product.description && (
                                                            <div className="text-xs text-gray-500 mt-1 max-w-xs truncate">{product.description}</div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-bold text-black">${product.price.toFixed(2)}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-3 py-1 bg-gray-200 text-black rounded-full text-sm font-medium">
                                                    {product.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-sm font-bold ${product.stock > 10 ? 'bg-black text-white' :
                                                    product.stock > 0 ? 'bg-gray-800 text-white' :
                                                        'bg-white border border-black text-black'
                                                    }`}>
                                                    {product.stock} units
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => handleDeleteProduct(product.id)}
                                                    className="bg-white text-black border border-black px-4 py-2 rounded-lg transition-all duration-200 font-semibold hover:bg-black hover:text-white flex items-center gap-2"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdminPage
