
import axios from "axios";
import { dest_api } from "../target_config";
import { requestStart, requestFailure, breakevenLoaded } from "../slices/breakevenSlice";

export const loadBreakevenList = (status?: string) => async (dispatch: any) => {
  dispatch(requestStart());

  try {
    const res = await axios.get(`${dest_api}/breakeven`, {
      params: status ? { status } : {},
      withCredentials: true
    });

    dispatch(breakevenLoaded(res.data));
  } catch (err) {
    dispatch(requestFailure("Не удалось загрузить список заявок"));
  }
};
