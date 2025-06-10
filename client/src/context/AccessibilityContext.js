import React, { createContext, useState, useContext, useEffect } from "react";
import { accessibilityColors } from "../styles/accessibilityColors";

const DEFAULT_SETTINGS = {
  fontSize: "16",
  colorBlindType: "normal",
};

// Добавляем DEFAULT_COLORS как запасной вариант
const DEFAULT_COLORS = {
  "--background-primary": "#ffffff",
  "--background-secondary": "#f8f9fa",
  "--text-primary": "#000000",
  "--text-secondary": "#6c757d",
  "--button-primary": "#007bff",
  "--button-secondary": "#6c757d",
  "--button-success": "#28a745",
  "--button-danger": "#dc3545",
  "--button-warning": "#ffc107",
  "--link": "#007bff",
  "--border": "#dee2e6",
  "--navbar": "#343a40",
  "--navbar-text": "#ffffff",
  "--card-bg": "#ffffff",
  "--input-bg": "#ffffff",
  "--input-border": "#ced4da",
  "--table-border": "#dee2e6",
  "--table-stripe": "#f2f2f2",
  "--favorite-active": "#ff3366",
};

const AccessibilityContext = createContext();

const STORAGE_KEY = "accessibility_settings";

// Цветовые схемы для разных типов цветовой слепоты
const colorSchemes = {
  normal: {
    "--primary-color": "#007bff",
    "--secondary-color": "#6c757d",
    "--success-color": "#28a745",
    "--danger-color": "#dc3545",
    "--warning-color": "#ffc107",
    "--info-color": "#17a2b8",
    "--light-color": "#f8f9fa",
    "--dark-color": "#343a40",
  },
  protanopia: {
    "--primary-color": "#0066cc", // Более насыщенный синий
    "--secondary-color": "#666666",
    "--success-color": "#006600", // Темно-зеленый
    "--danger-color": "#0000ff", // Синий вместо красного
    "--warning-color": "#ffff00", // Желтый
    "--info-color": "#00ffff", // Голубой
    "--light-color": "#f8f9fa",
    "--dark-color": "#343a40",
  },
  deuteranopia: {
    "--primary-color": "#0000ff", // Синий
    "--secondary-color": "#666666",
    "--success-color": "#ffff00", // Желтый вместо зеленого
    "--danger-color": "#0000ff", // Синий вместо красного
    "--warning-color": "#ffff00", // Желтый
    "--info-color": "#00ffff", // Голубой
    "--light-color": "#f8f9fa",
    "--dark-color": "#343a40",
  },
  tritanopia: {
    "--primary-color": "#ff0000", // Красный
    "--secondary-color": "#666666",
    "--success-color": "#00ff00", // Зеленый
    "--danger-color": "#ff0000", // Красный
    "--warning-color": "#ff6600", // Оранжевый вместо желтого
    "--info-color": "#00ff00", // Зеленый вместо голубого
    "--light-color": "#f8f9fa",
    "--dark-color": "#343a40",
  },
  achromatopsia: {
    "--primary-color": "#666666",
    "--secondary-color": "#999999",
    "--success-color": "#444444",
    "--danger-color": "#222222",
    "--warning-color": "#888888",
    "--info-color": "#555555",
    "--light-color": "#f8f9fa",
    "--dark-color": "#343a40",
  },
};

export const AccessibilityProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem("accessibility_settings");
      return saved
        ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) }
        : DEFAULT_SETTINGS;
    } catch (error) {
      console.error("Error loading settings:", error);
      return DEFAULT_SETTINGS;
    }
  });

  const applySettings = (newSettings) => {
    try {
      if (!newSettings || typeof newSettings !== "object") {
        console.error("Invalid settings object:", newSettings);
        return;
      }

      // Применяем размер шрифта
      const fontSize = newSettings.fontSize || DEFAULT_SETTINGS.fontSize;
      document.documentElement.style.fontSize = `${fontSize}px`;

      // Получаем цветовую схему
      const colorBlindType =
        newSettings.colorBlindType || DEFAULT_SETTINGS.colorBlindType;
      const colors = accessibilityColors[colorBlindType] || DEFAULT_COLORS;

      // Проверяем, что colors существует и является объектом
      if (!colors || typeof colors !== "object") {
        console.error("Invalid color scheme:", colorBlindType);
        return;
      }

      // Применяем цвета
      const colorEntries = Object.entries(colors);
      if (Array.isArray(colorEntries)) {
        colorEntries.forEach(([property, value]) => {
          if (property && value) {
            document.documentElement.style.setProperty(property, value);
          }
        });
      }

      // Обновляем важные элементы
      if (colors["--background-primary"]) {
        document.body.style.backgroundColor = colors["--background-primary"];
      }

      const navbar = document.querySelector(".navbar");
      if (navbar && colors["--navbar"]) {
        navbar.style.backgroundColor = colors["--navbar"];
      }

      // Сохраняем настройки
      localStorage.setItem(
        "accessibility_settings",
        JSON.stringify(newSettings)
      );
    } catch (error) {
      console.error("Error applying settings:", error);
    }
  };

  // Применяем настройки при монтировании
  useEffect(() => {
    if (settings) {
      applySettings(settings);
    }
  }, []);

  const updateSettings = (newSettings) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    applySettings(updatedSettings);
  };

  const value = {
    settings,
    updateSettings,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error(
      "useAccessibility must be used within an AccessibilityProvider"
    );
  }
  return context;
};
