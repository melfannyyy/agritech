const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.userLogin = async (req, resp) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return resp.status(401).json({ message: 'Email atau password salah' });
    }

    const passwordMatches = user.password?.startsWith('$2')
      ? await bcrypt.compare(password, user.password)
      : user.password === password;

    if (!passwordMatches) {
      return resp.status(401).json({ message: 'Email atau password salah' });
    }

    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role || 'farmer',
    };
    const token = jwt.sign(
      { id: userData._id, email: userData.email, role: userData.role },
      process.env.JWT_SECRET || 'agritech-secret-key-2024',
      { expiresIn: '1d' }
    );

    return resp.json({ status: 'success', token, user: userData });
  } catch {
    return resp.status(500).json({ message: 'Server error' });
  }
};

exports.userSignup = (req, resp) => {
  const { name, email, password } = req.body;
  User.findOne({ email: email })
    .then(use => {
      if (use) {
        resp.json("Already have an account");
      } else {
        bcrypt.hash(password, 10)
          .then(hashed => User.create({ email: email, name: name, password: hashed }))
          .then(result => resp.json("Account Created"))
          .catch(err => resp.json(err));
      }
    }).catch(err => resp.json("failed"));
};

exports.getAllUsers = (req, res) => {
  User.find().select('-password')
    .then((users) => {
      res.status(200).json({ data: users });
    })
    .catch(() => {
      res.sendStatus(500);
    });
};

exports.getUserById = (req, res) => {
  const id = req.params.id;
  User.findById({ _id: id }).select('-password')
    .then((user) => {
      res.status(200).json(user);
    })
    .catch(() => {
      res.sendStatus(500);
    });
};

exports.updateUser = async (req, res) => {
  const id = req.params.id;
  const { name, email, password, phone, address, role } = req.body;
  const update = {};
  if (name    !== undefined) update.name    = name;
  if (email   !== undefined) update.email   = email;
  if (phone   !== undefined) update.phone   = phone;
  if (address !== undefined) update.address = address;
  if (role    !== undefined) update.role    = role;
  try {
    // Password kosong = tidak diubah; password baru selalu disimpan sebagai hash bcrypt
    if (password !== undefined && password !== '') {
      if (password.length < 6) {
        return res.status(400).json({ message: 'Password minimal 6 karakter' });
      }
      update.password = await bcrypt.hash(password, 10);
    }
    const updatedUser = await User.findByIdAndUpdate(id, update, { new: true }).select('-password');
    if (!updatedUser) return res.status(404).json({ message: 'User tidak ditemukan' });
    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.deleteUser = (req, res) => {
  let id = req.params.id;
  User.deleteOne({ _id: id })
    .then((user) => {
      res.status(200).json(user);
    })
    .catch(() => {
      res.sendStatus(500);
    });
};
