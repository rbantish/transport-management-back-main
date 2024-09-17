import * as vehicleDb from '../database/vehicleQueries';
import * as statusService from '../services/statusService';
import * as statusDb from '../database/statusQueries';
import { Vehicle } from '../models/vehicle';
import { statuses } from '../enums/status';
import { stat } from 'fs';

export async function getAllVehicles() {
    return await vehicleDb.getAllVehicles();
}

export async function getAllVehicleTypes() {
    return await vehicleDb.getAllVehicleTypes();
}

export async function getVehicleById(id:number) {
    return (await vehicleDb.getVehicleById(id))[0];
}

export async function getVehicleCalendarById(id:number) {
    return await vehicleDb.getAllBookedDatesForaVehicle(id);
}

export async function createVehicle(vehicleData: Vehicle, imagePath: string): Promise<string> {
    try {
        vehicleData.imagePath = imagePath;
        console.log(vehicleData)
        const result = await vehicleDb.addVehicle(vehicleData);

        if (result.affectedRows === 1) {
            let [status]  = await statusDb.retrieveStatusByCode(statuses.ACTIVE)
            if(status){
                await statusService.addStatus("VehicleStatus",result.insertId,status.Id, vehicleData.updatedBy);
            }  
            return "Vehicle added successfully";
        } else {
            return "Failed to add vehicle";
        }
    } catch (error) {
        console.error("Error adding vehicle: ", error);
        return "Error occurred while adding vehicle";
    }
}


export async function addVehicle(vehicle: Vehicle){
    let result = await vehicleDb.addVehicle(vehicle);
    if(result.affectedRows == 1){
        return true;
    }else{
        return false;
    }
}