// firebase.js

// 必要な関数をインポート
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // 認証用
import { getFirestore } from "firebase/firestore"; // Firestore 用
import { getAnalytics } from "firebase/analytics"; // Analytics（任意）

// Firebase 設定情報（Firebase Console から取得）
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Firebase を初期化
const app = initializeApp(firebaseConfig);

// 各サービスのインスタンスを取得
const auth = getAuth(app); // 認証サービス
const db = getFirestore(app); // Firestore データベース
const analytics = getAnalytics(app); // Analytics（必要に応じて）

// 使いたいサービスをエクスポート
export { auth, db, analytics };
