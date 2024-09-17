// src/routes/index.ts
import { Router } from 'express';

// Import individual route modules
import customerRoutes from './customer';
import vehicleRoutes from './vehicle';
import rentalRoutes from './rental';
import paymentRoute from './payment';
import tripRoute from './trip';
import infoRoute from './info';
import statusRoute from './status';
import adminRoute from './admin';
import driverRoute from './driver';
// Create a new Router instance
const router = Router();

// Use the imported routes, specifying a base path for each set of routes
router.use('/customer', customerRoutes);
router.use('/vehicle', vehicleRoutes);
router.use('/rental', rentalRoutes);
router.use('/payment', paymentRoute);
router.use('/trip', tripRoute);
router.use('/info', infoRoute);
router.use('/status', statusRoute);
router.use('/admin',adminRoute);
router.use('/driver',driverRoute);
// Export the combined router
export default router;
