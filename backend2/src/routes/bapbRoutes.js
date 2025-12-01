const express = require('express');
const router = express.Router();
const bapbController = require('../controllers/bapbController');
const bapbApprovalController = require('../controllers/bapbApprovalController');
const signatureController = require('../controllers/signatureController');
const attachmentController = require('../controllers/attachmentController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const { validateBAPB, validateUUIDParam } = require('../middlewares/validationMiddleware');

// ==================== BAPB Base Routes ====================
/**
 * @route   GET /api/bapb
 * @desc    Get all BAPBs (with filtering)
 * @access  Private
 */
router.get('/', protect, bapbController.getAllBAPB);

/**
 * @route   POST /api/bapb
 * @desc    Create new BAPB
 * @access  Private (Vendor only)
 */
router.post('/', protect, authorize('vendor'), validateBAPB, bapbController.createBAPB);

/**
 * @route   GET /api/bapb/:id
 * @desc    Get single BAPB by ID
 * @access  Private
 */
router.get('/:id', protect, validateUUIDParam('id'), bapbController.getBAPBById);

/**
 * @route   PUT /api/bapb/:id
 * @desc    Update BAPB
 * @access  Private (Vendor only, must be owner)
 */
router.put('/:id', protect, authorize('vendor'), validateUUIDParam('id'), bapbController.updateBAPB);

/**
 * @route   DELETE /api/bapb/:id
 * @desc    Delete BAPB
 * @access  Private (Vendor only, must be owner, draft only)
 */
router.delete('/:id', protect, authorize('vendor'), validateUUIDParam('id'), bapbController.deleteBAPB);

/**
 * @route   POST /api/bapb/:id/submit
 * @desc    Submit BAPB for review
 * @access  Private (Vendor only, must be owner)
 */
router.post('/:id/submit', protect, authorize('vendor'), validateUUIDParam('id'), bapbController.submitBAPB);

// ==================== BAPB Approval Routes ====================
/**
 * @route   POST /api/bapb/:id/approve
 * @desc    Approve BAPB
 * @access  Private (PIC Gudang, Approver, Admin only)
 */
router.post(
  '/:id/approve',
  protect,
  authorize('pic_gudang', 'approver', 'admin'),
  validateUUIDParam('id'),
  bapbApprovalController.approveBAPB
);

/**
 * @route   POST /api/bapb/:id/reject
 * @desc    Reject BAPB
 * @access  Private (PIC Gudang, Approver, Admin only)
 */
router.post(
  '/:id/reject',
  protect,
  authorize('pic_gudang', 'approver', 'admin'),
  validateUUIDParam('id'),
  bapbApprovalController.rejectBAPB
);

/**
 * @route   POST /api/bapb/:id/revision
 * @desc    Request revision for BAPB
 * @access  Private (PIC Gudang, Approver, Admin only)
 */
router.post(
  '/:id/revision',
  protect,
  authorize('pic_gudang', 'approver', 'admin'),
  validateUUIDParam('id'),
  bapbApprovalController.requestRevisionBAPB
);

/**
 * @route   GET /api/bapb/:id/approvals
 * @desc    Get approval history for BAPB
 * @access  Private
 */
router.get(
  '/:id/approvals',
  protect,
  validateUUIDParam('id'),
  bapbApprovalController.getBAPBApprovalHistory
);

// ==================== BAPB Signature Routes ====================
/**
 * @route   POST /api/bapb/:id/signature
 * @desc    Upload signature for BAPB
 * @access  Private
 */
router.post(
  '/:id/signature',
  protect,
  validateUUIDParam('id'),
  signatureController.uploadBAPBSignature
);

/**
 * @route   GET /api/bapb/:id/signatures
 * @desc    Get all signatures for BAPB
 * @access  Private
 */
router.get(
  '/:id/signatures',
  protect,
  validateUUIDParam('id'),
  signatureController.getBAPBSignatures
);

/**
 * @route   DELETE /api/bapb/:id/signature/:attachmentId
 * @desc    Delete signature
 * @access  Private
 */
router.delete(
  '/:id/signature/:attachmentId',
  protect,
  validateUUIDParam('id'),
  validateUUIDParam('attachmentId'),
  signatureController.deleteSignature
);

// ==================== BAPB Attachment Routes ====================
/**
 * @route   POST /api/bapb/:id/attachments
 * @desc    Upload supporting document for BAPB
 * @access  Private
 */
router.post(
  '/:id/attachments',
  protect,
  validateUUIDParam('id'),
  attachmentController.uploadBAPBDocument
);

/**
 * @route   GET /api/bapb/:id/attachments
 * @desc    Get all attachments for BAPB
 * @access  Private
 */
router.get(
  '/:id/attachments',
  protect,
  validateUUIDParam('id'),
  attachmentController.getBAPBAttachments
);

/**
 * @route   DELETE /api/bapb/:id/attachments/:attachmentId
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
 * @route   GET /api/bapb/:id/attachments/:attachmentId/download
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