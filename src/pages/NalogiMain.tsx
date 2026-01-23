import "./NalogiMain.css";
import { FC, useEffect } from "react";
import { Spinner } from "react-bootstrap";
import { BreadCrumbs } from "../components/BreadCrumbs";
import DefaultImage from "../assets/DefaultImage.png";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { TopBar } from "../components/TopBar";
import emptyCartMock from "../assets/korzinaempty.png";
import { dest_img } from "../target_config";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store/store";

import { getCalcinf } from "../store/getCalcinf";
import {
  useSearch,
  useMinPrice,
  useMaxPrice,
  setSearchAction,
  setMinPriceAction,
  setMaxPriceAction
} from "../slices/filtersSlice";

import { loadExpenses } from "../api/expensesApi";
import { useServices, useServicesLoading } from "../slices/expensesSlice";

// 🔥 импорт добавления услуги в корзину
import { addExpenseToCalc } from "../api/expensesApi";

const NalogiMain: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);
  const app_id = useSelector((state: RootState) => state.Calcinf.app_id);
  const count = useSelector((state: RootState) => state.Calcinf.count ?? 0);

  // Логирование для отладки
  useEffect(() => {
    console.log('🔍 Store state:', { isAuthenticated, app_id, count });
  }, [isAuthenticated, app_id, count]);

  useEffect(() => {
    if (isAuthenticated) {
      console.log('📊 Загружаем данные корзины для авторизованного пользователя');
      dispatch(getCalcinf());
    }
  }, [isAuthenticated, dispatch]);

  const [searchParams] = useSearchParams();
  const query = searchParams.get("BreakenevSearch") || "";

  const search = useSearch();
  const minPrice = useMinPrice();
  const maxPrice = useMaxPrice();

  const services = useServices();
  const loading = useServicesLoading();

// Загружаем услуги после выхода из системы
useEffect(() => {
  if (!isAuthenticated) {
    loadExpenses(dispatch, "");
  }
}, [isAuthenticated, dispatch]);


// 2. Загружаем услуги при изменении поисковой строки
useEffect(() => {
  const effectiveSearch = query.trim().length > 0 ? query : search;
  loadExpenses(dispatch, effectiveSearch);
}, [query, search, dispatch]);


  // Фильтрация по поиску и цене
  const filteredServices = services.filter((s) => {
    const normalizedSearch = search.trim().toLowerCase();

    const matchesSearch =
      normalizedSearch.length === 0 ||
      s.Title.toLowerCase().includes(normalizedSearch);

    const min = minPrice === "" ? null : Number(minPrice);
    const max = maxPrice === "" ? null : Number(maxPrice);

    const matchesMin = min === null || s.Price >= min;
    const matchesMax = max === null || s.Price <= max;

    return matchesSearch && matchesMin && matchesMax;
  });

  function toProxyUrl(url?: string, isMock?: boolean) {
    if (!url) return "";
    if (isMock) return url;
    return dest_img + url
      .replace("https://192.168.31.164:9000", "")
      .replace("https://10.205.157.61:9000", "");
  }

  // 🔥 обработчик добавления услуги в корзину
const handleAdd = async (expenseId: number) => {
  if (!isAuthenticated) return;

  console.log('Добавляем услугу:', expenseId);
  await addExpenseToCalc(expenseId);   // просто вызов API
  console.log('API вызов завершен, обновляем корзину');
  await dispatch(getCalcinf());        // обновляем количество в корзине
  console.log('Корзина обновлена');
};


  return (
    <div className="page-root">
      <TopBar />

      <main className="content">
        <div className="cards-area">
          {/* Поиск */}
          <div className="search-row">
            <form className="search-form" onSubmit={(e) => e.preventDefault()}>
              <input
                className="search-input"
                type="text"
                placeholder="Поиск"
                value={search}
                onChange={(e) => dispatch(setSearchAction(e.target.value))}
              />

              <button
                className="search-button"
                type="button"
                onClick={() => loadExpenses(dispatch, search)}
              >
                Найти
              </button>
            </form>
          </div>

          {/* Фильтры */}
          <div className="filters-row">
            <div className="price-filter">
              <input
                type="number"
                min="0"
                className="price-input"
                placeholder="Мин. цена"
                value={minPrice}
                onChange={(e) =>
                  dispatch(
                    setMinPriceAction(
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  )
                }
              />

              <span className="price-separator">—</span>

              <input
                type="number"
                min="0"
                className="price-input"
                placeholder="Макс. цена"
                value={maxPrice}
                onChange={(e) =>
                  dispatch(
                    setMaxPriceAction(
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  )
                }
              />
            </div>
          </div>

          <div className="breadcrumbs-wrap">
            <BreadCrumbs crumbs={[{ label: "Услуги" }]} />
          </div>

          {/* Контент */}
          {loading ? (
            <div className="album_page_loader_block">
              <Spinner animation="border" />
            </div>
          ) : (
            <section className="cards-grid">
              {filteredServices.length > 0 ? (
                filteredServices.map((s) => (
                  <div className="card" key={s.ExpenseID}>
                    <div
                      className="card-img"
                      style={{
                        backgroundImage: `url('${toProxyUrl(
                          s.ImageURL,
                          s.isMock
                        ) || DefaultImage}')`
                      }}
                    ></div>

                    <div className="card-body">
                      <h3 className="card-title">{s.Title}</h3>
                      <p className="card-sub">{s.ShortDescription}</p>
                      <p className="card-price">Цена: {s.Price} ₽</p>

                      <div className="card-controls">
                        {/* Подробнее */}
                        <Link
                          className="btn-details"
                          to={`/Nalogimain/${s.ExpenseID}`}
                        >
                          Подробнее
                        </Link>

                        {/* 🔥 Добавить */}
                        {isAuthenticated && (
                          <button
                            className="btn-details"
                            onClick={() => handleAdd(s.ExpenseID)}
                          >
                            Добавить
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-results">Ничего не найдено.</div>
              )}
            </section>
          )}
        </div>
      </main>

      {/* Кнопка корзины */}
<a
  className={`calculator ${!isAuthenticated || count === 0 ? "disabled" : ""}`}
  onClick={() => {
    if (isAuthenticated && count > 0 && app_id) {
      navigate(`/BreakevenCalc/${app_id}`);
    }
  }}
>
<img
  src={
    !isAuthenticated || count === 0
      ? emptyCartMock
      : dest_img + "/lab1/korzinafull.png"
  }
  alt="cart"
  onError={(e) => {
    e.currentTarget.src = emptyCartMock;
  }}
/>


  {isAuthenticated && count > 0 && (
    <span className="calc-badge">{count}</span>
  )}
</a>

    </div>
  );
};

export default NalogiMain;
