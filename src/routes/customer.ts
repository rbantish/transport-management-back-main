import express from 'express';
import * as customerService from '../services/customerService';
import { Customer } from '../models/customer';
const router = express.Router();

router.post('/login', async (req, res) => {
  const customer = req.body as Customer;
  if (customer.email != undefined || customer.password != undefined) {
    let response = await customerService.login(req.body as Customer);
    let responseType = typeof response;
    if(responseType == "string"){
      res.status(500).json(response);
    }else{
      res.status(200).json(response);
    }
  } else {
    res.status(500).json({ message: 'Invalid email or password' });
  }
});

// update a customer
router.put('/modify', async (req, res) => {
  try {
    const result:boolean = await customerService.updateCustomer(req.body as Customer);
    if(result){
      res.status(200).json("Succcess");
    }else{
      res.status(500).json("error");
    }   
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});


// Route to get all customers with their latest status code
router.get('/all-with-status', async (req, res) => {
  try {
      const customers = await customerService.getAllCustomersWithLatestStatus();
      res.json(customers);
  } catch (error) {
      res.status(500).json({ error: 'Failed to fetch customers with latest status' });
  }
});


// Create a customer
router.post('/add', async (req, res) => {
  try {
    const result:string = await customerService.createCustomer(req.body as Customer);
    console.log(result)
    if(result == "created"){
      res.status(201).json(result);
    }else{
      res.status(500).json(result);
    }
    
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update a customer
router.put('/modify/:id', async (req, res) => {
  try {
    await customerService.updateCustomer(req.body as Customer);
    res.sendStatus(204);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get a customer by ID
router.get('/single/:id', async (req, res) => {
  try {
    const customer = await customerService.getCustomerById(parseInt(req.params.id));
    if (customer) {
      res.status(200).json(customer);
    } else {
      res.status(404).json({ message: 'Customer not found' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
