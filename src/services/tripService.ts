import * as tripDb from '../database/tripQueries';
import * as statusDb from '../database/statusQueries';
import * as paymentService from '../services/paymentService';
import { statuses } from '../enums/status';
import { Trip, TripRequest } from '../models/trip';

export async function addTrip(request: TripRequest){
    try{
        if(request){
            let requestArray: Array<Trip> = [];
            request.tripDate.forEach(x => {
                let tripRequest: Trip = {
                    vehicleId: request.vehicleId,
                    customerId: request.customerId,
                    tripDate: x,
                    paymentTypeId: request.paymentMethodId,
                    tripCost: request.tripCost
                }
                requestArray.push(tripRequest);
            });
            
            if(requestArray){        
                requestArray.forEach(async x => {
                    let result = await tripDb.addTrip(x);
                    if(result){
                        let [status] = await statusDb.retrieveStatusByCode(statuses.PENDING);
                        if(!status){
                            return "Error occured while retrieving status";
                        }  
                        let tripStatus = await tripDb.addTripStatus(result.insertId, status.Id);
                        if(!tripStatus){
                            return "Error occured while adding trip Status";
                        }

                        let paymentResponse = await paymentService.addPaymentForTrip(x,result.insertId);                       
                        let [paymentStatus] =  await statusDb.retrieveStatusByCode(statuses.PENDING);
                        if(paymentResponse && paymentStatus){
                           let paymentStatusResponse = await paymentService.addPaymentStatus(paymentResponse.insertId,paymentStatus.Id);
                           if(!paymentStatusResponse){
                            return "Error occured while adding payment status";
                           }

                       
                        request.points.forEach(async (x,index)=> {
                           let location =  await tripDb.addTripLocation(result.insertId,x.toString(),index);
                           if(!location){
                            return "Error occured while adding location"
                           }
                        })

                        }else{
                            return "Error occured";
                        }
                    }
                });

              
            } 
            
        }
        return "Success"
    }catch(error){
        return "Error";
    }
}


export async function addDriverToTrip(tripId: number, driverId: number): Promise<boolean> {
    try {
        const result = await tripDb.addDriverToTrip(tripId, driverId);
        return result.affectedRows === 1;
    } catch (error) {
        console.error("Error adding driver to trip:", error);
        throw new Error("Failed to add driver to trip");
    }
}

export async function getAllTripsWithDetailsAndPaymentStatus() {
    try {
        return await tripDb.getAllTripsWithDetailsAndPaymentStatus();
    } catch (error) {
        console.error("Error fetching trips with details and payment status:", error);
        throw new Error("Failed to fetch trips with details and payment status");
    }
}
