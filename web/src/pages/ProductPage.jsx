import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../api/index.js'
import { useCart } from '../context/CartContext.jsx'
import { getColorSwatch } from '../utils/color.js'
import { formatPrice } from '../utils/format.js'
import ProductImage, { resolveImageUrl } from '../components/ProductImage.jsx'
import QuantityStepper from '../components/QuantityStepper.jsx'

export default function ProductPage() {
  const { id } = useParams()
  const { addItem } = useCart()
  const [product, setProduct] = useState(null)
  const [error, setError] = useState('')
  const [imageIndex, setImageIndex] = useState(null)
  const [variantId, setVariantId] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    setProduct(null)
    setError('')
    api
      .getProduct(id)
      .then((data) => {
        setProduct(data)
        setImageIndex(null)
        setVariantId(data.variants[0]?.id ?? null)
        setAdded(false)
        setQuantity(1)
      })
      .catch((err) => setError(err.message))
  }, [id])

  if (error) return <p className="state error">{error}</p>
  if (!product) return <p className="state">Загрузка…</p>

  const variant = product.variants.find((value) => value.id === variantId)
  const colorImage = product.colorImages?.[variant?.color]
  const activeImage = imageIndex === null ? colorImage ?? product.images[0] : product.images[imageIndex]
  const sizes = [...new Set(product.variants.map((value) => value.size))]
  const variantsForSize = product.variants.filter((value) => value.size === variant?.size)
  const selectSize = (size) => {
    const matching = product.variants.filter((value) => value.size === size)
    setImageIndex(null)
    setVariantId((matching.find((value) => value.color === variant?.color) ?? matching[0]).id)
  }

  const handleAdd = async () => {
    if (!variant || !(await addItem(variant.id, quantity))) return
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <>
      <Link to="/" className="back">← Каталог</Link>
      <div className="product">
        <div className="product__gallery">
          <ProductImage src={activeImage} category={product.category} alt={product.name} />
          {product.images.length > 1 && (
            <div className="product__thumbs">
              {product.images.map((src, index) => (
                <button
                  key={src}
                  className={src === activeImage ? 'active' : ''}
                  onClick={() => setImageIndex(index)}
                >
                  <img src={resolveImageUrl(src)} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="product__info">
          <span className="card__category">{product.category}</span>
          <h1>{product.name}</h1>
          <p className="product__price">{formatPrice(product.price)}</p>

          {sizes.some(Boolean) && (
            <div className="option">
              <span className="option__label">Размер</span>
              <div className="option__values">
                {sizes.map((value) => (
                  <button
                    key={value ?? ''}
                    className={`chip ${variant?.size === value ? 'chip--active' : ''}`}
                    onClick={() => selectSize(value)}
                  >
                    {value || 'Без размера'}
                  </button>
                ))}
              </div>
            </div>
          )}

          {variantsForSize.some((value) => value.color) && (
            <div className="option">
              <span className="option__label">Цвет</span>
              <div className="option__values">
                {variantsForSize.map((value) => (
                  <button
                    key={value.id}
                    type="button"
                    className={`swatch ${variantId === value.id ? 'swatch--active' : ''}`}
                    style={{ backgroundColor: getColorSwatch(value.color) || 'transparent' }}
                    aria-label={value.color || 'Без цвета'}
                    aria-pressed={variantId === value.id}
                    title={value.color || 'Без цвета'}
                    onClick={() => {
                      setImageIndex(null)
                      setVariantId(value.id)
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="product__buy">
            <QuantityStepper value={quantity} onChange={setQuantity} />
            <button className="btn btn--primary" onClick={handleAdd} disabled={!variant}>
              {added ? 'Добавлено ✓' : 'Добавить в корзину'}
            </button>
          </div>

          {!variant && <p>Нет доступных вариантов</p>}
          <p className="product__description">{product.description}</p>
        </div>
      </div>
    </>
  )
}
