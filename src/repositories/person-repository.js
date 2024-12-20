const prisma = require("../database/prisma");

const findPersonByUserIdAndNIK = async (userId, nik) => {
  const person = await prisma.person.findFirst({
    where: {
      AND: [{ owner: userId }, { nik: nik }],
    },
  });
  return person;
};

const createPerson = async (
  nik,
  createdAt,
  updatedAt,
  nama,
  jenisKelamin,
  alamat,
  tempatLahir,
  tanggalLahir,
  umur,
  golonganDarah,
  rt,
  rw,
  kelurahan,
  kecamatan,
  agama,
  status,
  pekerjaan,
  kewarganegaraan,
  urlKTP,
  urlSelfie,
  ktpPath,
  selfiePath,
  userId
) => {
  const newPerson = await prisma.person.create({
    data: {
      nik: nik,
      created_at: createdAt,
      updated_at: updatedAt,
      nama: nama,
      jenis_kelamin: jenisKelamin,
      alamat: alamat,
      tempat_lahir: tempatLahir,
      tanggal_lahir: tanggalLahir,
      umur: umur,
      gol_darah: golonganDarah,
      rt: rt,
      rw: rw,
      kelurahan: kelurahan,
      kecamatan: kecamatan,
      agama: agama,
      status: status,
      pekerjaan: pekerjaan,
      kewarganegaraan: kewarganegaraan,
      url_image_ktp: urlKTP,
      url_image_selfie: urlSelfie,
      path_image_ktp: ktpPath,
      path_image_selfie: selfiePath,
      owner: userId,
    },
  });

  return newPerson;
};

const findAllPersonByOwner = async (owner, size, skip) => {
  const persons = await prisma.person.findMany({
    where: {
      owner: owner,
    },
    take: size,
    skip: skip,
    orderBy: {
      created_at: "desc",
    },
  });
  return persons;
};

const findAllPersonByOwnerFilteredByNIK = async (owner, size, skip, nik) => {
  const persons = await prisma.person.findMany({
    where: {
      owner: owner,
      nik: {
        contains: nik,
        mode: "insensitive",
      },
    },
    take: size,
    skip: skip,
    orderBy: {
      created_at: "desc",
    },
  });
  return persons;
};

const findAllPersonByOwnerFilteredByNama = async (owner, size, skip, nama) => {
  const persons = await prisma.person.findMany({
    where: {
      owner: owner,
      nama: {
        contains: nama,
        mode: "insensitive",
      },
    },
    take: size,
    skip: skip,
    orderBy: {
      created_at: "desc",
    },
  });
  return persons;
};

const findAllPersonByOwnerHaveReports = async (owner, size, skip) => {
  const persons = await prisma.person.findMany({
    where: {
      owner: owner,
      reports: {
        some: {},
      },
    },
    take: size,
    skip: skip,
    orderBy: {
      created_at: "desc",
    },
  });
  return persons;
};

const findAllPersonByOwnerHaveReportsFilteredByNIK = async (
  owner,
  size,
  skip,
  nik
) => {
  const persons = await prisma.person.findMany({
    where: {
      owner: owner,
      reports: {
        some: {},
      },
      nik: {
        contains: nik,
        mode: "insensitive",
      },
    },
    take: size,
    skip: skip,
    orderBy: {
      created_at: "desc",
    },
  });
  return persons;
};

const findAllPersonByOwnerHaveReportsFilteredByNama = async (
  owner,
  size,
  skip,
  nama
) => {
  const persons = await prisma.person.findMany({
    where: {
      owner: owner,
      reports: {
        some: {},
      },
      nama: {
        contains: nama,
        mode: "insensitive",
      },
    },
    take: size,
    skip: skip,
    orderBy: {
      created_at: "desc",
    },
  });
  return persons;
};

const countPersonByOwner = async (owner) => {
  const count = await prisma.person.count({
    where: {
      owner: owner,
    },
  });
  return count;
};

const countPersonByOwnerFilteredByNIK = async (owner, nik) => {
  const count = await prisma.person.count({
    where: {
      owner: owner,
      nik: {
        contains: nik,
        mode: "insensitive",
      },
    },
  });
  return count;
};

const countPersonByOwnerFilteredByNama = async (owner, nama) => {
  const count = await prisma.person.count({
    where: {
      owner: owner,
      nama: {
        contains: nama,
        mode: "insensitive",
      },
    },
  });
  return count;
};

const countPersonByOwnerHaveReports = async (owner) => {
  const count = await prisma.person.count({
    where: {
      owner: owner,
      reports: {
        some: {},
      },
    },
  });
  return count;
};

const countPersonByOwnerHaveReportsFilteredByNIK = async (owner, nik) => {
  const count = await prisma.person.count({
    where: {
      owner: owner,
      reports: {
        some: {},
      },
      nik: {
        contains: nik,
        mode: "insensitive",
      },
    },
  });
  return count;
};

const countPersonByOwnerHaveReportsFilteredByNama = async (owner, nama) => {
  const count = await prisma.person.count({
    where: {
      owner: owner,
      reports: {
        some: {},
      },
      nama: {
        contains: nama,
        mode: "insensitive",
      },
    },
  });
  return count;
};

const findPersonById = async (id) => {
  return await prisma.person.findUnique({
    where: { id },
  });
};

const updatePersonData = async (id, data, partial = false) => {
  if (partial) {
    const currentData = await findPersonById(id);
    data = { ...currentData, ...data };
  }

  return await prisma.person.update({
    where: { id },
    data,
  });
};

const deletePersonById = async (id) => {
  await prisma.report.deleteMany({
    where: { id_person: id },
  });

  return await prisma.person.delete({
    where: { id },
  });
};


module.exports = {
  findPersonByUserIdAndNIK,
  createPerson,
  findAllPersonByOwner,
  countPersonByOwner,
  findAllPersonByOwnerHaveReports,
  countPersonByOwnerHaveReports,
  findAllPersonByOwnerHaveReportsFilteredByNIK,
  findAllPersonByOwnerHaveReportsFilteredByNama,
  countPersonByOwnerHaveReportsFilteredByNIK,
  countPersonByOwnerHaveReportsFilteredByNama,
  findAllPersonByOwnerFilteredByNIK,
  findAllPersonByOwnerFilteredByNama,
  countPersonByOwnerFilteredByNIK,
  countPersonByOwnerFilteredByNama,
  findPersonById,
  updatePersonData,
  deletePersonById,
};
