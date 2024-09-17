import { Customer, CustomerDb, CustomerStatusResponse } from '../models/customer';
import * as db from '../database/queryCreator';

export async function addCustomer(customer:Customer) {
    console.log(customer)
    return await db.ModifyQuery(
        "INSERT INTO Customer (Name, Email, PhoneNumber, Address, CustomerTypeId, Password, DateCreated) VALUES (?, ?, ?, ?, ?, ?, NOW())",
        [customer.name, customer.email, customer.phoneNumber, customer.address, customer.customerTypeId, customer.password]
    );
}

export async function updateCustomerById(customer: Customer) {
    return await db.ModifyQuery(
        "UPDATE Customer SET DriverLicenseNumber = ? WHERE Id = ?",
        [customer.driverLicenseNumber, customer.id]
    );
}

export async function getCustomerById(id:number) {
    return await db.SelectQuery<Customer>(
        "SELECT * FROM Customer WHERE Id = ?",
        [id]
    );
}

export async function getCustomerByEmail(email: string) {
    return await db.SelectQuery<CustomerDb>(
        "SELECT Id, Name, Email, PhoneNumber, Address, Password, DriverLicenseNumber FROM Customer WHERE Email = ? LIMIT 1",
        [email]
    );
}

export async function checkIfEmailExist(email: string) {
 return await db.SelectQuery<number>(
    "SELECT Count(Id) as amt FROM Customer WHERE email = ?",
    [email]
 );
}

// Query to get all customers with their latest status code
export async function getAllCustomersWithLatestStatus() {
    return await db.SelectQuery<Array<CustomerStatusResponse>>(
        `
            SELECT 
    c.Id AS customerId,
    c.Name AS customerName,
    c.email,
    c.phoneNumber,
    c.address,
    c.driverLicenseNumber,
    c.DateCreated AS customerCreationDate,
    ct.Type AS customerType,
    s.Name AS latestStatusName,
    s.Code AS latestStatusCode,
    acc.UpdateDate AS statusUpdateDate
FROM 
    Customer c
-- Join with CustomerType to get the type of customer
INNER JOIN CustomerType ct ON c.CustomerTypeId = ct.Id
INNER JOIN (
    -- Subquery to get the latest status per customer based on the highest AccountStatus Id
    SELECT 
        CustomerId, 
        StatusId, 
        UpdateDate
    FROM 
        AccountStatus acc1
    WHERE 
        acc1.Id = (
            -- Select the max Id for the latest status of each customer
            SELECT MAX(Id) 
            FROM AccountStatus acc2 
            WHERE acc1.CustomerId = acc2.CustomerId
        )
) acc ON c.Id = acc.CustomerId
-- Join the Status table to get the name and code of the latest status
INNER JOIN Status s ON acc.StatusId = s.Id
ORDER BY 
    acc.UpdateDate DESC;
        `
    );
}
