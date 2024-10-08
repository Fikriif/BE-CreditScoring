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
  jenis_kelamin,
  role,
  ktp_photo,
  selfie_photo,
  protocol,
  host
) => {
  // Hash hanya untuk password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Proses dan upload foto
  const ktpImageName = preprocessImage(ktp_photo);
  const selfieImageName = preprocessImage(selfie_photo);

  // Upload foto ke direktori yang diinginkan
  await uploadImage(ktp_photo, ktpImageName, "./src/public/images/ktp");
  await uploadImage(
    selfie_photo,
    selfieImageName,
    "./src/public/images/selfie"
  );

  // Upload foto ke direktori yang diinginkan
  // await uploadImage(ktp_photo, ktpImageName, `${protocol}://${req.get("host")}/src/public/images/ktp`);
  // await uploadImage(
  //   ktp_photo,
  //   ktpImageName,
  //   `${protocol}://${host}/images/ktp`
  // );
  // await uploadImage(
  //   selfie_photo,
  //   selfieImageName,
  //   "./src/public/images/selfie"
  // );

  // Simpan pengguna ke database, termasuk path foto, tapi tidak meng-hash jenis_kelamin
  // const newUser = await insertUser(
  //   nik,
  //   username,
  //   email,
  //   hashedPassword, // Hanya password yang di-hash
  //   jenis_kelamin, // Tidak di-hash
  //   role,
  //   `./src/public/images/ktp/${ktpImageName}`, // Path foto KTP
  //   `./src/public/images/selfie/${selfieImageName}` // Path foto selfie
  // );

  const newUser = await insertUser(
    nik,
    username,
    email,
    hashedPassword, // Hanya password yang di-hash
    jenis_kelamin, // Tidak di-hash
    role,
    `${protocol}://${host}/images/ktp/${ktpImageName}`, // Path foto KTP
    `${protocol}://${host}/images/selfie/${selfieImageName}` // Path foto selfie
  );

  return newUser;
};

const verifyAdmin = async (userId) => {
  const user = await getUserProfileById(userId);
  if (user.role !== "superadmin" && user.role !== "admin") {
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

const updateUserByIdWithImage = async (
  req,
  userId,
  {
    username,
    email,
    role,
    nik,
    jenis_kelamin,
    password,
    ktp_photo,
    selfie_photo,
  }
) => {
  const ktpImage = `${req.protocol}://${req.get(
    "host"
  )}/images/ktp/${ktp_photo}`;

  const selfieImage = `${req.protocol}://${req.get(
    "host"
  )}/images/selfie/${selfie_photo}`;

  let passwordHash = null;

  if (password) {
    passwordHash = await bcrypt.hash(password, 10);
  }

  console.log("ktp: ", ktpImage);
  console.log("selfie: ", selfieImage);

  await getUserProfileById(userId);
  await editUserProfileByIdWithImage(userId, {
    username,
    email,
    role,
    nik,
    jenis_kelamin,
    password: passwordHash,
    ktp_photo: ktpImage,
    selfie_photo: selfieImage,
  });
};

const updateUserByIdWithoutImage = async (
  userId,
  { username, email, role, nik, jenis_kelamin, password }
) => {
  // const passwordHash = await bcrypt.hash(password, 10);
  // console.log(passwordHash);

  let passwordHash = null;

  // Hanya hash password jika diberikan
  if (password) {
    passwordHash = await bcrypt.hash(password, 10);
  }

  // console.log(passwordHash);
  console.log("Password sebelum hashing: ", password);
  console.log("Password setelah hashing: ", passwordHash);

  await getUserProfileById(userId);
  await editUserProfileByIdWithoutImage(userId, {
    username,
    email,
    role,
    nik,
    jenis_kelamin,
    password: passwordHash,
  });
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
  updateUserByIdWithImage,
  updateUserByIdWithoutImage,
  updateUserAccountById,
  getAllUser,
  verifySuperAdmin,
  getCountUser,
  deleteUserByIdService,
};
