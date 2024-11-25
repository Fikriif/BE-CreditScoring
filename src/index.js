const express = require("express");
const FileUpload = require("express-fileupload");
const dotenv = require("dotenv");
// const csv = require('fast-csv');
const fs = require("fs");
const path = require("path");

const routerUser = require("./controllers/user-controller");
const routerAuthentication = require("./controllers/authentication-controller");
const routerPerson = require("./controllers/person-controller");
const routerRequest = require("./controllers/request-controller");
const routerReport = require("./controllers/report-controller");
const routerScoring = require("./controllers/scoring-controller");
const routerAutomation = require("./controllers/automation-controller");
const verifyToken = require("./middleware/verifyToken");
const app = express();
const cors = require("cors");
const port = 80;

dotenv.config();
app.use(cors());
// app.use(cors({
//   origin: 'http://localhost:3000', // Pastikan sesuai dengan URL frontend Next.js
//   methods: ['GET', 'POST', 'PUT', 'DELETE'], // Sesuaikan metode HTTP yang diizinkan
//   allowedHeaders: ['Content-Type', 'Authorization'] // Izinkan header yang digunakan
// }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(FileUpload());
app.use(express.static(path.join(__dirname, "public")));

// const imagesDir = path.join(__dirname, "public", "images");
// if (!fs.existsSync(imagesDir)) {
//   fs.mkdirSync(imagesDir, { recursive: true });
// }

const ktpDir = path.join(__dirname, "public", "images", "ktp");
if (!fs.existsSync(ktpDir)) {
  fs.mkdirSync(ktpDir, { recursive: true });
}

const selfieDir = path.join(__dirname, "public", "images", "selfie");
if (!fs.existsSync(selfieDir)) {
  fs.mkdirSync(selfieDir, { recursive: true });
}

const profileDir = path.join(__dirname, "public", "images", "profile");
if (!fs.existsSync(profileDir)) {
  fs.mkdirSync(profileDir, { recursive: true });
}
const automationDir = path.join(__dirname, "public", "images", "automation");
if (!fs.existsSync(automationDir)) {
  fs.mkdirSync(automationDir, { recursive: true });
}

// const csvDir = path.join(__dirname, "public", "csv");
// if (!fs.existsSync(csvDir)) {
//   fs.mkdirSync(csvDir, { recursive: true });
// }

const reportDir = path.join(__dirname, "public", "pdf", "report");
if (!fs.existsSync(reportDir)) {
  fs.mkdirSync(reportDir, { recursive: true });
}

app.use("/users", verifyToken, routerUser);
app.use("/authentication", routerAuthentication);
app.use("/persons", verifyToken, routerPerson);
app.use("/requests", verifyToken, routerRequest);
app.use("/reports", verifyToken, routerReport);
app.use("/scoring", verifyToken, routerScoring);
app.use("/automation", verifyToken, routerAutomation);

app.get("/pdf/reports/:fileName", (req, res) => {
  const { fileName } = req.params;
  const filePath = path.join(__dirname, "public", "pdf", "report", fileName);

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).send({
        error: true,
        message: "File PDF tidak ditemukan",
      });
    }

    res.sendFile(filePath, (err) => {
      if (err) {
        return res.status(500).send({
          error: true,
          message: "Internal Server Error",
        });
      }
    });
  });
});

// app.post("/location", async (req, res) => {
//   if (req.files === undefined) {
//     return res.status(400).send({
//       message: "No File Uploaded",
//     });
//   }

//   const csvFile = req.files.csv;

//   if (!csvFile) {
//     return res.status(400).send({
//       message: "CSV file has not been uploaded",
//     });
//   }

//   const csvSize = csvFile.data.length;
//   const extCSV = path.extname(csvFile.name);
//   const csvName = csvFile.md5 + extCSV;
//   const urlCSV = `${req.protocol}://${req.get("host")}/csv/${csvName}`;
//   const allowedType = [".csv"];

//   if (
//     !allowedType.includes(extCSV.toLowerCase())
//   ) {
//     return res.status(422).send({
//       message: "Invalid csv file Extension",
//     });
//   }

//   if (csvSize > 5000000) {
//     return res.status(422).send({
//       message: "CSV file must be less than 5 MB",
//     });
//   }

//   const uploadCSV = (csv, csvName) => {
//     return new Promise((resolve, reject) => {
//       const uploadPath = `./public/csv/${csvName}`;
//       csv.mv(uploadPath, (err) => {
//         if (err) {
//           reject(err);
//         } else {
//           // Check if file exists after upload
//           fs.access(uploadPath, fs.constants.F_OK, (err) => {
//             if (err) {
//               reject(new Error('File not found after upload'));
//             } else {
//               resolve();
//             }
//           });
//         }
//       });
//     });
//   };

//   try {
//     await uploadCSV(csvFile, csvName);
//     let result = [];
//     fs.createReadStream(path.resolve(__dirname, `public/csv/${csvName}`))
//       .pipe(csv.parse({ headers: true }))
//       .on('error', error => console.error(error))
//       .on('data', row => result.push(row))
//       .on('end', () => {
//         const data = Object.values(result[0]).toString();
//         let dataArray = [];
//         let currentData = '';
//         let inQuotes = false; // variabel untuk melacak apakah sedang berada di dalam tanda kutip ganda

//         for (let i = 0; i < data.length; i++) {
//             if (data[i] === '"') {
//                 // Toggling nilai variabel inQuotes saat menemukan tanda kutip
//                 inQuotes = !inQuotes;
//                 continue; // Melanjutkan ke iterasi berikutnya tanpa menambahkan tanda kutip ke dataArray
//             }

//             if (!inQuotes && data[i] === ',') {
//                 // Jika tidak berada di dalam tanda kutip dan menemukan koma, tambahkan data ke dataArray
//                 dataArray.push(currentData);
//                 currentData = ''; // Mengosongkan currentData untuk data selanjutnya
//             } else {
//                 currentData += data[i];
//             }
//         }

