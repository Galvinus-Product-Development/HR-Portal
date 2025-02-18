const sendEmail = require('../utils/sendEmail'); // Your utility for sending emails

class NotificationController {
  static async sendLoginNotification(user, deviceInfo) {
    const message = `
      Hi ${user.name},
      
      You logged in from ${deviceInfo.deviceName} (${deviceInfo.os}) at ${new Date().toLocaleString()}. 
      If this wasn't you, please reset your password immediately.
    `;
    await sendEmail(user.email, 'Login Notification', message);
  }

  static async sendLogoutNotification(user) {
    const message = `
      Hi ${user.name},
      
      You logged out at ${new Date().toLocaleString()}. 
      If this wasn't you, please contact support.
    `;
    await sendEmail(user.email, 'Logout Notification', message);
  }

  static async sendPasswordResetNotification(user, type) {
    const message =
      type === 'request'
        ? `Hi ${user.name},
        
        A password reset request was made for your account at ${new Date().toLocaleString()}. 
        If this wasn't you, please contact support.`
        : `Hi ${user.name},
        
        Your password was successfully reset at ${new Date().toLocaleString()}. 
        If this wasn't you, please secure your account immediately.`;

    await sendEmail(user.email, 'Password Reset Notification', message);
  }
}

module.exports = NotificationController;
