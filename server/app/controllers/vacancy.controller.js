const db = require("../models");
const Vacancy = db.vacancy;

exports.createVac = async (req, res) => {
    const newData = req.body;

    try {
        const createdVacancy = Vacancy.create(newData)

        res.status(200).json(createdVacancy)
    } catch (error) {
        console.error("Error creating vacancy:", error);
        res.status(500).json({message: 'Error creating vacancy', error: error.message})
    }
}

exports.deleteVac = async (req, res) => {
    const vacancyId  = parseInt(req.params.id, 10);

    try {
        const deletedRowCount = await Vacancy.destroy({
            where: {id: vacancyId}
        });

        if (deletedRowCount > 0) {
            res.status(200).json({ message: "Vacancy deleted successfully"});
        } else {
            res.status(404).json({ message: "Vacancy not found"})
        }
    } catch (error) {
        console.error("Error deleting vacancy:", error);
        res.status(500).json({ message: "Error deleting vacancy", error: error.message})
    }
}

exports.showVac = async(req, res) => {
    Vacancy.findAll()
    .then(vacs => {
        res.status(200).send({
            vacs:vacs
        })
    })
    .catch((err) => {
        res.status(500).send({ message: err.message });
    });
}