// pages/home.js

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import Link from 'next/link';
import styles from './Home.module.css'; // CSS モジュールを使用

const Home = () => {
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

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>メニュー</h1>
      <ul className={styles.menu}>
        <li className={styles.menuItem}>
          <Link href="/study">
            <a className={styles.link}>勉強タスク管理</a>
          </Link>
        </li>
        <li className={styles.menuItem}>
          <Link href="/homework">
            <a className={styles.link}>宿題管理</a>
          </Link>
        </li>
        <li className={styles.menuItem}>
          <Link href="/submission">
            <a className={styles.link}>提出物管理</a>
          </Link>
        </li>
        <li className={styles.menuItem}>
          <Link href="/gamegoal">
            <a className={styles.link}>音ゲー目標管理</a>
          </Link>
        </li>
        <li className={styles.menuItem}>
          <Link href="/life">
            <a className={styles.link}>日常生活の記録</a>
          </Link>
        </li>
        <li className={styles.menuItem}>
          <Link href="/sleep">
            <a className={styles.link}>睡眠時間の記録</a>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Home;
