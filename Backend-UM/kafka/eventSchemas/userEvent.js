module.exports = {
  REGISTERED: {
    type: 'REGISTERED',
    requiredFields: ['userId', 'email', 'timestamp'],
  },
  PASSWORD_RESET: {
    type: 'PASSWORD_RESET',
    requiredFields: ['userId', 'email'],
  },
  LOGIN: {
    type: 'LOGIN',
    requiredFields: ['userId', 'email', 'timestamp'],
  },
};
