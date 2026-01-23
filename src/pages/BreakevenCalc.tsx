import { FC, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { AppDispatch } from "../store/store";
import { TopBar } from "../components/TopBar";
import { loadExpenseById } from "../api/expensesApi";
import { api } from "../api/index";
import { deleteCalc } from "../store/DeleteCalc";
import { dest_img } from "../target_config";
import "./breakevenCalc_style.css";
import { DsUpdateRequestExpenseDTO } from "../api/Api";

const BreakEvenCalcPage: FC = () => {
  const { app_id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [request, setRequest] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const [changes, setChanges] = useState<Map<string | number, any>>(new Map());
  const [saving, setSaving] = useState(false);
  const [forming, setForming] = useState(false);
  const [deletedExpenses, setDeletedExpenses] = useState<Set<number>>(new Set());

  // ============================
  // 1. ЗАГРУЗКА ЗАЯВКИ
  // ============================
  useEffect(() => {
    const load = async () => {
      try {
        if (!app_id) return;

        const full = await api.breakeven.breakevenDetail(Number(app_id));
        const base = full.data.data;

        if (!base) {
          setRequest(null);
          setLoading(false);
          return;
        }

        const enrichedExpenses = await Promise.all(
          (base.RequestExpense ?? []).map(async (item: any) => {
            const extra = await loadExpenseById(item.ExpenseID);
            return { ...item, ...extra };
          })
        );

        setRequest({
          ...base,
          RequestExpense: enrichedExpenses,
        });
      } catch (err) {
        console.error("Ошибка загрузки заявки:", err);
        setRequest(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [app_id]);

  // ============================
  // 2. РЕДИРЕКТ ЕСЛИ ЗАЯВКИ НЕТ
  // ============================
  useEffect(() => {
    if (!loading && request === null) {
      navigate("/Nalogimain");
    }
  }, [loading, request]);

  // ============================
  // 3. ПРОКСИ ДЛЯ КАРТИНОК
  // ============================
  function toProxyUrl(url?: string, isMock?: boolean) {
    if (!url) return "";
    if (isMock) return url;

    return (
      dest_img +
      url
        .replace("https://192.168.31.164:9000", "")
        .replace("https://10.205.157.61:9000", "")
    );
  }

  // ============================
  // 4. УДАЛЕНИЕ ЗАЯВКИ
  // ============================
  const onDelete = async () => {
    if (!request?.BreakevenRequestID) return;

    await dispatch(deleteCalc(request.BreakevenRequestID));
    setRequest(null);
  };

  // ============================
  // 5. СОХРАНЕНИЕ ВСЕХ ИЗМЕНЕНИЙ
  // ============================
  const onSave = async () => {
    if (changes.size === 0 && deletedExpenses.size === 0) return;
    if (!request?.BreakevenRequestID) return;

    setSaving(true);

    try {
      const savePromises: Promise<any>[] = [];

      // 1. Сохраняем траты
      for (const [key, data] of changes.entries()) {
        if (key === "AmountProduct") continue;

        savePromises.push(
          api.expenseCalc.expenseCalcUpdate(key as number, data)
        );
      }

      // 2. Сохраняем количество товара в заявке
      if (changes.has("AmountProduct")) {
        savePromises.push(
          api.breakeven.breakevenUpdate(
            request.BreakevenRequestID,
            { AmountProduct: changes.get("AmountProduct") } as any
          )
        );
      }

      // 3. Удаляем траты
      const deletePromises = Array.from(deletedExpenses.values()).map(
        (expenseId) => api.expenseCalc.expenseCalcDelete(expenseId)
      );

      await Promise.all([...savePromises, ...deletePromises]);

      setChanges(new Map());
      setDeletedExpenses(new Set());

      console.log("Все данные успешно сохранены!");
    } catch (err) {
      console.error("Ошибка сохранения:", err);
    } finally {
      setSaving(false);
    }
  };

  // ============================
  // 6. ОБРАБОТЧИКИ ИЗМЕНЕНИЙ
  // ============================
  const updateExpense = (id: number, data: DsUpdateRequestExpenseDTO) => {
    setChanges((prev) => new Map(prev).set(id, data));

    setRequest((prevReq: any) => ({
      ...prevReq,
      RequestExpense: prevReq.RequestExpense.map((x: any) =>
        x.ExpenseID === id ? { ...x, ...data } : x
      ),
    }));
  };

  const onChangeAmount = (item: any, value: string) => {
    const num = Number(value);

    updateExpense(item.ExpenseID, {
      AmountService: num,
      TypeSpend: item.TypeSpend,
    });
  };

  const onChangeType = (item: any, type: number) => {
    updateExpense(item.ExpenseID, {
      AmountService: item.AmountService,
      TypeSpend: type,
    });
  };

  const onChangeAmountProduct = (value: string) => {
    const num = Number(value);

    setRequest((prev: any) => ({
      ...prev,
      AmountProduct: num,
    }));

    setChanges((prev) => {
      const next = new Map(prev);
      next.set("AmountProduct", num);
      return next;
    });
  };

  // ============================
  // 6.5. УДАЛЕНИЕ ТРАТЫ
  // ============================
  const onDeleteExpense = async (expenseId: number) => {
    try {
      await api.expenseCalc.expenseCalcDelete(expenseId);

      setRequest((prev: any) => ({
        ...prev,
        RequestExpense: prev.RequestExpense.filter(
          (x: any) => x.ExpenseID !== expenseId
        ),
      }));

      setChanges((prev) => {
        const next = new Map(prev);
        next.delete(expenseId);
        return next;
      });

      console.log("Трата удалена полностью");
    } catch (err) {
      console.error("Ошибка удаления траты:", err);
    }
  };

  // ============================
  // 6.6. ФОРМИРОВАНИЕ ЗАЯВКИ
  // ============================
  const onFormRequest = async () => {
    if (!request?.BreakevenRequestID) return;

    setForming(true);

    try {
      // сначала сохраняем все изменения, если есть
      if (changes.size > 0 || deletedExpenses.size > 0) {
        await onSave();
      }

      // затем отправляем заявку на модерацию
      const updated = await api.breakeven.formUpdate(request.BreakevenRequestID);

      setRequest(updated.data);
      console.log("Заявка успешно отправлена на модерацию!");
    } catch (err) {
      console.error("Ошибка при формировании заявки:", err);
    } finally {
      setForming(false);
    }
  };

  // ============================
  // 7. РЕНДЕР
  // ============================
  return (
    <div className="page-root">
      <TopBar />

      <main className="content breakeven-root">
        <h1 className="page-title">Калькулятор точки безубыточности</h1>

        {/* Верхняя строка */}
        <div className="top-row">
          <div className="input-wrap">
            <input
              className="input product-cost"
              placeholder="Введите количество товара"
              value={request?.AmountProduct ?? ""}
              onChange={(e) => onChangeAmountProduct(e.target.value)}
            />
          </div>

          <div className="answer-wrap">
            <div className="result-card">
              Точка безубыточности: {request?.CalcAnswer ?? 0} ед.
            </div>

            {request && (
              <>
                <button
                  className="btn-form"
                  onClick={onFormRequest}
                  disabled={forming}
                >
                  {forming ? "Формирование..." : "Сформировать"}
                </button>

                <button
                  className="btn-save"
                  onClick={onSave}
                  disabled={(changes.size === 0 && deletedExpenses.size === 0) || saving}
                >
                  {saving ? "Сохранение..." : "Сохранить"}
                </button>

                <button className="btn-delete" onClick={onDelete}>
                  Удалить заявку
                </button>
              </>
            )}
          </div>
        </div>

        {/* Карточки */}
        {request ? (
          <>
            <section className="be-card be-card-header">
              <div className="be-header-row">
                <div className="be-col img"></div>
                <div className="be-col name">Название</div>
                <div className="be-col desc">Описание</div>
                <div className="be-col price">Цена</div>
                <div className="be-col type">Тип траты</div>
                <div className="be-col amount">Величина</div>
                <div className="be-col actions">Действия</div>
              </div>
            </section>

            {request.RequestExpense?.map((item: any) => (
              <section className="be-card" key={item.ExpenseID}>
                <div className="be-card-body be-row">
                  <div className="be-col img">
                    <div
                      className="be-card-img"
                      style={{
                        backgroundImage: `url('${toProxyUrl(item.ImageURL)}')`,
                      }}
                    ></div>
                  </div>

                  <div className="be-col name">
                    <h2 className="be-card-heading">
                      {item.Title || "Без названия"}
                    </h2>
                  </div>

                  <div className="be-col desc">
                    <div className="be-card-sub">
                      {item.ShortDescription || "Описание отсутствует"}
                    </div>
                  </div>

                  <div className="be-col price">
                    <p className="card-price">
                      {item.Price != null ? `${item.Price} ₽` : "—"}
                    </p>
                  </div>

                  <div className="be-col type">
                    <div className="radios">
                      <label className="radio-label">
                        <input
                          type="radio"
                          checked={item.TypeSpend === 1}
                          onChange={() => onChangeType(item, 1)}
                        />
                        Постоянные
                      </label>

                      <label className="radio-label">
                        <input
                          type="radio"
                          checked={item.TypeSpend === 2}
                          onChange={() => onChangeType(item, 2)}
                        />
                        Переменные
                      </label>
                    </div>
                  </div>

                  <div className="be-col amount">
                    <input
                      className="input amount-input"
                      value={item.AmountService ?? ""}
                      onChange={(e) => onChangeAmount(item, e.target.value)}
                    />
                  </div>

                  <div className="be-col actions">
                    <button
                      className="btn-delete-expense"
                      onClick={() => onDeleteExpense(item.ExpenseID)}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </section>
            ))}
          </>
        ) : (
          <div className="no-results">Нет активной заявки</div>
        )}
      </main>
    </div>
  );
};

export default BreakEvenCalcPage;
