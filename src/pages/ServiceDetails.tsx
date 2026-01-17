import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TopBarVertical } from "../components/TopBarVertical";
import "./ServiceDetails.css";
import { BreadCrumbs } from "../components/BreadCrumbs";
import { ROUTES } from "../../Routes";
import { expensesMock } from "../modules/expensesMock";

export const ServiceDetails: FC = () => {
  const { id } = useParams();
  const [service, setService] = useState<any>(null);

  useEffect(() => {
    const loadDetails = async () => {
      try {
        const res = await fetch(`/api/expenses/${id}`);
        if (!res.ok) {
          throw new Error("Backend unavailable");
        }
        const data = await res.json();
        setService(data.data);
      } catch (err) {
        console.warn("Бэк недоступен — использую mock");
 setService(expensesMock.find(s => s.ExpenseID === Number(id)));

      }
    };
    loadDetails();
  }, [id]);

  if (!service) return null;

  return (
    <div className="details-root">
      <TopBarVertical />
      <BreadCrumbs
        crumbs={[
          { label: "Траты", path: ROUTES.EXPENSES },
          { label: "Подробнее" },
        ]}
      />
      <main className="details-layout">
        {/* Центр — видео */}
        <div className="details-video-wrap">
          <video
            className="details-video"
            src="/src/assets/DefaultVideo.mp4"
            autoPlay
            muted
            loop
            playsInline
          />
        </div>

        {/* Справа — текст */}
        <div className="details-info">
          <h1 className="details-title">{service.Title}</h1>

          <p className="details-price">Цена: {service.Price} ₽</p>

          <p className="details-short">{service.ShortDescription}</p>

          <p className="details-desc">{service.Description}</p>
        </div>
      </main>
    </div>
  );
};
