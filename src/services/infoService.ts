import * as reportQueries from '../database/info.Queries';

// Service to get the number of drivers
export async function getNumberOfDrivers(): Promise<number> {
    try {
        return await reportQueries.getNumberOfDrivers();
    } catch (error) {
        console.error("Error fetching number of drivers:", error);
        throw new Error("Failed to fetch number of drivers");
    }
}

// Service to get the number of vehicles
export async function getNumberOfVehicles(): Promise<number> {
    try {
        return await reportQueries.getNumberOfVehicles();
    } catch (error) {
        console.error("Error fetching number of vehicles:", error);
        throw new Error("Failed to fetch number of vehicles");
    }
}

// Service to get the total amount of money made for the current month
export async function getTotalAmountForThisMonth(): Promise<number> {
    try {
        return await reportQueries.getTotalAmountForThisMonth();
    } catch (error) {
        console.error("Error fetching total amount for this month:", error);
        throw new Error("Failed to fetch total amount for this month");
    }
}
