import { API_URL, request } from './client.js'

const httpApi = {
  register: (data) => request('/auth/register', { method: 'POST', body: data }),
  login: (data) => request('/auth/login', { method: 'POST', body: data }),
  me: () => request('/auth/me'),
  logout: () => request('/auth/logout', { method: 'POST' }),

  // Товары
  getProducts: ({ category, search } = {}) => {
    const params = new URLSearchParams()
    if (category) params.set('category', category)
    if (search) params.set('search', search)
    const query = params.toString()

    return request('/products' + (query ? `?${query}` : ''))
  },

  getProduct: (id) => request(`/products/${id}`),

  // Корзина
  getCart: () => request('/cart'),

  // Возвращаем productId, size, color (как ждет старый бэкенд)
  addToCart: ({ productId, size, color, quantity = 1 }) =>
    request('/cart', {
      method: 'POST',
      body: {
        productId,
        size,
        color,
        quantity,
      },
    }),

  updateCartItem: (id, quantity) =>
    request(`/cart/${id}`, {
      method: 'PATCH',
      body: { quantity },
    }),

  removeCartItem: (id) =>
    request(`/cart/${id}`, { method: 'DELETE' }),
}

export const api = httpApi