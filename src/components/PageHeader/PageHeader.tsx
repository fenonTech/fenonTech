import React from "react";
import "./PageHeader.css";
import MonthYearSelector from "../MonthYearSelector";

interface PageHeaderProps {
  selectedMonth: number;
  selectedYear: number;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  selectedMonth,
  selectedYear,
  onMonthChange,
  onYearChange,
  className = "",
}) => {
  return (
    <div className={`page-header ${className}`}>
      <div className="page-filters">
        <MonthYearSelector
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          onMonthChange={onMonthChange}
          onYearChange={onYearChange}
          className="header-style"
        />
      </div>
    </div>
  );
};

export default PageHeader;
