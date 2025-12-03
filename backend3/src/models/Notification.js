const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Notification = sequelize.define('Notification', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    type: {
      type: DataTypes.ENUM(
        'bapb_submitted',
        'bapb_approved',
        'bapb_rejected',
        'bapb_revision_required',
        'bapp_submitted',
        'bapp_approved',
        'bapp_rejected',
        'bapp_revision_required',
        'bapb_assigned',
        'bapp_assigned',
        'signature_required',
        'document_ready'
      ),
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    relatedEntityType: {
      type: DataTypes.ENUM('bapb', 'bapp'),
      allowNull: true
    },
    relatedEntityId: {
      type: DataTypes.UUID,
      allowNull: true
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    readAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
      defaultValue: 'medium'
    },
    actionUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {}
    }
  }, {
    tableName: 'notifications',
    timestamps: true,
    indexes: [
      {
        fields: ['userId', 'isRead']
      },
      {
        fields: ['userId', 'createdAt']
      },
      {
        fields: ['relatedEntityType', 'relatedEntityId']
      }
    ]
  });

  return Notification;
};