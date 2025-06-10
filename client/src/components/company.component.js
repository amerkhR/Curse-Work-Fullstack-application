import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { connect } from "react-redux";
import VacancyService from "../services/vacancy.service";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import "./company.css";

const Company = ({ user }) => {
  const { companyName } = useParams();
  const [company, setCompany] = useState(null);
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState("");

  // Тестовые отзывы (в реальном приложении они будут приходить с сервера)
  const [reviews] = useState([
    {
      id: 1,
      rating: 4.5,
      text: "Отличная компания с дружным коллективом. Хорошие условия труда и возможности для роста.",
      author: "Иван Петров",
      date: "2024-03-15",
    },
    {
      id: 2,
      rating: 5,
      text: "Очень доволен работой в компании. Современный офис, гибкий график, интересные проекты.",
      author: "Мария Сидорова",
      date: "2024-03-10",
    },
    {
      id: 3,
      rating: 3.5,
      text: "Нормальная компания, есть свои плюсы и минусы. Хорошая зарплата, но иногда бывают авралы.",
      author: "Алексей Иванов",
      date: "2024-03-05",
    },
  ]);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        setLoading(true);
        const response = await VacancyService.getVacanciesByCompany(
          companyName
        );
        if (response.data && response.data.length > 0) {
          const companyInfo = {
            name: response.data[0].company,
            description:
              response.data[0].company_description ||
              "Описание компании отсутствует",
            logo: response.data[0].company_logo || null,
            website: response.data[0].company_website || null,
            location: response.data[0].company_location || null,
          };
          setCompany(companyInfo);
          setEditedDescription(companyInfo.description);
          setVacancies(response.data);
        } else {
          setError("Компания не найдена");
        }
      } catch (err) {
        setError(err.message || "Произошла ошибка при загрузке данных");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, [companyName]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    try {
      if (!editedDescription.trim()) {
        setError("Описание не может быть пустым");
        return;
      }

      console.log(
        "Отправка запроса на обновление описания для компании:",
        companyName
      );
      console.log("Новое описание:", editedDescription);

      const response = await VacancyService.updateCompanyDescription(
        companyName,
        editedDescription
      );

      console.log("Ответ сервера:", response.data);

      if (response.data && response.data.company) {
        setCompany((prev) => ({
          ...prev,
          description: response.data.description,
        }));
        setIsEditing(false);
        setError(null);
      } else {
        throw new Error("Неверный формат ответа от сервера");
      }
    } catch (err) {
      console.error("Ошибка при сохранении:", err);
      console.error("Детали ошибки:", {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });
      setError(
        err.response?.data?.message ||
          "Произошла ошибка при сохранении описания"
      );
    }
  };

  const handleCancelClick = () => {
    setEditedDescription(company.description);
    setIsEditing(false);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="star full" />);
    }
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="star half" />);
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaStar key={`empty-${i}`} className="star empty" />);
    }

    return stars;
  };

  if (loading) return <div className="loading">Загрузка...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!company) return <div className="error">Компания не найдена</div>;

  const isAdmin = user && user.roles && user.roles.includes("ROLE_ADMIN");

  return (
    <div className="company-page">
      <div className="company-header">
        {company.logo && (
          <img
            src={company.logo}
            alt={`Логотип ${company.name}`}
            className="company-logo"
          />
        )}
        <div className="company-info">
          <h1>{company.name}</h1>
          {company.location && (
            <p className="company-location">{company.location}</p>
          )}
          {company.website && (
            <a
              href={company.website}
              target="_blank"
              rel="noopener noreferrer"
              className="company-website"
            >
              Официальный сайт
            </a>
          )}
        </div>
      </div>

      <div className="company-description">
        <div className="description-header">
          <h2>О компании</h2>
          {isAdmin && !isEditing && (
            <button className="edit-button" onClick={handleEditClick}>
              Редактировать
            </button>
          )}
        </div>
        {isEditing ? (
          <div className="description-edit">
            <textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              className="description-textarea"
            />
            <div className="edit-buttons">
              <button className="save-button" onClick={handleSaveClick}>
                Сохранить
              </button>
              <button className="cancel-button" onClick={handleCancelClick}>
                Отмена
              </button>
            </div>
          </div>
        ) : (
          <p>{company.description}</p>
        )}
      </div>

      <div className="company-reviews">
        <h2>Отзывы о компании</h2>
        <div className="reviews-list">
          {reviews.map((review) => (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <div className="review-rating">
                  {renderStars(review.rating)}
                  <span className="rating-value">{review.rating}</span>
                </div>
                <div className="review-meta">
                  <span className="review-author">{review.author}</span>
                  <span className="review-date">{review.date}</span>
                </div>
              </div>
              <p className="review-text">{review.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="company-vacancies">
        <h2>Вакансии компании</h2>
        {vacancies.length > 0 ? (
          <div className="vacancies-list">
            {vacancies.map((vacancy) => (
              <Link
                to={`/vacancy/${vacancy.id}`}
                key={vacancy.id}
                className="vacancy-card"
              >
                <h3>{vacancy.name}</h3>
                <div className="vacancy-details">
                  <span className="salary">{vacancy.salary}</span>
                  <span className="experience">{vacancy.experience}</span>
                  <span className="work-format">{vacancy.workFormat}</span>
                </div>
                <div className="vacancy-description">
                  {vacancy.responsibilities && (
                    <p className="responsibilities">
                      {vacancy.responsibilities.split("\n")[0]}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p>На данный момент нет открытых вакансий</p>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps)(Company);
