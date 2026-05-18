import axios from "axios";
import { API_URL } from "~/lib/constants";

export const deleteEntry = async (entryId: string | number | null) => {
  await axios.delete(`${API_URL}/deleteEntry/${entryId}`).catch((err) => { throw err });
};
