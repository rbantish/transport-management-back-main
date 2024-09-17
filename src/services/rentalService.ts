import { stat } from 'fs';
import * as rentalDb from '../database/rentalQueries';
import * as statusDb from '../database/statusQueries';
import * as paymentService from '../services/paymentService';
import { statuses } from '../enums/status';
import { PaymentCompleteRequest, RentalRequest, RentalResponse } from '../models/rental';

export async function addRental(request: RentalRequest){
    try{
        let result =  await rentalDb.addRental(request);
        let [status] =  await statusDb.retrieveStatusByCode(statuses.PROGRESS);
        if(!status){
            return undefined;
        }   
        await rentalDb.AddRentalStatus(result.insertId, status.Id);

        let paymentResponse = await paymentService.addPaymentForRental(request,result.insertId);
        let [paymentStatus] =  await statusDb.retrieveStatusByCode(statuses.PENDING);
        if(paymentResponse && paymentStatus){
            await paymentService.addPaymentStatus(paymentResponse.insertId,paymentStatus.Id);
        }
        
        return result; 
    }catch(error){
        return undefined;
    }
}

export async function getAllRentalsWithDetailsAndPaymentStatus() {
    try {
        return await rentalDb.getAllRentalsWithDetailsAndPaymentStatus();
    } catch (error) {
        console.error("Error fetching rentals with details and payment status:", error);
        throw new Error("Failed to fetch rentals with details and payment status");
    }
}

export async function getAllBookings(customerId: number){
   return rentalDb.getAllBookings(customerId);
}


export async function updatePayment(payment: PaymentCompleteRequest){
    try {
        await rentalDb.CompletePayment(payment);
        let [status] = await statusDb.retrieveStatusByCode(statuses.COMPLETE);
        statusDb.addPaymentStatus(payment.paymentId,status?.Id!,payment.updatedBy);
        return "Success";
    } catch (error) {
        return "Error";
    }
}



export async function getAllTripsAndRentals() {
 return await  rentalDb.getAllTripAndRental();
}
