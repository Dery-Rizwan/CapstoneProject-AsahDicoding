const express = require('express');
const router = express.Router();
const bappController = require('../controllers/bappController');
const bappApprovalController = require('../controllers/bappApprovalController');
const signatureController = require('../controllers/signatureController');
const attachmentController = require('../controllers/attachmentController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const { validateBAPP, validateUUIDParam } = require('../middlewares/validationMiddleware');

// ==================== BAPP Base Routes ====================
/**
 * @route   GET /api/bapp
 * @desc    Get all BAPPs (with filtering)
 * @access  Private
 */
router.get('/', protect, bappController.getAllBAPP);

/**
 * @route   GET /api/bapp/statistics
 * @desc    Get BAPP statistics (for dashboard)
 * @access  Private
 */
router.get('/statistics', protect, bappController.getBAPPStatistics);

/**
 * @route   POST /api/bapp
 * @desc    Create new BAPP
 * @access  Private (Vendor only)
 */
router.post('/', protect, authorize('vendor'), validateBAPP, bappController.createBAPP);

/**
 * @route   GET /api/bapp/:id
 * @desc    Get single BAPP by ID
 * @access  Private
 */
router.get('/:id', protect, validateUUIDParam('id'), bappController.getBAPPById);

/**
 * @route   PUT /api/bapp/:id
 * @desc    Update BAPP
 * @access  Private (Vendor only, must be owner)
 */
router.put('/:id', protect, authorize('vendor'), validateUUIDParam('id'), bappController.updateBAPP);

/**
 * @route   DELETE /api/bapp/:id
 * @desc    Delete BAPP
 * @access  Private (Vendor only, must be owner, draft only)
 */
router.delete('/:id', protect, authorize('vendor'), validateUUIDParam('id'), bappController.deleteBAPP);

/**
 * @route   POST /api/bapp/:id/submit
 * @desc    Submit BAPP for review
 * @access  Private (Vendor only, must be owner)
 */
router.post('/:id/submit', protect, authorize('vendor'), validateUUIDParam('id'), bappController.submitBAPP);

/**
 * @route   POST /api/bapp/:id/review
 * @desc    Start reviewing BAPP (assign Direksi Pekerjaan)
 * @access  Private (Approver, Admin only)
 */
router.post(
  '/:id/review',
  protect,
  authorize('approver', 'admin'),
  validateUUIDParam('id'),
  bappController.startReviewBAPP
);

// ==================== BAPP Approval Routes ====================
/**
 * @route   POST /api/bapp/:id/approve
 * @desc    Approve BAPP
 * @access  Private (Approver, Admin only)
 */
router.post(
  '/:id/approve',
  protect,
  authorize('approver', 'admin'),
  validateUUIDParam('id'),
  bappApprovalController.approveBAPP
);

/**
 * @route   POST /api/bapp/:id/reject
 * @desc    Reject BAPP
 * @access  Private (Approver, Admin only)
 */
router.post(
  '/:id/reject',
  protect,
  authorize('approver', 'admin'),
  validateUUIDParam('id'),
  bappApprovalController.rejectBAPP
);

/**
 * @route   POST /api/bapp/:id/revision
 * @desc    Request revision for BAPP
 * @access  Private (Approver, Admin only)
 */
router.post(
  '/:id/revision',
  protect,
  authorize('approver', 'admin'),
  validateUUIDParam('id'),
  bappApprovalController.requestRevisionBAPP
);

/**
 * @route   GET /api/bapp/:id/approvals
 * @desc    Get approval history for BAPP
 * @access  Private
 */
router.get(
  '/:id/approvals',
  protect,
  validateUUIDParam('id'),
  bappApprovalController.getBAPPApprovalHistory
);

// ==================== BAPP Signature Routes ====================
/**
 * @route   POST /api/bapp/:id/signature
 * @desc    Upload signature for BAPP
 * @access  Private
 */
router.post(
  '/:id/signature',
  protect,
  validateUUIDParam('id'),
  signatureController.uploadBAPPSignature
);

/**
 * @route   GET /api/bapp/:id/signatures
 * @desc    Get all signatures for BAPP
 * @access  Private
 */
router.get(
  '/:id/signatures',
  protect,
  validateUUIDParam('id'),
  signatureController.getBAPPSignatures
);

// ==================== BAPP Attachment Routes ====================
/**
 * @route   POST /api/bapp/:id/attachments
 * @desc    Upload supporting document for BAPP
 * @access  Private
 */
router.post(
  '/:id/attachments',
  protect,
  validateUUIDParam('id'),
  attachmentController.uploadBAPPDocument
);

/**
 * @route   GET /api/bapp/:id/attachments
 * @desc    Get all attachments for BAPP
 * @access  Private
 */
router.get(
  '/:id/attachments',
  protect,
  validateUUIDParam('id'),
  attachmentController.getBAPPAttachments
);

/**
 * @route   DELETE /api/bapp/:id/attachments/:attachmentId
 * @desc    Delete attachment
 * @access  Private
 */
router.delete(
  '/:id/attachments/:attachmentId',
  protect,
  validateUUIDParam('id'),
  validateUUIDParam('attachmentId'),
  attachmentController.deleteAttachment
);

/**
 * @route   GET /api/bapp/:id/attachments/:attachmentId/download
 * @desc    Download attachment
 * @access  Private
 */
router.get(
  '/:id/attachments/:attachmentId/download',
  protect,
  validateUUIDParam('id'),
  validateUUIDParam('attachmentId'),
  attachmentController.downloadAttachment
);

module.exports = router;