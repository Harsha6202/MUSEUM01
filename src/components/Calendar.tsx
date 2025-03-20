import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isBefore, addMonths, subMonths, addDays, isWithinInterval, getDay } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

interface CalendarProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  onClose: () => void;
}

export default function Calendar({ selectedDate, onDateSelect, onClose }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isOpen, setIsOpen] = useState(true);
  
  // Get days in current month
  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  // Get days from previous month to fill the first week
  const firstDayOfMonth = startOfMonth(currentMonth);
  const firstDayOfWeek = getDay(firstDayOfMonth);
  
  const prevMonthDays = firstDayOfWeek > 0 
    ? eachDayOfInterval({
        start: addDays(firstDayOfMonth, -firstDayOfWeek),
        end: addDays(firstDayOfMonth, -1)
      })
    : [];

  // Get days from next month to fill the last week
  const lastDayOfMonth = endOfMonth(currentMonth);
  const lastDayOfWeek = getDay(lastDayOfMonth);
  
  const nextMonthDays = lastDayOfWeek < 6 
    ? eachDayOfInterval({
        start: addDays(lastDayOfMonth, 1),
        end: addDays(lastDayOfMonth, 6 - lastDayOfWeek)
      })
    : [];

  // Combine all days
  const allDays = [...prevMonthDays, ...days, ...nextMonthDays];

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  // Check if a date is selectable (not in the past)
  const isSelectable = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return !isBefore(date, today) || isToday(date);
  };

  // Check if a date is a weekend
  const isWeekend = (date: Date) => {
    const day = getDay(date);
    return day === 0 || day === 6;
  };

  // Check if a date is within the next 30 days (for highlighting peak season)
  const isWithin30Days = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const thirtyDaysLater = addDays(today, 30);
    return isWithinInterval(date, { start: today, end: thirtyDaysLater });
  };

  return (
    <div className="absolute bottom-full mb-4 bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-[320px] z-10">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={prevMonth}
          className="p-2 hover:bg-gray-100 rounded-full"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-semibold">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <button
          onClick={nextMonth}
          className="p-2 hover:bg-gray-100 rounded-full"
          aria-label="Next month"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {allDays.map(day => {
          const isSelected = selectedDate && format(day, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
          const isPast = isBefore(day, new Date()) && !isToday(day);
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isWeekendDay = isWeekend(day);
          const isPeakSeason = isWithin30Days(day);
          
          return (
            <button
              key={day.toString()}
              onClick={() => {
                if (isSelectable(day)) {
                  onDateSelect(day);
                  setIsOpen(false);
                }
              }}
              disabled={isPast}
              className={`
                p-2 text-sm rounded-full relative
                ${!isCurrentMonth ? 'text-gray-300' : ''}
                ${isSelected ? 'bg-blue-600 text-white' : ''}
                ${isPast ? 'text-gray-300 cursor-not-allowed' : ''}
                ${!isPast && !isSelected ? 'hover:bg-blue-50' : ''}
                ${isWeekendDay && isCurrentMonth && !isPast && !isSelected ? 'text-orange-500' : ''}
              `}
              title={format(day, 'EEEE, MMMM d, yyyy')}
            >
              <span className="relative z-10">
                {format(day, 'd')}
              </span>
              {isPeakSeason && isCurrentMonth && !isPast && !isSelected && (
                <span className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full"></span>
              )}
            </button>
          );
        })}
      </div>
      
      <div className="mt-4 pt-3 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
            <span>Peak Season</span>
          </div>
          <div className="flex items-center">
            <span className="text-orange-500 mr-1">●</span>
            <span>Weekend</span>
          </div>
        </div>
      </div>
      
      <div className="mt-3 flex justify-end">
        <button
          onClick={onClose}
          className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
        >
          Cancel
        </button>
        {selectedDate && (
          <button
            onClick={() => {
              onDateSelect(selectedDate);
              setIsOpen(false);
            }}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded ml-2 hover:bg-blue-700"
          >
            Confirm
          </button>
        )}
      </div>
    </div>
  );
}