const db = require("../models");
const Review = db.review;
const User = db.user;
const Company = db.company;

exports.createReview = async (req, res) => {
  try {
    const { rating, text, companyId } = req.body;
    const userId = req.userId;

    const review = await Review.create({
      rating,
      text,
      userId,
      companyId
    });

    const user = await User.findByPk(userId);
    const company = await Company.findByPk(companyId);

    if (!company) {
      return res.status(404).send({ message: "Компания не найдена" });
    }

    res.status(201).send({
      ...review.toJSON(),
      user: {
        username: user.username,
        avatar: user.avatar
      }
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.getCompanyReviews = async (req, res) => {
  try {
    const { companyId } = req.params;
    const reviews = await Review.findAll({
      where: { companyId },
      include: [{
        model: User,
        attributes: ['username', 'avatar']
      }]
    });

    res.status(200).send(reviews);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const review = await Review.findByPk(id);
    if (!review) {
      return res.status(404).send({ message: "Отзыв не найден" });
    }

    if (review.userId !== userId) {
      return res.status(403).send({ message: "Нет прав на удаление этого отзыва" });
    }

    await review.destroy();
    res.status(200).send({ message: "Отзыв успешно удален" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}; 