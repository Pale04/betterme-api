const { response }         = require('express');
const mongoose   = require('mongoose');
require('../models/verificationCode');
require('../models/existingUserVerificationCode');
const VerificationCode = mongoose.model('VerificationCode');
const ExistingUserVerificationCode = mongoose.model('ExistingUserVerificationCode');
console.log('DEBUG methods →', Object.keys(VerificationCode));
console.log('findOne →', typeof VerificationCode.findOne);      // should print: function
console.log('deleteMany →', typeof VerificationCode.deleteMany); //           : function
const transporter          = require('../middleware/transporter');
const axios                = require('axios');
const existingUserVerificationCode = require('../models/existingUserVerificationCode');


// POST /api/verify/initiate
// Body: { username, name, email, birthday, password, … }
const initiateVerification = async (req, res = response) => {
    const payload = req.body;
    const { email } = payload;

  const code = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    await VerificationCode.deleteMany({ email, code });

    await VerificationCode.create({ email, code, payload });

    await transporter.sendMail({
      from:    `"BetterMe" <${process.env.SMTP_USER}>`,
      to:      email,
      subject: 'Código de verificación BetterMe',
      text:    `Tu código de verificación es: ${code}`,
      html:    `<p>Tu código de verificación es: <strong>${code}</strong></p>`
    });

    res.status(200).json({ msg: 'Código enviado' });
  } catch (err) {
    console.error('verification.initiate error ➜', err);
    res.status(500).json({ msg: 'Error al enviar código' });
  }
};

// POST /api/verify/confirm
// Body: { email, code }
const confirmVerification = async (req, res = response) => {
    const { email, code } = req.body;

  try {
    const record = await VerificationCode.findOneAndDelete({ email, code });
    if (!record) {
      return res.status(400).json({ msg: 'Código inválido o expirado' });
    }

    const resp = await axios.post(
      `${process.env.USERS_API}/api/users`,
      record.payload
    );

    res.status(resp.status).json(resp.data);
  } catch (err) {
    console.error('verification.confirm error ➜', err.response?.data || err);
    const status = err.response?.status || 500;
    const msg    = err.response?.data?.msg || 'Error al crear cuenta';
    res.status(status).json({ msg });
  }
};

// POST /api/verify/existent/initiate
// Body: { email }
const initiateVerificationExistent = async (req, res = response) => {
    const { email } = req.body;

  const code = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    await ExistingUserVerificationCode.deleteMany({ email, code });

    await ExistingUserVerificationCode.create({ email, code });

    await transporter.sendMail({
      from:    `"BetterMe" <${process.env.SMTP_USER}>`,
      to:      email,
      subject: 'Código de verificación BetterMe',
      text:    `Tu código de verificación es: ${code}`,
      html:    `<p>Tu código de verificación es: <strong>${code}</strong></p>`
    });

    res.status(200).json({ msg: 'Código enviado' });
  } catch (err) {
    console.error('verification.initiate error ➜', err);
    res.status(500).json({ msg: 'Error al enviar código' });
  }
};

// POST /api/verify/existent/confirm
// Body: { email, code }
const confirmVerificationExistent = async (req, res = response) => {
    const { email, code } = req.body;
  try {
    const found = await ExistingUserVerificationCode.findOne({email,code});

    if (!found) {
      return res.status(400).json({ msg: 'Código inválido o expirado' });
    }
    else{
      await ExistingUserVerificationCode.findOneAndDelete({ email, code });
      res.status(200).json({ msg: 'Verificado correctamente' });
    }

  } catch (err) {
    console.error('verification.confirm error ➜', err.response?.data || err);
    const status = err.response?.status || 500;
    const msg    = err.response?.data?.msg || 'Error al crear cuenta';
    res.status(status).json({ msg });
  }
};

module.exports = {
  initiateVerification,
  confirmVerification,
  initiateVerificationExistent,
  confirmVerificationExistent
};
