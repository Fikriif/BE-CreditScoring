const moment = require("moment-timezone");
const { v4: uuidv4 } = require("uuid");
const {
  createRequest,
  findAllRequestByOwner,
  findRequestById,
  countRequestByOwner,
  findAllRequestByOwnerFilteredByJenisPermintaan,
  countRequestByOwnerFilteredByJenisPermintaan,
} = require("../repositories/request-repository");
const NotFoundError = require("../exceptions/NotFoundError");

const postRequest = async (sum, finishedAt, jenisPermintaan, userId) => {
  const generateShortUUID = () => {
    let shortUUID;
    do {
      const uuid = uuidv4().replace(/-/g, "");
      shortUUID = uuid.substring(0, 8);
    } while (shortUUID.charAt(0) !== "0");
    return shortUUID;
  };

  const id = generateShortUUID();
  const timezone = "Asia/Jakarta";
  const createdAt = moment().tz(timezone).format("DD/MM/YY HH:mm:ss");
  await createRequest(id, jenisPermintaan, sum, createdAt, finishedAt, userId);
  return id;
};

const getAllRequestByOwner = async (owner, size, skip) => {
  const requests = await findAllRequestByOwner(owner, size, skip);
  return requests;
};

const getAllRequestByOwnerFilteredByJenisPermintaan = async (
  owner,
  size,
  skip,
  jenisPermintaan
) => {
  const requests = await findAllRequestByOwnerFilteredByJenisPermintaan(
    owner,
    size,
    skip,
    jenisPermintaan
  );
  return requests;
};

const getRequestById = async (id) => {
  const request = await findRequestById(id);

  if (!request) {
    throw new NotFoundError("Request tidak ditemukan");
  }

  return request;
};

const getCountRequestByOwner = async (owner) => {
  const total = await countRequestByOwner(owner);
  return total;
};

const getCountRequestByOwnerFilteredByJenisPermintaan = async (
  owner,
  jenisPermintaan
) => {
  const total = await countRequestByOwnerFilteredByJenisPermintaan(
    owner,
    jenisPermintaan
  );
  return total;
};

module.exports = {
  postRequest,
  getAllRequestByOwner,
  getRequestById,
  getCountRequestByOwner,
  getAllRequestByOwnerFilteredByJenisPermintaan,
  getCountRequestByOwnerFilteredByJenisPermintaan,
};
