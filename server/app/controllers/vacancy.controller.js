const db = require("../models");
const Vacancy = db.vacancy;

exports.createVac = async (req, res) => {
  const newData = req.body;

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
};

exports.deleteVac = async (req, res) => {
  const vacancyId = parseInt(req.params.id, 10);

  try {
    const deletedRowCount = await Vacancy.destroy({
      where: { id: vacancyId },
    });

    if (deletedRowCount > 0) {
      res.status(200).json({ message: "Vacancy deleted successfully" });
    } else {
      res.status(404).json({ message: "Vacancy not found" });
    }
  } catch (error) {
    console.error("Error deleting vacancy:", error);
    res
      .status(500)
      .json({ message: "Error deleting vacancy", error: error.message });
  }
};

exports.showVac = async (req, res) => {
  Vacancy.findAll({ order: [["id", "ASC"]] })
    .then((vacs) => {
      res.status(200).send({
        vacs: vacs,
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
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

    res.status(200).json(vacancy);
  } catch (error) {
    console.error("Ошибка при получении вакансии:", error);
    res.status(500).json({
      message: "Ошибка при получении вакансии",
      error: error.message,
    });
  }
};
