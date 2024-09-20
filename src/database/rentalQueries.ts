import { BookingInfos, PaymentCompleteRequest, Rental, RentalRequest, RentalResponse, TripRental } from "../models/rental";
import { formatDateWithTime } from "../services/dateTimeManager";
import * as db from './queryCreator';

export async function addRental(rental:RentalRequest) {
    return await db.ModifyQuery(
        "INSERT INTO `Rental` (`CustomerId`, `VehicleId`,`StartDate`, `EndDate`, `TotalPayment`, `DateCreated`) VALUES ( ?,  ?,  ?, ?,  ?,  current_timestamp())",
        [rental.customerId, rental.vehicleId, formatDateWithTime(rental.startDate.toString()), formatDateWithTime(rental.endDate.toString()), rental.totalPayment]
    )
}

export async function GetAllRentals() {
    return await db.SelectQuery("SELECT * FROM Rental");
}

export async function ModifyRental(rental: Rental){
    return await db.ModifyQuery(
        "UPDATE rental SET VehicleId = ?, StartDate = ?, EndDate = ?, TotalPayment = ?",
        [rental.vehicleId, rental.startDate, rental.endDate, rental.totalPayment]
    );
}

export async function CompletePayment(rental: PaymentCompleteRequest) {
    let x = await db.ModifyQuery(
        "UPDATE `Payment` SET `UpdatedBy` = ?, `PaymentDate` = NOW()  WHERE `Id` = ?",
        [rental.updatedBy, rental.paymentId]
    )
    return x
}


//Query to get all rentals with the latest rental status code, user details, car number, and latest payment status code
export async function getAllRentalsWithDetailsAndPaymentStatus() {
    return await db.SelectQuery<Array<RentalResponse>>(
        `SELECT r.Id AS rentalId, 
                r.startDate, 
                r.endDate, 
                r.totalPayment, 
                c.Name AS customerName, 
                v.CarNumber AS carNumber,
                rs.StatusId AS latestRentalStatusId,
                s.Code AS latestRentalStatusCode,
                ps.StatusId AS latestPaymentStatusId,
                s2.Code AS latestPaymentStatusCode
         FROM Rental r
         JOIN Customer c ON r.CustomerId = c.Id
         JOIN Vehicle v ON r.VehicleId = v.Id
         LEFT JOIN RentalStatus rs ON r.Id = rs.RentalId
         LEFT JOIN Status s ON rs.StatusId = s.Id
         LEFT JOIN Payment p ON r.Id = p.RentalId
         LEFT JOIN PaymentStatus ps ON p.Id = ps.PaymentId
         LEFT JOIN Status s2 ON ps.StatusId = s2.Id
         WHERE rs.UpdateDate = (
             SELECT MAX(UpdateDate)
             FROM RentalStatus
             WHERE RentalId = r.Id
         )
         AND ps.UpdateDate = (
             SELECT MAX(UpdateDate)
             FROM PaymentStatus
             WHERE PaymentId = p.Id
         )`
    );

}

export async function AddRentalStatus(rentalId: number, statusId: number) {
    return await db.ModifyQuery(
        "INSERT INTO `RentalStatus` (`RentalId`, `StatusId`, `DateCreated`) VALUES (?, ?, current_timestamp())",
        [rentalId, statusId]
    );
}


export async function checkIfAlreadyExistInRentalOrTrip(vehicleId:number, date: Date) {
   return await db.SelectQuery(`
    SELECT 'Rental' AS BookingType, StartDate, EndDate
    FROM Rental
    WHERE VehicleId = ?
    AND ? BETWEEN StartDate AND EndDate
    UNION ALL
    SELECT 'Trip' AS BookingType, TripDate AS StartDate, TripDate AS EndDate
    FROM Trip
    WHERE VehicleId = ?
    AND TripDate = ?;
    `,
    [vehicleId,date,vehicleId,date]
    );
}

export async function getAllBookings(customerId: number){
    return await db.SelectQuery<Array<BookingInfos>>(
    `
SELECT * FROM (
    SELECT 
        'Rental' AS bookingType,
        R.Id AS bookingId,
        R.startDate,
        R.endDate,
        R.totalPayment,
        RS.Name AS latestStatusCode,
        RentalStatus.DateCreated AS statusDate,
        PS.Name AS latestPaymentStatusCode,
        PaymentMethod.Type AS paymentMethod,
        PaymentStatus.DateCreated AS paymentStatusDate
    FROM Rental R
    JOIN (
        SELECT RentalId, StatusId, MAX(DateCreated) AS DateCreated
        FROM RentalStatus
        GROUP BY RentalId, StatusId
    ) AS RentalStatus ON R.Id = RentalStatus.RentalId
    JOIN Status RS ON RentalStatus.StatusId = RS.Id

    LEFT JOIN Payment P ON P.RentalId = R.Id
    LEFT JOIN (
        SELECT PaymentId, StatusId, MAX(DateCreated) AS DateCreated
        FROM PaymentStatus
        GROUP BY PaymentId, StatusId
    ) AS PaymentStatus ON P.Id = PaymentStatus.PaymentId
    LEFT JOIN Status PS ON PaymentStatus.StatusId = PS.Id
    LEFT JOIN PaymentMethod ON P.PaymentMethodId = PaymentMethod.Id
    WHERE R.CustomerId = ?
    
    UNION ALL
    SELECT 
        'Trip' AS BookingType,
        T.Id AS BookingId,
        T.TripDate AS StartDate,
        T.TripDate AS EndDate,
        T.TripCost AS TotalPayment,
        TS.Name AS LatestStatusCode,
        TripStatus.DateCreated AS StatusDate,
        PS.Name AS LatestPaymentStatusCode,
        PaymentMethod.Type AS PaymentMethod,
        PaymentStatus.DateCreated AS PaymentStatusDate
    FROM Trip T

    JOIN (
        SELECT TripId, StatusId, MAX(DateCreated) AS DateCreated
        FROM TripStatus
        GROUP BY TripId, StatusId
    ) AS TripStatus ON T.Id = TripStatus.TripId
    JOIN Status TS ON TripStatus.StatusId = TS.Id

    LEFT JOIN Payment P ON P.TripId = T.Id
    LEFT JOIN (
        SELECT PaymentId, StatusId, MAX(DateCreated) AS DateCreated
        FROM PaymentStatus
        GROUP BY PaymentId, StatusId
    ) AS PaymentStatus ON P.Id = PaymentStatus.PaymentId
    LEFT JOIN Status PS ON PaymentStatus.StatusId = PS.Id
    LEFT JOIN PaymentMethod ON P.PaymentMethodId = PaymentMethod.Id
    WHERE T.CustomerId = ?
) AS BookingRecords
ORDER BY GREATEST(StatusDate, PaymentStatusDate) DESC;
`,
[customerId,customerId]
    )
}

