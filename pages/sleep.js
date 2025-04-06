// pages/sleep.js

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

const Sleep = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [sleepHours, setSleepHours] = useState("");  // 睡眠時間入力状態
  const [sleepDate, setSleepDate] = useState("");    // 睡眠日付状態

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleSleepHoursChange = (e) => {
    setSleepHours(e.target.value);
  };

  const handleSleepDateChange = (e) => {
    setSleepDate(e.target.value);
  };

  const saveSleepRecord = () => {
    // 睡眠時間を保存する処理（仮）
    console.log("睡眠記録:", sleepDate, sleepHours);
    // ここにFirebaseや状態管理を使用してデータを保存する処理を追加
    setSleepHours("");  // 入力フィールドをクリア
    setSleepDate("");   // 日付をクリア
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>睡眠時間の記録</h1>
      <div>
        <input
          type="date"
          value={sleepDate}
          onChange={handleSleepDateChange}
          placeholder="睡眠日付"
        />
      </div>
      <div>
        <input
          type="number"
          value={sleepHours}
          onChange={handleSleepHoursChange}
          placeholder="睡眠時間 (時間)"
          min="0"
          max="24"
        />
      </div>
      <button onClick={saveSleepRecord} style={{ marginTop: '10px' }}>
        保存
      </button>
    </div>
  );
};

export default Sleep;
