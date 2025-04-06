// pages/life.js

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

const Life = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [lifeRecord, setLifeRecord] = useState("");  // 日常記録用の状態

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

  const handleRecordChange = (e) => {
    setLifeRecord(e.target.value);
  };

  const saveRecord = () => {
    // 日常生活の記録を保存する処理（仮）
    console.log("日常生活の記録:", lifeRecord);
    // ここにFirebaseや状態管理を使用してデータを保存する処理を追加
    setLifeRecord("");  // 保存後、入力フィールドをクリア
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>日常生活の記録</h1>
      <textarea
        value={lifeRecord}
        onChange={handleRecordChange}
        placeholder="日々の生活を記録してみよう！"
        rows={5}
        style={{ width: '100%' }}
      />
      <button onClick={saveRecord} style={{ marginTop: '10px' }}>
        保存
      </button>
    </div>
  );
};

export default Life;
