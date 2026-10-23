import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function RegisterPage() {
  const { user, register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (user) return <Navigate to="/" replace />

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await register(form)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth">
      <form className="auth__form" onSubmit={handleSubmit}>
        <span className="logo">AURA</span>
        <h1>Регистрация</h1>
        <label>
          Имя
          <input name="name" value={form.name} onChange={handleChange} required />
        </label>
        <label>
          Почта
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </label>
        <label>
          Пароль
          <input type="password" name="password" value={form.password} onChange={handleChange} minLength={6} required />
        </label>
        {error && <p className="error">{error}</p>}
        <button className="btn btn--primary btn--block" disabled={submitting}>
          {submitting ? 'Создаём аккаунт…' : 'Создать аккаунт'}
        </button>
        <p className="auth__hint">
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </p>
      </form>
    </div>
  )
}
