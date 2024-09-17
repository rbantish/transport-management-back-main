import { Status, StatusResponse } from '../models/status';
import * as db from './queryCreator';

export async function retrieveStatusByCode(code: string){
    console.log()
    return await db.SelectQuery<Status>(
        "SELECT * FROM Status Where Code = ? LIMIT 1;",
        [code]
    )
}

// Query to add a new PaymentStatus
export async function addPaymentStatus(paymentId: number, statusId: number, updatedBy: number) {
    return await db.ModifyQuery(
        "INSERT INTO PaymentStatus (PaymentId, StatusId, UpdatedBy, UpdateDate, DateCreated) VALUES (?, ?, ?, NOW(), NOW())",
        [paymentId, statusId, updatedBy]
    );
}

// Query to add a new AccountStatus
export async function addAccountStatusCustomer(customerId: number, statusId: number) {
    return await db.ModifyQuery(
        "INSERT INTO AccountStatus (CustomerId, StatusId, UpdateDate, DateCreated) VALUES (?, ?, NOW(), NOW())",
        [customerId, statusId]
    );
}

// Query to add a new AccountStatus
export async function addAccountStatus(customerId: number, statusId: number, updatedBy: number) {
    return await db.ModifyQuery(
        "INSERT INTO AccountStatus (CustomerId, StatusId, UpdatedBy, UpdateDate, DateCreated) VALUES (?, ?, ?, NOW(), NOW())",
        [customerId, statusId, updatedBy]
    );
}

// Query to add a new DriverStatus
export async function addDriverStatusByDr(driverId: number, statusId: number) {
    return await db.ModifyQuery(
        "INSERT INTO DriverStatus (DriverId, StatusId, UpdateDate, DateCreated) VALUES (?, ?, NOW(), NOW())",
        [driverId, statusId]
    );
}

// Query to add a new RentalStatus
export async function addRentalStatus(rentalId: number, statusId: number, updatedBy: number) {
    return await db.ModifyQuery(
        "INSERT INTO RentalStatus (RentalId, StatusId, UpdatedBy, UpdateDate, DateCreated) VALUES (?, ?, ?, NOW(), NOW())",
        [rentalId, statusId, updatedBy]
    );
}

// Query to add a new TripStatus
export async function addTripStatus(tripId: number, statusId: number, updatedBy: number) {
    return await db.ModifyQuery(
        "INSERT INTO TripStatus (TripId, StatusId, UpdatedBy, UpdateDate, DateCreated) VALUES (?, ?, ?, NOW(), NOW())",
        [tripId, statusId, updatedBy]
    );
}

// Query to add a new DriverStatus
export async function addDriverStatus(driverId: number, statusId: number, updatedBy: number) {
    return await db.ModifyQuery(
        "INSERT INTO DriverStatus (DriverId, StatusId, UpdatedBy, UpdateDate, DateCreated) VALUES (?, ?, ?, NOW(), NOW())",
        [driverId, statusId, updatedBy]
    );
}

// Query to add a new VehicleStatus
export async function addVehicleStatus(vehicleId: number, statusId: number, updatedBy: number) {
    return await db.ModifyQuery(
        "INSERT INTO VehicleStatus (VehicleId, StatusId, UpdatedBy, UpdateDate, DateCreated) VALUES (?, ?, ?, NOW(), NOW())",
        [vehicleId, statusId, updatedBy]
    );
}

export async function getStatuses() {
    return await db.SelectQuery<Array<StatusResponse>>(
      "SELECT id, code, name FROM Status"
    );
  }
