import axios from "axios";
import { connect } from "http2";

const api = axios.create({
  // baseURL: "http://localhost:9000/api/v1",
  baseURL: "https://api.betterzojewels.com/api/v1",
});

export const getCategories = async () => {
  const res = await api.get('/categories');
  // console.log("categories", res.data.data.data); // log the categories data
  return res.data.data.data; // returns the array of categories
};

export const getProductsPaginated = async ({
  search,
  page = 1,
}: {
  search?: string;
  page?: number;
} = {}) => {
  const res = await api.get("/products", {
    params: {
      ...(search ? { search } : {}),
      page,
    },
  });

  const payload = res.data?.data;

  if (payload && Array.isArray(payload.data)) {
    return payload;
  }

  if (Array.isArray(payload)) {
    return {
      current_page: 1,
      data: payload,
      last_page: 1,
      total: payload.length,
      per_page: payload.length,
      next_page_url: null,
    };
  }

  return {
    current_page: 1,
    data: [],
    last_page: 1,
    total: 0,
    per_page: 0,
    next_page_url: null,
  };
};

export const getProducts = async (search?: string) => {
  const paginated = await getProductsPaginated({ search, page: 1 });
  return paginated.data || [];
};

export const getProductById = async (id: string | number) => {
  const res = await api.get(`/product/${id}`);
  return res.data.data; // returns the product object
};

// OTP Authentication functions
export const requestOTP = async (email: string) => {
  const formData = new FormData();
  formData.append('email', email);
  
  const res = await api.post('/instant-login/request-otp', formData);
  return res.data;
};

export const verifyOTP = async (email: string, otp: string) => {
  const formData = new FormData();
  formData.append('email', email);
  formData.append('otp', otp);
  
  const res = await api.post('/instant-login/verify-otp', formData);
  return res.data;
};

export const getRelatedProducts = async (categoryId: string | number, excludeProductId: string | number) => {
  // This assumes the API supports filtering by category and excluding a product by ID
  // If not, we fetch all products in the category and filter client-side
  const res = await api.get(`/products?category_id=${categoryId}`);
  const products = res.data.data.data || res.data.data; // handle both paginated and non-paginated
  return products.filter((p: any) => p.id !== excludeProductId);
};

// Helper function to format category name from slug
function formatCategoryName(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export const getCategoryBySlug = async (slug: string) => {
  try {
    const res = await api.get(`/category/${slug}`);
    return res.data.data;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      // Return a default category object if not found
      return {
        id: 0,
        name: formatCategoryName(slug),
        slug: slug,
        description: `Browse ${formatCategoryName(slug)} at JewTone Online`,
        image: null
      };
    }
    throw error;
  }
};

export const getProductsByCategorySlug = async (slug: string) => {
  try {
    const res = await api.get(`/product/category/${slug}`);
    return res.data.data;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      return [];
    }
    throw error;
  }
};

// Address API functions
export const getAddresses = async () => {
  const token = localStorage.getItem('auth_token');
  const res = await api.get('/address/list', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data.data;
};

export const createAddress = async (data: any) => {
  const token = localStorage.getItem('auth_token');
  const res = await api.post('/address/create', data, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res.data;
};

export const getAddressDetail = async (id: number) => {
  const token = localStorage.getItem('auth_token');
  const res = await api.get(`/address/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data.data;
};

export const updateAddress = async (id: number, data: any) => {
  const token = localStorage.getItem('auth_token');
  const res = await api.put(`/address/update/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res.data;
};

export const deleteAddress = async (id: number) => {
  const token = localStorage.getItem('auth_token');
  const res = await api.delete(`/address/delete/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

// Cart API functions
export const getCartItems = async () => {
  const token = localStorage.getItem('auth_token');
  const res = await api.get('/cart', {
    headers: { Authorization: `Bearer ${token}` }
  });
  // console.log("Cart Items Response:", res.data); // log the cart items response for debugging
  return res.data;
};

export const addToCart = async (product_id: number, quantity: number) => {
  const token = localStorage.getItem('auth_token');
  // console.log("product_id",product_id);
  // console.log("quantity",quantity);
  const res = await api.post('/cart/add', { product_id, quantity }, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res.data;
};

export const updateCartItem = async (cart_item_id: number, quantity: number) => {
  const token = localStorage.getItem('auth_token');
  const res = await api.put('/cart/update', { cart_item_id, quantity }, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res.data;
};

export const removeCartItem = async (cart_item_id: number) => {
  const token = localStorage.getItem('auth_token');
  const res = await api.delete('/cart/remove', {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    data: { cart_item_id },
  });
  return res.data;
};

// Checkout API function
export const placeOrder = async (orderData: {
  shipping_address_id?: string;
  shipping_address?: {
    name: string;
    phone: string;
    address_line_1: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  payment_method: string;
  coupon_code?: string;
  discount?: number;
  order_amount?: number;
}): Promise<{
  status: boolean;
  message: string;
  order_id: string;
  amount: number;
  rzpay_order_id: string;
}> => {
  const token = localStorage.getItem('auth_token');
  const res = await api.post('/checkout', orderData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res.data;
};

export const applyCoupon = async (couponCode: string, amount: number) => {
  const token = localStorage.getItem('auth_token');
  const res = await api.post(
    '/apply-coupon',
    {
      code: couponCode,
      order_amount: amount,
    },
    {
      headers: {
         Authorization: `Bearer ${token}` ,
        'Content-Type': 'application/json',
      },
    }
  );
  return res.data;
};

// Orders API function
export const getOrders = async () => {
  const token = localStorage.getItem('auth_token');
  const res = await api.get('/orders', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

// Get single order by order number
export const getOrderByNumber = async (orderNumber: string) => {
  const token = localStorage.getItem('auth_token');
  const res = await api.get(`/orders/${orderNumber}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data.data;
};

// Payment verification and order update API functions
export const verifyPaymentAndUpdateOrder = async (paymentData: {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
  order_id: string;
  amount: number;
}) => {
  const token = localStorage.getItem('auth_token');
  const res = await api.post('/k/payment/verify', paymentData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res.data;
};

// Get payment status for an order
export const getPaymentStatus = async (orderId: string) => {
  const token = localStorage.getItem('auth_token');
  const res = await api.get(`/payment/status/${orderId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

// Update order status (for manual updates if needed)
export const updateOrderStatus = async (orderId: string, status: string) => {
  const token = localStorage.getItem('auth_token');
  const res = await api.put(`/orders/${orderId}/status`, { status }, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res.data;
};

// Add a global response interceptor for auth errors
api.interceptors.response.use(
  response => response,
  error => {
    console.log("error",error); 
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Clear localStorage
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('user');
      localStorage.removeItem('auth_token');
      
      // Use router to redirect instead of window.location.href
      if (typeof window !== 'undefined') {
        // Dispatch a custom event to notify the app about auth failure
        window.dispatchEvent(new CustomEvent('auth-error', { detail: { status: error.response.status } }));
      }
    }
    return Promise.reject(error);
  }
);

export default api;