import React from "react";
import "./DaySelector.css";

interface DaySelectorProps {
  selectedDay: number | null;
  onDayChange: (day: number | null) => void;
  selectedMonth: number;
  selectedYear: number;
  className?: string;
}

const DaySelector: React.FC<DaySelectorProps> = ({
  selectedDay,
  onDayChange,
  selectedMonth,
  selectedYear,
  className = "",
}) => {
  // Calcular quantos dias tem o mês selecionado
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className={`day-selector ${className}`}>
      <label className="day-selector-label">Dia:</label>
      <select
        value={selectedDay || ""}
        onChange={(e) => {
          const day = e.target.value === "" ? null : Number(e.target.value);
          onDayChange(day);
        }}
        className="day-selector-select"
      >
        <option value="">Todos os dias</option>
        {days.map((day) => (
          <option key={day} value={day}>
            {day.toString().padStart(2, "0")}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DaySelector;
