import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TopBarVertical } from "../components/TopBarVertical";
import "./ServiceDetails.css";
import { BreadCrumbs } from "../components/BreadCrumbs";
import { ROUTES } from "../../Routes";
import { expensesMock } from "../modules/expensesMock";
import DefaultImage from "../assets/DefaultImage.png";

import { dest_img } from "../target_config";

interface ServiceDetail {
  ExpenseID: number;
  Title: string;
  ShortDescription: string;
  Price: number;
  ImageURL: string;
  Description: string;
  isMock?: boolean;
}
import { dest_api } from "../target_config";

export const ServiceDetails: FC = () => {
  const { id } = useParams();
  const [service, setService] = useState<ServiceDetail | null>(null);

  useEffect(() => {
    console.log("Render ServiceDetails");
    const loadDetails = async () => {
      try {
const res = await fetch(`${dest_api}/expenses/${id}`);
        if (!res.ok) {
          throw new Error("Backend unavailable");
        }
        const data = await res.json();
        setService(data.data);
      } catch (err) {
        console.warn("Бэк недоступен — использую mock");
        setService(
          expensesMock.find((s) => s.ExpenseID === Number(id)) || null,
        );
      }
    };
    loadDetails();
  }, [id]);

  if (!service) return null;

  function toProxyUrl(url?: string, isMock?: boolean) {
    if (!url) return "";
    // Если это мок изображение, то это уже валидный путь (из assets)
    if (isMock) {
      return url;
    }
    // Иначе преобразуем URL с бэкенда
    return (
      dest_img +
      url
        .replace("https://192.168.31.164:9000", "")
        .replace("https://10.205.157.61:9000", "")
    );
  }

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
  src="/FrontendRIPBackeven/DefaultVideo.mp4"
  autoPlay
  loop
  muted
  playsInline
  draggable={false}
>
</video>


        </div>

        {/* Справа — картинка и текст */}
        <div className="details-right">
          {/* Картинка для больших/средних экранов */}
          <div className="details-image-wrap">
            {" "}
            <img
              src={toProxyUrl(service.ImageURL, service.isMock) || DefaultImage}
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
