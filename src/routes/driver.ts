import { Router } from 'express';
import * as driverService from '../services/driverService';

const router = Router();

// Driver Registration
router.post('/add', async (req, res) => {
    const driverData = req.body;
    try {
        const result = await driverService.registerDriver(driverData);
        if(result.includes("Driver registered successfully")){
            res.status(200).json(result);
        }else{
            res.status(500).json(result);  
        }
       
    } catch (error) {
        res.status(500).json('Error occurred during registration');
    }
});

// Driver Login
router.post('/login', async (req, res) => {
    const driverCredentials = req.body;
    try {
        console.log(driverCredentials)
        const result = await driverService.loginDriver(driverCredentials);
        if (typeof result === 'string') {
            res.status(500).json(result );
        } else {
            res.json(result); 
        }
    } catch (error: any) {
        res.status(500).json(error.error);
    }
});

// Route to get all trip locations by trip ID
router.get('/trip/:tripId/locations', async (req, res) => {
    const tripId = parseInt(req.params.tripId);
    if (isNaN(tripId)) {
        return res.status(400).json({ error: "Invalid trip ID" });
    }

    const result = await driverService.getTripLocations(tripId);
    if (typeof result === 'string') {
        return res.status(400).json("Error while fetching locations");
    }

    return res.status(200).json(result);
});

// Route to get all drivers with their latest status
router.get('/all', async (req, res) => {
    try {
        const drivers = await driverService.getAllDriversWithLatestStatus();
        if (drivers) {
            res.status(200).json(drivers);
        } else {
            res.status(404).json('No drivers found');
        }
    } catch (error) {
        console.error("Error fetching drivers with latest status:", error);
        res.status(500).json('Internal server error');
    }
});


// Route to get all drivers's trips with their latest status
router.get('/trip/all', async (req, res) => {
    try {
        const driverId = parseInt(req.query.driverId?.toString()!);
        const trips = await driverService.getTripsForDriver(driverId);
        if (trips) {
            res.status(200).json(trips);
        } else {
            res.status(500).json('No drivers found');
        }
    } catch (error) {
        console.error("Error fetching trips", error);
        res.status(500).json('Internal server error');
    }
});

export default router;
