import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axiosClient from '../api/axiosClient';
import useAuthStore from './useAuthStore';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      
      addToCart: async (product) => {
        const { items } = get();
        const existingItem = items.find(item => item.product._id === product._id);
        
        let newItems;
        if (existingItem) {
          newItems = items.map(item => 
            item.product._id === product._id 
              ? { ...item, qty: item.qty + 1 }
              : item
          );
        } else {
          newItems = [...items, { product, qty: 1, priceAtAdd: product.price }];
        }
        
        set({ items: newItems });
        
        // Sync with backend if logged in
        if (useAuthStore.getState().accessToken) {
          try {
            await axiosClient.post('/cart', {
              items: newItems.map(item => ({
                product: item.product._id,
                qty: item.qty,
                priceAtAdd: item.priceAtAdd
              }))
            });
          } catch (error) {
            console.error('Failed to sync cart', error);
          }
        }
      },
      
      removeFromCart: async (productId) => {
        const newItems = get().items.filter(item => item.product._id !== productId);
        set({ items: newItems });
        
        if (useAuthStore.getState().accessToken) {
          try {
            await axiosClient.post('/cart', {
              items: newItems.map(item => ({
                product: item.product._id,
                qty: item.qty,
                priceAtAdd: item.priceAtAdd
              }))
            });
          } catch (error) {
            console.error('Failed to sync cart', error);
          }
        }
      },
      
      updateQuantity: async (productId, qty) => {
        if (qty < 1) return;
        
        const newItems = get().items.map(item => 
          item.product._id === productId 
            ? { ...item, qty }
            : item
        );
        
        set({ items: newItems });
        
        if (useAuthStore.getState().accessToken) {
          try {
            await axiosClient.post('/cart', {
              items: newItems.map(item => ({
                product: item.product._id,
                qty: item.qty,
                priceAtAdd: item.priceAtAdd
              }))
            });
          } catch (error) {
            console.error('Failed to sync cart', error);
          }
        }
      },
      
      fetchCart: async () => {
        if (useAuthStore.getState().accessToken) {
          try {
            const { data } = await axiosClient.get('/cart');
            if (data && data.items) {
              set({ items: data.items });
            }
          } catch (error) {
            console.error('Failed to fetch cart', error);
          }
        }
      },
      
      clearCart: () => set({ items: [] })
    }),
    {
      name: 'cart-storage',
    }
  )
);

export default useCartStore;
