import type { FC } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../Routes";

import "./HomePage.css";

export const HomePage: FC = () => {
  return (
    <div className="home-root">
      

      <div className="home-content">
        <h1 className="home-title">Расчёт точки безубыточности</h1>

        <p className="home-text">
          Добро пожаловать в сервис расчёта точки безубыточности. 
          Здесь вы можете подобрать затраты, просмотреть их стоимость, 
          добавить необходимые услуги в расчёт и получить итоговый результат.
        </p>

        <p className="home-text">
          Начните с выбора услуг, которые входят в ваши постоянные или переменные затраты.
        </p>

        <Link to={ROUTES.EXPENSES} className="home-button">
          Перейти к тратам
        </Link>
      </div>
    </div>
  );
};
