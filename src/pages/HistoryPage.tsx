import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadBreakevenList } from "../api/breakevenApi";
import { RootState } from "../store/store";
import { TopBar } from "../components/TopBar";
import "./HistoryPage.css";

interface BreakevenRow {
  RequestID: number;
  Title: string;
  Status: string;
  CreationDate: string | null;
}

const HistoryPage = () => {
  const dispatch = useDispatch<any>();

  const rawList = useSelector((state: RootState) => state.breakeven.list);
  const loading = useSelector((state: RootState) => state.breakeven.loading);

  // 🔥 Приводим backend → frontend формат
  const list: BreakevenRow[] = Array.isArray(rawList)
    ? rawList.map((item: any) => ({
        RequestID: item.BreakevenRequestID,
        Title: item.BreakevenRequestTitle ?? "Без названия",
        Status: item.BreakevenRequestStatus,
        CreationDate: item.CreationDate ?? null
      }))
    : [];

  useEffect(() => {
    dispatch(loadBreakevenList());
  }, [dispatch]);

  return (
    <div className="page-root">
      <TopBar />

      <div className="history-page-container">
        <div className="history-wrapper">
          <h2 className="history-title">История заявок</h2>

          {loading ? (
            <div className="history-loading">Загрузка...</div>
          ) : (
            <table className="history-table">
              <thead>
                <tr>
                  <th>ID</th>
                  
                  <th>Статус</th>
                  <th>Дата создания</th>
                </tr>
              </thead>

              <tbody>
                {list.length > 0 ? (
                  list.map((item) => (
                    <tr key={item.RequestID}>
                      <td>{item.RequestID}</td>
                      
                      <td>{item.Status}</td>

                      {/* Дата создания */}
                      <td>
                        {item.CreationDate
                          ? new Date(item.CreationDate).toLocaleString("ru-RU", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit"
                            })
                          : "—"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="no-data">
                      Нет заявок
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
