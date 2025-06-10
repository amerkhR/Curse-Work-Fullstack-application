const db = require("../models");
const Vacancy = db.vacancy;
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Настройка хранилища для загрузки видео
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = "./uploads/videos";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, `video_${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 100000000 }, // 100MB
  fileFilter: function (req, file, cb) {
    const filetypes = /mp4|webm|ogg/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Только видео в формате mp4, webm или ogg!"));
  },
}).single("video");

exports.createVac = async (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      return res.status(400).json({
        message: "Ошибка при загрузке видео",
        error: err.message,
      });
    }

    const newData = req.body;
    let videoPath = null;

    if (req.file) {
      videoPath = req.file.path.replace(/\\/g, "/");
    }

    try {
      const createdVacancy = await Vacancy.create({
        name: newData.name,
        company: newData.company,
        salary: newData.salary,
        experience: newData.experience,
        workFormat: newData.workFormat,
        schedule: newData.schedule,
        accessibility: newData.accessibility,
        responsibilities: newData.responsibilities,
        requirements: newData.requirements,
        conditions: newData.conditions,
        video_path: videoPath,
      });

      res.status(200).json({
        message: "Вакансия успешно создана",
        vacancy: createdVacancy,
      });
    } catch (error) {
      console.error("Ошибка при создании вакансии:", error);
      res.status(500).json({
        message: "Ошибка при создании вакансии",
        error: error.message,
      });
    }
  });
};

exports.deleteVac = async (req, res) => {
  const vacancyId = parseInt(req.params.id, 10);

  try {
    const vacancy = await Vacancy.findByPk(vacancyId);

    if (!vacancy) {
      return res.status(404).json({ message: "Вакансия не найдена" });
    }

    // Удаляем видео файл, если он существует
    if (vacancy.video_path) {
      const videoPath = path.join(__dirname, "..", "..", vacancy.video_path);
      if (fs.existsSync(videoPath)) {
        fs.unlinkSync(videoPath);
      }
    }

    await vacancy.destroy();
    res.status(200).json({ message: "Вакансия успешно удалена" });
  } catch (error) {
    console.error("Ошибка при удалении вакансии:", error);
    res.status(500).json({
      message: "Ошибка при удалении вакансии",
      error: error.message,
    });
  }
};

exports.showVac = async (req, res) => {
  try {
    const vacs = await Vacancy.findAll({ order: [["id", "ASC"]] });

    // Добавляем полный URL для видео
    const vacsWithVideoUrl = vacs.map((vac) => {
      const vacancy = vac.toJSON();
      if (vacancy.video_path) {
        vacancy.video_url = `${req.protocol}://${req.get("host")}/${
          vacancy.video_path
        }`;
      }
      return vacancy;
    });

    res.status(200).send({
      vacs: vacsWithVideoUrl,
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.favoriteVac = async (req, res) => {
  const vacancyId = parseInt(req.params.id, 10);

  try {
    const vac = await Vacancy.findOne({ where: { id: vacancyId } });
    if (!vac) {
      return res.status(404).json({ message: "Vacancy not found" });
    }

    const updateRowCount = await Vacancy.update(
      { isFavorite: !vac.isFavorite },
      { where: { id: vacancyId } }
    );

    if (updateRowCount > 0) {
      return res.status(200).json({ message: "Vacancy update successfully" });
    } else {
      return res.status(404).json({ message: "Vacancy not found" });
    }
  } catch (error) {
    console.error("Error update vacancy:", error);
    return res
      .status(500)
      .json({ message: "Error update vacancy", error: error.message });
  }
};

exports.getVacancyById = async (req, res) => {
  const vacancyId = parseInt(req.params.id, 10);

  try {
    const vacancy = await Vacancy.findOne({
      where: { id: vacancyId },
    });

    if (!vacancy) {
      return res.status(404).json({ message: "Вакансия не найдена" });
    }

    // Преобразуем данные вакансии в JSON и добавляем URL видео
    const vacancyData = vacancy.toJSON();
    if (vacancyData.video_path) {
      const videoUrl = `${req.protocol}://${req.get("host")}/${
        vacancyData.video_path
      }`;
      console.log("Сформированный URL видео:", videoUrl); // Отладочная информация
      vacancyData.video_url = videoUrl;
    }

    console.log("Отправляемые данные вакансии:", vacancyData); // Отладочная информация
    res.status(200).json(vacancyData);
  } catch (error) {
    console.error("Ошибка при получении вакансии:", error);
    res.status(500).json({
      message: "Ошибка при получении вакансии",
      error: error.message,
    });
  }
};
