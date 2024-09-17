import express from 'express';
import * as paymentService from '../services/paymentService';
const router = express.Router();

router.get('/all', async (req, res) => {
    try {
        let response = await paymentService.getAllPaymentTypes();
        if(response == undefined){
          res.status(500).json("Error");
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json("Error occured while adding rental");
    }
      
    });

    // Route to get all payments with customer details
router.get('/payments', async (req, res) => {
    try {
        const [payments] = await paymentService.getAllPaymentsWithCustomerDetailsAndStatus();
        res.json(payments);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch payments with customer details' });
    }
});
export default router;