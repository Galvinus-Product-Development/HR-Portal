module.exports = {
    USER_ACCOUNT: {
      type: 'USER_ACCOUNT',
      requiredFields: ['userId', 'userEmail', 'subject', 'message'],
    },
    ORDER: {
      type: 'ORDER',
      requiredFields: ['orderId', 'userId', 'status'],
    },
    PROMOTION: {
      type: 'PROMOTION',
      requiredFields: ['promoId', 'message'],
    },
  };
  