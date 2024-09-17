export interface Trip {
    vehicleId: number;
    customerId: number;
    paymentTypeId: number;
    tripDate: Date;
    tripCost: number;  
  }
  

  export interface TripResponse {
    tripId: number;
    tripDate: string;
    tripCost: number;
    customerName: string;
    carNumber: string;
    latestTripStatusId: number; // ID of the latest trip status
    latestTripStatusCode: string; // Code of the latest trip status
    latestPaymentStatusId: number; // ID of the latest payment status
    latestPaymentStatusCode: string; // Code of the latest payment status
  }

  export interface TriAddDriverRequest{
    tripId: number;
    driverId: number;
  }

  export interface TripWithVehicle {
    tripId: number;
    tripCost: number;
    tripDate: Date;
    dateCreated: Date;
    updateDate: Date;
    carNumber: string;
    make: string;
    model: string;
  }
  


  export interface TripRequest {
    vehicleId: number;
    customerId: number;
    tripDate: Array<Date>;
    tripCost: number; 
    paymentMethodId: number;
    points: Array<string>;

  }