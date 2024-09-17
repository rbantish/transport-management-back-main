import express from 'express';
import * as rentalSevice from '../services/rentalService';
import { PaymentCompleteRequest, RentalRequest, RentalResponse } from '../models/rental';
const router = express.Router();

router.post('/add', async (req, res) => {
try {
    const rentalRequest = req.body as RentalRequest;
    let response = await rentalSevice.addRental(rentalRequest);
    if(response?.affectedRows != 1){
      res.status(500).json("Error occured while adding rental");
    }else{
      res.status(200).json("Success");
    }  
} catch (error) {
    res.status(500).json("Error occured while adding rental");
}
  
});

//complete payment
router.post('/payment', async (req, res) => {
  try {
      const rentalRequest = req.body as PaymentCompleteRequest;
      let response = await rentalSevice.updatePayment(rentalRequest);
      if(response == "Success"){
        res.status(200).json("Success");
      }else{
        res.status(500).json("Error occured while updating payment");
      }  
  } catch (error) {
      res.status(500).json("Error occured while updating payment");
  }
});

// Route to get all rentals with the latest rental status code, user details, car number, and latest payment status code
router.get('/all', async (req, res) => {
  try {
      const [rentals] = await rentalSevice.getAllRentalsWithDetailsAndPaymentStatus();
      res.json(rentals);
  } catch (error) {
      res.status(500).json({ error: 'Failed to fetch rentals with details and payment status' });
  }
});


// Route to get all trips and rentals with their latest statuses and payment status
router.get('/trips-rentals', async (req, res) => {
  try {
    const data = await rentalSevice.getAllTripsAndRentals();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching trips and rentals:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



router.get('/bookings', async (req, res) => {
    try {
        const id = Number.parseInt(req.query.id?.toString()!); 
        if (isNaN(id)) {
          return res.status(400).json("Invalid Id");
        }  

        let response = await rentalSevice.getAllBookings(id);
        if(response == undefined){
          res.status(500).json("Error");
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json("Error occured while adding rental");
    }
      
    });
export default router;