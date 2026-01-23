import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../store/store';
import { loadUserProfile, updateUserProfile } from '../api/userApi';
import { ROUTES } from '../../Routes';
import { TopBar } from '../components/TopBar';
import './ProfilePage.css';

const ProfilePage: React.FC = () => {
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();

  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);
  const profile = useSelector((state: RootState) => state.user.profile);
  const loading = useSelector((state: RootState) => state.user.loading);
  const error = useSelector((state: RootState) => state.user.error);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    login: '',
    password: '',
  });

  // Загружаем профиль при входе на страницу
  useEffect(() => {
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN);
      return;
    }

    loadUserProfile(dispatch);
  }, [isAuthenticated, navigate, dispatch]);

  // Заполняем форму данными профиля
  useEffect(() => {
    console.log("PROFILE:", profile);

    if (profile) {
      setFormData({
        login: profile?.Login || '',
        password: '',
      });
    }
  }, [profile]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    await updateUserProfile(dispatch, {
      login: formData.login,
      password: formData.password,
    });

    setIsEditing(false);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="page-root">
      <TopBar />

      <div className="profile-page-container">
        <div className="profile-wrapper">
          <h1 className="profile-title">Мой профиль</h1>

          {error && <div className="alert alert-danger">{error}</div>}

          {loading ? (
            <div className="loading">Загрузка...</div>
          ) : (
            <>
              <div className="profile-info">
                <div className="profile-item">
                  <label className="profile-label">ID пользователя:</label>
                  <span className="profile-value">{profile?.UserId || '—'}</span>
                </div>

                <div className="profile-item">
                  <label className="profile-label">Логин:</label>
                  <span className="profile-value">{profile?.Login || '—'}</span>
                </div>

                <div className="profile-item">
                  <label className="profile-label">Роль:</label>
                  <span className="profile-value">
                    {profile?.Role ? getRoleName(profile.Role) : '—'}
                  </span>
                </div>
              </div>

              {isEditing ? (
                <form onSubmit={handleSubmit} className="profile-form">
                  <div className="form-group">
                    <label htmlFor="login">Новый логин</label>
                    <input
                      type="text"
                      id="login"
                      name="login"
                      value={formData.login}
                      onChange={handleChange}
                      placeholder="Введите новый логин"
                      className="form-control"
                      disabled={loading}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="password">Новый пароль</label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Введите новый пароль"
                      className="form-control"
                      disabled={loading}
                    />
                  </div>

                  <div className="button-group">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? 'Сохранение...' : 'Сохранить'}
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setIsEditing(false)}
                      disabled={loading}
                    >
                      Отмена
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  className="btn btn-primary"
                  onClick={() => setIsEditing(true)}
                >
                  Редактировать профиль
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Вспомогательная функция для отображения роли
function getRoleName(role: string): string {
  const roles: { [key: string]: string } = {
    guest: 'Гость',
    creator: 'Аналитик',
    moderator: 'Финансовый директор',
  };
  return roles[role] || role;
}

export default ProfilePage;
