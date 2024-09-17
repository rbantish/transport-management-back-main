export interface Payment {
    id?: number;
    customerId?: number;
    rentalId?: number;
    tripId?: number;
    paymentMethodId: number;
    paymentStatusId: number;
    paymentDate: Date;
    amount: number; 
    dateCreated: Date;
  }

  export interface AdminPaymentResponse {
    paymentId: number;
    amount: number;
    paymentDate: string; 
    customerName: string;
    customerPhoneNumber: string;
    latestStatusId: number; 
    latestStatusName: string; // Name of the latest status
    latestStatusCode: string; // Code of the latest status
}
  
  export interface PaymentResponse{
    id: number;
    type: string;
  }