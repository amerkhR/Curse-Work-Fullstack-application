import React, { useState, useEffect } from "react";
import axios from "axios";
import { connect } from "react-redux";
import FilterVac from "./filter-vacancy.component";
import classes from "./home.module.css";

const Profile = ({ user }) => {
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    photo: "",
    preferred_salary: 0,
    preferred_experience: "Не имеет значения",
    preferred_work_format: "полный день",
    preferred_schedule: "5/2",
    preferred_accessibility: "нет",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/test/profile",
        {
          headers: {
            "x-access-token": user.accessToken,
          },
        }
      );
      setProfile(response.data);

      // Обработка фото
      if (response.data.photo) {
        // Если фото приходит в формате base64
        if (response.data.photo.startsWith("data:image")) {
          setPreviewUrl(response.data.photo);
        }
        // Если фото приходит как URL
        else if (response.data.photo.startsWith("http")) {
          setPreviewUrl(response.data.photo);
        }
        // Если фото приходит как относительный путь
        else {
          setPreviewUrl(`http://localhost:8080${response.data.photo}`);
        }
      }
    } catch (error) {
      console.error("Ошибка при получении профиля:", error);
      setMessage("Ошибка при загрузке профиля");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Сначала обновляем основную информацию профиля
      await axios.put(
        "http://localhost:8080/api/test/profile",
        {
          first_name: profile.first_name,
          last_name: profile.last_name,
          email: profile.email,
        },
        {
          headers: {
            "x-access-token": user.accessToken,
          },
        }
      );

      // Если есть новое фото, загружаем его
      if (selectedFile) {
        const formData = new FormData();
        formData.append("photo", selectedFile);

        const photoResponse = await axios.post(
          "http://localhost:8080/api/test/profile/photo",
          formData,
          {
            headers: {
              "x-access-token": user.accessToken,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        // Обновляем URL фото после успешной загрузки
        if (photoResponse.data.photo) {
          setPreviewUrl(photoResponse.data.photo);
        }
      }

      setMessage("Профиль успешно обновлен");
      setIsEditing(false);
      fetchProfile(); // Обновляем данные профиля после всех изменений
    } catch (error) {
      console.error("Ошибка при обновлении профиля:", error);
      setMessage("Ошибка при обновлении профиля");
    }
  };

  const handlePreferencesUpdate = async (filters) => {
    try {
      await axios.put(
        "http://localhost:8080/api/test/profile/preferences",
        filters,
        {
          headers: {
            "x-access-token": user.accessToken,
          },
        }
      );
      setMessage("Предпочтения успешно обновлены");
      setIsFilterOpen(false);
      fetchProfile();
    } catch (error) {
      console.error("Ошибка при обновлении предпочтений:", error);
      setMessage("Ошибка при обновлении предпочтений");
    }
  };

  return (
    <div className={classes.profile_container}>
      {message && <div className={classes.message}>{message}</div>}

      <div className={classes.profile_header}>
        <div className={classes.profile_photo}>
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Фото профиля"
              onError={(e) => {
                console.error("Ошибка загрузки изображения:", e);
                setPreviewUrl("");
              }}
            />
          ) : (
            <div className={classes.photo_placeholder}>
              {profile.first_name ? profile.first_name[0] : "?"}
            </div>
          )}
          {isEditing && (
            <div className={classes.photo_overlay}>
              <label
                htmlFor="photo-upload"
                className={classes.photo_upload_label}
              >
                <i className="fas fa-camera"></i>
              </label>
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className={classes.photo_input}
              />
            </div>
          )}
        </div>

        <div className={classes.profile_info}>
          {isEditing ? (
            <form onSubmit={handleSubmit}>
              <div className={classes.form_group}>
                <label>Имя пользователя</label>
                <input
                  type="text"
                  value={profile.username}
                  disabled
                  className={classes.form_input}
                />
              </div>

              <div className={classes.form_group}>
                <label>Имя</label>
                <input
                  type="text"
                  name="first_name"
                  value={profile.first_name}
                  onChange={handleInputChange}
                  className={classes.form_input}
                />
              </div>

              <div className={classes.form_group}>
                <label>Фамилия</label>
                <input
                  type="text"
                  name="last_name"
                  value={profile.last_name}
                  onChange={handleInputChange}
                  className={classes.form_input}
                />
              </div>

              <div className={classes.form_group}>
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleInputChange}
                  className={classes.form_input}
                />
              </div>

              <div className={classes.form_buttons}>
                <button type="submit" className={classes.save_button}>
                  Сохранить
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setSelectedFile(null);
                    fetchProfile(); // Восстанавливаем исходное фото
                  }}
                  className={classes.cancel_button}
                >
                  Отмена
                </button>
              </div>
            </form>
          ) : (
            <>
              <h2>{profile.username}</h2>
              <p>
                {profile.first_name} {profile.last_name}
              </p>
              <p>{profile.email}</p>
              <button
                onClick={() => setIsEditing(true)}
                className={classes.edit_button}
              >
                Редактировать профиль
              </button>
            </>
          )}
        </div>
      </div>

      <div className={classes.preferences_section}>
        <h3>Предпочтения</h3>
        <button
          onClick={() => setIsFilterOpen(true)}
          className={classes.preferences_button}
        >
          Настроить предпочтения
        </button>
      </div>

      {isFilterOpen && (
        <FilterVac
          active={isFilterOpen}
          setActive={setIsFilterOpen}
          onApplyFilters={handlePreferencesUpdate}
          initialFilters={{
            salary: profile.preferred_salary,
            experience: profile.preferred_experience,
            workFormat: profile.preferred_work_format,
            schedule: profile.preferred_schedule,
            accessibility: profile.preferred_accessibility,
          }}
        />
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps)(Profile);
