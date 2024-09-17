import { Router } from 'express';
import * as statusService from '../services/statusService';

const router = Router();

// Route to add a status to a specific entity
router.post('/add-status', async (req, res) => {
    const { type, id, statusId, updatedBy } = req.body;

    if (!type || !id || !statusId || !updatedBy) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    try {
        const result = await statusService.addStatus(type, id, statusId, updatedBy);
        if (result === "Status added successfully") {
            res.status(200).json({ message: result });
        } else {
            res.status(400).json({ error: result });
        }
    } catch (error) {
        console.error("Error handling add-status route:", error);
        res.status(500).json({ error: 'Failed to add status' });
    }
});

// Route to get all statuses
router.get('/all', async (req, res) => {
    try {
      const statuses = await statusService.getAllStatuses();
      if (statuses) {
        res.status(200).json(statuses);
      } else {
        res.status(404).json({ message: "No statuses found" });
      }
    } catch (error) {
      console.error("Error fetching statuses:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

export default router;
