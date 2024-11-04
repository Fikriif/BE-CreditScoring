const express = require("express");
const { preprocessImage, uploadImage } = require("../utils");
const prisma = require("../database/prisma");
const ClientError = require("../exceptions/ClientError");
const { addFileAutomation } = require("../services/automation-service");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Automation Controller");
});

router.post("/", async (req, res) => {
  try {
    const userId = req.userId;

    if (req.files === undefined || req.files === null) {
      return res.status(400).send({
        error: true,
        message: "Tidak ada file yang diupload",
      });
    }

    // Ambil file dari request body
    const nibFile = req.files.nib;
    const siupFile = req.files.siup;
    const tdpFile = req.files.tdp;
    const skdpFile = req.files.skdp;
    const npwpFile = req.files.npwp;
    const situFile = req.files.situ;
    const imbFile = req.files.imb;
    const simFile = req.files.sim;

    // Cek apakah ada file yang belum diupload
    if (
      !nibFile ||
      !siupFile ||
      !tdpFile ||
      !skdpFile ||
      !npwpFile ||
      !situFile ||
      !imbFile ||
      !simFile
    ) {
      return res.status(400).send({
        error: true,
        message: "Ada file yang belum diupload",
      });
    }

    // Dapatkan nama file yang diupload
    const name_nib = preprocessImage(nibFile);
    const name_siup = preprocessImage(siupFile);
    const name_tdp = preprocessImage(tdpFile);
    const name_skdp = preprocessImage(skdpFile);
    const name_npwp = preprocessImage(npwpFile);
    const name_situ = preprocessImage(situFile);
    const name_imb = preprocessImage(imbFile);
    const name_sim = preprocessImage(simFile);

    // Upload file ke direktori yang diinginkan
    await uploadImage(nibFile, name_nib, "./src/public/images/automation");
    await uploadImage(siupFile, name_siup, "./src/public/images/automation");
    await uploadImage(tdpFile, name_tdp, "./src/public/images/automation");
    await uploadImage(skdpFile, name_skdp, "./src/public/images/automation");
    await uploadImage(npwpFile, name_npwp, "./src/public/images/automation");
    await uploadImage(situFile, name_situ, "./src/public/images/automation");
    await uploadImage(imbFile, name_imb, "./src/public/images/automation");
    await uploadImage(simFile, name_sim, "./src/public/images/automation");

    // Tambahkan data automation ke database
    const automation = await addFileAutomation(
      req,
      name_nib,
      name_siup,
      name_tdp,
      name_skdp,
      name_npwp,
      name_situ,
      name_imb,
      name_sim,
      userId
    );

    return res.status(201).send({
      error: false,
      message: "Data automation berhasil ditambahkan",
      result: automation,
    });
  } catch (error) {
    if (error instanceof ClientError) {
      return res.status(error.statusCode).send({
        error: true,
        message: error.message,
      });
    }

    console.error(error.message);
    return res.status(500).send({
      error: true,
      message: "Internal Server Error",
    });
  } finally {
    await prisma.$disconnect();
  }
});

module.exports = router;
