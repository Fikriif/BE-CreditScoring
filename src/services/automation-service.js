// const addFileAutomation = async (
//   req,
//   name_surat_nomor_pokok_wajib_pajak_pribadi,
//   name_surat_nomor_induk_berusaha,
//   name_surat_nomor_pokok_wajib_pajak_perusahaan,
//   name_surat_nomor_akta_notaris,
//   name_surat_keterangan_domisili_usaha,
//   name_surat_izin_usaha_perdagangan,
//   name_surat_tanda_daftar_perusahaan,
//   name_surat_izin_dinas,
//   userId
// ) => {
//   const npwpPribadiPath = path.join(
//     `./src/public/images/automation`,
//     name_surat_nomor_pokok_wajib_pajak_pribadi
//   );
//   const nibPath = path.join(
//     `./src/public/images/automation`,
//     name_surat_nomor_induk_berusaha
//   );
//   const npwpPerusahaanPath = path.join(
//     `./src/public/images/automation`,
//     name_surat_nomor_pokok_wajib_pajak_perusahaan
//   );
//   const nanPath = path.join(
//     `./src/public/images/automation`,
//     name_surat_nomor_akta_notaris
//   );
//   const kduPath = path.join(
//     `./src/public/images/automation`,
//     name_surat_keterangan_domisili_usaha
//   );
//   const iupPath = path.join(
//     `./src/public/images/automation`,
//     name_surat_izin_usaha_perdagangan
//   );
//   const tdpPath = path.join(
//     `./src/public/images/automation`,
//     name_surat_tanda_daftar_perusahaan
//   );
//   const idPath = path.join(
//     `./src/public/images/automation`,
//     name_surat_izin_dinas
//   );

//   const npwpPribadiUrl = `${req.protocol}://${req.get(
//     "host"
//   )}/images/ktp/${name_surat_nomor_pokok_wajib_pajak_pribadi}`;
//   const nibUrl = `${req.protocol}://${req.get(
//     "host"
//   )}/images/ktp/${name_surat_nomor_induk_berusaha}`;
//   const npwpPerusahaanUrl = `${req.protocol}://${req.get(
//     "host"
//   )}/images/ktp/${name_surat_nomor_pokok_wajib_pajak_perusahaan}`;
//   const nanUrl = `${req.protocol}://${req.get(
//     "host"
//   )}/images/ktp/${name_surat_nomor_akta_notaris}`;
//   const kduUrl = `${req.protocol}://${req.get(
//     "host"
//   )}/images/ktp/${name_surat_keterangan_domisili_usaha}`;
//   const iupUrl = `${req.protocol}://${req.get(
//     "host"
//   )}/images/ktp/${name_surat_izin_usaha_perdagangan}`;
//   const tdpUrl = `${req.protocol}://${req.get(
//     "host"
//   )}/images/ktp/${name_surat_tanda_daftar_perusahaan}`;
//   const idUrl = `${req.protocol}://${req.get(
//     "host"
//   )}/images/ktp/${name_surat_izin_dinas}`;

//   const formDataNPWPPribadi = new FormData();
//   formDataNPWPPribadi.append("image", fs.createReadStream(npwpPribadiPath));

//   const formDataNIB = new FormData();
//   formDataNIB.append("image", fs.createReadStream(nibPath));

//   const formDataNPWPPerusahaan = new FormData();
//   formDataNPWPPerusahaan.append(
//     "image",
//     fs.createReadStream(npwpPerusahaanPath)
//   );

//   const formDataNAN = new FormData();
//   formDataNAN.append("image", fs.createReadStream(nanPath));

//   const formDataKDU = new FormData();
//   formDataKDU.append("image", fs.createReadStream(kduPath));

//   const formDataIUP = new FormData();
//   formDataIUP.append("image", fs.createReadStream(iupPath));

//   const formDataTDP = new FormData();
//   formDataTDP.append("image", fs.createReadStream(tdpPath));

//   const formDataID = new FormData();
//   formDataID.append("image", fs.createReadStream(idPath));

//   // Buat konfigurasi axios untuk setiap file (header harus berbeda untuk setiap FormData)
//   const axiosConfigNPWPPribadi = {
//     headers: {
//       ...formDataNPWPPribadi.getHeaders(), // Headers dari FormData NPWP Pribadi
//     },
//   };

//   const axiosConfigNIB = {
//     headers: {
//       ...formDataNIB.getHeaders(), // Headers dari FormData NIB
//     },
//   };

//   const axiosConfigNPWPPerusahaan = {
//     headers: {
//       ...formDataNPWPPerusahaan.getHeaders(), // Headers dari FormData NPWP Perusahaan
//     },
//   };

//   const axiosConfigNAN = {
//     headers: {
//       ...formDataNAN.getHeaders(), // Headers dari FormData NAN
//     },
//   };

//   const axiosConfigKDU = {
//     headers: {
//       ...formDataKDU.getHeaders(), // Headers dari FormData KDU
//     },
//   };

//   const axiosConfigIUP = {
//     headers: {
//       ...formDataIUP.getHeaders(), // Headers dari FormData IUP
//     },
//   };

//   const axiosConfigTDP = {
//     headers: {
//       ...formDataTDP.getHeaders(), // Headers dari FormData TDP
//     },
//   };

