const prisma = require("../database/prisma");
const ClientError = require("../exceptions/ClientError");

const insertUser = async (
  nik,
  username,
  email,
  hashedPassword, // Ini adalah hashed password
  jenis_kelamin, // Tidak di-hash
  role,
  ktpPhotoPath,
  selfiePhotoPath
) => {
  const newUser = await prisma.user.create({
    data: {
      nik: nik,
      username: username,
      email: email,
      password: hashedPassword, // Password yang sudah di-hash
      jenis_kelamin: jenis_kelamin, // Tidak di-hash
      role: role,
      ktpPhoto: ktpPhotoPath,
      selfiePhoto: selfiePhotoPath,
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
      jenis_kelamin: true,
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

const editUserProfileByIdWithImage = async (userId, data) => {
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
      ktpPhoto: data.ktp_photo, // Update KTP photo
      selfiePhoto: data.selfie_photo, // Update selfie photo
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

  // Update hanya field yang ada
  const updateData = {
    username: data.username,
    email: data.email,
    role: data.role,
    nik: data.nik, // Update NIK di sini juga
  };

  // Jika password disediakan, tambahkan ke data yang akan di-update
  if (data.password) {
    updateData.password = data.password; // password yang sudah di-hash
  }

  try {
    return prisma.user.update({
      where: { id: parseInt(userId) },
      data: updateData, // Kirim data yang sudah disaring
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

  // try {
  //   return prisma.user.update({
  //     where: { id: parseInt(userId) },
  //     data: {
  //       username: data.username,
  //       email: data.email,
  //       role: data.role,
  //       nik: data.nik, // Update NIK di sini juga
  //       password: data.password,
  //     },
  //   });
  // } catch (error) {
  //   if (error.code === "P2002") {
  //     // Prisma error code for unique constraint violation
  //     if (error.meta && error.meta.target.includes("email")) {
  //       throw new ClientError("Email sudah digunakan oleh user lain.", 400); // Lempar error
  //     } else if (error.meta && error.meta.target.includes("nik")) {
  //       throw new ClientError("NIK sudah digunakan oleh user lain.", 400); // Lempar error
  //     }
  //   }
  //   throw error; // Lemparkan error lain ke controller
  // }
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