//         // console.log(dataArray.length);
//         // console.log(dataArray)
//         const date = dataArray[0];
//         // console.log(date)
//         const time = dataArray[1];
//         // console.log(time);
//         const nama = dataArray[2];
//         // console.log(nama);
//         const alamat_ktp_plus_code = dataArray[3];
//         // console.log(alamat_ktp_plus_code)
//         const alamat_ktp_jalan = dataArray[4];
//         // console.log(alamat_ktp_jalan)
//         const alamat_ktp_kelurahan = dataArray[5];
//         // console.log(alamat_ktp_kelurahan)
//         const alamat_ktp_kecamatan = dataArray[6];
//         // console.log(alamat_ktp_kecamatan)
//         const alamat_ktp_kabupaten = dataArray[7];
//         // console.log(alamat_ktp_kabupaten)
//         const alamat_ktp_provinsi = dataArray[8];
//         // console.log(alamat_ktp_provinsi)
//         const alamat_ktp = dataArray[9];
//         // console.log(alamat_ktp)
//         const alamat_ktp_lat = dataArray[10];
//         // console.log(alamat_ktp_lat)
//         const alamat_ktp_lon = dataArray[11];
//         // console.log(alamat_ktp_lon)
//         const alamat_ktp_tipe_lokasi = dataArray[12];
//         // console.log(alamat_ktp_tipe_lokasi)
//         const alamat_ktp_place_id = dataArray[13];
//         const alamat_ktp_jenis_jalan = dataArray[14];
//         const alamat_ktp_pemilik_bangunan = dataArray[15];
//         const alamat_ktp_lokasi_bangunan = dataArray[16];
//         const alamat_domisili_plus_code = dataArray[17];
//         const alamat_domisili_jalan = dataArray[18];
//         const alamat_domisili_kelurahan = dataArray[19];
//         const alamat_domisili_kecamatan = dataArray[20];
//         const alamat_domisili_kabupaten = dataArray[21];
//         const alamat_domisili_provinsi = dataArray[22];
//         const alamat_domisili = dataArray[23];
//         const alamat_domisili_lat = dataArray[24];
//         const alamat_domisili_lon = dataArray[25];
//         const alamat_domisili_tipe_lokasi = dataArray[26];
//         const alamat_domisili_place_id = dataArray[27];
//         const alamat_domisili_jenis_jalan = dataArray[28];
//         const alamat_domisili_pemilik_bangunan = dataArray[29];
//         const alamat_domisili_lokasi_bangunan = dataArray[30];
//         const alamat_pekerjaan_plus_code = dataArray[31];
//         const alamat_pekerjaan_jalan = dataArray[32];
//         const alamat_pekerjaan_kelurahan = dataArray[33];
//         const alamat_pekerjaan_kecamatan = dataArray[34];
//         const alamat_pekerjaan_kabupaten = dataArray[35];
//         const alamat_pekerjaan_provinsi = dataArray[36];
//         const alamat_pekerjaan = dataArray[37];
//         const alamat_pekerjaan_lat = dataArray[38];
//         const alamat_pekerjaan_lon = dataArray[39];
//         const alamat_pekerjaan_tipe_lokasi = dataArray[40];
//         const alamat_pekerjaan_place_id = dataArray[41];
//         const alamat_aset_plus_code = dataArray[42];
//         const alamat_aset_jalan = dataArray[43];
//         const alamat_aset_kelurahan = dataArray[44];
//         const alamat_aset_kecamatan = dataArray[45];
//         const alamat_aset_kabupaten = dataArray[46];
//         const alamat_aset_provinsi = dataArray[47];
//         const alamat_aset = dataArray[48];
//         const alamat_aset_lat = dataArray[49];
//         const alamat_aset_lon = dataArray[50];
//         const alamat_aset_tipe_lokasi = dataArray[51];
//         const alamat_aset_place_id = dataArray[52];
//         const jenis_aset = dataArray[53];
//         const nilai_aset = dataArray[54];
//         const lokasi_saat_ini_lat = dataArray[55];
//         const lokasi_saat_ini_lon = dataArray[56];
//         const lokasi_bts_lat = dataArray[57];
//         const lokasi_bts_lon = dataArray[58];
//         const lokasi_check_in_digital_lat = dataArray[59];
//         const lokasi_check_in_digital_lon = dataArray[60];
//         const jenis_check_in_digital = dataArray[61];
//         const lokasi_2_minggu_terakhir_lat = dataArray[62];
//         const lokasi_2_minggu_terakhir_lon = dataArray[63];
//         const lokasi_3_minggu_terakhir_lat = dataArray[64];
//         const lokasi_3_minggu_terakhir_lon = dataArray[65];
//         const lokasi_4_minggu_terakhir_lat = dataArray[66];
//         const lokasi_4_minggu_terakhir_lon = dataArray[67];
//         // console.log(lokasi_4_minggu_terakhir_lon)
//         const credit_score = dataArray[68];
//         // console.log(credit_score)
//         // console.log(credit_score)

