// Add this import at the top
const NotificationService = require('../services/notificationService');

// Updated submitBAPB function
exports.submitBAPB = async (req, res) => {
  try {
    const { id } = req.params;

    const bapb = await BAPB.findByPk(id, {
      include: [
        { model: BAPBItem, as: 'items' },
        { model: User, as: 'vendor' }
      ]
    });

    if (!bapb) {
      return res.status(404).json({
        success: false,
        message: 'BAPB not found'
      });
    }

    // Check authorization
    if (bapb.vendorId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to submit this BAPB'
      });
    }

    if (bapb.status !== 'draft' && bapb.status !== 'revision_required') {
      return res.status(400).json({
        success: false,
        message: 'Can only submit BAPB in draft or revision status'
      });
    }

    // Validate has items
    if (!bapb.items || bapb.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'BAPB must have at least one item'
      });
    }

    await bapb.update({ status: 'submitted' });

    // Send notifications to PIC Gudang and Approvers
    await NotificationService.notifyBAPBSubmitted(bapb, bapb.vendor);

    res.status(200).json({
      success: true,
      message: 'BAPB submitted successfully',
      data: bapb
    });
  } catch (error) {
    console.error('Submit BAPB error:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting BAPB',
      error: error.message
    });
  }
};