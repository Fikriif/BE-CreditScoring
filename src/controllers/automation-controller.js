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
    // console.log(req.files.surat_nib);
    // return;
    // const surat_npwpPribadi = req.files.surat_npwpPribadi;
    const surat_nib = req.files.surat_nib;
    // const surat_npwpPerusahaan = req.files.surat_npwpPerusahaan;
    // const surat_nan = req.files.surat_nan;
    // const surat_kdu = req.files.surat_kdu;
    // const surat_iup = req.files.surat_iup;
    // const surat_tdp = req.files.surat_tdp;
    // const surat_id = req.files.surat_id;

    // console.log("npwppribadi: ", surat_npwpPribadi);
    // console.log("nib: ", surat_nib);
    // console.log("npwpperusahaan: ", surat_npwpPerusahaan);
    // console.log("nan: ", surat_nan);
    // console.log("kdu: ", surat_kdu);
    // console.log("iup: ", surat_iup);
    // console.log("tdp: ", surat_tdp);
    // console.log("id: ", surat_id);
    // return;

    // if (
    //   !surat_npwpPribadi ||
    //   !surat_nib ||
    //   !surat_npwpPerusahaan ||
    //   !surat_nan ||
    //   !surat_kdu ||
    //   !surat_iup ||
    //   !surat_tdp ||
    //   !surat_id
    // ) {
    //   return res.status(400).send({
    //     error: true,
    //     message: "Ada file yang belum diupload",
    //   });
    // }

    if (!surat_nib) {
      return res.status(400).send({
        error: true,
        message: "Surat nib belum di upload",
      });
    }

    // const name_surat_npwpPribadi = preprocessImage(surat_npwpPribadi);
    const name_surat_nib = preprocessImage(surat_nib);
    // const name_surat_npwpPerusahaan = preprocessImage(surat_npwpPerusahaan);
    // const name_surat_nan = preprocessImage(surat_nan);
    // const name_surat_kdu = preprocessImage(surat_kdu);
    // const name_surat_iup = preprocessImage(surat_iup);
    // const name_surat_tdp = preprocessImage(surat_tdp);
    // const name_surat_id = preprocessImage(surat_id);

    // await uploadImage(
    //   surat_npwpPribadi,
    //   name_surat_npwpPribadi,
    //   "./src/public/images/automation"
    // );
    await uploadImage(
      surat_nib,
      name_surat_nib,
      "./src/public/images/automation"
    );
    // await uploadImage(
    //   surat_npwpPerusahaan,
    //   name_surat_npwpPerusahaan,
    //   "./src/public/images/automation"
    // );
    // await uploadImage(
    //   surat_nan,
    //   name_surat_nan,
    //   "./src/public/images/automation"
    // );
    // await uploadImage(
    //   surat_kdu,
    //   name_surat_kdu,
    //   "./src/public/images/automation"
    // );
    // await uploadImage(
    //   surat_iup,
    //   name_surat_iup,
    //   "./src/public/images/automation"
    // );
    // await uploadImage(
    //   surat_tdp,
    //   name_surat_tdp,
    //   "./src/public/images/automation"
    // );
    // await uploadImage(
    //   surat_id,
    //   name_surat_id,
    //   "./src/public/images/automation"
    // );
    // console.log("ok");

    // const automation = await addFileAutomation(
    //   req,
    //   name_surat_npwpPribadi,
    //   name_surat_nib,
    //   name_surat_npwpPerusahaan,
    //   name_surat_nan,
    //   name_surat_kdu,
    //   name_surat_iup,
    //   name_surat_tdp,
    //   name_surat_id,
    //   userId
    // );

    const automation = await addFileAutomation(req, name_surat_nib, userId);

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
