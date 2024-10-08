import * as db from '../database/queryCreator';
import { Driver, DriverDb, DriverRequest, DriverWithStatus, TripLocation, TripWithVehicle } from '../models/driver';

// Query to add a driver
export async function addDriver(driver: DriverRequest) {
    return await db.ModifyQuery(
        "INSERT INTO Driver (Name, PhoneNumber, Password, LicenseNumber, DateCreated) VALUES (?, ?, ?, ?, NOW())",
        [driver.name, driver.phoneNumber, driver.password, driver.licenseNumber]
    );
}

export async function getTripsByDriverId(driverId: number) {
    return await db.SelectQuery<Array<TripWithVehicle>>(
        `SELECT 
            Trip.Id as tripId,
            Trip.tripCost,
            DATE_ADD(Trip.tripDate, INTERVAL 4 HOUR) as tripDate,         
            DATE_ADD(Trip.dateCreated, INTERVAL 4 HOUR) as dateCreated,   
            DATE_ADD(Trip.updateDate, INTERVAL 4 HOUR) as updateDate,    
            Vehicle.carNumber,
            Vehicle.make,
            Vehicle.model
        FROM Trip
        INNER JOIN Vehicle ON Trip.VehicleId = Vehicle.Id
        WHERE Trip.DriverId = ?`,
        [driverId]
    );
}


// Query to get all drivers with their latest status
export async function getAllDriversWithLatestStatusFromDb() {
    const query = `
        SELECT 
            d.Id AS driverId,
            d.Name AS driverName,
            d.PhoneNumber AS driverPhoneNumber,
            d.LicenseNumber AS driverLicenseNumber,
            d.DateCreated AS driverCreationDate,
            s.Name AS latestStatusName,
            s.Code AS latestStatusCode,
            ds.UpdateDate AS statusUpdateDate
        FROM 
            Driver d
        INNER JOIN (
            -- Subquery to get the latest status per driver based on the highest DriverStatus Id
            SELECT 
                DriverId, 
                StatusId, 
                UpdateDate
            FROM 
                DriverStatus ds1
            WHERE 
                ds1.Id = (
                    -- Select the max Id for the latest status of each driver
                    SELECT MAX(Id) 
                    FROM DriverStatus ds2 
                    WHERE ds1.DriverId = ds2.DriverId
                )
        ) ds ON d.Id = ds.DriverId
        INNER JOIN Status s ON ds.StatusId = s.Id
        ORDER BY 
            ds.UpdateDate DESC;
    `;
        return await db.SelectQuery<Array<DriverWithStatus>>(query);
}

export async function getTripLocationsByTripId(tripId: number) {
    return await db.SelectQuery<Array<TripLocation>>(
        `SELECT id, locationPoint, \`order\`, updateDate 
         FROM TripLocation 
         WHERE TripId = ?
         ORDER BY \`Order\` ASC`,
        [tripId]
    );
}

export async function getLatestStatusByDriverId(driverId: number){
    return await db.SelectQuery<any>(`
        SELECT s.Code
        FROM Driver d
        JOIN DriverStatus ds ON d.Id = ds.DriverId
        JOIN Status s ON ds.StatusId = s.Id
        WHERE d.Id = ?
        AND ds.UpdateDate = (
            SELECT MAX(UpdateDate)
            FROM DriverStatus
            WHERE DriverId = d.Id
        );
        `,
        [driverId]
    );
}

// Query to get a driver by phone
export async function getDriverByPhoneNumber(phone: string) {
    return await db.SelectQuery<DriverDb>(
        "SELECT Id, Name, PhoneNumber, Password, LicenseNumber FROM Driver WHERE PhoneNumber = ? LIMIT 1",
        [phone]
    );
}
