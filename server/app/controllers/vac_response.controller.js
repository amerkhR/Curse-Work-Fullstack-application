const db = require("../models")
const Vac_responce = db.vac_response

exports.uploadVacRes = async (req, res) => {

  const newData = req.body;
  Vac_responce.create(newData)
  try {
    if (req.fileValidationError) {
      return res.status(400).json({ message: req.fileValidationError });
    } else if (!req.file) {
      return res.status(400).json({ message: 'Файл не загружен' });
    }

    res.status(200).json({ message: 'Файл успешно загружен' });
  } catch (error) {
    res.status(500).json({ message: 'Произошла ошибка сервера' });
  }
}