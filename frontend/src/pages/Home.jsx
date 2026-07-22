import { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axiosClient.get('/products');
        setProducts(data.products);
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-8">
        Featured Products
      </h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product._id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
              <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-slate-200 xl:aspect-w-7 xl:aspect-h-8">
                {product.images?.[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="h-full w-full object-cover object-center"
                  />
                ) : (
                  <div className="h-48 w-full bg-slate-100 flex items-center justify-center text-slate-400">
                    No image
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="mt-1 text-sm text-slate-700 line-clamp-2 h-10">{product.name}</h3>
                <p className="mt-2 text-lg font-semibold text-slate-900">${product.price.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
