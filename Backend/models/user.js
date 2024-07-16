const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const pool = require('../config/database');

class User {
  constructor(user) {
    this.id = user.id;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.email = user.email;
    this.password = user.password;
    this.role = user.role || 'User';
    this.createdAt = user.createdAt || new Date();
    this.resetPasswordToken = user.resetPasswordToken;
    this.resetPasswordTokenExpire = user.resetPasswordTokenExpire;
  }

  async isValidPassword(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  }

  getJwtToken() {
    return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_TIME,
    });
  }

  getResetToken() {
    const resetToken = crypto.randomBytes(20).toString('hex');
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.resetPasswordTokenExpire = Date.now() + 30 * 60 * 1000; // 30 minutes
    return resetToken;
  }

  static async findByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows.length ? new User(rows[0]) : null;
  }
}

module.exports = User;
