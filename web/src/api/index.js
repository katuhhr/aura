// Единая точка доступа к данным. Страницы импортируют только { api } отсюда.
//
// Контракт, которого ждёт фронт от бэкенда:
//
//   POST /auth/register  { name, email, password }  -> { token, user }
//   POST /auth/login     { email, password }        -> { token, user }
//   GET  /auth/me                                   -> user
//   POST /auth/logout                               -> { message }
//   GET  /products?category=&search=                -> Product[]
//   GET  /products/:id                              -> Product
//   GET    /cart                                    -> CartItem[]
//   POST   /cart      { variantId, quantity } -> CartItem[]
//   PATCH  /cart/:id  { quantity }                  -> CartItem[]
//   DELETE /cart/:id                                -> CartItem[]
//
//   user     = { id, name, email }
//   Product  = { id, name, category, price, description,
//                variants: { id, size, color }[], images: string[], colorImages?: Record<string, string> }
//   CartItem = { id, productId, variantId, name, category, price, image, size, color, quantity }

import { request } from './client.js'

export const api = {
  register: (data) => request('/auth/register', { method: 'POST', body: data }),
  login: (data) => request('/auth/login', { method: 'POST', body: data }),
  me: () => request('/auth/me'),
  logout: () => request('/auth/logout', { method: 'POST' }),

  getProducts: ({ category, search } = {}) => {
    const params = new URLSearchParams()
    if (category) params.set('category', category)
    if (search) params.set('search', search)
    const query = params.toString()
    return request('/products' + (query ? `?${query}` : ''))
  },
  getProduct: (id) => request(`/products/${id}`),

  getCart: () => request('/cart'),
  addToCart: (data) => request('/cart', { method: 'POST', body: data }),
  updateCartItem: (id, quantity) => request(`/cart/${id}`, { method: 'PATCH', body: { quantity } }),
  removeCartItem: (id) => request(`/cart/${id}`, { method: 'DELETE' }),
}
