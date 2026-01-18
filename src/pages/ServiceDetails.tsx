import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TopBarVertical } from "../components/TopBarVertical";
import "./ServiceDetails.css";
import { BreadCrumbs } from "../components/BreadCrumbs";
import { ROUTES } from "../../Routes";
import { expensesMock } from "../modules/expensesMock";
import DefaultImage from "../assets/DefaultImage.png";
import DefaultVideo from "../assets/DefaultVideo.mp4";

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
        setService(expensesMock.find((s) => s.ExpenseID === Number(id)));
      }
    };
    loadDetails();
  }, [id]);

  if (!service) return null;
function toProxyUrl(url?: string) { if (!url) return ""; return url.replace("http://localhost:9000", "/img-proxy"); }
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
        {/* Слева — видео */}
        <div className="details-video-wrap">
          <video
            className="details-video"
            src={DefaultVideo}
            controls
            autoPlay
            muted
            loop
            playsInline
          />
        </div>

        {/* Справа — картинка и текст */}
        <div className="details-right">
          {/* Картинка для больших/средних экранов */}
          <div className="details-image-wrap">
            {" "}
            <img
              src={toProxyUrl(service.ImageURL) || DefaultImage}
              alt={service.Title}
              className="details-image"
              onError={(e) => {
                e.currentTarget.src = DefaultImage;
              }}
            />{" "}
          </div>

          <div className="details-info">
            <h1 className="details-title">{service.Title}</h1>

            <p className="details-price">Цена: {service.Price} ₽</p>

            <p className="details-short">{service.ShortDescription}</p>

            <p className="details-desc">{service.Description}</p>
          </div>
        </div>
      </main>
    </div>
  );
};
