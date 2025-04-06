// pages/gamegoal.js

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

const GameGoal = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);

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

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>音ゲー目標管理（仮）</h1>
      <p>ここに音ゲーの目標とか記録する機能を作っていくよ！</p>
    </div>
  );
};

export default GameGoal;
