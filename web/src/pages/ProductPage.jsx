import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../api/index.js'
import { useCart } from '../context/CartContext.jsx'
import { formatPrice } from '../utils/format.js'
import ProductImage from '../components/ProductImage.jsx'
import QuantityStepper from '../components/QuantityStepper.jsx'

export default function ProductPage() {
  const { id } = useParams()
  const { addItem } = useCart()
  const [product, setProduct] = useState(null)
  const [error, setError] = useState('')
  const [imageIndex, setImageIndex] = useState(0)
  const [size, setSize] = useState(null)
  const [color, setColor] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    setProduct(null)
    setError('')
    api
      .getProduct(id)
      .then((data) => {
        setProduct(data)
        setImageIndex(0)
        setSize(data.sizes[0] ?? null)
        setColor(data.colors[0]?.name ?? null)
        setQuantity(1)
      })
      .catch((err) => setError(err.message))
  }, [id])

  if (error) return <p className="state error">{error}</p>
  if (!product) return <p className="state">Загрузка…</p>

  const handleAdd = () => {
    addItem(product, { size, color, quantity })
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <>
      <Link to="/" className="back">← Каталог</Link>
      <div className="product">
        <div className="product__gallery">
          <ProductImage src={product.images[imageIndex]} category={product.category} alt={product.name} />
          {product.images.length > 1 && (
            <div className="product__thumbs">
              {product.images.map((src, index) => (
                <button
                  key={src}
                  className={index === imageIndex ? 'active' : ''}
                  onClick={() => setImageIndex(index)}
                >
                  <img src={src} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="product__info">
          <span className="card__category">{product.category}</span>
          <h1>{product.name}</h1>
          <p className="product__price">{formatPrice(product.price)}</p>

          {product.sizes.length > 0 && (
            <div className="option">
              <span className="option__label">Размер</span>
              <div className="option__values">
                {product.sizes.map((value) => (
                  <button
                    key={value}
                    className={`chip ${size === value ? 'chip--active' : ''}`}
                    onClick={() => setSize(value)}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.colors.length > 0 && (
            <div className="option">
              <span className="option__label">Цвет: {color}</span>
              <div className="option__values">
                {product.colors.map((value) => (
                  <button
                    key={value.name}
                    className={`swatch ${color === value.name ? 'swatch--active' : ''}`}
                    style={{ background: value.hex }}
                    onClick={() => setColor(value.name)}
                    aria-label={value.name}
                    title={value.name}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="product__buy">
            <QuantityStepper value={quantity} onChange={setQuantity} />
            <button className="btn btn--primary" onClick={handleAdd}>
              {added ? 'Добавлено ✓' : 'Добавить в корзину'}
            </button>
          </div>

          <p className="product__description">{product.description}</p>
        </div>
      </div>
    </>
  )
}
