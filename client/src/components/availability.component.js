import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { accessibilityColors } from "../styles/accessibilityColors";
import "./addVac.css";

const Availability = () => {
  const [active, setActive] = useState(true);
  const history = useHistory();

  // Инициализация состояния из localStorage
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem("accessibility_settings");
    return saved
      ? JSON.parse(saved)
      : {
          fontSize: "16",
          colorBlindType: "normal",
        };
  });

  const applySettings = (newSettings) => {
    // Применяем размер шрифта
    document.documentElement.style.fontSize = `${newSettings.fontSize}px`;

    // Применяем цветовую схему
    const colors = accessibilityColors[newSettings.colorBlindType];
    Object.entries(colors).forEach(([property, value]) => {
      document.documentElement.style.setProperty(property, value);
    });

    // Принудительно обновляем некоторые важные элементы
    document.body.style.backgroundColor = colors["--background-primary"];
    const navbar = document.querySelector(".navbar");
    if (navbar) {
      navbar.style.backgroundColor = colors["--navbar"];
    }

    // Сохраняем настройки
    localStorage.setItem("accessibility_settings", JSON.stringify(newSettings));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newSettings = { ...settings, [name]: value };
    setSettings(newSettings);
    applySettings(newSettings);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    applySettings(settings);
    setActive(false);
    history.push("/");
  };

  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  const getColorBlindTypeDescription = (type) => {
    const descriptions = {
      normal: "Обычное зрение без корректировки",
      protanopia: "Отсутствие восприятия красного цвета",
      deuteranopia: "Отсутствие восприятия зеленого цвета",
      tritanopia: "Отсутствие восприятия синего цвета",
      achromatopsia: "Полное отсутствие цветового зрения",
    };
    return descriptions[type] || "";
  };

  return (
    <div
      className={active ? "AddVac_container active" : "AddVac_container"}
      onClick={() => setActive(false)}
    >
      <div className="AddVac_content" onClick={stopPropagation}>
        <form className="AddVac_form" onSubmit={handleSubmit}>
          <h3>Настройки доступности</h3>

          <div className="form-group">
            <label>Размер шрифта (px):</label>
            <select
              className="AddVac_form_field"
              name="fontSize"
              value={settings.fontSize}
              onChange={handleChange}
            >
              <option value="12">12px</option>
              <option value="14">14px</option>
              <option value="16">16px</option>
              <option value="18">18px</option>
              <option value="20">20px</option>
              <option value="24">24px</option>
            </select>
          </div>

          <div className="form-group">
            <label>Тип цветовой слепоты:</label>
            <select
              className="AddVac_form_field"
              name="colorBlindType"
              value={settings.colorBlindType}
              onChange={handleChange}
            >
              <option value="normal">Обычное зрение</option>
              <option value="protanopia">Протанопия</option>
              <option value="deuteranopia">Дейтеранопия</option>
              <option value="tritanopia">Тританопия</option>
              <option value="achromatopsia">Ахроматопсия</option>
            </select>
          </div>

          <p className="color-blind-description">
            {getColorBlindTypeDescription(settings.colorBlindType)}
          </p>

          <button className="AddVac_form_buttn" type="submit">
            Применить настройки
          </button>
        </form>
      </div>
    </div>
  );
};

export default Availability;
