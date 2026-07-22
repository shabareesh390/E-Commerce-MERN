import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import useCartStore from '../store/useCartStore';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axiosClient.get(`/products/${id}`);
        setProduct(data);
      } catch (error) {
        console.error('Failed to fetch product', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!product) {
    return <div className="text-center mt-20 text-xl text-slate-600">Product not found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 xl:gap-x-16">
        <div className="mb-10 lg:mb-0">
          <div className="aspect-w-1 aspect-h-1 w-full rounded-2xl overflow-hidden bg-slate-100">
            {product.images?.[0] ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-center object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-96 text-slate-400">
                No Image Available
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            {product.name}
          </h1>
          
          <div className="mt-4">
            <h2 className="sr-only">Product information</h2>
            <p className="text-3xl text-slate-900">${product.price.toFixed(2)}</p>
          </div>

          <div className="mt-6">
            <h3 className="sr-only">Description</h3>
            <div className="text-base text-slate-700 space-y-6">
              <p>{product.description}</p>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button
              type="button"
              onClick={handleAddToCart}
              className={`flex-1 border border-transparent rounded-xl py-4 px-8 flex items-center justify-center text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm transition-all ${
                added ? 'bg-green-600 hover:bg-green-700' : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {added ? 'Added to Cart!' : 'Add to Cart'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/cart')}
              className="flex-1 bg-white border border-slate-300 rounded-xl py-4 px-8 flex items-center justify-center text-base font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm transition-all"
            >
              View Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
