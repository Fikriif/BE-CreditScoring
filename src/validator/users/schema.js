const Joi = require("joi");

const UserPayloadSchema = Joi.object({
  username: Joi.string().required().messages({
    "any.required": "Username wajib diisi",
    "string.empty": "Username tidak boleh kosong",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Email harus berupa format email yang valid",
    "any.required": "Email wajib diisi",
    "string.empty": "Email tidak boleh kosong",
  }),
  password: Joi.string().required().messages({
    "any.required": "Password wajib diisi",
    "string.empty": "Password tidak boleh kosong",
  }),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Password dan konfirmasi password harus sama",
    "any.required": "Konfirmasi password wajib diisi",
    "string.empty": "Konfirmasi password tidak boleh kosong",
  }),
  role: Joi.string().valid("user", "admin").required().messages({
    "any.only": 'Role harus salah satu dari "user" atau "admin"',
    "any.required": "Role wajib diisi",
    "string.empty": "Role tidak boleh kosong",
  }),
  nik: Joi.string().required().messages({
    "any.required": "NIK wajib diisi",
    "string.empty": "NIK tidak boleh kosong",
  }),
  jenis_kelamin: Joi.string().valid("male", "female").required().messages({
    "any.only": 'Jenis kelamin harus salah satu dari "male" atau "female"',
    "any.required": "Jenis kelamin wajib diisi",
    "string.empty": "Jenis kelamin tidak boleh kosong",
  }),
});

module.exports = { UserPayloadSchema };
