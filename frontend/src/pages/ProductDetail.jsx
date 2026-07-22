import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import axiosClient from '../api/axiosClient';
import useCartStore from '../store/useCartStore';
import useAuthStore from '../store/useAuthStore';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const addToCart = useCartStore((state) => state.addToCart);
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchProductAndInteractions = async () => {
      try {
        setLoading(true);
        const { data } = await axiosClient.get(`/products/${id}`);
        setProduct(data);
        
        // Fetch similar products
        const similarRes = await axiosClient.get(`/products/${id}/similar`);
        setSimilarProducts(similarRes.data);

        // Record view interaction if logged in
        if (user) {
          try {
            await axiosClient.post('/interactions', { productId: id, type: 'view' });
          } catch (e) {
            console.error('Failed to record interaction', e);
          }
        }
      } catch (error) {
        console.error('Failed to fetch product', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProductAndInteractions();
  }, [id, user]);

  const handleAddToCart = async () => {
    addToCart(product);
    toast.success('Added to Cart!');
    
    // Record cart interaction if logged in
    if (user) {
      try {
        await axiosClient.post('/interactions', { productId: id, type: 'cart' });
      } catch (e) {
        console.error('Failed to record interaction', e);
      }
    }
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
          <div className="aspect-w-1 aspect-h-1 w-full rounded-2xl overflow-hidden bg-slate-100 shadow-sm border border-slate-200">
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
          
          <div className="mt-4 flex items-center">
            <h2 className="sr-only">Product information</h2>
            <p className="text-3xl text-indigo-600 font-bold">${product.price.toFixed(2)}</p>
            {product.tags && product.tags.length > 0 && (
               <div className="ml-4 flex gap-2">
                 {product.tags.map(tag => (
                   <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                     {tag}
                   </span>
                 ))}
               </div>
            )}
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
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 border border-transparent rounded-xl py-4 px-8 flex items-center justify-center text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-md transition-all"
            >
              Add to Cart
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

      {similarProducts.length > 0 && (
        <div className="mt-24">
          <h2 className="text-2xl font-extrabold text-slate-900 mb-6">You might also like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {similarProducts.map((p) => (
              <div key={p._id} className="group relative bg-white border border-slate-200 rounded-2xl p-4 transition-all hover:shadow-lg">
                <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-xl bg-slate-100">
                  {p.images?.[0] ? (
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      className="h-48 w-full object-cover object-center group-hover:opacity-75 transition-opacity"
                    />
                  ) : (
                    <div className="h-48 flex justify-center items-center text-slate-400">No Image</div>
                  )}
                </div>
                <div className="mt-4 flex justify-between">
                  <div>
                    <h3 className="text-sm text-slate-700 font-medium truncate w-32">
                      <Link to={`/product/${p._id}`}>
                        <span aria-hidden="true" className="absolute inset-0" />
                        {p.name}
                      </Link>
                    </h3>
                  </div>
                  <p className="text-sm font-bold text-indigo-600">${p.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
