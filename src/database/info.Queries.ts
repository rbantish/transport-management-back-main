import * as db from '../database/queryCreator';

// Query to get the number of drivers
export async function getNumberOfDrivers(): Promise<number> {
    const result = await db.SelectQuery<{ count: number }>(
        "SELECT COUNT(*) AS count FROM Driver"
    );
    return result[0]?.count || 0;
}

// Query to get the number of vehicles
export async function getNumberOfVehicles(): Promise<number> {
    const result = await db.SelectQuery<{ count: number }>(
        "SELECT COUNT(*) AS count FROM Vehicle"
    );
    return result[0]?.count || 0;
}

// Query to get the total amount of money made for the current month
export async function getTotalAmountForThisMonth(): Promise<number> {
    const currentMonthStart = new Date();
    currentMonthStart.setDate(1);
    currentMonthStart.setHours(0, 0, 0, 0);

    const currentMonthEnd = new Date();
    currentMonthEnd.setMonth(currentMonthEnd.getMonth() + 1);
    currentMonthEnd.setDate(0);
    currentMonthEnd.setHours(23, 59, 59, 999);
    console.log(currentMonthEnd, currentMonthStart)
    const result = await db.SelectQuery<{ totalAmount: number }>(
        "SELECT SUM(Amount) AS totalAmount FROM Payment WHERE PaymentDate BETWEEN ? AND ?",
        [currentMonthStart.toISOString().slice(0, 19).replace('T', ' '), currentMonthEnd.toISOString().slice(0, 19).replace('T', ' ')]
    );

    return result[0]?.totalAmount || 0;
}
