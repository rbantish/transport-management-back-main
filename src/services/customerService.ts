import * as customerQueries from '../database/customerQueries';
import * as statusQueries from '../database/statusQueries';
import * as statusService from '../services/statusService';
import { statuses } from '../enums/status';
import { Customer, CustomerDb } from '../models/customer'; 
import * as encryption from './encryption';

// Function to create a customer
export async function createCustomer(customerData: Customer): Promise<any> {
  try {
    if(customerData.name == undefined || customerData.name == ""){
        return "Name missing";
      }else if(customerData.address == undefined || customerData.address == ""){
        return "Address missing";
      }else if(customerData.email == undefined || customerData.email == ""){
        return "Email missing";
      }else if(customerData.password == undefined || customerData.password == ""){
        return "Password missing";
      }else if(customerData.phoneNumber == undefined || customerData.phoneNumber.toString().length <= 0){
        return "Mobile number invalid";
      }

      if(await checkIfUserExist(customerData.email)){
        return "Email already exist";
      }
      let [status] = await statusQueries.retrieveStatusByCode(statuses.ACTIVE);
      if(status == undefined){
        return "Error occured while retrieving status";
      }

      customerData.password = await encryption.hashPassword(customerData.password);
      const result = await customerQueries.addCustomer(customerData);
      if(result.affectedRows == 1){
        await statusQueries.addAccountStatusCustomer(result.insertId,status.Id);
        return "created";
      }
      
  } catch (error) {
    return "error occured";
  }
}

export async function getAllCustomersWithLatestStatus() {
  try {
      return await customerQueries.getAllCustomersWithLatestStatus();
  } catch (error) {
      console.error("Error fetching customers with latest status:", error);
      throw new Error("Failed to fetch customers with latest status");
  }
}

// Function to update a customer
export async function updateCustomer(customerData: Customer): Promise<boolean> {
  try {
    let result = await customerQueries.updateCustomerById(customerData);
    console.log(result)
    if(result.affectedRows == 1){
        return true;
    }
    return false;
  } catch (error) {
    return false;
  }
  
}

export async function checkIfUserExist(email: string){
  try{
    let result: any = await customerQueries.checkIfEmailExist(email);
    if(result[0].amt > 0){
      return true;
    }
    return false;
  }catch(error){
    return false;
  }
 
}

// Function to get a customer by ID
export async function getCustomerById(id: number): Promise<Customer | null> {
  let customer: any = await customerQueries.getCustomerById(id);
  if(customer == undefined){
    return null;
  }
  return customer  as Customer;
}

export async function login(customer: Customer) {
  try{
    let result = await customerQueries.getCustomerByEmail(customer.email);
    if(result == null){
      return "You are not registered!";
    }

    let cs: CustomerDb = result[0] as CustomerDb;
    if(await encryption.comparePassword(customer.password!, cs.Password!)){
      const customer: Customer = {
        id: result[0]?.Id!,
        name: result[0]?.Name!,
        email: result[0]?.Email!,
        phoneNumber: result[0]?.PhoneNumber!,
        address: result[0]?.Address!,
        type: "customer",
        driverLicenseNumber: result[0]?.DriverLicenseNumber!
      }
      return customer;
    }else{
      return "Wrong Password"
    }  
  }catch(error){
    return "Error";
  }
}
