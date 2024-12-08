import express from "express";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { PORT } from "./config.js";
import multer from "multer";

import { v2 as cloudinary } from "cloudinary";

const app = express();

const __dirname = dirname(fileURLToPath(import.meta.url));

(async function () {
  // Configuration
  cloudinary.config({
    cloud_name: "dd2aozvnz",
    api_key: "952188984381178",
    api_secret: "fCE7WT-NTLrrvs0Jbh6FkXGVG0M", // Click 'View API Keys' above to copy your API secret
  });
})();

// Configuracion de almacenamiento en disco
// const diskStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "api/upload");
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });

// Configuracion de almacenamiento en memoria (Vercel)
const memoryStorage = multer.memoryStorage();

//Inicializacion de multer
const upload = multer({ storage: memoryStorage });

app.set("views", join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", (req, res) => res.render("index"));

// Ruta para manejar la carga
app.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No se subió ningún archivo." });
    }
    // const filePath = req.file.path;
    const buffer = req.file.buffer;

    // Para almacenamiento en diskStorage
    // const response = await cloudinary.uploader.upload(filePath);

    // Para almacenamiento en memoryStorage
    const response = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({}, (err, result) => {
          if (err) {
            reject(err);
          }
          resolve(result);
        })
        .end(buffer);
    });

    res.json({ url: response.secure_url });
  } catch (error) {
    console.error("Error al subir la imagen:", error);
    res.status(500).json({ message: "Error al procesar la imagen" });
  }
});

app.use(express.static(join(__dirname, "public")));

app.listen(PORT);
console.log("Server on port ", PORT);
