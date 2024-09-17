import * as paymentDb from '../database/paymentQueries';
import { AdminPaymentResponse } from '../models/payment';
import {RentalRequest } from '../models/rental';
import { Trip, TripRequest } from '../models/trip';

export async function getAllPaymentTypes(){
    return await paymentDb.GetAllPaymentMethods();
}

export async function addPaymentForRental(rentalRequest: RentalRequest, rentalId: number){
    return await paymentDb.addPaymentForRental(rentalRequest, rentalId);
}

export async function addPaymentForTrip(trip: Trip, tripId: number){
    return await paymentDb.addPaymentForTrip(trip, tripId);
}

export async function getAllPaymentsWithCustomerDetailsAndStatus() {
    try {
        return await paymentDb.getAllPaymentsWithCustomerDetailsAndStatus();
    } catch (error) {
        console.error("Error fetching payments with customer details and latest status:", error);
        throw new Error("Failed to fetch payments with customer details and latest status");
    }
}

export async function addPaymentStatus(paymentStatusId: number, statusId: number){
    return await paymentDb.AddPaymentStatus(paymentStatusId, statusId);
}

