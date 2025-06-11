import axios from "axios";

const API_URL = "http://localhost:8080/api/";

class ReviewService {
  createReview(rating, text, companyId) {
    const token = localStorage.getItem("token");
    console.log("Creating review with token:", token);
    console.log("Review data:", { rating, text, companyId });

    return axios.post(
      API_URL + "reviews",
      {
        rating,
        text,
        companyId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
  }

  getCompanyReviews(companyId) {
    console.log("Getting reviews for company:", companyId);
    return axios.get(API_URL + `reviews/company/${companyId}`);
  }

  deleteReview(reviewId) {
    const token = localStorage.getItem("token");
    console.log("Deleting review with token:", token);
    console.log("Review ID to delete:", reviewId);

    return axios.delete(API_URL + `reviews/${reviewId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  }
}

const reviewService = new ReviewService();
export default reviewService;
