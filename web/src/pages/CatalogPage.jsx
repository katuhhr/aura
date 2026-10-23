import { useEffect, useState } from 'react'
import { api } from '../api/index.js'
import { CATEGORIES } from '../data/products.js'
import ProductCard from '../components/ProductCard.jsx'

export default function CatalogPage() {
  const [category, setCategory] = useState(null)
  const [search, setSearch] = useState('')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    // Флаг нужен, чтобы ответ на устаревший запрос не затёр свежий результат
    let cancelled = false
    setLoading(true)
    setError('')

    // Небольшая задержка, чтобы не слать запрос на каждую набранную букву
    const timer = setTimeout(() => {
      api
        .getProducts({ category, search })
        .then((data) => !cancelled && setProducts(data))
        .catch((err) => !cancelled && setError(err.message))
        .finally(() => !cancelled && setLoading(false))
    }, 200)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [category, search])

  return (
    <>
      <section className="banner">
        <span className="banner__label">Новая коллекция</span>
        <h1>Осень — зима 2026</h1>
        <p>Шерсть, кашемир и кожа в спокойных оттенках сезона</p>
      </section>

      <input
        className="search"
        type="search"
        placeholder="Поиск по названию"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="chips">
        <button className={`chip ${category === null ? 'chip--active' : ''}`} onClick={() => setCategory(null)}>
          Все
        </button>
        {CATEGORIES.map((name) => (
          <button
            key={name}
            className={`chip ${category === name ? 'chip--active' : ''}`}
            onClick={() => setCategory(name)}
          >
            {name}
          </button>
        ))}
      </div>

      {error && <p className="state error">{error}</p>}
      {!error && loading && <p className="state">Загрузка…</p>}
      {!error && !loading && products.length === 0 && <p className="state">Ничего не найдено</p>}
      {!error && !loading && (
        <div className="grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </>
  )
}
