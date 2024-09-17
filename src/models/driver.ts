export interface Driver {
    id?: number;
    name: string;
    phoneNumber: string;
    type: string;
    password?: string; // Optional for login, required for registration
    licenseNumber: string;
}

export interface DriverRequest {
    name: string;
    phoneNumber: string;
    password: string; 
    licenseNumber: string;
}


export interface DriverResponse {
    driverId: number;
    driverName: string;
    driverPhoneNumber: string;
    driverLicenseNumber: string;
    driverCreationDate: Date;
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

  
export interface DriverWithStatus extends DriverResponse {
    latestStatusName: string;
    latestStatusCode: string;
    statusUpdateDate: Date;
}


export interface TripLocation {
    id: number;
    locationPoint: string;
    order: number;
    updateDate: string;
}

export interface TripLocationResponse {
    tripId: number;
    tripLocations: TripLocation[];
}



export interface DriverDb {
    Id: number;
    Name: string;
    PhoneNumber: string;
    Password: string;
    LicenseNumber: string;
}
