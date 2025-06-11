import React, { useState, useEffect } from "react";
import { FaStar, FaTrash } from "react-icons/fa";
import classes from "./home.module.css";
import { connect } from "react-redux";
import reviewService from "../services/review.service";

const Review = ({ companyId, user }) => {
  const [reviews, setReviews] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [text, setText] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, [companyId]);

  const fetchReviews = async () => {
    try {
      const response = await reviewService.getCompanyReviews(companyId);
      setReviews(response.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await reviewService.createReview(
        rating,
        text,
        companyId
      );
      setReviews([response.data, ...reviews]);
      setShowModal(false);
      setRating(0);
      setText("");
      setError(null);
    } catch (error) {
      console.error("Error creating review:", error);
      setError("Ошибка при добавлении отзыва");
    }
  };

  const handleDelete = async (reviewId) => {
    try {
      await reviewService.deleteReview(reviewId);
      setReviews(reviews.filter((review) => review.id !== reviewId));
    } catch (error) {
      console.error("Error deleting review:", error);
      setError("Ошибка при удалении отзыва");
    }
  };

  const handleStarClick = (index, isHalf) => {
    const newRating = isHalf ? index + 0.5 : index + 1;
    setRating(newRating);
  };

  const handleStarHover = (index, isHalf) => {
    const newRating = isHalf ? index + 0.5 : index + 1;
    setHoverRating(newRating);
  };

  return (
    <div className={classes.reviews_section}>
      <div className={classes.reviews_header}>
        <button
          className={classes.add_review_btn}
          onClick={() => setShowModal(true)}
        >
          Добавить отзыв
        </button>
      </div>

      {error && <div className={classes.error_message}>{error}</div>}

      <div className={classes.reviews_list}>
        {reviews.map((review) => (
          <div key={review.id} className={classes.review_item}>
            <div className={classes.review_header}>
              <div className={classes.review_user}>
                <img
                  src={review.user.avatar || "/default-avatar.png"}
                  alt={review.user.username}
                  className={classes.review_avatar}
                />
                <span className={classes.review_username}>
                  {review.user.username}
                </span>
              </div>
              {user && user.id === review.userId && (
                <FaTrash
                  className={classes.delete_review_btn}
                  onClick={() => handleDelete(review.id)}
                />
              )}
            </div>
            <div className={classes.review_rating}>
              {[...Array(5)].map((_, index) => (
                <FaStar
                  key={index}
                  className={classes.star}
                  style={{
                    color: index < review.rating ? "#ffd700" : "#e4e5e9",
                  }}
                />
              ))}
            </div>
            <p className={classes.review_text}>{review.text}</p>
          </div>
        ))}
      </div>

      {showModal && (
        <div className={classes.modal_overlay}>
          <div className={classes.modal_content}>
            <h3>Добавить отзыв</h3>
            <form onSubmit={handleSubmit}>
              <div className={classes.rating_input}>
                {[...Array(5)].map((_, index) => (
                  <div key={index} style={{ position: "relative" }}>
                    <FaStar
                      className={`${classes.star} ${
                        index + 0.5 === (hoverRating || rating)
                          ? classes.half
                          : ""
                      }`}
                      style={{
                        color:
                          index < (hoverRating || rating)
                            ? "#ffd700"
                            : "#e4e5e9",
                      }}
                      onClick={() => handleStarClick(index, false)}
                      onMouseEnter={() => handleStarHover(index, false)}
                      onMouseLeave={() => setHoverRating(0)}
                    />
                    <FaStar
                      className={classes.star}
                      style={{
                        color:
                          index + 0.5 <= (hoverRating || rating)
                            ? "#ffd700"
                            : "#e4e5e9",
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "50%",
                        overflow: "hidden",
                      }}
                      onClick={() => handleStarClick(index, true)}
                      onMouseEnter={() => handleStarHover(index, true)}
                      onMouseLeave={() => setHoverRating(0)}
                    />
                  </div>
                ))}
              </div>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Напишите ваш отзыв..."
                required
                className={classes.review_textarea}
              />
              <div className={classes.modal_buttons}>
                <button type="submit" className={classes.submit_btn}>
                  Сохранить
                </button>
                <button
                  type="button"
                  className={classes.cancel_btn}
                  onClick={() => setShowModal(false)}
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps)(Review);
