import { JsonDB } from "node-json-db";

const path = import.meta.env.VITE_DB_PATH;

export const localDB = new JsonDB(path, true, true, "/");
