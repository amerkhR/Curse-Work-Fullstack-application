import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaRegHeart, FaHeart } from "react-icons/fa6";
import classes from "./home.module.css";
import { connect } from "react-redux";

const VacancyDetails = ({ setVacResActive, user }) => {
  const { id } = useParams();
  const [vacancy, setVacancy] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVacancy = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/test/vacancies/${id}`
        );
        setVacancy(response.data);
        setIsFavorite(response.data.isFavorite);
        setLoading(false);
      } catch (error) {
        console.error("Ошибка при получении данных вакансии:", error);
        setError("Не удалось загрузить данные вакансии");
        setLoading(false);
      }
    };

    fetchVacancy();
  }, [id]);

  const handleFavorite = () => {
    if (!user) {
      setError(
        "Чтобы добавлять вакансии в избранное, необходимо авторизоваться"
      );
      setTimeout(() => setError(null), 3000);
      return;
    }

    axios
      .put(`http://localhost:8080/api/test/favorites/${id}`)
      .then((response) => {
        setIsFavorite(!isFavorite);
        console.log("Вакансия успешно обновлена");
      })
      .catch((error) => {
        console.error("Ошибка при обновлении вакансии: ", error);
      });
  };

  const handleApply = (e) => {
    e.preventDefault();
    if (!user) {
      setError("Чтобы откликнуться на вакансию, необходимо авторизоваться");
      setTimeout(() => setError(null), 3000);
      return;
    }
    setVacResActive(true);
  };

  if (loading) {
    return <div className={classes.loading}>Загрузка...</div>;
  }

  if (error) {
    return <div className={classes.error}>{error}</div>;
  }

  if (!vacancy) {
    return <div className={classes.error}>Вакансия не найдена</div>;
  }

  // Функция для разделения текста на пункты
  const splitTextToList = (text) => {
    if (!text) return [];
    return text.split("\n").filter((item) => item.trim() !== "");
  };

  return (
    <div className={classes.vacancy_details_container}>
      {error && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#ff3366",
            color: "white",
            padding: "10px 20px",
            borderRadius: "5px",
            zIndex: 1000,
          }}
        >
          {error}
        </div>
      )}
      <div className={classes.vacancy_details_header}>
        <h1>{vacancy.name}</h1>
        <div>
          {isFavorite ? (
            <FaHeart
              className={`${classes.heart} ${classes.active}`}
              size={30}
              onClick={handleFavorite}
            />
          ) : (
            <FaRegHeart
              className={classes.heart}
              size={30}
              onClick={handleFavorite}
            />
          )}
        </div>
      </div>

      {/* Основная информация */}
      <div className={classes.vacancy_details_main_info}>
        <div className={classes.info_item}>
          <h3>Уровень дохода</h3>
          <p>{vacancy.salary || "Не указан"}</p>
        </div>

        <div className={classes.info_item}>
          <h3>Компания</h3>
          <p>{vacancy.company || "Не указана"}</p>
        </div>

        <div className={classes.info_item}>
          <h3>Опыт работы</h3>
          <p>{vacancy.experience || "Не указан"}</p>
        </div>

        <div className={classes.info_item}>
          <h3>График работы</h3>
          <p>{vacancy.schedule || "Не указан"}</p>
        </div>

        <div className={classes.info_item}>
          <h3>Доступность для инвалидов</h3>
          <p>{vacancy.accessibility || "Не указано"}</p>
        </div>

        <div className={classes.info_item}>
          <h3>Формат работы</h3>
          <p>{vacancy.workFormat || "Не указан"}</p>
        </div>
      </div>

      {/* Детальная информация */}
      <div className={classes.vacancy_details_sections}>
        {vacancy.responsibilities && (
          <div className={classes.section}>
            <h3>Обязанности</h3>
            <ul>
              {splitTextToList(vacancy.responsibilities).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {vacancy.requirements && (
          <div className={classes.section}>
            <h3>Требования</h3>
            <ul>
              {splitTextToList(vacancy.requirements).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {vacancy.conditions && (
          <div className={classes.section}>
            <h3>Условия</h3>
            <ul>
              {splitTextToList(vacancy.conditions).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Обновленная кнопка отклика */}
      <button className={classes.apply_button} onClick={handleApply}>
        Откликнуться
      </button>
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps)(VacancyDetails);