//         const locationScore = axios.post(process.env.LOCATION_ML_API, {
//           date,
//           time,
//           nama,
//           alamat_ktp_plus_code,
//           alamat_ktp_jalan,
//           alamat_ktp_kelurahan,
//           alamat_ktp_kecamatan,
//           alamat_ktp_kabupaten,
//           alamat_ktp_provinsi,
//           alamat_ktp,
//           alamat_ktp_lat,
//           alamat_ktp_lon,
//           alamat_ktp_tipe_lokasi,
//           alamat_ktp_place_id,
//           alamat_ktp_jenis_jalan,
//           alamat_ktp_pemilik_bangunan,
//           alamat_ktp_lokasi_bangunan,
//           alamat_domisili_plus_code,
//           alamat_domisili_jalan,
//           alamat_domisili_kelurahan,
//           alamat_domisili_kecamatan,
//           alamat_domisili_kabupaten,
//           alamat_domisili_provinsi,
//           alamat_domisili,
//           alamat_domisili_lat,
//           alamat_domisili_lon,
//           alamat_domisili_tipe_lokasi,
//           alamat_domisili_place_id,
//           alamat_domisili_jenis_jalan,
//           alamat_domisili_pemilik_bangunan,
//           alamat_domisili_lokasi_bangunan,
//           alamat_pekerjaan_plus_code,
//           alamat_pekerjaan_jalan,
//           alamat_pekerjaan_kelurahan,
//           alamat_pekerjaan_kecamatan,
//           alamat_pekerjaan_kabupaten,
//           alamat_pekerjaan_provinsi,
//           alamat_pekerjaan,
//           alamat_pekerjaan_lat,
//           alamat_pekerjaan_lon,
//           alamat_pekerjaan_tipe_lokasi,
//           alamat_pekerjaan_place_id,
//           alamat_aset_plus_code,
//           alamat_aset_jalan,
//           alamat_aset_kelurahan,
//           alamat_aset_kecamatan,
//           alamat_aset_kabupaten,
//           alamat_aset_provinsi,
//           alamat_aset,
//           alamat_aset_lat,
//           alamat_aset_lon,
//           alamat_aset_tipe_lokasi,
//           alamat_aset_place_id,
//           jenis_aset,
//           nilai_aset,
//           lokasi_saat_ini_lat,
//           lokasi_saat_ini_lon,
//           lokasi_bts_lat,
//           lokasi_bts_lon,
//           lokasi_check_in_digital_lat,
//           lokasi_check_in_digital_lon,
//           jenis_check_in_digital,
//           lokasi_2_minggu_terakhir_lat,
//           lokasi_2_minggu_terakhir_lon,
//           lokasi_3_minggu_terakhir_lat,
//           lokasi_3_minggu_terakhir_lon,
//           lokasi_4_minggu_terakhir_lat,
//           lokasi_4_minggu_terakhir_lon,
//           credit_score
//         }).then(response => {
//           const generateShortUUID = () => {
//             let shortUUID;
//             do {
//               const uuid = uuidv4().replace(/-/g,'');
//               shortUUID = uuid.substring(0, 8);
//             } while (shortUUID.charAt(0) !== '0');
//             return shortUUID;
//           }

//           const id = generateShortUUID();

//           const newRequest = prisma.request.create({
//             data: {
//               no: id,
//               jenis_permintaan: "LOKASI",
//               jumlah_customer: 1,
//             }
//           }).then(response => {
//             console.log("Uploaded")
//           }).catch(err => {
//             console.log(err);
//           });
//           return res.status(200).send({
//             message: "Location verified successfully",
//             result: response.data
//           });
//         }).catch(err => {
//           console.log(err)
//         })
//       });
//   } catch (error) {
//     console.log(error);
//   }
// })

// app.post("/identityscoring", async (req, res) => {
//   if (req.files === undefined) {
//     return res.status(400).send({
//       message: "No File Uploaded",
//     });
//   }

//   const ktp = req.files.ktp;
//   const foto = req.files.foto;
//   const csvFile = req.files.csv;

//   if (!ktp || !foto || !csvFile) {
//     return res.status(400).send({
//       message: "KTP, Photo or CSV file has not been uploaded",
//     });
//   }

//   const ktpSize = ktp.data.length;
//   const fotoSize = foto.data.length;
//   const csvSize = csvFile.data.length;

//   const extKTP = path.extname(ktp.name);
//   const extFoto = path.extname(foto.name);
//   const extCSV = path.extname(csvFile.name);

//   const ktpName = ktp.md5 + extKTP;
//   const fotoName = foto.md5 + extFoto;
//   const csvName = csvFile.md5 + extCSV;

//   const urlKTP = `${req.protocol}://${req.get("host")}/images/${ktpName}`;
//   const urlFoto = `${req.protocol}://${req.get("host")}/images/${fotoName}`;
//   const urlCSV = `${req.protocol}://${req.get("host")}/csv/${csvName}`;

//   const allowedImageType = [".png", ".jpg"];
//   const allowedCSVType = [".csv"];

//   if (
//     !allowedImageType.includes(extKTP.toLowerCase()) ||
//     !allowedImageType.includes(extFoto.toLowerCase())
//   ) {
//     return res.status(422).send({
//       message: "Invalid Image Extension",
//     });
//   }

//   if (
//     !allowedCSVType.includes(extCSV.toLowerCase())
//   ) {
//     return res.status(422).send({
//       message: "Invalid csv file Extension",
//     });
//   }

//   if (ktpSize > 1000000 || fotoSize > 1000000) {
//     return res.status(422).send({
//       message: "Image must be less than 1 MB",
//     });
//   }

//   if (csvSize > 5000000) {
//     return res.status(422).send({
//       message: "CSV file must be less than 5 MB",
//     });
//   }

//   const uploadImage = (image, imageName) => {
//     return new Promise((resolve, reject) => {
//       const uploadPath = `./public/images/${imageName}`;
//       image.mv(uploadPath, (err) => {
//         if (err) {
//           reject(err);
//         } else {
//           // Check if file exists after upload
//           fs.access(uploadPath, fs.constants.F_OK, (err) => {
//             if (err) {
//               reject(new Error('File not found after upload'));
//             } else {
//               resolve();
//             }
//           });
//         }
//       });
//     });
//   };

//   const uploadCSV = (csv, csvName) => {
//     return new Promise((resolve, reject) => {
//       const uploadPath = `./public/csv/${csvName}`;
//       csv.mv(uploadPath, (err) => {
//         if (err) {
//           reject(err);
//         } else {
//           // Check if file exists after upload
//           fs.access(uploadPath, fs.constants.F_OK, (err) => {
//             if (err) {
//               reject(new Error('File not found after upload'));
//             } else {
//               resolve();
//             }
//           });
//         }
//       });
//     });
//   };

//   try {
//     await uploadImage(ktp, ktpName);
//     await uploadImage(foto, fotoName);
//     await uploadCSV(csvFile, csvName);

//     const newKTP = await prisma.kTP.create({
//       data: {
//         image: urlKTP,
//       },
//     });

//     const newFoto = await prisma.selfie.create({
//       data: {
//         image: urlFoto,
//       },
//     });

//     const ktpPath = path.join(__dirname, 'public', 'images', ktpName);
//     const fotoPath = path.join(__dirname, 'public', 'images', fotoName);