export async function getAllTripAndRental() {
    return await db.SelectQuery<Array<TripRental>>(`
        -- Get all trips and rentals, along with their latest statuses, payment status, and PaymentId
SELECT 
    'Trip' AS type,
    t.Id AS entityId,
    c.Name AS customerName,
    t.CustomerId,
    d.Name AS driverName,  -- Driver's name added
    t.TripCost AS cost,
    t.TripDate AS startDate,
    NULL AS endDate, 
    t.DateCreated AS creationDate,
    ts.Name AS latestStatusName,
    ts.Code AS latestStatusCode,
    tsUpdate.UpdateDate AS statusUpdateDate,
    ps.Name AS latestPaymentStatusName,
    ps.Code AS latestPaymentStatusCode,
    p.PaymentDate AS paymentDate,
    p.Amount AS paymentAmount,
    p.Id AS paymentId 
FROM 
    Trip t
-- Join Customer to get the name
INNER JOIN Customer c ON t.CustomerId = c.Id
-- Join Driver to get the driver's name
LEFT JOIN Driver d ON t.DriverId = d.Id  -- Left join to include null drivers
-- Latest trip status
INNER JOIN (
    SELECT 
        TripId, 
        StatusId, 
        UpdateDate
    FROM TripStatus ts1
    WHERE ts1.Id = (
        SELECT MAX(ts2.Id) 
        FROM TripStatus ts2 
        WHERE ts1.TripId = ts2.TripId
    )
) tsUpdate ON t.Id = tsUpdate.TripId
INNER JOIN Status ts ON tsUpdate.StatusId = ts.Id
-- Latest payment status for the trip
LEFT JOIN Payment p ON t.Id = p.TripId
LEFT JOIN (
    SELECT 
        PaymentId, 
        StatusId, 
        UpdateDate
    FROM PaymentStatus ps1
    WHERE ps1.Id = (
        SELECT MAX(ps2.Id) 
        FROM PaymentStatus ps2 
        WHERE ps1.PaymentId = ps2.PaymentId
    )
) psUpdate ON p.Id = psUpdate.PaymentId
LEFT JOIN Status ps ON psUpdate.StatusId = ps.Id

UNION

SELECT 
    'Rental' AS type,
    r.Id AS entityId,
    c.Name AS customerName,
    r.CustomerId,
    NULL AS driverName,  
    r.TotalPayment AS cost,
    r.StartDate AS startDate,
    r.EndDate AS endDate, 
    r.DateCreated AS creationDate,
    rs.Name AS latestStatusName,
    rs.Code AS latestStatusCode,
    rsUpdate.UpdateDate AS statusUpdateDate,
    ps.Name AS latestPaymentStatusName,
    ps.Code AS latestPaymentStatusCode,
    p.PaymentDate AS paymentDate,
    p.Amount AS paymentAmount,
    p.Id AS paymentId 
FROM 
    Rental r
-- Join Customer to get the name
INNER JOIN Customer c ON r.CustomerId = c.Id
-- Latest rental status
INNER JOIN (
    SELECT 
        RentalId, 
        StatusId, 
        UpdateDate
    FROM RentalStatus rs1
    WHERE rs1.Id = (
        SELECT MAX(rs2.Id) 
        FROM RentalStatus rs2 
        WHERE rs1.RentalId = rs2.RentalId
    )
) rsUpdate ON r.Id = rsUpdate.RentalId
INNER JOIN Status rs ON rsUpdate.StatusId = rs.Id
-- Latest payment status for the rental
LEFT JOIN Payment p ON r.Id = p.RentalId
LEFT JOIN (
    SELECT 
        PaymentId, 
        StatusId, 
        UpdateDate
    FROM PaymentStatus ps1
    WHERE ps1.Id = (
        SELECT MAX(ps2.Id) 
        FROM PaymentStatus ps2 
        WHERE ps1.PaymentId = ps2.PaymentId
    )
) psUpdate ON p.Id = psUpdate.PaymentId
LEFT JOIN Status ps ON psUpdate.StatusId = ps.Id

ORDER BY creationDate DESC;

     `);
 }
