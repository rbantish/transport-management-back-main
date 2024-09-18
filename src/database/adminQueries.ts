import { Admin } from '../models/admin';
import * as db from './queryCreator';

export async function getAdminByEmail(email: string) {
    let script = `SELECT Id as id, Name as name, Email as email, Password as password FROM Admin WHERE Email LIKE '%${email}%' LIMIT 1;`;
    return await db.SelectQuery<Admin>(
        script
    );
}
