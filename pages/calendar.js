// pages/calendar.js

import { useState } from 'react';
import styles from './Calendar.module.css';

const Calendar = () => {
  const [view, setView] = useState('day'); // 'day', 'week', 'month' のいずれか

  const handleViewChange = (newView) => {
    setView(newView);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>カレンダー</h1>

      {/* モード切替ボタン */}
      <div className={styles.buttons}>
        <button onClick={() => handleViewChange('day')} className={styles.button}>
          1日モード
        </button>
        <button onClick={() => handleViewChange('week')} className={styles.button}>
          1週間モード
        </button>
        <button onClick={() => handleViewChange('month')} className={styles.button}>
          1か月モード
        </button>
      </div>

      {/* カレンダー表示部分 */}
      <div className={styles.calendar}>
        {view === 'day' && <DayView />}
        {view === 'week' && <WeekView />}
        {view === 'month' && <MonthView />}
      </div>
    </div>
  );
};

// 1日モード
const DayView = () => (
  <div className={styles.dayView}>
    <p>ここに1日モードのカレンダーが表示されます。</p>
  </div>
);

// 1週間モード
const WeekView = () => (
  <div className={styles.weekView}>
    <p>ここに1週間モードのカレンダーが表示されます。</p>
  </div>
);

// 1か月モード
const MonthView = () => (
  <div className={styles.monthView}>
    <p>ここに1か月モードのカレンダーが表示されます。</p>
  </div>
);

export default Calendar;
