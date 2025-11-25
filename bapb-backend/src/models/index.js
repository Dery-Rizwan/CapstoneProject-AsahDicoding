const { Sequelize } = require('sequelize');
const config = require('../config/database');

const sequelize = new Sequelize(
  config.development.database,
  config.development.username,
  config.development.password,
  {
    host: config.development.host,
    port: config.development.port,
    dialect: config.development.dialect,
    logging: config.development.logging
  }
);

const models = {
  User: require('./User')(sequelize),
  BAPB: require('./BAPB')(sequelize),
  BAPBItem: require('./BAPBItem')(sequelize),
  BAPBApproval: require('./BAPBApproval')(sequelize),
  BAPBAttachment: require('./BAPBAttachment')(sequelize)
};

// Associations
models.BAPB.belongsTo(models.User, { as: 'vendor', foreignKey: 'vendorId' });
models.BAPB.belongsTo(models.User, { as: 'picGudang', foreignKey: 'picGudangId' });
models.BAPB.hasMany(models.BAPBItem, { foreignKey: 'bapbId', as: 'items' });
models.BAPB.hasMany(models.BAPBApproval, { foreignKey: 'bapbId', as: 'approvals' });
models.BAPB.hasMany(models.BAPBAttachment, { foreignKey: 'bapbId', as: 'attachments' });

models.BAPBItem.belongsTo(models.BAPB, { foreignKey: 'bapbId' });
models.BAPBApproval.belongsTo(models.BAPB, { foreignKey: 'bapbId' });
models.BAPBApproval.belongsTo(models.User, { as: 'approver', foreignKey: 'approverId' });
models.BAPBAttachment.belongsTo(models.BAPB, { foreignKey: 'bapbId' });

module.exports = { sequelize, ...models };