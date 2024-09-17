export interface Rental {
    id?: number;
    customerId: number;
    vehicleId: number;
    rentalStatusId: number;
    startDate: Date;
    endDate: Date;
    totalPayment: number;
    dateCreated: Date;
  }


  export interface PaymentCompleteRequest{
    paymentId: number;
    updatedBy: number;
  }

  export interface RentalResponse {
    rentalId: number;
    startDate: string; 
    endDate: string; 
    totalPayment: number;
    customerName: string;
    carNumber: string;
    latestRentalStatusId: number; 
    latestRentalStatusCode: string; 
    latestPaymentStatusId: number; 
    latestPaymentStatusCode: string; // Code of the latest payment status
}

export interface TripRental {
  type: 'Trip' | 'Rental';
  entityId: number;
  customerId: number;
  paymentId: number;
  customerName: string;
  driverId?: number; // Only for trips
  cost: number;
  startDate: Date;
  endDate?: Date; // Only for rentals
  creationDate: Date;
  latestStatusName: string;
  latestStatusCode: string;
  statusUpdateDate: Date;
  latestPaymentStatusName?: string;
  latestPaymentStatusCode?: string;
  paymentDate?: Date;
  paymentAmount?: number;
}

  

  export interface RentalRequest {
    customerId: number;
    vehicleId: number;
    startDate: Date;
    endDate: Date;
    totalPayment: number;
    paymentTypeId: number;
  }

  export interface BookingInfos{
    bookingType: string;
    rentalId: number;
    startDate: Date;
    endDate: Date;
    totalPayment: number;
    latestStatusCode: string;
    latestPaymentStatusCode: string;
    PaymentMethod: string;
    
  }