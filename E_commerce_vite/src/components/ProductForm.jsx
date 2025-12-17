import { useState } from "react";

const ProductForm = ({ addProduct }) => {
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    sellingPrice: "",
    originalPrice: "",
    category: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    addProduct(formData);

    setFormData({
      name: "",
      image: "",
      sellingPrice: "",
      originalPrice: "",
      category: "",
    });
  };
  return (
    <>
      <h3 className="text-3xl font-serif font-bold text-black mb-8 mt-50 text-center">Add New Products</h3>
      <div className="ml-10 flex justify-center mt-14 mb-20">
        <div className=" max-w-lg bg-white shadow-xl ml-1 rounded-2xl p-10 border-2 border-gray-200 hover:shadow-2xl">
          <h2 className="text-3xl font-serif text-gray-800 mb-8 text-center">
            Add Products
          </h2>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Product Name"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 
                        focus:ring-black focus:outline-none"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="image"
              placeholder="Image URL"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 
                        focus:ring-black focus:outline-none"
              value={formData.image}
              onChange={handleChange}
              required
            />

            <input
              type="number"
              name="sellingPrice"
              placeholder="Selling Price"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 
                        focus:ring-black focus:outline-none"
              value={formData.sellingPrice}
              onChange={handleChange}
              required
            />

            <input
              type="number"
              name="originalPrice"
              placeholder="Original Price"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 
                        focus:ring-black focus:outline-none"
              value={formData.originalPrice}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="category"
              placeholder="Category"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 
                        focus:ring-black focus:outline-none"
              value={formData.category}
              onChange={handleChange}
              required
            />

            <button
              type="submit"
              className="w-full bg-black hover:bg-gray-800 text-white py-3 
                        rounded-lg text-lg font-medium transition"
            >
              Add Product
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ProductForm;
