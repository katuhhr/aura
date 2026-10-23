// Фото товара. Пока у товара нет картинки, показываем заглушку с силуэтом категории.

const ICONS = {
  Women: 'M24 8l4 6h8l4-6M24 8l-2 14 4 6-10 28h32L38 28l4-6-2-14',
  Men: 'M22 10L8 18l6 10 6-3v29h24V25l6 3 6-10-14-8c-2 4-6 6-10 6s-8-2-10-6z',
  Footwear: 'M6 44V28l8 2 6-8 14 12 18 4c4 1 6 4 6 8H6zM6 48h52',
  Accessories: 'M12 24h40l-3 30H15zM24 24v-6a8 8 0 0116 0v6',
}

export default function ProductImage({ src, category, alt = '' }) {
  if (src) return <img className="product-image" src={src} alt={alt} />

  return (
    <div className="product-image product-image--empty" role="img" aria-label={alt}>
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
        <path d={ICONS[category] || ICONS.Accessories} />
      </svg>
    </div>
  )
}