//     // Buat objek FormData
//     const formDataKTP = new FormData();
//     formDataKTP.append('image', fs.createReadStream(ktpPath));

//     const formDataFoto = new FormData();
//     formDataFoto.append('image', fs.createReadStream(fotoPath));

//      // Konfigurasi untuk mengirimkan FormData
//     const axiosConfig = {
//     headers: {
//       ...formDataKTP.getHeaders() // Mendapatkan header dari FormData
//       }
//     };

//     const uploadKtp = await axios.post(process.env.UPLOAD_IMAGE_API, formDataKTP, axiosConfig);
//     const uploadFoto = await axios.post(process.env.UPLOAD_IMAGE_API, formDataFoto, axiosConfig);

//     const ktpId = uploadKtp.data.data.image.id;
//     const selfieId = uploadFoto.data.data.image.id;
//     let result = [];

//     fs.createReadStream(path.resolve(__dirname, `public/csv/${csvName}`))
//       .pipe(csv.parse({ headers: true }))
//       .on('error', error => console.error(error))
//       .on('data', row => result.push(row))
//       .on('end', () => {
//         const data = Object.values(result[0]).toString();
//         let dataArray = [];
//         let currentData = '';
//         let inQuotes = false; // variabel untuk melacak apakah sedang berada di dalam tanda kutip ganda

//         for (let i = 0; i < data.length; i++) {
//             if (data[i] === '"') {
//                 // Toggling nilai variabel inQuotes saat menemukan tanda kutip
//                 inQuotes = !inQuotes;
//                 continue; // Melanjutkan ke iterasi berikutnya tanpa menambahkan tanda kutip ke dataArray
//             }

//             if (!inQuotes && data[i] === ',') {
//                 // Jika tidak berada di dalam tanda kutip dan menemukan koma, tambahkan data ke dataArray
//                 dataArray.push(currentData);
//                 currentData = ''; // Mengosongkan currentData untuk data selanjutnya
//             } else {
//                 currentData += data[i];
//             }
//         }

//         // console.log(dataArray.length);
//         // console.log(dataArray)
//         const date = dataArray[0];
//         // console.log(date)
//         const time = dataArray[1];
//         // console.log(time);
//         const nama = dataArray[2];
//         // console.log(nama);
//         const alamat_ktp_plus_code = dataArray[3];
//         // console.log(alamat_ktp_plus_code)
//         const alamat_ktp_jalan = dataArray[4];
//         // console.log(alamat_ktp_jalan)
//         const alamat_ktp_kelurahan = dataArray[5];
//         // console.log(alamat_ktp_kelurahan)
//         const alamat_ktp_kecamatan = dataArray[6];
//         // console.log(alamat_ktp_kecamatan)
//         const alamat_ktp_kabupaten = dataArray[7];
//         // console.log(alamat_ktp_kabupaten)
//         const alamat_ktp_provinsi = dataArray[8];
//         // console.log(alamat_ktp_provinsi)
//         const alamat_ktp = dataArray[9];
//         // console.log(alamat_ktp)
//         const alamat_ktp_lat = dataArray[10];
//         // console.log(alamat_ktp_lat)
//         const alamat_ktp_lon = dataArray[11];
//         // console.log(alamat_ktp_lon)
//         const alamat_ktp_tipe_lokasi = dataArray[12];
//         // console.log(alamat_ktp_tipe_lokasi)
//         const alamat_ktp_place_id = dataArray[13];
//         const alamat_ktp_jenis_jalan = dataArray[14];
//         const alamat_ktp_pemilik_bangunan = dataArray[15];
//         const alamat_ktp_lokasi_bangunan = dataArray[16];
//         const alamat_domisili_plus_code = dataArray[17];
//         const alamat_domisili_jalan = dataArray[18];
//         const alamat_domisili_kelurahan = dataArray[19];
//         const alamat_domisili_kecamatan = dataArray[20];
//         const alamat_domisili_kabupaten = dataArray[21];
//         const alamat_domisili_provinsi = dataArray[22];
//         const alamat_domisili = dataArray[23];
//         const alamat_domisili_lat = dataArray[24];
//         const alamat_domisili_lon = dataArray[25];
//         const alamat_domisili_tipe_lokasi = dataArray[26];
//         const alamat_domisili_place_id = dataArray[27];
//         const alamat_domisili_jenis_jalan = dataArray[28];
//         const alamat_domisili_pemilik_bangunan = dataArray[29];
//         const alamat_domisili_lokasi_bangunan = dataArray[30];
//         const alamat_pekerjaan_plus_code = dataArray[31];
//         const alamat_pekerjaan_jalan = dataArray[32];
//         const alamat_pekerjaan_kelurahan = dataArray[33];
//         const alamat_pekerjaan_kecamatan = dataArray[34];
//         const alamat_pekerjaan_kabupaten = dataArray[35];
//         const alamat_pekerjaan_provinsi = dataArray[36];
//         const alamat_pekerjaan = dataArray[37];
//         const alamat_pekerjaan_lat = dataArray[38];
//         const alamat_pekerjaan_lon = dataArray[39];
//         const alamat_pekerjaan_tipe_lokasi = dataArray[40];
//         const alamat_pekerjaan_place_id = dataArray[41];
//         const alamat_aset_plus_code = dataArray[42];
//         const alamat_aset_jalan = dataArray[43];
//         const alamat_aset_kelurahan = dataArray[44];
//         const alamat_aset_kecamatan = dataArray[45];
//         const alamat_aset_kabupaten = dataArray[46];
//         const alamat_aset_provinsi = dataArray[47];
//         const alamat_aset = dataArray[48];
//         const alamat_aset_lat = dataArray[49];
//         const alamat_aset_lon = dataArray[50];
//         const alamat_aset_tipe_lokasi = dataArray[51];
//         const alamat_aset_place_id = dataArray[52];
//         const jenis_aset = dataArray[53];
//         const nilai_aset = dataArray[54];
//         const lokasi_saat_ini_lat = dataArray[55];
//         const lokasi_saat_ini_lon = dataArray[56];
//         const lokasi_bts_lat = dataArray[57];
//         const lokasi_bts_lon = dataArray[58];
//         const lokasi_check_in_digital_lat = dataArray[59];
//         const lokasi_check_in_digital_lon = dataArray[60];
//         const jenis_check_in_digital = dataArray[61];
//         const lokasi_2_minggu_terakhir_lat = dataArray[62];
//         const lokasi_2_minggu_terakhir_lon = dataArray[63];
//         const lokasi_3_minggu_terakhir_lat = dataArray[64];
//         const lokasi_3_minggu_terakhir_lon = dataArray[65];
//         const lokasi_4_minggu_terakhir_lat = dataArray[66];
//         const lokasi_4_minggu_terakhir_lon = dataArray[67];
//         // console.log(lokasi_4_minggu_terakhir_lon)
//         const credit_score = dataArray[68];
//         // console.log(credit_score)
//         // console.log(credit_score)

