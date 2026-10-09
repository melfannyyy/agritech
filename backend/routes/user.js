const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'agritech-secret-key-2024';

// POST /users/register
router.post('/register', async (req, res) => {
    const { name, email, password, phone, address, role } = req.body;

    if (!password || password.length < 6) {
        return res.status(400).json({ message: 'Password minimal 6 karakter' });
    }

    try {
        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(409).json({ message: 'Email sudah terdaftar' });
        }

        await User.create({
            name,
            email,
            password: await bcrypt.hash(password, 10),
            phone:   phone   || '',
            address: address || '',
            role:    role    || 'farmer',
            status:  'pending',          // must be approved by admin before login
        });

        // No token returned — user must wait for admin approval
        res.status(201).json({ status: 'pending', message: 'Registrasi berhasil. Akun Anda sedang menunggu persetujuan admin.' });
    } catch (err) {
        console.error('Error during registration:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /users/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Email atau password salah' });
        }

        // Block login if account not approved (farmers only — admins bypass status check)
        // Only block on explicit 'pending'/'rejected' — existing users with no status field can still log in
        if (user.role !== 'admin' && user.status) {
            if (user.status === 'pending') {
                return res.status(403).json({ message: 'Akun Anda sedang menunggu persetujuan admin.' });
            }
            if (user.status === 'rejected') {
                return res.status(403).json({ message: 'Akun Anda ditolak oleh admin. Hubungi administrator untuk informasi lebih lanjut.' });
            }
        }

        // Support both bcrypt-hashed and plain-text passwords
        const passwordMatches = user.password?.startsWith('$2')
            ? await bcrypt.compare(password, user.password)
            : user.password === password;

        if (!passwordMatches) {
            return res.status(401).json({ message: 'Email atau password salah' });
        }

        const userData = { _id: user._id, name: user.name, email: user.email, role: user.role || 'farmer' };
        const token = jwt.sign(
            { id: userData._id, email: userData.email, role: userData.role },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({ status: 'success', token, user: userData });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT /users/:id/status  — admin approve / reject
router.put('/:id/status', async (req, res) => {
    const { status } = req.body;
    if (!['approved', 'rejected', 'pending'].includes(status)) {
        return res.status(400).json({ message: 'Status tidak valid' });
    }
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });
        res.json({ message: `Status berhasil diubah menjadi ${status}`, user });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
