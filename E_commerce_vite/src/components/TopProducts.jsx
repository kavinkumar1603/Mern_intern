import Products from "./Products";
import { useEffect, useState } from "react";

const TopProducts = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:3000/products');
                if (response.ok) {
                    const data = await response.json();
                    // Simulating "Top Products" by taking the first 4 items
                    // In a real app, this would filter by rating or sales count
                    setProducts(data.slice(0, 4));
                }
            } catch (error) {
                console.error('Error fetching top products:', error);
            }
        }
        fetchData();
    }, []);

    return (
        <div className="py-4">
            <div className="text-center mb-6">
                <h1 className="text-4xl font-extrabold text-black">
                    Top Trending Products
                </h1>
                <p className="text-gray-600 mt-2">Curated selection of our best-selling items</p>
            </div>
            <Products products={products} />
        </div>
    );
}

export default TopProducts;