//         const locationScore = axios.post(process.env.IDENTITY_LOCATION_ML, {
//           ktpid: ktpId,
//           selfieid: selfieId,
//           data: {
//             date,
//             time,
//             nama,
//             alamat_ktp_plus_code,
//             alamat_ktp_jalan,
//             alamat_ktp_kelurahan,
//             alamat_ktp_kecamatan,
//             alamat_ktp_kabupaten,
//             alamat_ktp_provinsi,
//             alamat_ktp,
//             alamat_ktp_lat,
//             alamat_ktp_lon,
//             alamat_ktp_tipe_lokasi,
//             alamat_ktp_place_id,
//             alamat_ktp_jenis_jalan,
//             alamat_ktp_pemilik_bangunan,
//             alamat_ktp_lokasi_bangunan,
//             alamat_domisili_plus_code,
//             alamat_domisili_jalan,
//             alamat_domisili_kelurahan,
//             alamat_domisili_kecamatan,
//             alamat_domisili_kabupaten,
//             alamat_domisili_provinsi,
//             alamat_domisili,
//             alamat_domisili_lat,
//             alamat_domisili_lon,
//             alamat_domisili_tipe_lokasi,
//             alamat_domisili_place_id,
//             alamat_domisili_jenis_jalan,
//             alamat_domisili_pemilik_bangunan,
//             alamat_domisili_lokasi_bangunan,
//             alamat_pekerjaan_plus_code,
//             alamat_pekerjaan_jalan,
//             alamat_pekerjaan_kelurahan,
//             alamat_pekerjaan_kecamatan,
//             alamat_pekerjaan_kabupaten,
//             alamat_pekerjaan_provinsi,
//             alamat_pekerjaan,
//             alamat_pekerjaan_lat,
//             alamat_pekerjaan_lon,
//             alamat_pekerjaan_tipe_lokasi,
//             alamat_pekerjaan_place_id,
//             alamat_aset_plus_code,
//             alamat_aset_jalan,
//             alamat_aset_kelurahan,
//             alamat_aset_kecamatan,
//             alamat_aset_kabupaten,
//             alamat_aset_provinsi,
//             alamat_aset,
//             alamat_aset_lat,
//             alamat_aset_lon,
//             alamat_aset_tipe_lokasi,
//             alamat_aset_place_id,
//             jenis_aset,
//             nilai_aset,
//             lokasi_saat_ini_lat,
//             lokasi_saat_ini_lon,
//             lokasi_bts_lat,
//             lokasi_bts_lon,
//             lokasi_check_in_digital_lat,
//             lokasi_check_in_digital_lon,
//             jenis_check_in_digital,
//             lokasi_2_minggu_terakhir_lat,
//             lokasi_2_minggu_terakhir_lon,
//             lokasi_3_minggu_terakhir_lat,
//             lokasi_3_minggu_terakhir_lon,
//             lokasi_4_minggu_terakhir_lat,
//             lokasi_4_minggu_terakhir_lon,
//             credit_score
//           }

//         }).then(response => {
//           const generateShortUUID = () => {
//             let shortUUID;
//             do {
//               const uuid = uuidv4().replace(/-/g,'');
//               shortUUID = uuid.substring(0, 8);
//             } while (shortUUID.charAt(0) !== '0');
//             return shortUUID;
//           }

//           const id = generateShortUUID();

//           const newRequest = prisma.request.create({
//             data: {
//               no: id,
//               jenis_permintaan: "IDENTITAS DAN LOKASI",
//               jumlah_customer: 1,
//             }
//           }).then(response => {
//             console.log("Uploaded")
//           }).catch(err => {
//             console.log(err);
//           });;

//           return res.status(200).send({
//             message: "Credit scoring predicted successfully",
//             result: response.data
//           });
//         }).catch(err => {
//           console.log(err)
//         })
//       });
//   } catch (error) {
//     console.log(error)
//   }

// })

app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});


