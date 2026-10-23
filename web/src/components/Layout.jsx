import { Link, NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useCart } from '../context/CartContext.jsx'

export default function Layout() {
  const { user } = useAuth()
  const { count } = useCart()

  return (
    <>
      <header className="header">
        <div className="container header__inner">
          <Link to="/" className="logo">AURA</Link>
          <nav className="header__nav">
            <NavLink to="/" end>Каталог</NavLink>
            <NavLink to="/profile">{user.name}</NavLink>
            <NavLink to="/cart" className="header__cart">
              Корзина
              {count > 0 && <span className="badge">{count}</span>}
            </NavLink>
          </nav>
        </div>
      </header>
      <main className="container main">
        <Outlet />
      </main>
    </>
  )
}
