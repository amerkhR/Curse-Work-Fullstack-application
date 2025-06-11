const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const bcrypt = require("bcryptjs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./resumes/upload_files");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname +
        "-" +
        Date.now() +
        "." +
        file.originalname.split(".").pop()
    );
  },
});

const upload = multer({ storage: storage });
const app = express();
require("./swagger")(app);

app.post("/api/test/vac_response", upload.single("resume"), (req, res) => {
  try {
    if (req.fileValidationError) {
      return res.status(400).json({ message: req.fileValidationError });
    } else if (!req.file) {
      return res.status(400).json({ message: "Файл не загружен" });
    }
    res.status(200).json({ message: "Файл успешно загружен" });
  } catch (error) {
    res.status(500).json({ message: "Произошла ошибка сервера" });
  }
});

var corsOptions = {
  origin: "http://localhost:8081",
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Добавляем статическую раздачу файлов
app.use(express.static(path.join(__dirname)));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(
  "/uploads/videos",
  express.static(path.join(__dirname, "uploads", "videos"))
);

// Добавляем отладочную информацию для проверки путей
console.log("Путь к директории uploads:", path.join(__dirname, "uploads"));
console.log(
  "Путь к директории videos:",
  path.join(__dirname, "uploads", "videos")
);

const db = require("./app/models");
const Role = db.role;
const Agr = db.agr;
const Vacancy = db.vacancy;
const Help = db.help;
const Vac_responce = db.vac_response;

db.sequelize.sync({ force: false }).then(() => {
  console.log("Database synchronized");
  initial();
});

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/vacancy.routes")(app);
require("./app/routes/agr.routes")(app);
require("./app/routes/help.routes")(app);
require("./app/routes/review.routes")(app);
require("./app/routes/vac_response.routes")(app);
require("./app/routes/profile.routes")(app);

// Создаем директорию для загрузки фото профилей, если она не существует
const fs = require("fs");
const uploadDir = "./uploads/profiles";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function initial() {
  Agr.create({
    name: "Agr1",
    status: "Active",
  }).then(() => {
    console.log("Agr1 created successfully.");
  });

  Agr.create({
    name: "Agr2",
    status: "Inactive",
  }).then(() => {
    console.log("Agr2 created successfully.");
  });

  Agr.create({
    name: "Agr3",
    status: "Pending",
  }).then(() => {
    console.log("Agr3 created successfully.");
  });

  Help.create({
    username: "Said",
    contact: "said@aue.com",
    description: "bolh bec ukho",
  }).then(() => {
    console.log("Firs help bid created seccuessfully");
  });
  const fs = require("fs");
  fs.readFile(
    "C:\\Users\\amerkh\\Desktop\\Empower\\Curse-Work-Fullstack-application\\server\\resumes\\resume.docx",
    (err, data) => {
      if (err) throw err;

      const base64file = data.toString("base64");
    }
  );
}
