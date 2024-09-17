import { ResultSetHeader } from "mysql2";
import { db } from "./db";
export async function SelectQuery<T>(queryString: string, values?: Array<any>): Promise<Partial<T[]>>{
    const [results] = await db.execute(queryString, values);
    return results as T[];
}

export async function ModifyQuery(queryString: string, values?: Array<any>): Promise<ResultSetHeader>{
    const [results] = await db.execute(queryString,values);
    return results as ResultSetHeader;
}