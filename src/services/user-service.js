const bcrypt = require("bcrypt");
const {
  insertUser,
  findUserByEmail,
  findUserById,
  editUserAccountById,
  editUserProfileByIdWithImage,
  editUserProfileByIdWithoutImage,
  findAllUser,
  countUser,
} = require("../repositories/user-repository");
const AuthorizationError = require("../exceptions/AuthorizationError");
const InvariantError = require("../exceptions/InvariantError");
const NotFoundError = require("../exceptions/NotFoundError");
const { preprocessImage, uploadImage } = require("../utils");
const { deleteUserById } = require("../repositories/user-repository");

const createUser = async (
  nik,
  username,
  email,
  password,
  role,
  ktp_photo,
  selfie_photo
) => {
  // Hash password sebelum menyimpan ke database
  const hashedPassword = await bcrypt.hash(password, 10);

  // Mengupload file dan mendapatkan path
  const ktpImageName = preprocessImage(ktp_photo);
  const selfieImageName = preprocessImage(selfie_photo);

  // Upload foto ke direktori yang diinginkan
  await uploadImage(ktp_photo, ktpImageName, "./src/public/images/ktp");
  await uploadImage(
    selfie_photo,
    selfieImageName,
    "./src/public/images/selfie"
  );

  // Simpan pengguna ke database, termasuk path foto
  const newUser = await insertUser(
    nik,
    username,
    email,
    hashedPassword, // Simpan password yang sudah di-hash
    role,
    `./src/public/images/ktp/${ktpImageName}`, // Path foto KTP
    `./src/public/images/selfie/${selfieImageName}` // Path foto selfie
  );

  return newUser;
};

const verifyAdmin = async (userId) => {
  const user = await getUserProfileById(userId);
  if (user.role !== "admin") {
    throw new AuthorizationError("Anda tidak berhak mengakses resource ini");
  }
};

const checkEmail = async (email) => {
  const user = await findUserByEmail(email);
  if (user) {
    throw new InvariantError("Email sudah digunakan");
  }
};

const getUserProfileById = async (userId) => {
  const user = await findUserById(userId);
  if (!user) {
    throw new NotFoundError("Profil tidak ditemukan");
  }
  return user;
};

// const updateUserProfileByIdWithImage = async (
//   req,
//   userId,
//   { username, imageName }
// ) => {
//   const urlImage = `${req.protocol}://${req.get(
//     "host"
//   )}/images/profile/${imageName}`;
//   await getUserProfileById(userId);
//   await editUserProfileByIdWithImage(userId, { username, urlImage });
// };

// const updateUserProfileByIdWithoutImage = async (userId, { username }) => {
//   await getUserProfileById(userId);
//   await editUserProfileByIdWithoutImage(userId, { username });
// };

const updateUserProfileByIdWithImage = async (
  req,
  userId,
  { username, email, role, nik, imageName }
) => {
  const urlImage = `${req.protocol}://${req.get(
    "host"
  )}/images/profile/${imageName}`;
  await getUserProfileById(userId);
  await editUserProfileByIdWithImage(userId, {
    username,
    email,
    role,
    nik,
    urlImage,
  });
};

const updateUserProfileByIdWithoutImage = async (
  userId,
  { username, email, role, nik }
) => {
  await getUserProfileById(userId);
  await editUserProfileByIdWithoutImage(userId, { username, email, role, nik });
};

const updateUserAccountById = async (userId, data) => {
  await getUserProfileById(userId);
  await editUserAccountById(userId, data);
};

const getAllUser = async (size, skip) => {
  const users = await findAllUser(size, skip);
  return users;
};

const verifySuperAdmin = async (userId) => {
  const user = await getUserProfileById(userId);
  if (user.email !== "admin@gmail.com") {
    throw new AuthorizationError("Anda tidak berhak mengakses resource ini");
  }
};

const getCountUser = async () => {
  const total = await countUser();
  return total;
};

const deleteUserByIdService = async (userId) => {
  // Cek apakah user ada di database
  const user = await getUserProfileById(userId);

  if (!user) {
    throw new NotFoundError("User tidak ditemukan");
  }

  // Hapus user
  await deleteUserById(userId);
};

module.exports = {
  createUser,
  verifyAdmin,
  checkEmail,
  getUserProfileById,
  updateUserProfileByIdWithImage,
  updateUserProfileByIdWithoutImage,
  updateUserAccountById,
  getAllUser,
  verifySuperAdmin,
  getCountUser,
  deleteUserByIdService,
};
