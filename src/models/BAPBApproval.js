const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const BAPBApproval = sequelize.define('BAPBApproval', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    bapbId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'bapb',
        key: 'id'
      }
    },
    approverId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    action: {
      type: DataTypes.ENUM('approved', 'rejected', 'revision_required'),
      allowNull: false
    },
    notes: DataTypes.TEXT,
    approvedAt: DataTypes.DATE
  }, {
    tableName: 'bapb_approvals',
    timestamps: true
  });

  return BAPBApproval;
};