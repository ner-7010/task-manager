// pages/login.js

import { auth } from '../firebase';
import { useRouter } from 'next/router';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const Login = () => {
  const router = useRouter();

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push('/');
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-sm w-full text-center">
        {/* ロゴ部分（仮） */}
        <h1 className="text-3xl font-bold mb-4">StudyLog</h1>

        {/* 説明文 */}
        <p className="text-gray-600 mb-6">勉強・生活をまとめて管理しよう</p>

        {/* Google ログインボタン */}
        <button
          onClick={signInWithGoogle}
          className="flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          <img src="/google-icon.svg" alt="Google" className="w-5 h-5" />
          Googleでログイン
        </button>
      </div>
    </div>
  );
};

export default Login;
