const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const { protect } = require('../middlewares/authMiddleware');
const { validateUUIDParam } = require('../middlewares/validationMiddleware');

// ==================== BAPB Document Routes ====================
/**
 * @route   GET /api/documents/bapb/:id/generate
 * @desc    Generate BAPB document (HTML or PDF)
 * @access  Private
 * @query   format=html|pdf
 */
router.get(
  '/bapb/:id/generate',
  protect,
  validateUUIDParam('id'),
  documentController.generateBAPBDocument
);

/**
 * @route   GET /api/documents/bapb/:id/preview
 * @desc    Preview BAPB document
 * @access  Private
 */
router.get(
  '/bapb/:id/preview',
  protect,
  validateUUIDParam('id'),
  documentController.previewBAPBDocument
);

// ==================== BAPP Document Routes ====================
/**
 * @route   GET /api/documents/bapp/:id/generate
 * @desc    Generate BAPP document (HTML or PDF)
 * @access  Private
 * @query   format=html|pdf
 */
router.get(
  '/bapp/:id/generate',
  protect,
  validateUUIDParam('id'),
  documentController.generateBAPPDocument
);

/**
 * @route   GET /api/documents/bapp/:id/preview
 * @desc    Preview BAPP document
 * @access  Private
 */
router.get(
  '/bapp/:id/preview',
  protect,
  validateUUIDParam('id'),
  documentController.previewBAPPDocument
);

module.exports = router;