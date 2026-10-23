import { NavLink, Outlet } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'

const TABS = [
  { to: '/', label: 'Главная', icon: 'M4 11l8-7 8 7v9h-5v-6H9v6H4z' },
  { to: '/cart', label: 'Корзина', icon: 'M5 8h14l-1 12H6zM9 8V6a3 3 0 016 0v2' },
  { to: '/profile', label: 'Профиль', icon: 'M12 12a4 4 0 100-8 4 4 0 000 8zM4 21c0-4 4-6 8-6s8 2 8 6' },
]

export default function Layout() {
  const { count } = useCart()

  return (
    <>
      <header className="top">
        <span className="logo">AURA</span>
      </header>

      <main className="content">
        <Outlet />
      </main>

      {/* Нижняя навигационная панель (ТЗ, рисунок 1, цифра 6) */}
      <nav className="tabbar">
        {TABS.map((tab) => (
          <NavLink key={tab.to} to={tab.to} end className="tabbar__item">
            <span className="tabbar__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
                <path d={tab.icon} />
              </svg>
              {tab.to === '/cart' && count > 0 && <span className="badge">{count}</span>}
            </span>
            {tab.label}
          </NavLink>
        ))}
      </nav>
    </>
  )
}