app.post("/exel-identity", async (req, res) => {
  if (req.files === undefined) {
    return res.status(400).send({
      message: "No File Uploaded",
    });
  }

  const ktp = req.files.ktp;
  const foto = req.files.foto;
  const excelFile = req.files.excelFile;

  if (!ktp || !foto || !excelFile) {
    return res.status(400).send({
      message: "KTP, Photo, or CSV file has not been uploaded",
    });
  }

  const ktpSize = ktp.data.length;
  const fotoSize = foto.data.length;
  const excelFileSize = excelFile.data.length;

  const extKTP = path.extname(ktp.name);
  const extFoto = path.extname(foto.name);
  const extExcel = path.extname(excelFile.name);

  const ktpName = ktp.md5 + extKTP;
  const fotoName = foto.md5 + extFoto;
  const excelFileName = excelFile.md5 + extExcel;

  const uploadDirImages = path.join(__dirname, "public", "images");
  const uploadDirExcel = path.join(__dirname, "public", "excel");

  if (!fs.existsSync(uploadDirImages))
    fs.mkdirSync(uploadDirImages, { recursive: true });
  if (!fs.existsSync(uploadDirExcel))
    fs.mkdirSync(uploadDirExcel, { recursive: true });

  const urlKTP = `${req.protocol}://${req.get(
    "host"
  )}/public/images/${ktpName}`;
  const urlFoto = `${req.protocol}://${req.get(
    "host"
  )}/public/images/${fotoName}`;
  const urlExcel = `${req.protocol}://${req.get(
    "host"
  )}/public/excel/${excelFileName}`;

  const allowedImageTypes = [".png", ".jpg", ".jpeg"];
  const allowedCSVTypes = [".csv", ".xlsx"];

  if (
    !allowedImageTypes.includes(extKTP.toLowerCase()) ||
    !allowedImageTypes.includes(extFoto.toLowerCase())
  ) {
    return res.status(422).send({
      message: "Invalid Image Extension",
    });
  }

  if (!allowedCSVTypes.includes(extExcel.toLowerCase())) {
    return res.status(422).send({
      message: "Invalid CSV file Extension",
    });
  }

  if (ktpSize > 1000000 || fotoSize > 1000000) {
    return res.status(422).send({
      message: "Image must be less than 1 MB",
    });
  }

  if (excelFileSize > 5000000) {
    return res.status(422).send({
      message: "CSV file must be less than 5 MB",
    });
  }

  const uploadImage = (image, imageName) => {
    return new Promise((resolve, reject) => {
      const uploadPath = path.join(uploadDirImages, imageName);
      image.mv(uploadPath, (err) => {
        if (err) reject(err);
        else resolve(uploadPath);
      });
    });
  };

  const uploadCSV = (excelFile, excelFileName) => {
    return new Promise((resolve, reject) => {
      const uploadPath = path.join(uploadDirExcel, excelFileName);
      excelFile.mv(uploadPath, (err) => {
        if (err) reject(err);
        else resolve(uploadPath);
      });
    });
  };

  // const getToken = async () => {
  //   try {
  //     const response = await axios.post(`${process.env.ML_API}/auth`, {
  //       username: process.env.ML_API_USERNAME, // Atur username di .env
  //       password: process.env.ML_API_PASSWORD, // Atur password di .env
  //     });

  //     return response.data.token; // Pastikan sesuai dengan respons API
  //   } catch (error) {
  //     console.error("Error fetching token:", error);
  //     throw new Error("Failed to fetch token from ML API");
  //   }
  // };

  try {
    // const token = await getToken();
    const ktpPath = await uploadImage(ktp, ktpName);
    const fotoPath = await uploadImage(foto, fotoName);
    const excelFilePath = await uploadCSV(excelFile, excelFileName);

    const formDataKTP = new FormData();
    formDataKTP.append("image", fs.createReadStream(ktpPath));

    const formDataFoto = new FormData();
    formDataFoto.append("image", fs.createReadStream(fotoPath));

    const axiosConfig = {
      headers: {
        Authorization: `Bearer ${process.env.ML_API_KEY}`,
        ...formDataKTP.getHeaders(),
      },
    };

    const uploadKtp = await axios.post(
      `${process.env.ML_API}/api/image/upload/`,
      formDataKTP,
      axiosConfig
    );
    const uploadFoto = await axios.post(
      `${process.env.ML_API}/api/image/upload/`,
      formDataFoto,
      axiosConfig
    );

    const ktpId = uploadKtp.data.data.image.id;
    const selfieId = uploadFoto.data.data.image.id;

    console.log("KTP ID:", ktpId);
    console.log("Selfie ID:", selfieId);

    const workbook = xlsx.read(excelFile.data, { type: "buffer" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = xlsx.utils.sheet_to_json(worksheet, { defval: "" });

    const saveEntries = async () => {
      try {
        const dataEntries = jsonData.map((entry) => {
          return prisma.exelIdentity.create({
            data: {
              date: new Date(entry.date),
              time: entry.time,
              nama: entry.nama,
              alamat_ktp_plus_code: entry.alamat_ktp_plus_code,
              alamat_ktp_jalan: entry.alamat_ktp_jalan,
              alamat_ktp_kelurahan: entry.alamat_ktp_kelurahan,
              alamat_ktp_kecamatan: entry.alamat_ktp_kecamatan,
              alamat_ktp_kabupaten: entry.alamat_ktp_kabupaten,
              alamat_ktp_provinsi: entry.alamat_ktp_provinsi,
              alamat_ktp: entry.alamat_ktp,
              alamat_ktp_lat: entry.alamat_ktp_lat,
              alamat_ktp_lon: entry.alamat_ktp_lon,
              alamat_ktp_tipe_lokasi: entry.alamat_ktp_tipe_lokasi,
              alamat_ktp_place_id: entry.alamat_ktp_place_id,
              alamat_ktp_jenis_jalan: entry.alamat_ktp_jenis_jalan,
              alamat_ktp_pemilik_bangunan: entry.alamat_ktp_pemilik_bangunan,
              alamat_ktp_lokasi_bangunan: entry.alamat_ktp_lokasi_bangunan,
              alamat_domisili_plus_code: entry.alamat_domisili_plus_code,
              alamat_domisili_jalan: entry.alamat_domisili_jalan,
              alamat_domisili_kelurahan: entry.alamat_domisili_kelurahan,
              alamat_domisili_kecamatan: entry.alamat_domisili_kecamatan,
              alamat_domisili_kabupaten: entry.alamat_domisili_kabupaten,
              alamat_domisili_provinsi: entry.alamat_domisili_provinsi,
              alamat_domisili: entry.alamat_domisili,
              alamat_domisili_lat: entry.alamat_domisili_lat,
              alamat_domisili_lon: entry.alamat_domisili_lon,
              alamat_domisili_tipe_lokasi: entry.alamat_domisili_tipe_lokasi,
              alamat_domisili_place_id: entry.alamat_domisili_place_id,
              alamat_domisili_jenis_jalan: entry.alamat_domisili_jenis_jalan,
              alamat_domisili_pemilik_bangunan:
                entry.alamat_domisili_pemilik_bangunan,
              alamat_domisili_lokasi_bangunan:
                entry.alamat_domisili_lokasi_bangunan,
              alamat_pekerjaan_plus_code: entry.alamat_pekerjaan_plus_code,
              alamat_pekerjaan_jalan: entry.alamat_pekerjaan_jalan,
              alamat_pekerjaan_kelurahan: entry.alamat_pekerjaan_kelurahan,
              alamat_pekerjaan_kecamatan: entry.alamat_pekerjaan_kecamatan,
              alamat_pekerjaan_kabupaten: entry.alamat_pekerjaan_kabupaten,
              alamat_pekerjaan_provinsi: entry.alamat_pekerjaan_provinsi,
              alamat_pekerjaan: entry.alamat_pekerjaan,
              alamat_pekerjaan_lat: entry.alamat_pekerjaan_lat,
              alamat_pekerjaan_lon: entry.alamat_pekerjaan_lon,
              alamat_pekerjaan_tipe_lokasi: entry.alamat_pekerjaan_tipe_lokasi,
              alamat_pekerjaan_place_id: entry.alamat_pekerjaan_place_id,
              alamat_aset_plus_code: entry.alamat_aset_plus_code,
              alamat_aset_jalan: entry.alamat_aset_jalan,
              alamat_aset_kelurahan: entry.alamat_aset_kelurahan,
              alamat_aset_kecamatan: entry.alamat_aset_kecamatan,
              alamat_aset_kabupaten: entry.alamat_aset_kabupaten,
              alamat_aset_provinsi: entry.alamat_aset_provinsi,
              alamat_aset: entry.alamat_aset,
              alamat_aset_lat: entry.alamat_aset_lat,
              alamat_aset_lon: entry.alamat_aset_lon,
              alamat_aset_tipe_lokasi: entry.alamat_aset_tipe_lokasi,
              alamat_aset_place_id: entry.alamat_aset_place_id,
              jenis_aset: entry.jenis_aset,
              nilai_aset: entry.nilai_aset,
              lokasi_saat_ini_lat: entry.lokasi_saat_ini_lat,
              lokasi_saat_ini_lon: entry.lokasi_saat_ini_lon,
              lokasi_bts_lat: entry.lokasi_bts_lat,
              lokasi_bts_lon: entry.lokasi_bts_lon,
              lokasi_check_in_digital_lat: entry.lokasi_check_in_digital_lat,
              lokasi_check_in_digital_lon: entry.lokasi_check_in_digital_lon,
              jenis_check_in_digital: entry.jenis_check_in_digital,
              lokasi_2_minggu_terakhir_lat: entry.lokasi_2_minggu_terakhir_lat,
              lokasi_2_minggu_terakhir_lon: entry.lokasi_2_minggu_terakhir_lon,
              lokasi_3_minggu_terakhir_lat: entry.lokasi_3_minggu_terakhir_lat,
              lokasi_3_minggu_terakhir_lon: entry.lokasi_3_minggu_terakhir_lon,
              lokasi_4_minggu_terakhir_lat: entry.lokasi_4_minggu_terakhir_lat,
              lokasi_4_minggu_terakhir_lon: entry.lokasi_4_minggu_terakhir_lon,
            },
          });
        });

        // Tunggu hingga semua promise selesai
        await Promise.all(dataEntries);

        console.log("Semua data berhasil disimpan!");
      } catch (err) {
        console.error("Error saving entries to database:", err);
      }
    };

    // Panggil fungsi saveEntries untuk menjalankan proses
    saveEntries();

    // Mengirim data JSON bersama dengan ktpId dan selfieId ke API ML
    const mlResponse = await axios.post(
      `${process.env.ML_API}/identityscore`,
      {
        ktpid: ktpId,
        selfieid: selfieId,
        // data: {
        //   date: "2023-06-21",
        //   time: "10:16:18.396268",
        //   nama: "Elvina Sudiati",
        //   alamat_ktp_plus_code: "16",
        //   alamat_ktp_jalan: "Jalan Veteran II",
        //   alamat_ktp_kelurahan: "Selabatu",
        //   alamat_ktp_kecamatan: "Kabupaten Sukabumi",
        //   alamat_ktp_kabupaten: "Kota Sukabumi",
        //   alamat_ktp_provinsi: "Jawa Barat",
        //   alamat_ktp:
        //     "Jl. Veteran II No.16, RW.06, Selabatu, Kab. Sukabumi, Kota Sukabumi, Jawa Barat 43111, Indonesia",
        //   alamat_ktp_lat: -6.9182816,
        //   alamat_ktp_lon: 106.9265299,
        //   alamat_ktp_tipe_lokasi: "ROOFTOP",
        //   alamat_ktp_place_id: "ChIJPekRmzFIaC4R9oKxo7eRlyM",
        //   alamat_ktp_jenis_jalan: "Jalan Besar",
        //   alamat_ktp_pemilik_bangunan: "Perorangan Pribadi",
        //   alamat_ktp_lokasi_bangunan: "Kawasan Pegunungan",
        //   alamat_domisili_plus_code: "GV93+9QC",
        //   alamat_domisili_jalan: "Jalan Guru Suma",
        //   alamat_domisili_kelurahan: "Cibinong",
        //   alamat_domisili_kecamatan: "Kecamatan Cibinong",
        //   alamat_domisili_kabupaten: "Kabupaten Bogor",
        //   alamat_domisili_provinsi: "Jawa Barat",
        //   alamat_domisili:
        //     "GV93+9QC, Jl. Guru Suma, Cibinong, Kec. Cibinong, Kabupaten Bogor, Jawa Barat 16911, Indonesia",
        //   alamat_domisili_lat: -6.4815687,
        //   alamat_domisili_lon: 106.8544011,
        //   alamat_domisili_tipe_lokasi: "GEOMETRIC_CENTER",
        //   alamat_domisili_place_id: "ChIJ8WmgsYbBaS4R11326Gwh7XY",
        //   alamat_domisili_jenis_jalan: "Jalan Kecil",
        //   alamat_domisili_pemilik_bangunan: "Pemerintah",
        //   alamat_domisili_lokasi_bangunan: "Kawasan Perumahan",
        //   alamat_pekerjaan_plus_code: "GV93+9QC",
        //   alamat_pekerjaan_jalan: "Jalan Guru Suma",
        //   alamat_pekerjaan_kelurahan: "Cibinong",
        //   alamat_pekerjaan_kecamatan: "Kecamatan Cibinong",
        //   alamat_pekerjaan_kabupaten: "Kabupaten Bogor",
        //   alamat_pekerjaan_provinsi: "Jawa Barat",
        //   alamat_pekerjaan:
        //     "GV93+9QC, Jl. Guru Suma, Cibinong, Kec. Cibinong, Kabupaten Bogor, Jawa Barat 16911, Indonesia",
        //   alamat_pekerjaan_lat: -6.4815687,
        //   alamat_pekerjaan_lon: 106.8544011,
        //   alamat_pekerjaan_tipe_lokasi: "GEOMETRIC_CENTER",
        //   alamat_pekerjaan_place_id: "ChIJ8WmgsYbBaS4R11326Gwh7XY",
        //   alamat_aset_plus_code: "7M8X+52M",
        //   alamat_aset_jalan: "Besuki",
        //   alamat_aset_kelurahan: "Besuki",
        //   alamat_aset_kecamatan: "Kecamatan Besuki",
        //   alamat_aset_kabupaten: "Kabupaten Situbondo",
        //   alamat_aset_provinsi: "Jawa Timur",
        //   alamat_aset:
        //     "7M8X+52M, Besuki, Kec. Besuki, Kabupaten Situbondo, Jawa Timur 68356, Indonesia",
        //   alamat_aset_lat: -7.7345357,
        //   alamat_aset_lon: 113.6975385,
        //   alamat_aset_tipe_lokasi: "ROOFTOP",
        //   alamat_aset_place_id: "ChIJ5_6gKPQe1y0RvGO6cj91fTg",
        //   jenis_aset: "Kendaraan",
        //   nilai_aset: 145006357,
        //   lokasi_saat_ini_lat: -6.9182816,
        //   lokasi_saat_ini_lon: 106.9265299,
        //   lokasi_bts_lat: -7.01833,
        //   lokasi_bts_lon: 107.60389,
        //   lokasi_check_in_digital_lat: -7.5790982,
        //   lokasi_check_in_digital_lon: 112.2312996,
        //   jenis_check_in_digital: "Kantor",
        //   lokasi_2_minggu_terakhir_lat: 3.7275508,
        //   lokasi_2_minggu_terakhir_lon: 98.6738755,
        //   lokasi_3_minggu_terakhir_lat: 3.7275508,
        //   lokasi_3_minggu_terakhir_lon: 98.6738755,
        //   lokasi_4_minggu_terakhir_lat: -6.4815687,
        //   lokasi_4_minggu_terakhir_lon: 106.8544011,
        // },
        data: jsonData[0],
        // data: {
        //   date,
        //   time,
        //   nama,
        //   alamat_ktp_plus_code,
        //   alamat_ktp_jalan,
        //   alamat_ktp_kelurahan,
        //   alamat_ktp_kecamatan,
        //   alamat_ktp_kabupaten,
        //   alamat_ktp_provinsi,
        //   alamat_ktp,
        //   alamat_ktp_lat,
        //   alamat_ktp_lon,
        //   alamat_ktp_tipe_lokasi,
        //   alamat_ktp_place_id,
        //   alamat_ktp_jenis_jalan,
        //   alamat_ktp_pemilik_bangunan,
        //   alamat_ktp_lokasi_bangunan,
        //   alamat_domisili_plus_code,
        //   alamat_domisili_jalan,
        //   alamat_domisili_kelurahan,
        //   alamat_domisili_kecamatan,
        //   alamat_domisili_kabupaten,
        //   alamat_domisili_provinsi,
        //   alamat_domisili,
        //   alamat_domisili_lat,
        //   alamat_domisili_lon,
        //   alamat_domisili_tipe_lokasi,
        //   alamat_domisili_place_id,
        //   alamat_domisili_jenis_jalan,
        //   alamat_domisili_pemilik_bangunan,
        //   alamat_domisili_lokasi_bangunan,
        //   alamat_pekerjaan_plus_code,
        //   alamat_pekerjaan_jalan,
        //   alamat_pekerjaan_kelurahan,
        //   alamat_pekerjaan_kecamatan,
        //   alamat_pekerjaan_kabupaten,
        //   alamat_pekerjaan_provinsi,
        //   alamat_pekerjaan,
        //   alamat_pekerjaan_lat,
        //   alamat_pekerjaan_lon,
        //   alamat_pekerjaan_tipe_lokasi,
        //   alamat_pekerjaan_place_id,
        //   alamat_aset_plus_code,
        //   alamat_aset_jalan,
        //   alamat_aset_kelurahan,
        //   alamat_aset_kecamatan,
        //   alamat_aset_kabupaten,
        //   alamat_aset_provinsi,
        //   alamat_aset,
        //   alamat_aset_lat,
        //   alamat_aset_lon,
        //   alamat_aset_tipe_lokasi,
        //   alamat_aset_place_id,
        //   jenis_aset,
        //   nilai_aset,
        //   lokasi_saat_ini_lat,
        //   lokasi_saat_ini_lon,
        //   lokasi_bts_lat,
        //   lokasi_bts_lon,
        //   lokasi_check_in_digital_lat,
        //   lokasi_check_in_digital_lon,
        //   jenis_check_in_digital,
        //   lokasi_2_minggu_terakhir_lat,
        //   lokasi_2_minggu_terakhir_lon,
        //   lokasi_3_minggu_terakhir_lat,
        //   lokasi_3_minggu_terakhir_lon,
        //   lokasi_4_minggu_terakhir_lat,
        //   lokasi_4_minggu_terakhir_lon,
        // },
      },
      console.log(jsonData),
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.ML_API_KEY}`,
        },
      }
    );

    res.status(200).json({
      mlResponse: mlResponse.data,
    });
    console.log("Data payload:", JSON.stringify(data));
  } catch (error) {
    console.error("Error during processing:", error);
    res.status(500).send({ message: "Internal Server Error", error });
  }
});