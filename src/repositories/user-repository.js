const prisma = require("../database/prisma");
const ClientError = require("../exceptions/ClientError");

const insertUser = async (
  nik,
  username,
  email,
  hashedPassword,
  role,
  ktpPhotoPath,
  selfiePhotoPath
) => {
  const newUser = await prisma.user.create({
    data: {
      nik: nik,
      username: username,
      email: email,
      password: hashedPassword, // Simpan hashed password
      role: role,
      ktpPhoto: ktpPhotoPath, // Path foto KTP
      selfiePhoto: selfiePhotoPath, // Path foto selfie
    },
  });

  return newUser;
};

const findUserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      img_profile: true,
    },
  });
  return user;
};

const findUserByEmail = async (email) => {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  return user;
};

// const editUserProfileByIdWithImage = async (userId, { username, urlImage }) => {
//   await prisma.user.update({
//     where: {
//       id: userId,
//     },
//     data: {
//       username: username,
//       img_profile: urlImage,
//     },
//   });
// };

// const editUserProfileByIdWithoutImage = async (userId, { username }) => {
//   await prisma.user.update({
//     where: {
//       id: userId,
//     },
//     data: {
//       username: username,
//     },
//   });
// };

// Jika ada gambar yang diupdate

const editUserProfileByIdWithImage = async (req, userId, data) => {
  const existingUserWithEmail = await prisma.user.findFirst({
    where: {
      email: data.email,
      id: {
        not: parseInt(userId), // Kecualikan user yang sedang di-update
      },
    },
  });

  if (existingUserWithEmail) {
    throw new ClientError("Email sudah digunakan oleh user lain.");
  }

  // Cek apakah NIK sudah digunakan oleh user lain
  const existingUserWithNik = await prisma.user.findFirst({
    where: {
      nik: data.nik,
      id: {
        not: parseInt(userId), // Kecualikan user yang sedang di-update
      },
    },
  });

  if (existingUserWithNik) {
    throw new ClientError("NIK sudah digunakan oleh user lain.");
  }

  return prisma.user.update({
    where: { id: userId },
    data: {
      username: data.username,
      email: data.email,
      role: data.role,
      nik: data.nik, // Update NIK di sini
      ktp_photo: data.ktp_photo, // Update KTP photo
      selfie_photo: data.selfie_photo, // Update selfie photo
    },
  });
};

// Jika tidak ada gambar yang diupdate
const editUserProfileByIdWithoutImage = async (userId, data) => {
  const existingUserWithEmail = await prisma.user.findFirst({
    where: {
      email: data.email,
      id: {
        not: parseInt(userId), // Kecualikan user yang sedang di-update
      },
    },
  });

  if (existingUserWithEmail) {
    throw new ClientError("Email sudah digunakan oleh user lain.");
  }

  // Cek apakah NIK sudah digunakan oleh user lain
  const existingUserWithNik = await prisma.user.findFirst({
    where: {
      nik: data.nik,
      id: {
        not: parseInt(userId), // Kecualikan user yang sedang di-update
      },
    },
  });

  if (existingUserWithNik) {
    throw new ClientError("NIK sudah digunakan oleh user lain.");
  }

  try {
    return prisma.user.update({
      where: { id: parseInt(userId) },
      data: {
        username: data.username,
        email: data.email,
        role: data.role,
        nik: data.nik, // Update NIK di sini juga
      },
    });
  } catch (error) {
    if (error.code === "P2002") {
      // Prisma error code for unique constraint violation
      if (error.meta && error.meta.target.includes("email")) {
        throw new ClientError("Email sudah digunakan oleh user lain.", 400); // Lempar error
      } else if (error.meta && error.meta.target.includes("nik")) {
        throw new ClientError("NIK sudah digunakan oleh user lain.", 400); // Lempar error
      }
    }
    throw error; // Lemparkan error lain ke controller
  }
};

const editUserAccountById = async (userId, data) => {
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      password: data.password,
    },
  });
};

const findAllUser = async (size, skip) => {
  const users = prisma.user.findMany({
    take: size,
    skip: skip,
    select: {
      id: true,
      username: true,
      email: true,
      password: true,
      role: true,
      img_profile: true,
      nik: true,
      ktpPhoto: true,
      selfiePhoto: true,
    },
  });
  return users;
};

const countUser = async () => {
  const count = await prisma.user.count();
  return count;
};

const deleteUserById = async (userId) => {
  try {
    await prisma.user.delete({
      where: {
        id: userId,
      },
    });
  } catch (error) {
    throw new Error("Error saat menghapus user");
  }
};

module.exports = {
  insertUser,
  findUserById,
  findUserByEmail,
  editUserProfileByIdWithImage,
  editUserProfileByIdWithoutImage,
  editUserAccountById,
  findAllUser,
  countUser,
  deleteUserById,
};
