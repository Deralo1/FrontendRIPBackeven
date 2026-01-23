import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../store/store';
import { loginUser } from '../api/userApi';
import { ROUTES } from '../../Routes';
import { TopBar } from '../components/TopBar';
import './LoginPage.css';

const LoginPage: React.FC = () => {
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const error = useSelector((state: RootState) => state.user.error);
  const loading = useSelector((state: RootState) => state.user.loading);
  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);

  // 🔥 Правильный переход после успешной авторизации
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.EXPENSES);
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    await loginUser(dispatch, {
      login: formData.username,
      password: formData.password
    });
  };

  return (
    <div className="page-root">
      <TopBar />

      <div className="login-page-container">
        <div className="login-form-wrapper">
          <h2 className="login-title">Рады Вас видеть!</h2>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Имя пользователя</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Введите имя пользователя"
                className="form-control"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Пароль</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Введите пароль"
                className="form-control"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? 'Загрузка...' : 'Войти'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
