import express from 'express';
import * as adminService from '../services/adminService';
import { Admin, AdminRequest } from '../models/admin';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const adminData: AdminRequest = { email, password };

  const loginResult = await adminService.login(adminData);

  if (typeof loginResult === 'string') {
    return res.status(401).json( loginResult );
  }

  return res.status(200).json(loginResult);
});

export default router;
