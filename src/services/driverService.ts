import * as driverQueries from '../database/driverQueries';
import * as statusQueries from '../database/statusQueries';
import * as encryption from './encryption';
import { Driver, DriverDb, DriverRequest } from '../models/driver';
import { statuses } from '../enums/status';

export async function loginDriver(driver: Driver): Promise<any> {
  try {
    let result = await driverQueries.getDriverByPhoneNumber(driver.phoneNumber);
    if (!result || result.length === 0) {
      return "Driver not registered";
    }

    let dbDriver: DriverDb = result[0] as DriverDb;
    if (await encryption.comparePassword(driver.password!, dbDriver.Password!)) {
      const loggedInDriver: Driver = {
          id: dbDriver.Id,
          name: dbDriver.Name,
          phoneNumber: dbDriver.PhoneNumber,
          type: "driver",
          licenseNumber: dbDriver.LicenseNumber
      };
      return loggedInDriver;
    } else {
      return "Incorrect password";
    }
  } catch (error) {
    console.error("Error logging in driver:", error);
    return "Error occurred during login";
  }
}

// Fetch all drivers with their latest status
export async function getAllDriversWithLatestStatus(){
    try {
        return await driverQueries.getAllDriversWithLatestStatusFromDb();
    } catch (error) {
        console.error("Service error: Could not get drivers with latest status", error);
        throw error;
    }
};

export async function getTripLocations(tripId: number) {
  try {
      return await driverQueries.getTripLocationsByTripId(tripId);
  } catch (error) {
      console.error("Error fetching trip locations: ", error);
      return "Error occurred while fetching trip locations.";
  }
}

export async function getTripsForDriver(driverId: number) {
    try {
        return await driverQueries.getTripsByDriverId(driverId);
    } catch (error) {
        return "Error fetching trips";
    }
}


export async function registerDriver(driverData: DriverRequest): Promise<string> {
    try {
      if (!driverData.name || !driverData.password || !driverData.phoneNumber) {
        return "Missing required fields";
      }
  
      if (await checkIfDriverExists(driverData.phoneNumber)) {
        return "Phone Number already exists";
      }
  
      let [status] = await statusQueries.retrieveStatusByCode(statuses.ACTIVE);
      if (!status) {
        return "Error occurred while retrieving status";
      }
  
      driverData.password = await encryption.hashPassword(driverData.password);
      const result = await driverQueries.addDriver(driverData);
      if (result.affectedRows === 1) {
        await statusQueries.addDriverStatusByDr(result.insertId,status.Id);
        return "Driver registered successfully";
      } else {
        return "Failed to register driver";
      }
  
    } catch (error) {
      console.error("Error registering driver:", error);
      return "Error occurred during registration";
    }
  }
  
  async function checkIfDriverExists(phone: string): Promise<boolean> {
    const result = await driverQueries.getDriverByPhoneNumber(phone);
    return result.length > 0;
  }
