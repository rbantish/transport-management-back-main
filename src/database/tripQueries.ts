import { Trip, TripResponse } from "../models/trip";
import * as db from './queryCreator';

export async function addTrip(trip:Trip) {
    return await db.ModifyQuery(
        "INSERT INTO `Trip` (`CustomerId`, `VehicleId`,`TripDate`, `TripCost`,`DateCreated`) VALUES ( ?,  ?,  ?, ?,  current_timestamp())",
        [trip.customerId, trip.vehicleId, trip.tripDate, trip.tripCost]
    )
}

export async function addTripLocation(tripId: number, location: string, order: number){
    return await db.ModifyQuery(
        "INSERT INTO `TripLocation` (`TripId`, `LocationPoint`,`Order`, `DateCreated`) VALUES ( ?,  ?, ?,  current_timestamp())",
        [tripId,location, order]
    )
}

export async function AddTripStatus(tripId: number, statusId: number){
    return await db.ModifyQuery("INSERT INTO `Tripstatus` (`TripId`, `StatusId`, `DateCreated`) VALUES (?, ?, current_timestamp())",[tripId, statusId]);
}

// Query to update the driver for a specific trip
export async function addDriverToTrip(tripId: number, driverId: number) {
    return await db.ModifyQuery(
        "UPDATE Trip SET DriverId = ? WHERE Id = ?",
        [driverId, tripId]
    );
}

// Query to get all trips with the latest trip status code, user details, car number, and latest payment status code
export async function getAllTripsWithDetailsAndPaymentStatus() {
    return await db.SelectQuery<Array<TripResponse>>(
        `SELECT t.Id AS tripId, 
                t.tripDate, 
                t.tripCost, 
                c.Name AS customerName, 
                v.CarNumber AS carNumber,
                ts.StatusId AS latestTripStatusId,
                s.Code AS latestTripStatusCode,
                ps.StatusId AS latestPaymentStatusId,
                s2.Code AS latestPaymentStatusCode
         FROM Trip t
         JOIN Customer c ON t.CustomerId = c.Id
         JOIN Vehicle v ON t.VehicleId = v.Id
         LEFT JOIN TripStatus ts ON t.Id = ts.TripId
         LEFT JOIN Status s ON ts.StatusId = s.Id
         LEFT JOIN Payment p ON t.Id = p.TripId
         LEFT JOIN PaymentStatus ps ON p.Id = ps.PaymentId
         LEFT JOIN Status s2 ON ps.StatusId = s2.Id
         WHERE ts.UpdateDate = (
             SELECT MAX(UpdateDate)
             FROM TripStatus
             WHERE TripId = t.Id
         )
         AND ps.UpdateDate = (
             SELECT MAX(UpdateDate)
             FROM PaymentStatus
             WHERE PaymentId = p.Id
         )`
    );
}
