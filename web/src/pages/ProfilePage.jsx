import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useCart } from '../context/CartContext.jsx'

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const { clear } = useCart()
  const navigate = useNavigate()

  // Корзина привязана к сессии, поэтому при выходе она очищается
  const leave = (path) => {
    clear()
    logout()
    navigate(path)
  }

  return (
    <>
      <h1 className="page-title">Личный кабинет</h1>
      <div className="profile">
        <div className="profile__avatar">{user.name[0]?.toUpperCase()}</div>
        <div>
          <p className="profile__name">{user.name}</p>
          <p className="profile__email">{user.email}</p>
        </div>
        <div className="profile__actions">
          <button className="btn" onClick={() => leave('/login')}>Сменить аккаунт</button>
          <button className="btn btn--primary" onClick={() => leave('/login')}>Выйти</button>
        </div>
      </div>
    </>
  )
}
