// pages/login.js

import { auth } from '../firebase';
import { useRouter } from 'next/router';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const Login = () => {
  const router = useRouter();

  // Google ログイン関数
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push('/'); // ログイン後、トップページに遷移
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <button onClick={signInWithGoogle}>Sign in with Google</button>
    </div>
  );
};

export default Login;
