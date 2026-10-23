import { createContext, useContext, useEffect, useState } from 'react'

// Корзина хранится локально на устройстве (ТЗ, п. 5.1), сервер для неё не нужен.

const CART_KEY = 'aura_cart'
const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => JSON.parse(localStorage.getItem(CART_KEY) || '[]'))

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items))
  }, [items])

  // Один и тот же товар в разных размерах/цветах — разные позиции корзины
  const addItem = (product, { size = null, color = null, quantity = 1 } = {}) => {
    const key = `${product.id}|${size ?? ''}|${color ?? ''}`
    setItems((prev) => {
      if (prev.some((item) => item.key === key)) {
        return prev.map((item) =>
          item.key === key ? { ...item, quantity: item.quantity + quantity } : item,
        )
      }
      const { id, name, category, price, images } = product
      return [...prev, { key, productId: id, name, category, price, image: images[0], size, color, quantity }]
    })
  }

  const setQuantity = (key, quantity) => {
    if (quantity < 1) return
    setItems((prev) => prev.map((item) => (item.key === key ? { ...item, quantity } : item)))
  }

  const removeItem = (key) => setItems((prev) => prev.filter((item) => item.key !== key))
  const clear = () => setItems([])

  const count = items.reduce((sum, item) => sum + item.quantity, 0)
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <CartContext.Provider value={{ items, count, total, addItem, setQuantity, removeItem, clear }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
