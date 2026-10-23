export default function QuantityStepper({ value, onChange }) {
  return (
    <div className="stepper">
      <button onClick={() => onChange(value - 1)} disabled={value <= 1} aria-label="Уменьшить количество">
        −
      </button>
      <span>{value}</span>
      <button onClick={() => onChange(value + 1)} aria-label="Увеличить количество">
        +
      </button>
    </div>
  )
}
