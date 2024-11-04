const prisma = require("../database/prisma");

const createAutomation = async (createdAt, updatedAt, nibUrl, npwpUrl) => {
  const newAutomation = await prisma.automation.create({
    data: {
      url_image_nib: nibUrl,
      url_image_npwp: npwpUrl,
    },
    select: {
      created_at: true,
      updated_at: true,
      url_image_nib: true,
      url_image_siup: true,
      url_image_tdp: true,
      url_image_skdp: true,
      url_image_npwp: true,
      url_image_situ: true,
      url_image_imb: true,
      url_image_sim: true,
    },
  });
  return newAutomation;
};

module.exports = {
  createAutomation,
};
