const { Notification, User } = require('../models');

class NotificationService {
  // Create a notification
  static async create({
    userId,
    type,
    title,
    message,
    relatedEntityType = null,
    relatedEntityId = null,
    priority = 'medium',
    actionUrl = null,
    metadata = {}
  }) {
    try {
      const notification = await Notification.create({
        userId,
        type,
        title,
        message,
        relatedEntityType,
        relatedEntityId,
        priority,
        actionUrl,
        metadata
      });

      return notification;
    } catch (error) {
      console.error('Create notification error:', error);
      throw error;
    }
  }

  // Create notifications for multiple users
  static async createBulk(userIds, notificationData) {
    try {
      const notifications = userIds.map(userId => ({
        userId,
        ...notificationData
      }));

      const result = await Notification.bulkCreate(notifications);
      return result;
    } catch (error) {
      console.error('Create bulk notifications error:', error);
      throw error;
    }
  }

  // BAPB Notifications
  static async notifyBAPBSubmitted(bapb, vendor) {
    try {
      // Notify all PIC Gudang and Approvers
      const recipients = await User.findAll({
        where: {
          role: ['pic_gudang', 'approver', 'admin'],
          isActive: true
        },
        attributes: ['id']
      });

      const userIds = recipients.map(u => u.id);

      if (userIds.length > 0) {
        await this.createBulk(userIds, {
          type: 'bapb_submitted',
          title: 'BAPB Baru Disubmit',
          message: `${vendor.name} telah mensubmit BAPB ${bapb.bapbNumber} untuk ditinjau`,
          relatedEntityType: 'bapb',
          relatedEntityId: bapb.id,
          priority: 'high',
          actionUrl: `/bapb/${bapb.id}`,
          metadata: {
            bapbNumber: bapb.bapbNumber,
            vendorName: vendor.name,
            orderNumber: bapb.orderNumber
          }
        });
      }

      return true;
    } catch (error) {
      console.error('Notify BAPB submitted error:', error);
      return false;
    }
  }

  static async notifyBAPBApproved(bapb, approver, vendor) {
    try {
      // Notify vendor
      await this.create({
        userId: vendor.id,
        type: 'bapb_approved',
        title: 'BAPB Disetujui',
        message: `BAPB ${bapb.bapbNumber} Anda telah disetujui oleh ${approver.name}`,
        relatedEntityType: 'bapb',
        relatedEntityId: bapb.id,
        priority: 'high',
        actionUrl: `/bapb/${bapb.id}`,
        metadata: {
          bapbNumber: bapb.bapbNumber,
          approverName: approver.name,
          approvedAt: new Date()
        }
      });

      return true;
    } catch (error) {
      console.error('Notify BAPB approved error:', error);
      return false;
    }
  }

  static async notifyBAPBRejected(bapb, rejector, vendor, reason) {
    try {
      await this.create({
        userId: vendor.id,
        type: 'bapb_rejected',
        title: 'BAPB Ditolak',
        message: `BAPB ${bapb.bapbNumber} Anda telah ditolak oleh ${rejector.name}. Alasan: ${reason}`,
        relatedEntityType: 'bapb',
        relatedEntityId: bapb.id,
        priority: 'urgent',
        actionUrl: `/bapb/${bapb.id}`,
        metadata: {
          bapbNumber: bapb.bapbNumber,
          rejectorName: rejector.name,
          rejectionReason: reason,
          rejectedAt: new Date()
        }
      });

      return true;
    } catch (error) {
      console.error('Notify BAPB rejected error:', error);
      return false;
    }
  }

