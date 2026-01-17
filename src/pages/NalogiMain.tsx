import "./NalogiMain.css";
import { FC, useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { BreadCrumbs } from "../components/BreadCrumbs";
// import { ROUTES, ROUTE_LABELS } from "../../Routes";
import DefaultImage from "../assets/DefaultImage.png";
import { useSearchParams } from "react-router-dom";
import { TopBar } from "../components/TopBar";
import { expensesMock } from "../modules/expensesMock";
import { Link } from "react-router-dom";

// Тип услуги
interface Service {
  ExpenseID: number;
  Title: string;
  ShortDescription: string;
  Price: number;
  ImageURL: string;
}

const NalogiMain: FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);

  const [searchParams] = useSearchParams();
  const query = searchParams.get("BreakenevSearch") || "";
  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");

  useEffect(() => {
    const loadExpenses = async () => {
      setLoading(true);

      const url =
        query.trim().length > 0
          ? `/api/expenses?searchbyexpensename=${encodeURIComponent(query)}`
          : `/api/expenses`;

      try {
        const res = await fetch(url);

        if (!res.ok) {
          throw new Error("Backend unavailable");
        }

        const data = await res.json();

        const filtered = data.data.filter((s: Service) => {
          const okMin = minPrice === "" || s.Price >= minPrice;
          const okMax = maxPrice === "" || s.Price <= maxPrice;
          return okMin && okMax;
        });

        setServices(filtered);
      } catch (err) {
        console.warn("Бэк недоступен — использую mock");

        const normalizedQuery = query.trim().toLowerCase();

        const filtered = expensesMock
          .filter((s: Service) =>
            normalizedQuery
              ? s.Title.toLowerCase().includes(normalizedQuery)
              : true,
          )
          .filter((s: Service) => {
            const okMin = minPrice === "" || s.Price >= minPrice;
            const okMax = maxPrice === "" || s.Price <= maxPrice;
            return okMin && okMax;
          });

        setServices(filtered);
      } finally {
        setLoading(false);
      }
    };

    loadExpenses();
  }, [query, minPrice, maxPrice]); // ← вот это убирает ошибку

  return (
    <div className="page-root">
      <TopBar />
      <main className="content">
        <div className="cards-area">
          <div className="search-row">
            <form className="search-form" action="/Nalogimain" method="GET">
              <input
                className="search-input"
                type="text"
                name="BreakenevSearch"
                placeholder="Поиск"
                defaultValue={query}
              />
              <button className="search-button" type="submit">
                Найти
              </button>
            </form>
          </div>
          <div className="filters-row">
            <div className="price-filter">
              <input
                type="number"
                className="price-input"
                placeholder="Мин. цена"
                value={minPrice}
                onChange={(e) =>
                  setMinPrice(
                    e.target.value === "" ? "" : Number(e.target.value),
                  )
                }
              />

              <span className="price-separator">—</span>

              <input
                type="number"
                className="price-input"
                placeholder="Макс. цена"
                value={maxPrice}
                onChange={(e) =>
                  setMaxPrice(
                    e.target.value === "" ? "" : Number(e.target.value),
                  )
                }
              />
            </div>
          </div>

          <div className="breadcrumbs-wrap">
            {" "}
            <BreadCrumbs crumbs={[{ label: "Услуги" }]} />{" "}
          </div>
          {loading ? (
            <div className="album_page_loader_block">
              <Spinner animation="border" />
            </div>
          ) : (
            <section className="cards-grid">
              {services.length > 0 ? (
                services.map((s) => (
                  <div className="card" key={s.ExpenseID}>
                    <div
                      className="card-img"
                      style={{
                        backgroundImage: `url('${s.ImageURL || DefaultImage}')`,
                      }}
                    ></div>

                    <div className="card-body">
                      <h3 className="card-title">{s.Title}</h3>
                      <p className="card-sub">{s.ShortDescription}</p>

                      <p className="card-price">Цена: {s.Price} ₽</p>

                      <div className="card-controls">
                        <form
                          action="/breakevencalc/add-expense"
                          method="POST"
                          className="inline-form"
                        >
                          <input
                            type="hidden"
                            name="ExpenseID"
                            value={s.ExpenseID}
                          />
                          <input
                            type="hidden"
                            name="BreakevenRequestID"
                            value={1}
                          />
                        </form>


<Link
  className="btn-details"
  to={`/Nalogimain/${s.ExpenseID}`}
>
  Подробнее
</Link>

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

      <a className="calculator disabled">
        <img
          src="http://localhost:9000/lab1/korzinaempty.png"
          alt="calculator-empty"
        />
      </a>
    </div>
  );
};

export default NalogiMain;
