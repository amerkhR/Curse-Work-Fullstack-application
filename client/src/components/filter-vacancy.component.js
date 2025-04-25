import React, { useState, useEffect } from "react";
import "./filterVac.css";

const FilterVac = ({ active, setActive, onApplyFilters, initialFilters }) => {
  const [formData, setFormData] = useState({
    salary: 0,
    experience: "все",
    workFormat: "все",
    schedule: "все",
    accessibility: "все",
    ...initialFilters
  });

  useEffect(() => {
    if (initialFilters) {
      setFormData(prev => ({
        ...prev,
        ...initialFilters
      }));
    }
  }, [initialFilters]);

  useEffect(() => {
    if (active) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [active]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const formatSalary = (value) => {
    return new Intl.NumberFormat('ru-RU').format(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onApplyFilters(formData);
    setActive(false);
  };

  return (
    <div
      className={active ? "FilterVac_container active" : "FilterVac_container"}
      onClick={(e) => e.target === e.currentTarget && setActive(false)}
    >
      <div className="FilterVac_content" onClick={(e) => e.stopPropagation()}>
        <form className="FilterVac_form" onSubmit={handleSubmit}>
          <h3>Фильтры</h3>

          <div className="form-group">
            <label className="form-label">
              Зарплата от: {formatSalary(formData.salary)} ₽
            </label>
            <input
              type="range"
              name="salary"
              min="0"
              max="500000"
              step="5000"
              value={formData.salary}
              onChange={handleChange}
              className="salary-slider"
            />
            <div className="salary-range">
              <span>0 ₽</span>
              <span>500 000 ₽</span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Опыт работы</label>
            <select
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              className="FilterVac_form_field"
            >
              <option value="все">Все варианты</option>
              <option value="Не имеет значения">Не имеет значения</option>
              <option value="Нет опыта">Нет опыта</option>
              <option value="От 1 года до 3 лет">От 1 года до 3 лет</option>
              <option value="От 3 до 6 лет">От 3 до 6 лет</option>
              <option value="Более 6 лет">Более 6 лет</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Формат работы</label>
            <select
              name="workFormat"
              value={formData.workFormat}
              onChange={handleChange}
              className="FilterVac_form_field"
            >
              <option value="все">Все варианты</option>
              <option value="полный день">Полный день</option>
              <option value="частичная занятость">Частичная занятость</option>
              <option value="стажировка">Стажировка</option>
              <option value="вахта">Вахта</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">График работы</label>
            <select
              name="schedule"
              value={formData.schedule}
              onChange={handleChange}
              className="FilterVac_form_field"
            >
              <option value="все">Все варианты</option>
              <option value="5/2">5/2</option>
              <option value="2/2">2/2</option>
              <option value="6/1">6/1</option>
              <option value="3/3">3/3</option>
              <option value="по выходным">По выходным</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Доступность для инвалидов</label>
            <select
              name="accessibility"
              value={formData.accessibility}
              onChange={handleChange}
              className="FilterVac_form_field"
            >
              <option value="все">Все варианты</option>
              <option value="да">Да</option>
              <option value="нет">Нет</option>
            </select>
          </div>

          <button type="submit" className="FilterVac_form_buttn">
            Применить фильтры
          </button>
        </form>
      </div>
    </div>
  );
};

export default FilterVac;
