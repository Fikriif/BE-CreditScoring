const fs = require("fs");
const FormData = require("form-data");
const axios = require("axios");
const path = require("path");
const { createAutomation } = require("../repositories/automation-repository");
const moment = require("moment-timezone");

const addFileAutomation = async (
  req,
  name_nib,
  name_siup,
  name_tdp,
  name_skdp,
  name_npwp,
  name_situ,
  name_imb,
  name_sim
) => {
  // Path
  const nibPath = path.join(`./src/public/images/automation`, name_nib);
  const siupPath = path.join(`./src/public/images/automation`, name_siup);
  const tdpPath = path.join(`./src/public/images/automation`, name_tdp);
  const skdpPath = path.join(`./src/public/images/automation`, name_skdp);
  const npwpPath = path.join(`./src/public/images/automation`, name_npwp);
  const situPath = path.join(`./src/public/images/automation`, name_situ);
  const imbPath = path.join(`./src/public/images/automation`, name_imb);
  const simPath = path.join(`./src/public/images/automation`, name_sim);

  // URL
  const nibUrl = `${req.protocol}://${req.get(
    "host"
  )}/images/automation/${name_nib}`;

  const siupUrl = `${req.protocol}://${req.get(
    "host"
  )}/images/automation/${name_siup}`;

  const tdpUrl = `${req.protocol}://${req.get(
    "host"
  )}/images/automation/${name_tdp}`;

  const skdpUrl = `${req.protocol}://${req.get(
    "host"
  )}/images/automation/${name_skdp}`;

  const npwpUrl = `${req.protocol}://${req.get(
    "host"
  )}/images/automation/${name_npwp}`;

  const situUrl = `${req.protocol}://${req.get(
    "host"
  )}/images/automation/${name_situ}`;

  const imbUrl = `${req.protocol}://${req.get(
    "host"
  )}/images/automation/${name_imb}`;

  const simUrl = `${req.protocol}://${req.get(
    "host"
  )}/images/automation/${name_sim}`;

  // FormData
  const formDataNIB = new FormData();
  formDataNIB.append("image", fs.createReadStream(nibPath));

  const formDataSIUP = new FormData();
  formDataSIUP.append("image", fs.createReadStream(siupPath));

  const formDataTDP = new FormData();
  formDataTDP.append("image", fs.createReadStream(tdpPath));

  const formDataSKDP = new FormData();
  formDataSKDP.append("image", fs.createReadStream(skdpPath));

  const formDataNPWP = new FormData();
  formDataNPWP.append("image", fs.createReadStream(npwpPath));

  const formDataSITU = new FormData();
  formDataSITU.append("image", fs.createReadStream(situPath));

  const formDataIMB = new FormData();
  formDataIMB.append("image", fs.createReadStream(imbPath));

  const formDataSIM = new FormData();
  formDataSIM.append("image", fs.createReadStream(simPath));

  // Konfigurasi axios
  const axiosConfigNIB = {
    headers: {
      ...formDataNIB.getHeaders(),
    },
  };

  const axiosConfigSIUP = {
    headers: {
      ...formDataSIUP.getHeaders(),
    },
  };

  const axiosConfigTDP = {
    headers: {
      ...formDataTDP.getHeaders(),
    },
  };

  const axiosConfigSKDP = {
    headers: {
      ...formDataSKDP.getHeaders(),
    },
  };

  const axiosConfigNPWP = {
    headers: {
      ...formDataNPWP.getHeaders(),
    },
  };

  const axiosConfigSITU = {
    headers: {
      ...formDataSITU.getHeaders(),
    },
  };

  const axiosConfigIMB = {
    headers: {
      ...formDataIMB.getHeaders(),
    },
  };

  const axiosConfigSIM = {
    headers: {
      ...formDataSIM.getHeaders(),
    },
  };

  // Kirimkan setiap file dengan axios
  const uploadNIB = await axios.post(
    `${process.env.ML_API}/api/image/upload/`,
    formDataNIB,
    axiosConfigNIB
  );

  const uploadSIUP = await axios.post(
    `${process.env.ML_API}/api/image/upload/`,
    formDataSIUP,
    axiosConfigSIUP
  );

  const uploadTDP = await axios.post(
    `${process.env.ML_API}/api/image/upload/`,
    formDataTDP,
    axiosConfigTDP
  );

  const uploadSKDP = await axios.post(
    `${process.env.ML_API}/api/image/upload/`,
    formDataSKDP,
    axiosConfigSKDP
  );

  const uploadNPWP = await axios.post(
    `${process.env.ML_API}/api/image/upload/`,
    formDataNPWP,
    axiosConfigNPWP
  );

  const uploadSITU = await axios.post(
    `${process.env.ML_API}/api/image/upload/`,
    formDataSITU,
    axiosConfigSITU
  );

  const uploadIMB = await axios.post(
    `${process.env.ML_API}/api/image/upload/`,
    formDataIMB,
    axiosConfigIMB
  );

  const uploadSIM = await axios.post(
    `${process.env.ML_API}/api/image/upload/`,
    formDataSIM,
    axiosConfigSIM
  );

  // Dapatkan ID dari file surat-surat yg telah di upload
  const nibId = uploadNIB.data.data.image.id;
  const siupId = uploadSIUP.data.data.image.id;
  const tdpId = uploadTDP.data.data.image.id;
  const skdpId = uploadSKDP.data.data.image.id;
  const npwpId = uploadNPWP.data.data.image.id;
  const situId = uploadSITU.data.data.image.id;
  const imbId = uploadIMB.data.data.image.id;
  const simId = uploadSIM.data.data.image.id;

  console.log(nibId, "nibId");
  console.log(siupId, "siupId");
  console.log(tdpId, "tdpId");
  console.log(skdpId, "skdpId");
  console.log(npwpId, "npwpId");
  console.log(situId, "situId");
  console.log(imbId, "imbId");
  console.log(simId, "simId");

  // Upload ke API AI masing-masing surat
  const uploadNIBToApi = await axios.post(
    `${process.env.ML_API}/api/ocrnib/?id=${nibId}`
  );

  const uploadSIUPToApi = await axios.post(
    `${process.env.ML_API}/api/ocrsiup/?id=${siupId}`
  );

  const uploadTDPToApi = await axios.post(
    `${process.env.ML_API}/api/ocrtdp/?id=${tdpId}`
  );

  const uploadSKDPToApi = await axios.post(
    `${process.env.ML_API}/api/ocrskdp/?id=${skdpId}`
  );

  const uploadNPWPToApi = await axios.post(
    `${process.env.ML_API}/api/ocrnpwp/?id=${npwpId}`
  );

  const uploadSITUToApi = await axios.post(
    `${process.env.ML_API}/api/ocrsitu/?id=${situId}`
  );

  const uploadIMBToApi = await axios.post(
    `${process.env.ML_API}/api/ocrimb/?id=${imbId}`
  );

  const uploadSIMToApi = await axios.post(
    `${process.env.ML_API}/api/ocrsim/?id=${simId}`
  );

  // Respon dari API AI
  console.log(uploadNIBToApi.data, "OCR NIB response");
  console.log(uploadSIUPToApi.data, "OCR SIUP response");
  console.log(uploadTDPToApi.data, "OCR TDP response");
  console.log(uploadSKDPToApi.data, "OCR SKDP response");
  console.log(uploadNPWPToApi.data, "OCR NPWP response");
  console.log(uploadSITUToApi.data, "OCR SITU response");
  console.log(uploadIMBToApi.data, "OCR IMB response");
  console.log(uploadSIMToApi.data, "OCR SIM response");

  // Setelah upload, Delete file menggunakan ID
  await axios.delete(`${process.env.ML_API}/api/image/delete/`, {
    data: {
      id: nibId,
    },
  });
  await axios.delete(`${process.env.ML_API}/api/image/delete/`, {
    data: {
      id: siupId,
    },
  });
  await axios.delete(`${process.env.ML_API}/api/image/delete/`, {
    data: {
      id: tdpId,
    },
  });
  await axios.delete(`${process.env.ML_API}/api/image/delete/`, {
    data: {
      id: skdpId,
    },
  });
  await axios.delete(`${process.env.ML_API}/api/image/delete/`, {
    data: {
      id: npwpId,
    },
  });
  await axios.delete(`${process.env.ML_API}/api/image/delete/`, {
    data: {
      id: situId,
    },
  });
  await axios.delete(`${process.env.ML_API}/api/image/delete/`, {
    data: {
      id: imbId,
    },
  });
  await axios.delete(`${process.env.ML_API}/api/image/delete/`, {
    data: {
      id: simId,
    },
  });

  const automation = createAutomation(
    nibUrl,
    siupUrl,
    tdpUrl,
    skdpUrl,
    npwpUrl,
    situUrl,
    imbUrl,
    simUrl
  );

  return automation;
};

module.exports = {
  addFileAutomation,
};
