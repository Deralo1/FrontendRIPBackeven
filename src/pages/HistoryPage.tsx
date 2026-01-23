import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState, AppDispatch } from "../store/store";
import { fetchBreakevenList } from "../slices/breakEvenDraftSlice";
import { api } from "../api/index";
import { ROUTES } from "../../Routes";
import { TopBar } from "../components/TopBar";
import "./HistoryPage.css";

interface DsBreakevenRequestDTO {
  BreakevenRequestID?: number;
  BreakevenRequestStatus?: string;
  AmountProduct?: number;
  CalcAnswer?: number;
  CreationDate?: string;
  FormatedAt?: string;
  CompletedAt?: string;
  CreatorLogin?: string;
  ModeratorLogin?: string;
  RequestExpense?: any[];
}

const HistoryPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);
  const userRole = useSelector((state: RootState) => state.user.profile?.Role);
  const list = useSelector((state: RootState) => state.breakeven.list);
  const loading = useSelector((state: RootState) => state.breakeven.loading);

  // Фильтры
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [creatorFilter, setCreatorFilter] = useState<string>("");
  const [dateFromFilter, setDateFromFilter] = useState<string>("");
  const [dateToFilter, setDateToFilter] = useState<string>("");
  const [processingSid, setProcessingSid] = useState<number | null>(null);

  // Short polling
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isModerator = userRole?.toLowerCase() === "moderator";

  // Загружаем список и запускаем polling
  useEffect(() => {
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN);
      return;
    }

    // Первая загрузка
    dispatch(fetchBreakevenList(statusFilter));

    // Запускаем short polling (каждые 5 секунд)
    pollingRef.current = setInterval(() => {
      dispatch(fetchBreakevenList(statusFilter));
    }, 5000);

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [isAuthenticated, navigate, dispatch, statusFilter]);

  // Фильтрация списка
  const filteredList = (list as DsBreakevenRequestDTO[])
    .filter((request) => {
      // Фильтр по создателю (клиент)
      if (creatorFilter && request.CreatorLogin?.toLowerCase() !== creatorFilter.toLowerCase()) {
        return false;
      }

      // Фильтр по датам формирования
      if (dateFromFilter) {
        const requestDate = new Date(request.FormatedAt || request.CreationDate || "");
        const fromDate = new Date(dateFromFilter);
        if (requestDate < fromDate) {
          return false;
        }
      }

      if (dateToFilter) {
        const requestDate = new Date(request.FormatedAt || request.CreationDate || "");
        const toDate = new Date(dateToFilter);
        toDate.setHours(23, 59, 59, 999); // конец дня
        if (requestDate > toDate) {
          return false;
        }
      }

      return true;
    })
    // Сортировка по ID от большего к меньшему
    .sort((a, b) => (b.BreakevenRequestID || 0) - (a.BreakevenRequestID || 0));

  // Изменение статуса
  const handleStatusChange = async (requestId: number, action: "complete" | "reject") => {
    setProcessingSid(requestId);
    try {
      await api.breakeven.processUpdate(requestId, { action });
      // Обновляем список сразу
      dispatch(fetchBreakevenList(statusFilter));
    } catch (err) {
      console.error("Ошибка при изменении статуса:", err);
    } finally {
      setProcessingSid(null);
    }
  };

  const getStatusDisplay = (status?: string) => {
    const statusMap: { [key: string]: string } = {
      "черновик": "Черновик",
      "сформирован": "Сформирован",
      "завершён": "Завершён",
      "отклонён": "Отклонён",
    };
    return statusMap[status?.toLowerCase() || ""] || status || "Неизвестно";
  };

  const getStatusClass = (status?: string) => {
    const className: { [key: string]: string } = {
      "черновик": "status-draft",
      "сформирован": "status-formed",
      "завершён": "status-completed",
      "отклонён": "status-rejected",
    };
    return className[status?.toLowerCase() || ""] || "status-unknown";
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    try {
      return new Date(dateString).toLocaleDateString("ru-RU", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const handleRowClick = (requestId?: number) => {
    if (requestId) {
      navigate(`${ROUTES.BreakevenCalc}/${requestId}`);
    }
  };

  const creatorList = Array.from(new Set((list as DsBreakevenRequestDTO[]).map((r) => r.CreatorLogin).filter(Boolean) as string[]));

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="page-root">
      <TopBar />

      <main className="content history-root">
        <h1 className="page-title">История заявок {isModerator && "(Модератор)"}</h1>

        {/* Фильтры */}
        <div className="filters-section">
          <div className="filter-group">
            <label className="filter-label">Статус:</label>
            <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">Все статусы</option>
              <option value="черновик">Черновик</option>
              <option value="сформирован">Сформирован</option>
              <option value="завершён">Завершён</option>
              <option value="отклонён">Отклонён</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Дата от:</label>
            <input
              type="date"
              className="filter-input"
              value={dateFromFilter}
              onChange={(e) => setDateFromFilter(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label className="filter-label">Дата до:</label>
            <input
              type="date"
              className="filter-input"
              value={dateToFilter}
              onChange={(e) => setDateToFilter(e.target.value)}
            />
          </div>

          {isModerator && creatorList.length > 0 && (
            <div className="filter-group">
              <label className="filter-label">Создатель:</label>
              <select className="filter-select" value={creatorFilter} onChange={(e) => setCreatorFilter(e.target.value)}>
                <option value="">Все</option>
                {creatorList.map((creator) => (
                  <option key={creator} value={creator}>
                    {creator}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Таблица */}
        <div className="table-wrapper">
          {loading && list.length === 0 ? (
            <div className="loading">Загрузка заявок...</div>
          ) : filteredList.length > 0 ? (
            <table className="history-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Статус</th>
                  <th>Кол-во товара</th>
                  <th>Ответ</th>
                  <th>Создано</th>
                  <th>Сформировано</th>
                  <th>Завершено</th>
                  <th>Создатель</th>
                  <th>Модератор</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {filteredList.map((request) => (
                  <tr key={request.BreakevenRequestID} className="table-row">
                    <td className="cell-id">{request.BreakevenRequestID || "—"}</td>
                    <td>
                      <span className={`status-badge ${getStatusClass(request.BreakevenRequestStatus)}`}>
                        {getStatusDisplay(request.BreakevenRequestStatus)}
                      </span>
                    </td>
                    <td className="cell-amount">{request.AmountProduct ?? "—"}</td>
                    <td className="cell-answer">{request.CalcAnswer ?? "—"}</td>
                    <td className="cell-date">{formatDate(request.CreationDate)}</td>
                    <td className="cell-date">{formatDate(request.FormatedAt)}</td>
                    <td className="cell-date">{formatDate(request.CompletedAt)}</td>
                    <td className="cell-user">{request.CreatorLogin || "—"}</td>
                    <td className="cell-user">{request.ModeratorLogin || "—"}</td>
                    <td className="cell-actions">
                      <button
                        className="btn-view"
                        onClick={() => handleRowClick(request.BreakevenRequestID)}
                        disabled={processingSid === request.BreakevenRequestID}
                      >
                        Просмотр
                      </button>

                      {isModerator && request.BreakevenRequestStatus?.toLowerCase() === "сформирован" && (
                        <>
                          <button
                            className="btn-complete"
                            onClick={() => handleStatusChange(request.BreakevenRequestID!, "complete")}
                            disabled={processingSid === request.BreakevenRequestID}
                          >
                            ✓
                          </button>
                          <button
                            className="btn-reject"
                            onClick={() => handleStatusChange(request.BreakevenRequestID!, "reject")}
                            disabled={processingSid === request.BreakevenRequestID}
                          >
                            ✕
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="no-results">Нет заявок по выбранному фильтру</div>
          )}
        </div>
      </main>
    </div>
  );
};

export default HistoryPage;
