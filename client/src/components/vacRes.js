import React, { useState, useEffect } from "react";
import "./vacancy-response.css";

const VacRes = ({ active, setActive, vacancy }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  useEffect(() => {
    if (active) {
      // Сохраняем текущую позицию прокрутки
      const scrollY = window.scrollY;

      // Блокируем прокрутку
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.height = "100%";

      // Блокируем тач-скролл
      const preventTouchMove = (e) => {
        if (e.target.closest(".vacancy-response-content")) return;
        e.preventDefault();
      };
      document.addEventListener("touchmove", preventTouchMove, {
        passive: false,
      });

      return () => {
        // Восстанавливаем позицию прокрутки
        const scrollY = document.body.style.top;
        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        document.body.style.height = "";
        window.scrollTo(0, parseInt(scrollY || "0") * -1);

        // Удаляем обработчик тач-событий
        document.removeEventListener("touchmove", preventTouchMove);
      };
    }
  }, [active]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Здесь будет логика отправки формы
    console.log("Form submitted:", formData);
    setActive(false);
  };

  return (
    <div
      className={`vacancy-response-modal ${active ? "active" : ""}`}
      onClick={() => setActive(false)}
    >
      <div
        className="vacancy-response-content"
        onClick={(e) => e.stopPropagation()}
      >
        <h2>Откликнуться на вакансию</h2>
        <p>{vacancy?.name}</p>
        <form className="vacancy-response-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="name">
              Ваше имя
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-field"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-field"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="phone">
              Телефон
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              className="form-field"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="message">
              Сопроводительное письмо
            </label>
            <textarea
              id="message"
              name="message"
              className="form-field"
              value={formData.message}
              onChange={handleChange}
              rows="4"
              required
            />
          </div>
          <button type="submit" className="submit-button">
            Отправить
          </button>
        </form>
      </div>
    </div>
  );
};

export default VacRes;