//   const axiosConfigID = {
//     headers: {
//       ...formDataID.getHeaders(), // Headers dari FormData ID
//     },
//   };

//   // Kirimkan setiap file dengan axios
//   const uploadNPWPPribadi = await axios.post(
//     `${process.env.ML_API}/api/image/upload/`,
//     formDataNPWPPribadi,
//     axiosConfigNPWPPribadi
//   );

//   const uploadNIB = await axios.post(
//     `${process.env.ML_API}/api/image/upload/`,
//     formDataNIB,
//     axiosConfigNIB
//   );

//   const uploadNPWPPerusahaan = await axios.post(
//     `${process.env.ML_API}/api/image/upload/`,
//     formDataNPWPPerusahaan,
//     axiosConfigNPWPPerusahaan
//   );

//   const uploadNAN = await axios.post(
//     `${process.env.ML_API}/api/image/upload/`,
//     formDataNAN,
//     axiosConfigNAN
//   );

//   const uploadKDU = await axios.post(
//     `${process.env.ML_API}/api/image/upload/`,
//     formDataKDU,
//     axiosConfigKDU
//   );

//   const uploadIUP = await axios.post(
//     `${process.env.ML_API}/api/image/upload/`,
//     formDataIUP,
//     axiosConfigIUP
//   );

//   const uploadTDP = await axios.post(
//     `${process.env.ML_API}/api/image/upload/`,
//     formDataTDP,
//     axiosConfigTDP
//   );

//   const uploadID = await axios.post(
//     `${process.env.ML_API}/api/image/upload/`,
//     formDataID,
//     axiosConfigID
//   );

//   const npwpPribadiId = uploadNPWPPribadi.data.data.image.id;
//   const nibId = uploadNIB.data.data.image.id;
//   const npwpPerusahaanId = uploadNPWPPerusahaan.data.data.image.id;
//   const nanId = uploadNAN.data.data.image.id;
//   const kduId = uploadKDU.data.data.image.id;
//   const iupId = uploadIUP.data.data.image.id;
//   const tdpId = uploadTDP.data.data.image.id;
//   const idId = uploadID.data.data.image.id;

//   console.log(npwpPribadiId, nibId, npwpPerusahaanId, nanId, kduId, iupId, tdpId, idId);

//   // Delete file menggunakan ID
//   await axios.delete(`${process.env.ML_API}/api/image/delete/`, {
//     data: {
//       id: npwpPribadiId,
//     },
//   });

//   await axios.delete(`${process.env.ML_API}/api/image/delete/`, {
//     data: {
//       id: nibId,
//     },
//   });

//   await axios.delete(`${process.env.ML_API}/api/image/delete/`, {
//     data: {
//       id: npwpPerusahaanId,
//     },
//   });

//   await axios.delete(`${process.env.ML_API}/api/image/delete/`, {
//     data: {
//       id: nanId,
//     },
//   });

//   await axios.delete(`${process.env.ML_API}/api/image/delete/`, {
//     data: {
//       id: kduId,
//     },
//   });

//   await axios.delete(`${process.env.ML_API}/api/image/delete/`, {
//     data: {
//       id: iupId,
//     },
//   });

//   await axios.delete(`${process.env.ML_API}/api/image/delete/`, {
//     data: {
//       id: tdpId,
//     },
//   });

//   await axios.delete(`${process.env.ML_API}/api/image/delete/`, {
//     data: {
//       id: idId,
//     },
//   });
// };

const fs = require("fs");
const FormData = require("form-data");
const axios = require("axios");
const path = require("path");
const { createAutomation } = require("../repositories/automation-repository");
const moment = require("moment-timezone");

const addFileAutomation = async (
  req,
  name_surat_nomor_induk_berusaha,
  userId
) => {
  const nibPath = path.join(
    `./src/public/images/automation`,
    name_surat_nomor_induk_berusaha
  );

  const nibUrl = `${req.protocol}://${req.get(
    "host"
  )}/images/automation/${name_surat_nomor_induk_berusaha}`;

  const formDataNIB = new FormData();
  formDataNIB.append("image", fs.createReadStream(nibPath));

  // Buat konfigurasi axios untuk setiap file (header harus berbeda untuk setiap FormData)

  const axiosConfigNIB = {
    headers: {
      ...formDataNIB.getHeaders(), // Headers dari FormData NIB
    },
  };

  // Kirimkan setiap file dengan axios
  const uploadNIB = await axios.post(
    `${process.env.ML_API}/api/image/upload/`,
    formDataNIB,
    axiosConfigNIB
  );

  const nibId = uploadNIB.data.data.image.id;

  // console.log(nibId, "nibId");

  const uploadNIBToNIBAPI = await axios.post(
    `${process.env.ML_API}/api/ocrnib/?id=${nibId}`
    // formDataNIB,
    // axiosConfigNIB
  );

  // console.log(uploadNIBToNIBAPI.data, "OCR NIB response");

  // Delete file menggunakan ID
  await axios.delete(`${process.env.ML_API}/api/image/delete/`, {
    data: {
      id: nibId,
    },
  });

  const timezone = "Asia/Jakarta";
  const createdAt = moment().tz(timezone).format("DD/MM/YY HH:mm:ss");
  const updatedAt = createdAt;

  const automation = createAutomation(nibUrl, createdAt, updatedAt);
  return automation;
};

module.exports = {
  addFileAutomation,
};
