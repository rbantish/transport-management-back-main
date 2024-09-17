import * as db from '../database/queryCreator';
import { Item, Vehicle, VehicleResponse } from '../models/vehicle';
import { VehicleType } from '../models/vehicleType';

export async function addVehicle(vehicle:Vehicle) {
    return await db.ModifyQuery(
        `INSERT INTO Vehicle (VehicleTypeId, TripPrice, DailyPrice, UpdatedBy, Seats, ImagePath, CarNumber, Make, Model, Year, CurrentLocation, DateCreated) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
        [
            vehicle.vehicleTypeId,
            vehicle.tripPrice,
            vehicle.dailyPrice,
            vehicle.updatedBy,
            vehicle.seats,
            vehicle.imagePath, // The image path is passed here
            vehicle.carNumber,
            vehicle.make,
            vehicle.model,
            vehicle.year,
            vehicle.currentLocation
        ]
    );
}

export async function getVehicleById(id:number) {
    return await db.SelectQuery<VehicleResponse>(
        `SELECT 
    v.Id AS id,
    vt.Type AS vehicleTypeCode,
    v.DailyPrice AS dailyPrice,
    v.Make AS make,
    v.TripPrice as tripPrice,
    v.Model  AS model,
    v.ImagePath AS imagePath,
    v.Year AS year,
    v.Seats AS seats,
    v.CarNumber AS carNumber,
    v.CurrentLocation AS currentLocation,
    (SELECT s.Code
     FROM VehicleStatus vs
     JOIN Status s ON vs.StatusId = s.Id
     WHERE vs.VehicleId = v.Id
     ORDER BY vs.DateCreated DESC
     LIMIT 1) AS vehicleStatusCode,
    (SELECT s.Code
     FROM RentalStatus rs
     JOIN Status s ON rs.StatusId = s.Id
     JOIN Rental r ON rs.RentalId = r.Id
     WHERE r.VehicleId = v.Id
     ORDER BY rs.DateCreated DESC
     LIMIT 1) AS rentalStatusCode
    FROM Vehicle v
    JOIN VehicleType vt ON v.VehicleTypeId = vt.Id
    WHERE v.Id = ?;
`,
        [id]
    );
}

export async function getAllVehicleTypes(){
    return await db.SelectQuery<Array<VehicleType>>("SELECT id, type FROM VehicleType");
}

export async function getAllVehicles(){
    let sql = `SELECT 
    v.Id AS id,
    vt.Type AS vehicleTypeCode,
    v.DailyPrice AS dailyPrice,
    v.TripPrice as tripPrice,
    v.Make AS make,
    v.Model  AS model,
    v.ImagePath AS imagePath,
    v.Year AS year,
    v.Seats AS seats,
    v.CarNumber AS carNumber,
    v.CurrentLocation as currentLocation,
    (SELECT s.Name
     FROM VehicleStatus vs
     JOIN Status s ON vs.StatusId = s.Id
     WHERE vs.VehicleId = v.Id
     ORDER BY vs.DateCreated DESC
     LIMIT 1) AS vehicleStatusCode,
    (SELECT s.Name
     FROM RentalStatus rs
     JOIN Status s ON rs.StatusId = s.Id
     JOIN Rental r ON rs.RentalId = r.Id
     WHERE r.VehicleId = v.Id
     ORDER BY rs.DateCreated DESC
     LIMIT 1) AS rentalStatusCode
FROM Vehicle v
JOIN VehicleType vt ON v.VehicleTypeId = vt.Id;
`;
    return await db.SelectQuery<Array<VehicleResponse>>(sql);
}

export async function getAllBookedDatesForaVehicle(vehicleId: number){
    let sql: string  = `WITH TripDates AS (
    SELECT 
        t.TripDate AS tripDate
    FROM 
        Trip t
    WHERE 
        t.VehicleId = ?
),
RentalDates AS (
    SELECT 
        r.StartDate + INTERVAL seq DAY AS rentalDate
    FROM 
        Rental r
    JOIN (
        SELECT 0 AS seq UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL 
        SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL 
        SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL 
        SELECT 9 UNION ALL SELECT 10 -- Expand as needed for longer rentals
    ) AS seq
    WHERE 
        r.VehicleId = ?
        AND r.StartDate + INTERVAL seq DAY <= r.EndDate
)


SELECT tripDate AS date
FROM TripDates
UNION
SELECT rentalDate AS date
FROM RentalDates
ORDER BY date;
 `;

 return await db.SelectQuery<Array<Item>>(sql, [vehicleId, vehicleId]);

}

