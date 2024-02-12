import React, { useState } from 'react';
import './calendar.css';

interface CalendarProps {
  date: number;
  day: string;
  onClick: () => void; 
  isSelected: boolean; 
}

const Calendar = (props: CalendarProps) => {
  const { date, day, onClick, isSelected } = props;

  return (
    <React.Fragment>
      <button className={`calMain ${isSelected ? 'selected' : ''}`} onClick={onClick}>
        <div className="calDate">{date}</div>
        <div className="calDay">{day}</div>
      </button>
    </React.Fragment>
  );
};

export default Calendar