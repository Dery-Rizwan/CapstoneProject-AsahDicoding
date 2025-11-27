/**
 * Validation Middleware for BAPP
 * Validates request data before processing
 */

/**
 * Validate BAPP creation/update data
 */
exports.validateBAPP = (req, res, next) => {
  const { contractNumber, projectName, projectLocation, startDate, endDate, workItems } = req.body;
  const errors = [];

  // Required fields validation
  if (!contractNumber || contractNumber.trim() === '') {
    errors.push({ field: 'contractNumber', message: 'Contract number is required' });
  }

  if (!projectName || projectName.trim() === '') {
    errors.push({ field: 'projectName', message: 'Project name is required' });
  }

  if (!projectLocation || projectLocation.trim() === '') {
    errors.push({ field: 'projectLocation', message: 'Project location is required' });
  }

  if (!startDate) {
    errors.push({ field: 'startDate', message: 'Start date is required' });
  }

  if (!endDate) {
    errors.push({ field: 'endDate', message: 'End date is required' });
  }

  // Date validation
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime())) {
      errors.push({ field: 'startDate', message: 'Invalid start date format' });
    }

    if (isNaN(end.getTime())) {
      errors.push({ field: 'endDate', message: 'Invalid end date format' });
    }

    if (start >= end) {
      errors.push({ field: 'endDate', message: 'End date must be after start date' });
    }
  }

  // Work items validation
  if (workItems && Array.isArray(workItems)) {
    workItems.forEach((item, index) => {
      if (!item.workItemName || item.workItemName.trim() === '') {
        errors.push({ 
          field: `workItems[${index}].workItemName`, 
          message: 'Work item name is required' 
        });
      }

      if (item.plannedProgress === undefined || item.plannedProgress === null) {
        errors.push({ 
          field: `workItems[${index}].plannedProgress`, 
          message: 'Planned progress is required' 
        });
      } else if (item.plannedProgress < 0 || item.plannedProgress > 100) {
        errors.push({ 
          field: `workItems[${index}].plannedProgress`, 
          message: 'Planned progress must be between 0 and 100' 
        });
      }

      if (item.actualProgress === undefined || item.actualProgress === null) {
        errors.push({ 
          field: `workItems[${index}].actualProgress`, 
          message: 'Actual progress is required' 
        });
      } else if (item.actualProgress < 0 || item.actualProgress > 100) {
        errors.push({ 
          field: `workItems[${index}].actualProgress`, 
          message: 'Actual progress must be between 0 and 100' 
        });
      }

      if (!item.unit || item.unit.trim() === '') {
        errors.push({ 
          field: `workItems[${index}].unit`, 
          message: 'Unit is required' 
        });
      }
    });
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

/**
 * Validate user registration data
 */
exports.validateRegister = (req, res, next) => {
  const { email, password, name, role } = req.body;
  const errors = [];

  // Email validation
  if (!email || email.trim() === '') {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push({ field: 'email', message: 'Invalid email format' });
  }

  // Password validation
  if (!password || password.trim() === '') {
    errors.push({ field: 'password', message: 'Password is required' });
  } else if (password.length < 6) {
    errors.push({ field: 'password', message: 'Password must be at least 6 characters' });
  }

  // Name validation
  if (!name || name.trim() === '') {
    errors.push({ field: 'name', message: 'Name is required' });
  }

  // Role validation
  const validRoles = ['vendor', 'pic_gudang', 'admin', 'approver'];
  if (!role || !validRoles.includes(role)) {
    errors.push({ 
      field: 'role', 
      message: `Role must be one of: ${validRoles.join(', ')}` 
    });
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

/**
 * Validate login data
 */
exports.validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || email.trim() === '') {
    errors.push({ field: 'email', message: 'Email is required' });
  }

  if (!password || password.trim() === '') {
    errors.push({ field: 'password', message: 'Password is required' });
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

/**
 * Validate pagination parameters
 */
exports.validatePagination = (req, res, next) => {
  const { page, limit } = req.query;

  if (page && (isNaN(page) || parseInt(page) < 1)) {
    return res.status(400).json({
      success: false,
      message: 'Page must be a positive integer'
    });
  }

  if (limit && (isNaN(limit) || parseInt(limit) < 1 || parseInt(limit) > 100)) {
    return res.status(400).json({
      success: false,
      message: 'Limit must be between 1 and 100'
    });
  }

  next();
};