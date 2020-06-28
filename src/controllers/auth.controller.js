const User = require('../models/user');
const passport = require('passport');
const _ = require('lodash');
const userCtrl = {};
const crypto = require('crypto');
const smtpTransport = require('../libs/nodemailer');

userCtrl.register = async (req, res, next) => {
  const user = new User({
    fullname: req.body.fullname,
    email: req.body.email,
    password: req.body.password,
  });
  await user.save((err, doc) => {
    if (!err) res.send(doc);
    else {
      console.log(err);
      if (err.code == 11000)
        res.status(422).send(['Duplicate email adrress found.']);
      else return next(err);
    }
  });
};

userCtrl.authenticate = (req, res, next) => {
  // call for passport authentication
  passport.authenticate('local', (err, user, info) => {
    // error from passport middleware
    if (err) return res.status(400).json(err);
    // registered user
    else if (user) return res.status(200).json({ token: user.generateJwt() });
    // unknown user or wrong password
    else return res.status(404).json(info);
  })(req, res);
};

userCtrl.userProfile = (req, res, next) => {
  User.findOne({ _id: req._id }, (err, user) => {
    if (!user)
      return res
        .status(404)
        .json({ status: false, message: 'User record not found.' });
    else
      return res.status(200).json({
        status: true,
        user: _.pick(user, ['fullname', 'email']),
      });
  });
};

/**
 * Métodos para recuperar la contraseña
 */
userCtrl.putForgotPw = async (req, res) => {
  try {
    const token = await crypto.randomBytes(20).toString('hex');
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({
        message:
          'No existe una cuenta con esa dirección de correo electrónico.',
      });
    }
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();
    const host = process.env.HOST_PROD;
    const msg = {
      to: user.email,
      from: 'SAM 13 Administración <sam13info@sam13.com>',
      subject: 'SAM 13 - Cambio de contraseña',
      text: `Está recibiendo esto porque usted (u otra persona) ha solicitado restablecer la contraseña de su cuenta.
      Haga clic en el siguiente enlace o cópielo y péguelo en su navegador para completar el proceso:
      ${host}/reset/${token}
      Si no solicitó esto, ignore este correo electrónico y su contraseña permanecerá sin cambios.`.replace(
        /      /g,
        ''
      ),
    };
    await smtpTransport.sendMail(msg);
    res.status(200).send({
      message: `Se ha enviado un correo electrónico a ${email} con más instrucciones.`,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message || 'Ocurrio un error no identificado',
    });
  }
};

userCtrl.getReset = async (req, res) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: {
        $gt: Date.now(),
      },
    });
    if (!user) {
      return res.status(400).send({
        message:
          'El token de restablecimiento de contraseña no es válido o ha expirado.',
      });
    }
  } catch (error) {
    res.status(500).send({
      message: error.message || 'Ocurrio un error no identificado',
    });
  }
};

userCtrl.putReset = async (req, res) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: {
        $gt: Date.now(),
      },
    });
    if (!user) {
      return res.status(400).send({
        message:
          'El token de restablecimiento de contraseña no es válido o ha expirado.',
      });
    }
    user.password = req.body.password;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();
    const msg = {
      to: user.email,
      from: 'SAM 13 Administración <sam13info@sam13.com>',
      subject: 'SAM 13 - Contraseña actualizada',
      text: `Hola,
      Este correo electrónico es para confirmar que la contraseña de su cuenta se acaba de cambiar.
      Si no realizó este cambio, pulse responder y notifíquenos de inmediato.`.replace(
        /      /g,
        ''
      ),
    };
    await smtpTransport.sendMail(msg);
    res.status(200).send({
      message: 'Contraseña actualizada correctamente',
    });
  } catch (error) {
    res.status(500).send({
      message: error.message || 'Ocurrio un error no identificado',
    });
  }
};

module.exports = userCtrl;
