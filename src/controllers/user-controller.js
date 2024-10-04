const express = require("express");
const prisma = require("../database/prisma");
const {
  verifyAdmin,
  checkEmail,
  createUser,
  getUserProfileById,
  getAllUser,
  getCountUser,
  deleteUserByIdService,
  updateUserByIdWithImage,
  updateUserByIdWithoutImage,
} = require("../services/user-service");

const ClientError = require("../exceptions/ClientError");
const UsersValidator = require("../validator/users");
const { preprocessImage, uploadImage } = require("../utils");
const { findUserById } = require("../repositories/user-repository");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const userId = req.userId;
    await verifyAdmin(userId);

    // Validasi payload
    UsersValidator.validateUserPayload(req.body);

    const {
      nik,
      username,
      email,
      password,
      confirmPassword, // untuk validasi
      role,
      jenis_kelamin,
    } = req.body;
    const { ktp_photo, selfie_photo } = req.files;

    // Validasi file upload manual
    if (!ktp_photo) {
      return res.status(400).send({
        error: true,
        message: "Foto KTP wajib di-upload",
      });
    }

    // Validasi file upload manual
    if (!selfie_photo) {
      return res.status(400).send({
        error: true,
        message: "Foto selfie wajib di-upload",
      });
    }

    // Validasi field tidak boleh kosong
    if (!nik || !username || !email || !password || !role || !jenis_kelamin) {
      return res.status(400).send({
        error: "true",
        message:
          "nik, username, email, password, jenis kelamin atau role belum diisi",
      });
    }

    // cocokan password dengan condirmPassword
    if (password !== confirmPassword) {
      res.status(400).send({
        error: true,
        message: "Password dan konfirmasi password tidak cocok",
      });
    }

    // Hapus confirmPassword dari objek yang akan disimpan ke database
    delete req.body.confirmPassword;

    // console.log(ktp_photo);
    const protocol = req.protocol;
    const host = req.get("host");
    // Lanjutkan ke proses pembuatan user
    await checkEmail(email);
    await createUser(
      nik,
      username,
      email,
      password,
      jenis_kelamin,
      role,
      ktp_photo,
      selfie_photo,
      protocol,
      host
    );

    // console.log(object);
    // Berikan respon berhasil ke front-end
    return res.status(201).send({
      error: false,
      message: "Akun berhasil dibuat",
      result: {
        nik,
        username,
        jenis_kelamin,
        email,
        password,
        role,
      },
    });
  } catch (error) {
    if (error instanceof ClientError) {
      return res.status(error.statusCode).send({
        error: true,
        message: error.message,
      });
    }
    if (error.code === "P2002") {
      const field = error.meta.target[0]; // Mendapatkan field yang menyebabkan error
      return res.status(400).send({
        error: true,
        message: `${
          field === "nik" ? "NIK" : "Email"
        } sudah terdaftar. Gunakan ${
          field === "nik" ? "NIK" : "Email"
        } yang lain.`,
      });
    }

    console.log(error);
    console.error(error.message);
    return res.status(500).send({
      error: true,
      message: "Internal Server Error",
    });
  } finally {
    await prisma.$disconnect();
  }
});

router.get("/", async (req, res) => {
  const userId = req.userId;

  try {
    const user = await getUserProfileById(userId);
    return res.status(200).send({
      error: false,
      data: {
        user,
      },
    });
  } catch (error) {
    if (error instanceof ClientError) {
      return res.status(error.statusCode).send({
        error: true,
        message: error.message,
      });
    }

    console.error(error.message);
    return res.status(500).send({
      error: true,
      message: "Internal Server Error",
    });
  } finally {
    await prisma.$disconnect();
  }
});

router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const userId = parseInt(id);
  const { username, email, role, nik, password } = req.body;

  if (req.files) {
    try {
      const { ktp_photo, selfie_photo } = req.files;

      const ktpImageName = preprocessImage(ktp_photo);
      await uploadImage(ktp_photo, ktpImageName, "./src/public/images/ktp");

      const selfieImageName = preprocessImage(selfie_photo);
      await uploadImage(
        selfie_photo,
        selfieImageName,
        "./src/public/images/selfie"
      );

      // await updateUserProfileByIdWithImage(req, userId, {
      //   username,
      //   email,
      //   role,
      //   nik,
      //   ktp_photo: ktpImageName,
      //   selfie_photo: selfieImageName,
      // });
      await updateUserByIdWithImage(req, userId, {
        username,
        email,
        role,
        nik,
        ktp_photo: ktpImageName,
        selfie_photo: selfieImageName,
      });

      return res.status(200).send({
        error: false,
        message: "Profil berhasil diperbarui dengan gambar",
      });
    } catch (error) {
      if (error instanceof ClientError) {
        return res.status(error.statusCode).send({
          error: true,
          message: error.message,
        });
      }
      console.error(error.message);
      return res.status(500).send({
        error: true,
        message: "Internal Server Error",
      });
    } finally {
      await prisma.$disconnect();
    }
  }

  // Jika tidak ada gambar yang diupload, update field yang ada
  try {
    await updateUserByIdWithoutImage(userId, {
      username,
      email,
      role,
      nik,
      password,
    });

    return res.status(200).send({
      error: false,
      message: "Profil berhasil diperbarui tanpa gambar",
    });
  } catch (error) {
    if (error instanceof ClientError) {
      return res.status(error.statusCode).send({
        error: true,
        message: error.message, // Kirim pesan error yang spesifik
      });
    }

    console.error("Error during PATCH user: ", error.message);
    return res.status(500).send({
      error: true,
      message: "Internal Server Error", // Untuk error lainnya
    });
  } finally {
    await prisma.$disconnect();
  }
});

router.get("/list", async (req, res) => {
  try {
    const userId = req.userId;
    await verifyAdmin(userId);

    const size = parseInt(req.query.size) || 5;
    const current = parseInt(req.query.current) || 1;
    const skip = (current - 1) * size;

    const users = await getAllUser(size, skip);
    const totalUsers = await getCountUser();
    const totalPages = Math.ceil(totalUsers / size);

    return res.status(200).send({
      error: false,
      data: {
        users,
      },
      page: {
        size,
        total: totalUsers,
        totalPages,
        current,
      },
    });
  } catch (error) {
    if (error instanceof ClientError) {
      return res.status(error.statusCode).send({
        error: true,
        message: error.message,
      });
    }

    console.error(error.message);
    return res.status(500).send({
      error: true,
      message: "Internal Server Error",
    });
  } finally {
    await prisma.$disconnect();
  }
});

router.delete("/:id", async (req, res) => {
  const userId = req.userId;
  const { id } = req.params;
  try {
    const parseId = parseInt(id);
    const user = await findUserById(parseId);
    await verifyAdmin(userId);
    await deleteUserByIdService(parseId);
    return res.status(200).send({
      error: false,
      message: `User ${user.username} has been deleted`,
    });
  } catch (error) {
    console.error("Error during DELETE user: ", error); // Tambahkan log error ini
    if (error instanceof ClientError) {
      return res.status(error.statusCode).send({
        error: true,
        message: error.message,
      });
    }
    console.error(error.message);
    return res.status(500).send({
      error: true,
      message: "Terjadi kesalahan pada server",
    });
  } finally {
    await prisma.$disconnect();
  }
});

module.exports = router;
