import { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../api/index.js'
import { useAuth } from './AuthContext.jsx'


const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { user } = useAuth()
  const [items, setItems] = useState([])

  // Загружаем корзину при входе и очищаем список на экране при выходе
  useEffect(() => {
    if (!user) {
      setItems([])
      return
    }
    api.getCart().then(setItems).catch((err) => alert(err.message))
  }, [user])

  const update = (request) =>
    request.then((cart) => {
      setItems(cart)
      return true
    }).catch((err) => {
      alert(err.message)
      return false
    })

  // Один и тот же товар в разных размерах/цветах — разные позиции корзины
  const addItem = (variantId, quantity = 1) =>
    update(api.addToCart({ variantId, quantity }))

  const setQuantity = (id, quantity) => {
    if (quantity < 1) return
    return update(api.updateCartItem(id, quantity))
  }

  const removeItem = (id) => update(api.removeCartItem(id))

  const count = items.reduce((sum, item) => sum + item.quantity, 0)
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <CartContext.Provider value={{ items, count, total, addItem, setQuantity, removeItem }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
