import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axiosClient from '../api/axiosClient';
import useCartStore from '../store/useCartStore';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_dummy');

const CheckoutForm = ({ clientSecret, totalAmount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { items, clearCart } = useCartStore();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: 'Customer Name',
        },
      },
    });

    if (payload.error) {
      setError(`Payment failed: ${payload.error.message}`);
      setProcessing(false);
    } else {
      setError(null);
      // Payment succeeded, create the order in our database
      try {
        const orderItems = items.map(item => ({
          product: item.product._id,
          name: item.product.name,
          qty: item.qty,
          image: item.product.images?.[0] || '',
          price: item.product.price,
        }));
        
        const subtotal = items.reduce((acc, item) => acc + (item.product.price * item.qty), 0);

        await axiosClient.post('/orders', {
          orderItems,
          shippingAddress: { address: '123 Main St', city: 'Anytown', postalCode: '12345', country: 'US' }, // hardcoded for demo
          paymentMethod: 'Stripe',
          itemsPrice: subtotal,
          taxPrice: subtotal * 0.08,
          shippingPrice: 5.00,
          totalPrice: totalAmount,
          paymentIntentId: payload.paymentIntent.id
        });

        clearCart();
        navigate('/'); // We will route to /orders later when Order History is built
      } catch (err) {
        console.error('Order creation failed', err);
        setError('Payment succeeded, but order creation failed. Please contact support.');
      }
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-6">
      <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
        <label className="block text-sm font-medium text-slate-700 mb-4">Credit Card Details</label>
        <CardElement options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': { color: '#aab7c4' },
              },
              invalid: { color: '#9e2146' },
            },
          }} 
          className="p-4 border border-slate-300 rounded-md bg-slate-50"
        />
      </div>
      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
      <button
        disabled={processing || !stripe}
        id="submit"
        className="w-full bg-indigo-600 text-white py-4 px-4 rounded-full font-bold shadow-md hover:shadow-lg hover:bg-indigo-700 disabled:opacity-50 transition-all text-lg"
      >
        {processing ? 'Processing...' : `Pay $${totalAmount.toFixed(2)}`}
      </button>
    </form>
  );
};

const Checkout = () => {
  const [clientSecret, setClientSecret] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
  const { items } = useCartStore();

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    const createPaymentIntent = async () => {
      if (items.length === 0) return;
      try {
        const { data } = await axiosClient.post('/orders/create-payment-intent', { items });
        setClientSecret(data.clientSecret);
        setTotalAmount(data.totalAmount);
      } catch (error) {
        console.error('Failed to init payment', error);
      }
    };
    createPaymentIntent();
  }, [items]);

  if (items.length === 0) {
    return <div className="text-center mt-24 text-xl text-slate-600">Your cart is empty. Please add items before checking out.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold text-slate-900 mb-8">Checkout</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-xl font-bold mb-4 text-slate-800">Order Summary</h2>
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
            <ul className="divide-y divide-slate-200">
              {items.map(item => (
                <li key={item.product._id} className="py-3 flex justify-between">
                  <span className="text-slate-700">{item.qty} x {item.product.name}</span>
                  <span className="font-medium">${(item.qty * item.product.price).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className="border-t border-slate-200 mt-4 pt-4 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold mb-4 text-slate-800">Payment</h2>
          {clientSecret ? (
            <Elements stripe={stripePromise}>
              <CheckoutForm clientSecret={clientSecret} totalAmount={totalAmount} />
            </Elements>
          ) : (
            <div className="flex justify-center mt-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
