import express from 'express';
import * as tripService from '../services/tripService';
import { TriAddDriverRequest, TripRequest } from '../models/trip';
const router = express.Router();

router.post('/add', async (req, res) => {
try {
    const tripRequest = req.body as TripRequest;
    let response = await tripService.addTrip(tripRequest);
    if(response.includes("Error")){
      res.status(500).json(response);
    }else{
      res.status(200).json("Success");
    }  
} catch (error) {
    res.status(500).json("Error occured while adding trip");
}
  
});

// Route to add a driver to a trip
router.post('/add-driver', async (req, res) => {
  const request = req.body as TriAddDriverRequest;

  if (!request.tripId || !request.driverId) {
      return res.status(400).json({ error: 'Trip ID and Driver ID are required' });
  }

  try {
      const success = await tripService.addDriverToTrip(request.tripId, request.driverId);
      if (success) {
          res.status(200).json({ message: 'Driver added to trip successfully' });
      } else {
          res.status(404).json({ error: 'Trip not found' });
      }
  } catch (error) {
      res.status(500).json({ error: 'Failed to add driver to trip' });
  }
});

// Route to get all trips with the latest trip status code, user details, car number, and latest payment status code
router.get('/all', async (req, res) => {
  try {
      const [trips] = await tripService.getAllTripsWithDetailsAndPaymentStatus();
      res.json(trips);
  } catch (error) {
      res.status(500).json({ error: 'Failed to fetch trips with details and payment status' });
  }
});
export default router;