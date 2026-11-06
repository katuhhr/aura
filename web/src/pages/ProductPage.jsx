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
  
  // Состояния для выбранного варианта, количества и статуса добавления
  const [selectedVariantId, setSelectedVariantId] = useState(null)
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
        setQuantity(1)
        
        // По умолчанию выбираем первый вариант из массива variants
        if (data.variants && data.variants.length > 0) {
          setSelectedVariantId(data.variants[0].id)
        }
      })
      .catch((err) => setError(err.message))
  }, [id])

  if (error) return <p className="state error">{error}</p>
  if (!product) return <p className="state">Загрузка…</p>

  // Уникальные списки размеров и цветов из вариантов
  const sizes = [...new Set(product.variants?.map((v) => v.size).filter(Boolean))]
  const colors = [...new Set(product.variants?.map((v) => v.color).filter(Boolean))]
  
  // Текущий выбранный вариант
  const currentVariant = product.variants?.find((v) => v.id === selectedVariantId) || product.variants?.[0]

  const handleAdd = () => {
    if (!currentVariant) return

    addItem(product, {
      variantId: currentVariant.id,
      quantity,
    })
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

          {/* Выбор размера */}
          {sizes.length > 0 && (
            <div className="option">
              <span className="option__label">Размер</span>
              <div className="option__values">
                {sizes.map((sizeValue) => {
                  const isSelected = currentVariant?.size === sizeValue
                  return (
                    <button
                      key={sizeValue}
                      className={`chip ${isSelected ? 'chip--active' : ''}`}
                      onClick={() => {
                        // Находим вариант, соответствующий выбранному размеру и текущему цвету
                        const found = product.variants.find(
                          (v) => v.size === sizeValue && (!currentVariant?.color || v.color === currentVariant.color)
                        ) || product.variants.find((v) => v.size === sizeValue)
                        
                        if (found) setSelectedVariantId(found.id)
                      }}
                    >
                      {sizeValue}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Выбор цвета */}
          {colors.length > 0 && (
            <div className="option">
              <span className="option__label">Цвет: {currentVariant?.color}</span>
              <div className="option__values">
                {colors.map((colorValue) => {
                  const isSelected = currentVariant?.color === colorValue
                  return (
                    <button
                      key={colorValue}
                      className={`chip ${isSelected ? 'chip--active' : ''}`}
                      onClick={() => {
                        // Находим вариант, соответствующий выбранному цвету и текущему размеру
                        const found = product.variants.find(
                          (v) => v.color === colorValue && (!currentVariant?.size || v.size === currentVariant.size)
                        ) || product.variants.find((v) => v.color === colorValue)
                        
                        if (found) setSelectedVariantId(found.id)
                      }}
                    >
                      {colorValue}
                    </button>
                  )
                })}
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
