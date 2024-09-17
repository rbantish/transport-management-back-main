import * as adminQueries from '../database/adminQueries';
import * as encryption from './encryption';
import { Admin, AdminRequest, AdminResponse } from '../models/admin';
import { UserInfo } from 'os';

export async function login(adminData: AdminRequest): Promise<any> {
  try {
    // Fetch the admin record by email
    console.log(adminData)
    let [result] = await adminQueries.getAdminByEmail(adminData.email);
    if (result == null) {
      return "Admin not found!";
    }

    // Compare hashed passwords
    if (await encryption.comparePassword(adminData.password, result.password)) {
      const admin: AdminResponse = {
        id: result.id,
        name: result.name,
        email: result.email!,
        type: "admin"
      }
      return admin
    } else {
      return "Invalid password!";
    }
  } catch (error) {
    console.error("Error during admin login:", error);
    return "Error occurred during login.";
  }
}
