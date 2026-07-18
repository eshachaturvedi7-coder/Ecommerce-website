import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';

const ProductForm = () => {
  const { id } = useParams(); // agar id hai to Edit mode, warna Add mode
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    discountPrice: '',
    category: '',
    brand: '',
    stock: ''
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditMode);

  useEffect(() => {
    if (isEditMode) {
      const fetchProduct = async () => {
        try {
          const { data } = await api.get(`/products/${id}`);
          const p = data.product;
          setForm({
            name: p.name,
            description: p.description,
            price: p.price,
            discountPrice: p.discountPrice || '',
            category: p.category,
            brand: p.brand || '',
            stock: p.stock
          });
        } catch (error) {
          toast.error('Failed to load product');
        } finally {
          setFetching(false);
        }
      };
      fetchProduct();
    }
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEditMode) {
        // Edit mode — sirf text fields update (image change abhi support nahi kiya, simplicity ke liye)
        await api.put(`/products/${id}`, form);
        toast.success('Product updated successfully');
      } else {
        // Add mode — form-data use karna hoga image ke liye
        const formData = new FormData();
        Object.keys(form).forEach((key) => formData.append(key, form[key]));
        images.forEach((img) => formData.append('images', img));

        await api.post('/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Product created successfully');
      }
      navigate('/admin');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="text-center py-20 text-gray-500">Loading product...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        {isEditMode ? 'Edit Product' : 'Add New Product'}
      </h1>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text" name="name" value={form.name} onChange={handleChange} required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description" value={form.description} onChange={handleChange} required rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
            <input
              type="number" name="price" value={form.price} onChange={handleChange} required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Discount Price (₹)</label>
            <input
              type="number" name="discountPrice" value={form.discountPrice} onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <input
              type="text" name="category" value={form.category} onChange={handleChange} required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
            <input
              type="text" name="brand" value={form.brand} onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
          <input
            type="number" name="stock" value={form.stock} onChange={handleChange} required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {!isEditMode && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Images (up to 5)</label>
            <input
              type="file" multiple accept="image/*"
              onChange={(e) => setImages(Array.from(e.target.files))}
              className="w-full text-sm text-gray-600"
            />
          </div>
        )}

        <button
          type="submit" disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? 'Saving...' : isEditMode ? 'Update Product' : 'Create Product'}
        </button>
      </form>
    </div>
  );
};

export default ProductForm;