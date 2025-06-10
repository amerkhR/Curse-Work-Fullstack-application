const db = require("../models");
const User = db.user;
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Настройка хранилища для загрузки файлов
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/profiles");
  },
  filename: function (req, file, cb) {
    cb(null, `profile_${req.userId}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5000000 }, // 5MB
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Только изображения в формате jpeg, jpg или png!"));
  },
}).single("photo");

// Получение профиля пользователя
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    // Если есть фото, формируем полный URL
    if (user.photo_path) {
      const photoUrl = `${req.protocol}://${req.get(
        "host"
      )}/${user.photo_path.replace(/\\/g, "/")}`;
      user.photo = photoUrl;
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: "Ошибка при получении профиля",
      error: error.message,
    });
  }
};

// Обновление профиля пользователя
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId);

    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    const updateData = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
    };

    await user.update(updateData);

    res.status(200).json({
      message: "Профиль успешно обновлен",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        photo: user.photo,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Ошибка при обновлении профиля",
      error: error.message,
    });
  }
};

// Загрузка фото профиля
exports.uploadPhoto = (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      return res.status(400).json({
        message: "Ошибка при загрузке фото",
        error: err.message,
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Файл не был загружен",
      });
    }

    try {
      const user = await User.findByPk(req.userId);
      if (!user) {
        return res.status(404).json({ message: "Пользователь не найден" });
      }

      // Удаляем старое фото, если оно существует
      if (user.photo_path) {
        const oldFilePath = path.join(__dirname, "..", "..", user.photo_path);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }

      // Сохраняем путь к новому фото
      const photoPath = req.file.path.replace(/\\/g, "/");
      await user.update({ photo_path: photoPath });

      // Формируем полный URL для нового фото
      const photoUrl = `${req.protocol}://${req.get("host")}/${photoPath}`;

      res.status(200).json({
        message: "Фото профиля успешно загружено",
        photo: photoUrl,
      });
    } catch (error) {
      res.status(500).json({
        message: "Ошибка при сохранении фото",
        error: error.message,
      });
    }
  });
};

// Обновление предпочтений пользователя
exports.updatePreferences = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId);

    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    const preferences = {
      preferred_salary: req.body.preferred_salary,
      preferred_experience: req.body.preferred_experience,
      preferred_work_format: req.body.preferred_work_format,
      preferred_schedule: req.body.preferred_schedule,
      preferred_accessibility: req.body.preferred_accessibility,
    };

    await user.update(preferences);

    res.status(200).json({
      message: "Предпочтения успешно обновлены",
      preferences: preferences,
    });
  } catch (error) {
    res.status(500).json({
      message: "Ошибка при обновлении предпочтений",
      error: error.message,
    });
  }
};
