// Заглушка сервера: те же методы, что и у httpApi, но данные лежат в браузере.
// Пользователи хранятся в localStorage в открытом виде — это только для разработки.

import { products } from '../data/products.js'
import { demoUser } from '../data/demoUser.js'
import { getToken } from './client.js'

const USERS_KEY = 'aura_mock_users'

const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms))
const readStored = () => JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
const readUsers = () => [demoUser, ...readStored()]
const publicUser = ({ id, name, email }) => ({ id, name, email })
const currentUserId = () => Number((getToken() || '').replace('mock-', ''))

// У каждого пользователя своя корзина, как на сервере
const cartKey = () => `aura_mock_cart_${currentUserId()}`
const readCart = () => JSON.parse(localStorage.getItem(cartKey()) || '[]')
const saveCart = (cart) => {
  localStorage.setItem(cartKey(), JSON.stringify(cart))
  return cart
}

export const mockApi = {
  async register({ name, email, password }) {
    await delay()
    const users = readUsers()
    if (users.some((u) => u.email === email)) {
      throw new Error('Пользователь с такой почтой уже зарегистрирован')
    }
    const user = { id: Date.now(), name, email, password }
    localStorage.setItem(USERS_KEY, JSON.stringify([...readStored(), user]))
    return { token: `mock-${user.id}`, user: publicUser(user) }
  },

  async login({ email, password }) {
    await delay()
    const user = readUsers().find((u) => u.email === email && u.password === password)
    if (!user) throw new Error('Неверная почта или пароль')
    return { token: `mock-${user.id}`, user: publicUser(user) }
  },

  async me() {
    await delay(100)
    const user = readUsers().find((u) => u.id === currentUserId())
    if (!user) throw new Error('Сессия истекла')
    return publicUser(user)
  },

  async logout() {
    await delay(100)
  },

  async getProducts({ category, search } = {}) {
    await delay()
    const query = (search || '').trim().toLowerCase()
    return products.filter(
      (p) =>
        (!category || p.category === category) &&
        (!query || p.name.toLowerCase().includes(query)),
    )
  },

  async getProduct(id) {
    await delay()
    const product = products.find((p) => p.id === Number(id))
    if (!product) throw new Error('Товар не найден')
    return product
  },

  async getCart() {
    await delay(100)
    return readCart()
  },

  async addToCart({ productId, size, color, quantity }) {
    await delay(100)
    const cart = readCart()
    const existing = cart.find(
      (item) => item.productId === productId && item.size === size && item.color === color,
    )
    if (existing) {
      existing.quantity += quantity
    } else {
      const { name, category, price, images } = products.find((p) => p.id === productId)
      cart.push({ id: Date.now(), productId, name, category, price, image: images[0] ?? null, size, color, quantity })
    }
    return saveCart(cart)
  },

  async updateCartItem(id, quantity) {
    await delay(100)
    return saveCart(readCart().map((item) => (item.id === id ? { ...item, quantity } : item)))
  },

  async removeCartItem(id) {
    await delay(100)
    return saveCart(readCart().filter((item) => item.id !== id))
  },
}
