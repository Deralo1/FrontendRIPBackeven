/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export enum DsUserRole {
  RoleGuest = "guest",
  /** обычный пользователь */
  RoleCreator = "creator",
  RoleModerator = "moderator",
}

export interface DsAuthResponseDTO {
  access_token?: string;
  /** Unix timestamp истечения */
  expires_in?: number;
  token_type?: string;
}

export interface DsBreakevenRequestDTO {
  AmountProduct?: number;
  BreakevenRequestID?: number;
  BreakevenRequestStatus?: string;
  CalcAnswer?: number;
  CompletedAt?: string;
  CreationDate?: string;
  CreatorLogin?: string;
  FormatedAt?: string;
  ModeratorLogin?: string;
  RequestExpense?: DsExpenseForRequestDTO[];
}

export interface DsChangeUserDTO {
  login?: string;
  password?: string;
}

export interface DsExpenseDTO {
  Description?: string;
  ExpenseID?: number;
  ImageURL?: string;
  Price?: number;
  ShortDescription?: string;
  Title?: string;
}

export interface DsExpenseForRequestDTO {
  AmountService?: number;
  ExpenseID?: number;
  ImageURL?: string;
  Title?: string;
  TypeSpend?: number;
}

export interface DsUpdateRequestExpenseDTO {
  AmountService?: number;
  TypeSpend?: number;
}

export interface DsUpdateexpenseDTO {
  Description?: string;
  Price?: number;
  ShortDescription?: string;
  Title?: string;
}

export interface DsUserDTO {
  Login?: string;
  Role?: DsUserRole;
  UserId?: number;
}

