import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../store/store';
import { registerUser } from '../api/userApi';
import { ROUTES } from '../../Routes';
import { TopBar } from '../components/TopBar';
import './RegisterPage.css';

const RegisterPage: React.FC = () => {
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    login: '',
    password: '',
  });

  const [validationError, setValidationError] = useState('');

  const error = useSelector((state: RootState) => state.user.error);
  const loading = useSelector((state: RootState) => state.user.loading);
  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.LOGIN);
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setValidationError('');
  };

 const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();

  if (!formData.login.trim()) {
    setValidationError('Заполните логин');
    return;
  }

  if (!formData.password.trim()) {
    setValidationError('Заполните пароль');
    return;
  }

  await registerUser(dispatch, {
    login: formData.login,
    password: formData.password,
  });
};


  return (
    <div className="page-root">
      <TopBar />

      <div className="register-page-container">
        <div className="register-form-wrapper">
          <h2 className="register-title">Регистрация</h2>

          {error && <div className="alert alert-danger">{error}</div>}
          {validationError && <div className="alert alert-danger">{validationError}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="login">Логин</label>
              <input
                type="text"
                id="login"
                name="login"
                value={formData.login}
                onChange={handleChange}
                placeholder="Введите логин"
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
              className="register-button"
              disabled={loading}
            >
              {loading ? 'Загрузка...' : 'Зарегистрироваться'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
