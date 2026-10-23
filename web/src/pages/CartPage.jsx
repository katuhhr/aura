import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { formatPrice } from '../utils/format.js'
import ProductImage from '../components/ProductImage.jsx'
import QuantityStepper from '../components/QuantityStepper.jsx'

export default function CartPage() {
  const { items, count, total, setQuantity, removeItem } = useCart()
  const [notice, setNotice] = useState(false)

  if (items.length === 0) {
    return (
      <div className="state">
        <p>В корзине пока пусто</p>
        <Link to="/" className="btn btn--primary">Перейти в каталог</Link>
      </div>
    )
  }

  return (
    <>
      <h1 className="page-title">Корзина</h1>
      <div className="cart">
        <ul className="cart__list">
          {items.map((item) => (
            <li key={item.id} className="cart-item">
              <Link to={`/product/${item.productId}`} className="cart-item__image">
                <ProductImage src={item.image} category={item.category} alt={item.name} />
              </Link>
              <div className="cart-item__body">
                <Link to={`/product/${item.productId}`} className="cart-item__name">{item.name}</Link>
                <span className="cart-item__meta">
                  {[item.size && `Размер ${item.size}`, item.color].filter(Boolean).join(' · ')}
                </span>
                <div className="cart-item__row">
                  <span className="cart-item__price">{formatPrice(item.price * item.quantity)}</span>
                  <QuantityStepper value={item.quantity} onChange={(value) => setQuantity(item.id, value)} />
                </div>
              </div>
              <button className="cart-item__remove" onClick={() => removeItem(item.id)} aria-label="Удалить из корзины">
                ×
              </button>
            </li>
          ))}
        </ul>

        <aside className="summary">
          <div className="summary__row">
            <span>Товаров</span>
            <span>{count}</span>
          </div>
          <div className="summary__row summary__row--total">
            <span>Итого</span>
            <span>{formatPrice(total)}</span>
          </div>
          {/* Оформление заказа и оплата не входят в текущую версию (ТЗ, п. 3.5.1) */}
          <button className="btn btn--primary btn--block" onClick={() => setNotice(true)}>
            Оформить заказ
          </button>
          {notice && <p className="summary__notice">Оформление заказа появится в следующей версии</p>}
        </aside>
      </div>
    </>
  )
}