export interface HandlerErrorResponse {
  message?: string;
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "https://10.205.157.61:8080",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title Расчет точки безубыточности
 * @version 1.0
 * @baseUrl 
 * @contact
 *
 * Используется для запросов из браузера.
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  breakeven = {
    /**
     * @description Для модератора - все заявки. Для создателя - только его заявки.
     *
     * @tags Домен заявки на подсчет точки
     * @name BreakevenList
     * @summary Получить список заявок
     * @request GET:/breakeven
     * @secure
     */
breakevenList: (
  query?: {
    status?: string;
  },
  params: RequestParams = {},
) =>
  this.request<DsBreakevenRequestDTO[], HandlerErrorResponse>({
    path: `/breakeven`,
    method: "GET",
    query: query,
    secure: true,
    ...params,
  }),


    /**
     * @description Возвращает ID текущей черновой заявки и количество трат в ней.
     *
     * @tags Домен заявки на подсчет точки
     * @name CalcList
     * @summary Получить информацию о черновике
     * @request GET:/breakeven/calc
     * @secure
     */
    calcList: (params: RequestParams = {}) =>
      this.request<
        {
            data: {
          BreakevenRequestID?: number;
          expense_in_BreakEvenCount?: number;
          }
        },
        HandlerErrorResponse
      >({
        path: `/breakeven/calc`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Домен заявки на подсчет точки
     * @name BreakevenDetail
     * @summary Получить одну заявку по id
     * @request GET:/breakeven/{id}
     * @secure
     */
    breakevenDetail: (id: number, params: RequestParams = {}) =>
      this.request< { data: DsBreakevenRequestDTO }, 
    HandlerErrorResponse >({
        path: `/breakeven/${id}`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description Обновляет поле 'Количество товара' черновой заявки.
     *
     * @tags Домен заявки на подсчет точки
     * @name BreakevenUpdate
     * @summary Обновить черновик
     * @request PUT:/breakeven/{id}
     * @secure
     */
    breakevenUpdate: (
      id: number,
      request: DsUpdateRequestExpenseDTO,
      params: RequestParams = {},
    ) =>
      this.request<DsBreakevenRequestDTO, HandlerErrorResponse>({
        path: `/breakeven/${id}`,
        method: "PUT",
        body: request,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Удаляет заявку (только черновик).
     *
     * @tags Домен заявки на подсчет точки
     * @name BreakevenDelete
     * @summary Удалить черновик заявки
     * @request DELETE:/breakeven/{id}
     * @secure
     */
    breakevenDelete: (id: number, params: RequestParams = {}) =>
      this.request<void, HandlerErrorResponse>({
        path: `/breakeven/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description Переводит статус черновика на 'на модерации'.
     *
     * @tags Домен заявки на подсчет точки
     * @name FormUpdate
     * @summary Отправить заявку на модерацию
     * @request PUT:/breakeven/{id}/form
     * @secure
     */
    formUpdate: (id: number, params: RequestParams = {}) =>
      this.request<DsBreakevenRequestDTO, HandlerErrorResponse>({
        path: `/breakeven/${id}/form`,
        method: "PUT",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Домен заявки на подсчет точки
     * @name ProcessUpdate
     * @summary Завершить или отклонить заявку (Только для Модератора)
     * @request PUT:/breakeven/{id}/process
     * @secure
     */
    processUpdate: (
      id: number,
      query: {
        /** Действие ('complete' или 'reject') */
        action: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<DsBreakevenRequestDTO, HandlerErrorResponse>({
        path: `/breakeven/${id}/process`,
        method: "PUT",
        query: query,
        secure: true,
        ...params,
      }),
  };
  expenseCalc = {
    /**
     * @description Обновляет количество и тип для выбранной траты в текущем черновике заявки.
     *
     * @tags Домен м-м
     * @name ExpenseCalcUpdate
     * @summary Обновить трату в заявке
     * @request PUT:/expense-calc/{id}
     * @secure
     */
    expenseCalcUpdate: (
      id: number,
      request: DsUpdateRequestExpenseDTO,
      params: RequestParams = {},
    ) =>
      this.request<void, HandlerErrorResponse>({
        path: `/expense-calc/${id}`,
        method: "PUT",
        body: request,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Удаляет трату из текущего черновика заявки.
     *
     * @tags Домен м-м
     * @name ExpenseCalcDelete
     * @summary Удалить трату из заявки
     * @request DELETE:/expense-calc/{id}
     */
    expenseCalcDelete: (id: number, params: RequestParams = {}) =>
      this.request<void, HandlerErrorResponse>({
        path: `/expense-calc/${id}`,
        method: "DELETE",
        ...params,
      }),
  };
  expenses = {
    /**
     * @description Возвращает список всех существующих трат. Доступен публично.
     *
     * @tags Домен трат
     * @name ExpensesList
     * @summary Получить список трат
     * @request GET:/expenses
     */
    expensesList: (
      query?: {
        /** Поиск по названию траты (частичное совпадение) */
        searchbyexpensename?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<DsExpenseDTO, HandlerErrorResponse>({
        path: `/expenses`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Создает новую трату. Требуются права **Модератора**.
     *
     * @tags Домен трат
     * @name ExpensesCreate
     * @summary Создать новую трату
     * @request POST:/expenses
     * @secure
     */
    expensesCreate: (request: DsUpdateexpenseDTO, params: RequestParams = {}) =>
      this.request<DsExpenseDTO, HandlerErrorResponse>({
        path: `/expenses`,
        method: "POST",
        body: request,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Добавляет трату в текущую черновую заявку пользователя. Требуется **Авторизация**.
     *
     * @tags Домен трат
     * @name AddToCalcCreate
     * @summary Добавить трату в черновик заявки
     * @request POST:/expenses/add-to-calc/{id}
     * @secure
     */
    addToCalcCreate: (id: number, params: RequestParams = {}) =>
      this.request<void, HandlerErrorResponse>({
        path: `/expenses/add-to-calc/${id}`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * @description Возвращает информацию о конкретном трате. Доступен публично.
     *
     * @tags Домен трат
     * @name ExpensesDetail
     * @summary Получить трату по ID
     * @request GET:/expenses/{id}
     */
    expensesDetail: (id: number, params: RequestParams = {}) =>
      this.request<DsExpenseDTO, HandlerErrorResponse>({
        path: `/expenses/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Обновляет цену и описание траты по ID. Требуются права **Модератора**.
     *
     * @tags Домен трат
     * @name ExpensesUpdate
     * @summary Обновить трату
     * @request PUT:/expenses/{id}
     * @secure
     */
    expensesUpdate: (
      id: number,
      request: DsUpdateexpenseDTO,
      params: RequestParams = {},
    ) =>
      this.request<DsExpenseDTO, HandlerErrorResponse>({
        path: `/expenses/${id}`,
        method: "PUT",
        body: request,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Устанавливает флаг is_deleted = true для траты. Требуются права **Модератора**.
     *
     * @tags Домен трат
     * @name ExpensesDelete
     * @summary Удалить Трату
     * @request DELETE:/expenses/{id}
     * @secure
     */
    expensesDelete: (id: number, params: RequestParams = {}) =>
      this.request<void, HandlerErrorResponse>({
        path: `/expenses/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description Загружает и обновляет изображение для траты по ID. Требуются права **Модератора**.
     *
     * @tags Домен трат
     * @name ImageCreate
     * @summary Загрузить изображение траты
     * @request POST:/expenses/{id}/image
     * @secure
     */
    imageCreate: (
      id: number,
      data: {
        /** Файл изображения */
        file: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<DsExpenseDTO, HandlerErrorResponse>({
        path: `/expenses/${id}/image`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),
  };
  user = {
    /**
     * No description
     *
     * @tags Домен пользователя
     * @name LoginCreate
     * @summary Аутентификация пользователя
     * @request POST:/user/login
     */
    loginCreate: (user: DsChangeUserDTO, params: RequestParams = {}) =>
      this.request<DsAuthResponseDTO, HandlerErrorResponse>({
        path: `/user/login`,
        method: "POST",
        body: user,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Домен пользователя
     * @name LogoutCreate
     * @summary Выход из системы
     * @request POST:/user/logout
     * @secure
     */
    logoutCreate: (params: RequestParams = {}) =>
      this.request<void, HandlerErrorResponse>({
        path: `/user/logout`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Домен пользователя
     * @name ProfileList
     * @summary Получить профиль
     * @request GET:/user/profile
     * @secure
     */
    profileList: (params: RequestParams = {}) =>
      this.request<DsUserDTO, HandlerErrorResponse>({
        path: `/user/profile`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Домен пользователя
     * @name ProfileUpdate
     * @summary Обновить профиль
     * @request PUT:/user/profile
     * @secure
     */
    profileUpdate: (request: DsChangeUserDTO, params: RequestParams = {}) =>
      this.request<DsUserDTO, HandlerErrorResponse>({
        path: `/user/profile`,
        method: "PUT",
        body: request,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Домен пользователя
     * @name RegisterCreate
     * @summary Регистрация нового пользователя
     * @request POST:/user/register
     */
    registerCreate: (request: DsChangeUserDTO, params: RequestParams = {}) =>
      this.request<void, HandlerErrorResponse>({
        path: `/user/register`,
        method: "POST",
        body: request,
        type: ContentType.Json,
        ...params,
      }),
  };
}
