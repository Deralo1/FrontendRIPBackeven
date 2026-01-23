// src/types/Service.ts
export interface Service {
  ExpenseID: number;
  Title: string;
  ShortDescription: string;
  Price: number;
  ImageURL: string;
  isMock?: boolean;
}
