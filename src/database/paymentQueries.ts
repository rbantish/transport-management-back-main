import { AdminPaymentResponse } from "../models/payment";
import { PaymentMethodResponse } from "../models/paymentMethod";
import { RentalRequest } from "../models/rental";
import { Trip } from "../models/trip";
import * as db from './queryCreator';

export async function GetAllPaymentMethods() {
    return await db.SelectQuery<PaymentMethodResponse>("SELECT id, type FROM PaymentMethod");
}

// Query to get all payments with customer details and the latest status including code
export async function getAllPaymentsWithCustomerDetailsAndStatus() {
    return await db.SelectQuery<Array<AdminPaymentResponse>>(
        `SELECT p.Id AS paymentId, 
                p.Amount, 
                p.PaymentDate, 
                c.Name AS customerName, 
                c.PhoneNumber AS customerPhoneNumber, 
                ps.StatusId AS latestStatusId,
                s.Name AS latestStatusName,
                s.Code AS latestStatusCode
         FROM Payment p
         JOIN Customer c ON p.CustomerId = c.Id
         LEFT JOIN PaymentStatus ps ON p.Id = ps.PaymentId
         LEFT JOIN Status s ON ps.StatusId = s.Id
         WHERE ps.UpdateDate = (
             SELECT MAX(UpdateDate)
             FROM PaymentStatus
             WHERE PaymentId = p.Id
         )`
    );
}

export async function addPaymentForRental(rentalRequest: RentalRequest,rentalId: number) {
    return await db.ModifyQuery(
        "INSERT INTO Payment (CustomerId, RentalId, PaymentMethodId, Amount, DateCreated) VALUES (?, ?, ?, ?, current_timestamp())",
        [rentalRequest.customerId, rentalId, rentalRequest.paymentTypeId, rentalRequest.totalPayment ]
    )
}

export async function addPaymentForTrip(tripRequest: Trip, tripId: number) {
    return await db.ModifyQuery(
        "INSERT INTO Payment (CustomerId, TripId, PaymentMethodId, Amount, DateCreated) VALUES (?, ?, ?, ?, current_timestamp())",
        [tripRequest.customerId, tripId, tripRequest.paymentTypeId, tripRequest.tripCost ]
    )
}

export async function AddPaymentStatus(paymentId: number, statusId: number){
    return await db.ModifyQuery("INSERT INTO `Paymentstatus` (`PaymentId`, `StatusId`, `DateCreated`) VALUES (?, ?, current_timestamp())",[paymentId, statusId]);
}


