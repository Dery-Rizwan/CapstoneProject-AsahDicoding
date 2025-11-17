const express = require('express');
const router = express.Router();
const {
  createBAPB,
  getAllBAPB,
  getBAPBById,
  updateBAPB,
  deleteBAPB,
  submitBAPB
} = require('../controllers/bapbController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// All routes require authentication
router.use(protect);

router.post('/', authorize('vendor'), createBAPB);
router.get('/', getAllBAPB);
router.get('/:id', getBAPBById);
router.put('/:id', authorize('vendor'), updateBAPB);
router.delete('/:id', authorize('vendor'), deleteBAPB);
router.post('/:id/submit', authorize('vendor'), submitBAPB);

module.exports = router;