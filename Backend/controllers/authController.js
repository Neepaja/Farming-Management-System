const bcrypt = require('bcrypt');
const pool = require('../config/database'); // Adjust path accordingly
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, role } = req.body;
        console.log(firstName, lastName, email, password, role);

        // Check if user already exists
        const [existingUser] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ success: false, message: 'Email already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into database
        const [result] = await pool.query(
            'INSERT INTO users (firstName, lastName, email, password, role) VALUES (?, ?, ?, ?, ?)',
            [firstName, lastName, email, hashedPassword, role]
        );
        console.log("result , ", result);

        const insertedId = result.insertId;

        const user = {
            id: insertedId,
            firstName,
            lastName,
            email,
            role,
            createdAt: new Date(),
        };

        // Generate JWT token
        const token = jwt.sign({ id: insertedId }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_TIME,
        });
        res.cookie('token', token, {
          httpOnly: true,
      });
        res.status(201).json({ success: true, message: 'User registered successfully', user, token });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};


exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const [userResult] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (userResult.length === 0) {
            return res.status(400).json({ success: false, message: 'Invalid email or password' });
        }

        const user = userResult[0];

        // Check if password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_TIME,
        });

        // Send token in a cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Ensure the cookie is sent only over HTTPS in production
        });

        // Send response with user details (excluding password)
        const { id, firstName, lastName, role, createdAt } = user;
        res.status(200).json({ success: true, message: 'Login successful', user: { id, firstName, lastName, email, role, createdAt }, token });

    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};