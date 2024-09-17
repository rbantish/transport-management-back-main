import { Router } from 'express';
import * as reportService from '../services/infoService';

const router = Router();

// Route to get the number of drivers
router.get('/drivers/count', async (req, res) => {
    try {
        const count = await reportService.getNumberOfDrivers();
        res.json( count );
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch number of drivers' });
    }
});

// Route to get the number of vehicles
router.get('/vehicles/count', async (req, res) => {
    try {
        const count = await reportService.getNumberOfVehicles();
        res.json(count);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch number of vehicles' });
    }
});

// Route to get the total amount of money made for this month
router.get('/money/this-month', async (req, res) => {
    try {
        const totalAmount = await reportService.getTotalAmountForThisMonth();
        res.json(totalAmount);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch total amount for this month' });
    }
});

export default router;
