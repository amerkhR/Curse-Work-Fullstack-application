const db = require("../models");
const Help = db.help;

exports.createHelp = async (req, res) => {
  try {
    // Убедитесь, что newData определена и содержит нужные данные
    const newData = req.body; // Например, если данные приходят в теле запроса
    const createdHelp = await Help.create(newData); // Использование await для ожидания результата

    res.status(200).json({ message: "Заявка отправлена, спасибо за обратную связь <3" });
  } catch (error) {
    console.error("Error creating help:", error);
    res.status(500).json({ message: 'Error creating help', error: error.message });
  }
};