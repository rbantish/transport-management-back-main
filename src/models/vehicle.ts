import { VehicleType } from "./vehicleType";

export interface Vehicle {
    vehicleTypeId: number;
    tripPrice: number;
    dailyPrice: number; 
    seats: number;
    updatedBy: number;
    imagePath: string;
    make: string;  
    model: string;  
    year: number;
    carNumber: string;  
    currentLocation: string;
  }

  export interface Item{
    date: Date;
}

  export interface VehicleResponse {
    id: number;
    vehicleTypeCde: string;
    dailyPrice: number; 
    seats: number;
    imagePath: string
    make: string;  
    model: string;  
    year: number;
    carNumber: string;  
    currentLocation: string;  
    vehicleStatusCode?: string;
    rentalStatusCode?: string;
  }
  