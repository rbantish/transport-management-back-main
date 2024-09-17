import express from 'express';
import * as vehicleService from '../services/vehicleService';
import { Vehicle } from '../models/vehicle';
import upload from '../services/uploadConfig';
const router = express.Router();



// Route to add a new vehicle with image upload
router.post('/add', upload.single('image'), async (req, res) => {
  try {
      // Ensure the file is present
      if (!req.file) {
          return res.status(400).json({ error: "Image file is required" });
      }
      // Extract the relative path of the uploaded image
      const imagePath = `/uploads/vehicles/${req.file.filename}`;

      // Collect vehicle data from the request body
      const vehicleData: Vehicle = {
        vehicleTypeId: req.body.vehicleTypeId,
        tripPrice: req.body.tripPrice,
        dailyPrice: req.body.dailyPrice,
        updatedBy: req.body.updatedBy,
        seats: req.body.seats,
        carNumber: req.body.carNumber,
        make: req.body.make,
        model: req.body.model,
        year: req.body.year,
        currentLocation: req.body.currentLocation,
        imagePath: imagePath
      };

      // Save the vehicle data with the image path
      const result = await vehicleService.createVehicle(vehicleData, imagePath);
      
      if (result === "Vehicle added successfully") {
          return res.status(201).json({ message: result });
      } else {
          return res.status(400).json({ error: result });
      }
  } catch (error) {
      console.error("Error in vehicle creation:", error);
      return res.status(500).json({ error: "Internal server error" });
  }
});

// Get all vehicles
router.get('/vehicletype/all', async (req, res) => {
  try {
    const vehicles = await vehicleService.getAllVehicleTypes();
    res.status(200).json(vehicles);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// // Create a vehicle
// router.post('/add', async (req, res) => {
//   try {
//     const vehicle = await vehicleService.addVehicle(req.body as Vehicle);
//     res.status(201).json(vehicle);
//   } catch (error: any) {
//     res.status(500).json({ error: error.message });
//   }
// });

// Get all vehicles
router.get('/all', async (req, res) => {
    try {
      const vehicles = await vehicleService.getAllVehicles();
      res.status(200).json(vehicles);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
});

// Get vehicle calendar by id
router.get('/calendar', async (req, res) => {
    try {
      const id = Number.parseInt(req.query.id?.toString()!); 
      if (isNaN(id)) {
        return res.status(400).json("Invalid Id");
      }  

      let dates = await vehicleService.getVehicleCalendarById(id);
      if(dates){
        res.status(200).json(dates);
      }
      
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
});

// Get vehicle by id
router.get('/single', async (req, res) => {
    try {
      const id = Number.parseInt(req.query.id?.toString()!); 
      if (isNaN(id)) {
        return res.status(400).json("Invalid Id");
      }  
      
      const vehicles = await vehicleService.getVehicleById(id);
      res.status(200).json(vehicles);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
});

export default router;