  static async notifyBAPBRevisionRequired(bapb, requester, vendor, reason) {
    try {
      await this.create({
        userId: vendor.id,
        type: 'bapb_revision_required',
        title: 'BAPB Perlu Revisi',
        message: `BAPB ${bapb.bapbNumber} perlu direvisi. Catatan dari ${requester.name}: ${reason}`,
        relatedEntityType: 'bapb',
        relatedEntityId: bapb.id,
        priority: 'high',
        actionUrl: `/bapb/${bapb.id}/edit`,
        metadata: {
          bapbNumber: bapb.bapbNumber,
          requesterName: requester.name,
          revisionReason: reason,
          requestedAt: new Date()
        }
      });

      return true;
    } catch (error) {
      console.error('Notify BAPB revision required error:', error);
      return false;
    }
  }

  static async notifyBAPBAssigned(bapb, picGudang, vendor) {
    try {
      // Notify PIC Gudang
      await this.create({
        userId: picGudang.id,
        type: 'bapb_assigned',
        title: 'BAPB Ditugaskan ke Anda',
        message: `Anda telah ditugaskan untuk meninjau BAPB ${bapb.bapbNumber} dari ${vendor.name}`,
        relatedEntityType: 'bapb',
        relatedEntityId: bapb.id,
        priority: 'high',
        actionUrl: `/bapb/${bapb.id}`,
        metadata: {
          bapbNumber: bapb.bapbNumber,
          vendorName: vendor.name,
          assignedAt: new Date()
        }
      });

      return true;
    } catch (error) {
      console.error('Notify BAPB assigned error:', error);
      return false;
    }
  }

  // BAPP Notifications
  static async notifyBAPPSubmitted(bapp, vendor) {
    try {
      const recipients = await User.findAll({
        where: {
          role: ['approver', 'admin'],
          isActive: true
        },
        attributes: ['id']
      });

      const userIds = recipients.map(u => u.id);

      if (userIds.length > 0) {
        await this.createBulk(userIds, {
          type: 'bapp_submitted',
          title: 'BAPP Baru Disubmit',
          message: `${vendor.name} telah mensubmit BAPP ${bapp.bappNumber} untuk proyek ${bapp.projectName}`,
          relatedEntityType: 'bapp',
          relatedEntityId: bapp.id,
          priority: 'high',
          actionUrl: `/bapp/${bapp.id}`,
          metadata: {
            bappNumber: bapp.bappNumber,
            vendorName: vendor.name,
            projectName: bapp.projectName,
            totalProgress: bapp.totalProgress
          }
        });
      }

      return true;
    } catch (error) {
      console.error('Notify BAPP submitted error:', error);
      return false;
    }
  }

  static async notifyBAPPApproved(bapp, approver, vendor) {
    try {
      await this.create({
        userId: vendor.id,
        type: 'bapp_approved',
        title: 'BAPP Disetujui',
        message: `BAPP ${bapp.bappNumber} untuk proyek ${bapp.projectName} telah disetujui oleh ${approver.name}`,
        relatedEntityType: 'bapp',
        relatedEntityId: bapp.id,
        priority: 'high',
        actionUrl: `/bapp/${bapp.id}`,
        metadata: {
          bappNumber: bapp.bappNumber,
          projectName: bapp.projectName,
          approverName: approver.name,
          approvedAt: new Date()
        }
      });

      return true;
    } catch (error) {
      console.error('Notify BAPP approved error:', error);
      return false;
    }
  }

  static async notifyBAPPRejected(bapp, rejector, vendor, reason) {
    try {
      await this.create({
        userId: vendor.id,
        type: 'bapp_rejected',
        title: 'BAPP Ditolak',
        message: `BAPP ${bapp.bappNumber} untuk proyek ${bapp.projectName} telah ditolak oleh ${rejector.name}. Alasan: ${reason}`,
        relatedEntityType: 'bapp',
        relatedEntityId: bapp.id,
        priority: 'urgent',
        actionUrl: `/bapp/${bapp.id}`,
        metadata: {
          bappNumber: bapp.bappNumber,
          projectName: bapp.projectName,
          rejectorName: rejector.name,
          rejectionReason: reason,
          rejectedAt: new Date()
        }
      });

      return true;
    } catch (error) {
      console.error('Notify BAPP rejected error:', error);
      return false;
    }
  }

