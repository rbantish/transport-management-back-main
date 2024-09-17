import * as statusQueries from '../database/statusQueries';

export async function addStatus(
    type: 'PaymentStatus' | 'AccountStatus' | 'RentalStatus' | 'TripStatus' | 'DriverStatus' | 'VehicleStatus',
    id: number,
    statusId: number,
    updatedBy: number
): Promise<string> {
    try {
        let result;
        switch (type) {
            case 'PaymentStatus':
                console.log(id,statusId,updatedBy)
                result = await statusQueries.addPaymentStatus(id, statusId, updatedBy);
                break;
            case 'AccountStatus':
                result = await statusQueries.addAccountStatus(id, statusId, updatedBy);
                break;
            case 'RentalStatus':
                result = await statusQueries.addRentalStatus(id, statusId, updatedBy);
                break;
            case 'TripStatus':
                result = await statusQueries.addTripStatus(id, statusId, updatedBy);
                break;
            case 'DriverStatus':
                result = await statusQueries.addDriverStatus(id, statusId, updatedBy);
                break;
            case 'VehicleStatus':
                result = await statusQueries.addVehicleStatus(id, statusId, updatedBy);
                break;
            default:
                return "Invalid status type";
        }

        if (result.affectedRows === 1) {
            return "Status added successfully";
        } else {
            return "Failed to add status";
        }
    } catch (error) {
        console.error("Error adding status:", error);
        return "Error occurred while adding status";
    }
}

export async function getAllStatuses() {
    try {
      const statuses = await statusQueries.getStatuses();
      return statuses;
    } catch (error) {
      console.error("Error in getting statuses:", error);
      throw new Error("Could not retrieve statuses");
    }
  }
