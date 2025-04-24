import React, { createContext, useState, useContext, useEffect } from "react";

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
    const savedSettings = localStorage.getItem(STORAGE_KEY);
    return savedSettings
      ? JSON.parse(savedSettings)
      : {
          fontSize: "16",
          colorBlindType: "normal",
        };
  });

  // Применяем настройки при монтировании компонента
  useEffect(() => {
    applySettings(settings);
  }, []);

  // Применяем и сохраняем настройки при их изменении
  useEffect(() => {
    applySettings(settings);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  // Функция для применения настроек
  const applySettings = (settings) => {
    // Применяем размер шрифта к корневому элементу
    document.documentElement.style.fontSize = `${settings.fontSize}px`;

    // Применяем фильтр для цветовой слепоты
    document.documentElement.style.filter =
      settings.colorBlindType === "normal"
        ? "none"
        : `url(#${settings.colorBlindType})`;

    // Применяем цветовую схему
    const colors = colorSchemes[settings.colorBlindType];
    Object.entries(colors).forEach(([property, value]) => {
      document.documentElement.style.setProperty(property, value);
    });

    console.log("Настройки применены:", settings);
  };

  return (
    <AccessibilityContext.Provider value={{ settings, setSettings }}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => useContext(AccessibilityContext);
