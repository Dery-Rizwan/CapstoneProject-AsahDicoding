// File: backend/src/routes/bappRoutes.js
const express = require('express');
const router = express.Router();
const bappController = require('../controllers/bappController');
const bappApprovalController = require('../controllers/bappApprovalController');
const signatureController = require('../controllers/signatureController');
const attachmentController = require('../controllers/attachmentController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const { validateBAPP, validateUUIDParam } = require('../middlewares/validationMiddleware');

// Base routes
router.get('/', protect, bappController.getAllBAPP);
router.post('/', protect, authorize('vendor'), validateBAPP, bappController.createBAPP);
router.get('/:id', protect, validateUUIDParam('id'), bappController.getBAPPById);
router.put('/:id', protect, authorize('vendor'), validateUUIDParam('id'), bappController.updateBAPP);
router.delete('/:id', protect, authorize('vendor'), validateUUIDParam('id'), bappController.deleteBAPP);
router.post('/:id/submit', protect, authorize('vendor'), validateUUIDParam('id'), bappController.submitBAPP);

// Approval routes
router.post('/:id/approve', protect, authorize('approver', 'admin'), validateUUIDParam('id'), bappApprovalController.approveBAPP);
router.post('/:id/reject', protect, authorize('approver', 'admin'), validateUUIDParam('id'), bappApprovalController.rejectBAPP);
router.post('/:id/revision', protect, authorize('approver', 'admin'), validateUUIDParam('id'), bappApprovalController.requestRevisionBAPP);
router.get('/:id/approvals', protect, validateUUIDParam('id'), bappApprovalController.getBAPPApprovalHistory);

// Signature routes
router.post('/:id/signature', protect, validateUUIDParam('id'), signatureController.uploadBAPPSignature);
router.get('/:id/signatures', protect, validateUUIDParam('id'), signatureController.getBAPPSignatures);

// Attachment routes
router.post('/:id/attachments', protect, validateUUIDParam('id'), attachmentController.uploadBAPPDocument);
router.get('/:id/attachments', protect, validateUUIDParam('id'), attachmentController.getBAPPAttachments);

module.exports = router;