  static async notifyBAPPRevisionRequired(bapp, requester, vendor, reason) {
    try {
      await this.create({
        userId: vendor.id,
        type: 'bapp_revision_required',
        title: 'BAPP Perlu Revisi',
        message: `BAPP ${bapp.bappNumber} untuk proyek ${bapp.projectName} perlu direvisi. Catatan dari ${requester.name}: ${reason}`,
        relatedEntityType: 'bapp',
        relatedEntityId: bapp.id,
        priority: 'high',
        actionUrl: `/bapp/${bapp.id}/edit`,
        metadata: {
          bappNumber: bapp.bappNumber,
          projectName: bapp.projectName,
          requesterName: requester.name,
          revisionReason: reason,
          requestedAt: new Date()
        }
      });

      return true;
    } catch (error) {
      console.error('Notify BAPP revision required error:', error);
      return false;
    }
  }

  static async notifyBAPPAssigned(bapp, direksi, vendor) {
    try {
      await this.create({
        userId: direksi.id,
        type: 'bapp_assigned',
        title: 'BAPP Ditugaskan ke Anda',
        message: `Anda telah ditugaskan untuk meninjau BAPP ${bapp.bappNumber} proyek ${bapp.projectName} dari ${vendor.name}`,
        relatedEntityType: 'bapp',
        relatedEntityId: bapp.id,
        priority: 'high',
        actionUrl: `/bapp/${bapp.id}`,
        metadata: {
          bappNumber: bapp.bappNumber,
          projectName: bapp.projectName,
          vendorName: vendor.name,
          assignedAt: new Date()
        }
      });

      return true;
    } catch (error) {
      console.error('Notify BAPP assigned error:', error);
      return false;
    }
  }

  // Signature notifications
  static async notifySignatureRequired(entityType, entity, user) {
    try {
      const entityNumber = entityType === 'bapb' ? entity.bapbNumber : entity.bappNumber;

      await this.create({
        userId: user.id,
        type: 'signature_required',
        title: 'Tanda Tangan Diperlukan',
        message: `Dokumen ${entityType.toUpperCase()} ${entityNumber} menunggu tanda tangan Anda`,
        relatedEntityType: entityType,
        relatedEntityId: entity.id,
        priority: 'high',
        actionUrl: `/${entityType}/${entity.id}/signature`,
        metadata: {
          entityType,
          entityNumber,
          requiresSignature: true
        }
      });

      return true;
    } catch (error) {
      console.error('Notify signature required error:', error);
      return false;
    }
  }

  // Document ready notification
  static async notifyDocumentReady(entityType, entity, user) {
    try {
      const entityNumber = entityType === 'bapb' ? entity.bapbNumber : entity.bappNumber;

      await this.create({
        userId: user.id,
        type: 'document_ready',
        title: 'Dokumen Siap Diunduh',
        message: `Dokumen final ${entityType.toUpperCase()} ${entityNumber} sudah siap diunduh`,
        relatedEntityType: entityType,
        relatedEntityId: entity.id,
        priority: 'medium',
        actionUrl: `/${entityType}/${entity.id}/document`,
        metadata: {
          entityType,
          entityNumber,
          documentReady: true
        }
      });

      return true;
    } catch (error) {
      console.error('Notify document ready error:', error);
      return false;
    }
  }

  // Clean old notifications (can be called by cron job)
  static async cleanOldNotifications(daysOld = 30) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      const result = await Notification.destroy({
        where: {
          isRead: true,
          readAt: {
            [Op.lt]: cutoffDate
          }
        }
      });

      console.log(`Cleaned ${result} old notifications`);
      return result;
    } catch (error) {
      console.error('Clean old notifications error:', error);
      throw error;
    }
  }
}

module.exports = NotificationService;