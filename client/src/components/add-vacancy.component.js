import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./addVac.css";

const AddVac = ({ active, setActive }) => {
  const filePicker = useRef(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);

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

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedVideo(file);
      const videoUrl = URL.createObjectURL(file);
      setVideoPreview(videoUrl);
    }
  };

  const handleVideoClick = (e) => {
    e.preventDefault();
    filePicker.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();

      // Добавляем все поля формы
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });

      // Добавляем видео, если оно было выбрано
      if (selectedVideo) {
        formDataToSend.append("video", selectedVideo);
      }

      await axios.post(
        "http://localhost:8080/api/test/vacancies",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Вакансия успешно создана");
      setActive(false);
      window.location.reload();
    } catch (error) {
      console.error("Ошибка при создании вакансии: ", error);
    }
  };

  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      setActive(false);
    }
  };

  return (
    <div
      className={active ? "AddVac_container active" : "AddVac_container"}
      onClick={handleBackgroundClick}
    >
      <div className="AddVac_content" onClick={(e) => e.stopPropagation()}>
        <form className="AddVac_form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Название вакансии</label>
            <input
              type="text"
              name="name"
              placeholder="Введите название вакансии"
              value={formData.name}
              onChange={handleChange}
              className="AddVac_form_field"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Компания</label>
            <input
              type="text"
              name="company"
              placeholder="Введите название компании"
              value={formData.company}
              onChange={handleChange}
              className="AddVac_form_field"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Зарплата</label>
            <input
              type="text"
              name="salary"
              placeholder="Укажите зарплату"
              value={formData.salary}
              onChange={handleChange}
              className="AddVac_form_field"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Опыт работы</label>
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
            <label className="form-label">Формат работы</label>
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
            <label className="form-label">График работы</label>
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
            <label className="form-label">Доступность для инвалидов</label>
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
            <label className="form-label">Обязанности</label>
            <textarea
              name="responsibilities"
              placeholder="Введите обязанности, каждый пункт с новой строки"
              value={formData.responsibilities}
              onChange={handleChange}
              className="AddVac_form_field AddVac_form_textarea"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Требования</label>
            <textarea
              name="requirements"
              placeholder="Введите требования, каждый пункт с новой строки"
              value={formData.requirements}
              onChange={handleChange}
              className="AddVac_form_field AddVac_form_textarea"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Условия</label>
            <textarea
              name="conditions"
              placeholder="Введите условия, каждый пункт с новой строки"
              value={formData.conditions}
              onChange={handleChange}
              className="AddVac_form_field AddVac_form_textarea"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Видео о вакансии</label>
            <button
              type="button"
              onClick={handleVideoClick}
              className="AddVac_form_buttn"
            >
              Загрузить видео
            </button>
            <input
              type="file"
              ref={filePicker}
              onChange={handleVideoChange}
              accept="video/mp4,video/webm,video/ogg"
              className="hidden"
            />
            {videoPreview && (
              <div className="video-preview">
                <video src={videoPreview} controls className="preview-video" />
              </div>
            )}
          </div>

          <button className="AddVac_form_buttn" type="submit">
            Создать вакансию
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddVac;
