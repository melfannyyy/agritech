const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const Admin  = require('../db/Admin/AdminSchema');

const JWT_SECRET = process.env.JWT_SECRET || 'agritech-secret-key-2024';

exports.adminLogin = async (req, resp) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return resp.status(401).json({ message: 'Email atau password salah' });
    }

    const passwordMatches = admin.password?.startsWith('$2')
      ? await bcrypt.compare(password, admin.password)
      : admin.password === password; // fallback for plain-text legacy passwords

    if (!passwordMatches) {
      return resp.status(401).json({ message: 'Email atau password salah' });
    }

    const userData = { _id: admin._id, name: admin.name, email: admin.email, role: 'admin' };
    const token = jwt.sign(
      { id: userData._id, email: userData.email, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    return resp.json({ status: 'success', token, user: userData });
  } catch {
    return resp.status(500).json({ message: 'Server error' });
  }
};

exports.adminSignup = async (req, resp) => {
  const { name, email, password } = req.body;
  try {
    const existing = await Admin.findOne({ email });
    if (existing) {
      return resp.status(409).json({ message: 'Already have an account' });
    }
    const hashed = await bcrypt.hash(password, 10);
    await Admin.create({ name, email, password: hashed });
    return resp.status(201).json({ message: 'Account Created' });
  } catch {
    return resp.status(500).json({ message: 'Server error' });
  }
};
