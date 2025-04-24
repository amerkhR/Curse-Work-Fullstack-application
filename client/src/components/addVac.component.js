import React, { useState } from "react";
import axios from "axios";
import "./addVac.css";

const AddVac = ({ active, setActive }) => {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    salary: "",
    experience: "Не имеет значения",
    workFormat: "полный день",
    schedule: "5/2",
    accessibility: "нет",
    responsibilities: "",
    requirements: "",
    conditions: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/test/vacancies", formData);
      console.log("Vacancy created successfully");
      setActive(false);
    } catch (error) {
      console.error("Error creating vacancy: ", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div
      className={active ? "AddVac_container active" : "AddVac_container"}
      onClick={() => setActive(false)}
    >
      <div className="AddVac_content" onClick={(e) => e.stopPropagation()}>
        <form className="AddVac_form" onSubmit={handleSubmit}>
          <h3>Создание вакансии</h3>

          <div className="form-group">
            <label>Название вакансии</label>
            <input
              type="text"
              placeholder="Введите название вакансии"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="AddVac_form_field"
            />
          </div>

          <div className="form-group">
            <label>Компания</label>
            <input
              type="text"
              placeholder="Введите название компании"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="AddVac_form_field"
            />
          </div>

          <div className="form-group">
            <label>Зарплата</label>
            <input
              type="text"
              placeholder="Укажите зарплату"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              className="AddVac_form_field"
            />
          </div>

          <div className="form-group">
            <label>Опыт работы</label>
            <select
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              className="AddVac_form_field"
            >
              <option value="Не имеет значения">Не имеет значения</option>
              <option value="Нет опыта">Нет опыта</option>
              <option value="От 1 года до 3 лет">От 1 года до 3 лет</option>
              <option value="От 3 до 6 лет">От 3 до 6 лет</option>
              <option value="Более 6 лет">Более 6 лет</option>
            </select>
          </div>

          <div className="form-group">
            <label>Формат работы</label>
            <select
              name="workFormat"
              value={formData.workFormat}
              onChange={handleChange}
              className="AddVac_form_field"
            >
              <option value="полный день">Полный день</option>
              <option value="частичная занятость">Частичная занятость</option>
              <option value="стажировка">Стажировка</option>
              <option value="вахта">Вахта</option>
            </select>
          </div>

          <div className="form-group">
            <label>График работы</label>
            <select
              name="schedule"
              value={formData.schedule}
              onChange={handleChange}
              className="AddVac_form_field"
            >
              <option value="5/2">5/2</option>
              <option value="2/2">2/2</option>
              <option value="6/1">6/1</option>
              <option value="3/3">3/3</option>
              <option value="по выходным">По выходным</option>
            </select>
          </div>

          <div className="form-group">
            <label>Доступность для инвалидов</label>
            <select
              name="accessibility"
              value={formData.accessibility}
              onChange={handleChange}
              className="AddVac_form_field"
            >
              <option value="нет">Нет</option>
              <option value="да">Да</option>
            </select>
          </div>

          <div className="form-group">
            <label>Обязанности</label>
            <textarea
              placeholder="Опишите обязанности"
              name="responsibilities"
              value={formData.responsibilities}
              onChange={handleChange}
              className="AddVac_form_field AddVac_form_textarea"
            />
          </div>

          <div className="form-group">
            <label>Требования</label>
            <textarea
              placeholder="Опишите требования"
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              className="AddVac_form_field AddVac_form_textarea"
            />
          </div>

          <div className="form-group">
            <label>Условия</label>
            <textarea
              placeholder="Опишите условия"
              name="conditions"
              value={formData.conditions}
              onChange={handleChange}
              className="AddVac_form_field AddVac_form_textarea"
            />
          </div>

          <button type="submit" className="AddVac_form_buttn">
            Создать вакансию
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddVac;
