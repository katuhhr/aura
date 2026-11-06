import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { formatPrice } from '../utils/format.js'
import ProductImage from './ProductImage.jsx'

export default function ProductCard({ product }) {
  const { addItem } = useCart()

  const handleAdd = () => {
    // Берем первый доступный вариант из массива variants, приходящего с бэкенда
    const firstVariant = product.variants?.[0]
    if (!firstVariant) return

    addItem(product, {
      variantId: firstVariant.id,
    })
  }

  return (
    <article className="card">
      <Link to={`/product/${product.id}`} className="card__link">
        <ProductImage src={product.images[0]} category={product.category} alt={product.name} />
        <span className="card__category">{product.category}</span>
        <h3 className="card__name">{product.name}</h3>
        <span className="card__price">{formatPrice(product.price)}</span>
      </Link>
      <button className="btn btn--primary btn--block" onClick={handleAdd}>
        Добавить в корзину
      </button>
    </article>
  )
}