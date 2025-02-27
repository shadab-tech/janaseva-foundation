const express = require('express');
const router = express.Router();
const { protect, partner } = require('../middleware/authMiddleware');
const {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  searchServices
} = require('../controllers/serviceController');

// Public routes
router.get('/', getServices);
router.get('/search', searchServices);
router.get('/:id', getServiceById);

// Protected routes
router.post('/', protect, partner, createService);
router.put('/:id', protect, partner, updateService);
router.delete('/:id', protect, partner, deleteService);

module.exports = router;
