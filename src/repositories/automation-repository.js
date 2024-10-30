const prisma = require("../database/prisma");

const createAutomation = async (nibUrl, createdAt, updatedAt) => {
  const newAutomation = await prisma.person.create({
    data: {
      created_at: createdAt,
      updated_at: updatedAt,
      url_image_surat_nib: nibUrl,
    },
    select: {
      created_at: true,
      updated_at: true,
      url_image_surat_npwpPribadi: true,
      url_image_surat_nib: true,
      url_image_surat_npwpPerusahaan: true,
      url_image_surat_kdu: true,
      url_image_surat_iup: true,
      url_image_surat_nan: true,
      url_image_surat_tdp: true,
      url_image_surat_id: true,
    },
  });
  return newAutomation;
};

module.exports = {
  createAutomation,
};
