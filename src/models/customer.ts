export interface Customer {
  id?: number;
  name: string;
  email: string;
  phoneNumber: number;
  address: string;
  type: string;
  driverLicenseNumber?: string;
  customerTypeId?: number;
  password?: string;
  dateCreated?: Date;
}

export interface CustomerStatusResponse {
  customerId: number;
  customerName: string;
  phoneNumber: string;
  address: string;
  driverLicenseNumber: string;
  latestStatusId: number; // ID of the latest status
  latestStatusCode: string; // Code of the latest status
}


export interface CustomerDb {
  Id?: number;
  Name: string;
  Email: string;
  PhoneNumber: number;
  Address: string;
  DriverLicenseNumber: string;
  CustomerTypeId: number;
  AccountStatusId: number;
  Password: string;
  DateCreated?: Date;
}