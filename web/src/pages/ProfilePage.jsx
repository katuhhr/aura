import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  // Корзина хранится на сервере и дождётся следующего входа
  const leave = () => {
    logout()
    navigate('/login')
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
          <button className="btn" onClick={leave}>Сменить аккаунт</button>
          <button className="btn btn--primary" onClick={leave}>Выйти</button>
        </div>
      </div>
    </>
  )
}
