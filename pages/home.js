// pages/home.js

import { useEffect, useState } from 'react';
import { collection, addDoc, onSnapshot, updateDoc, doc, deleteDoc, query, where } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase';

const Home = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);  // ログインユーザー
  const [newTask, setNewTask] = useState("");
  const [priority, setPriority] = useState("");  // 優先度
  const [dueDate, setDueDate] = useState("");   // 期限
  const [tasksList, setTasksList] = useState([]);  // 初期値を空配列に変更
  const [filter, setFilter] = useState("all");  // フィルタの状態

  useEffect(() => {
    // ログイン状態を確認
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);  // ユーザーがログインしている
      } else {
        setUser(null);  // ログインしていない
        router.push('/login');  // ログインページにリダイレクト
      }
    });

    return () => unsubscribe();  // コンポーネントアンマウント時に監視を解除
  }, [router]);

  useEffect(() => {
    if (!user) return; // ユーザーがいない場合は何もしない

    const q = query(collection(db, 'tasks'), where('userId', '==', user.uid));  // ユーザーIDでフィルタリング
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasks = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasksList(tasks);
    });

    return () => unsubscribe();  // タスク監視を解除
  }, [user]);

  // タスクの追加
  const addTask = async () => {
    if (newTask.trim() === "" || priority.trim() === "" || dueDate.trim() === "") return;

    try {
      await addDoc(collection(db, 'tasks'), {
        name: newTask,
        completed: false,
        priority: priority,
        dueDate: dueDate,
        userId: user.uid,  // ログインユーザーのIDを追加
      });
      setNewTask("");  // 入力フィールドをクリア
      setPriority(""); // 優先度をリセット
      setDueDate("");  // 期限をリセット
    } catch (error) {
      console.error("タスクの追加エラー:", error);
    }
  };

  // タスクの完了状態を切り替え
  const toggleTaskCompletion = async (taskId, currentStatus) => {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, {
        completed: !currentStatus,
      });
    } catch (error) {
      console.error("タスクの状態更新エラー:", error);
    }
  };

  // タスクの削除
  const deleteTask = async (taskId) => {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      await deleteDoc(taskRef);  // Firestore からタスクを削除
    } catch (error) {
      console.error("タスク削除エラー:", error);
    }
  };

  // 優先度に基づいてタスクを並べ替え
  const sortTasks = (tasks) => {
    return tasks.sort((a, b) => {
      const priorityOrder = { 高: 1, 中: 2, 低: 3 };
      if (a.priority === b.priority) {
        // 期限順に並べる
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  };

  // フィルタリング機能
  const filteredTasks = (tasksList || []).filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "notCompleted") return !task.completed;
    return true;  // "all" フィルター
  });

  return (
    <div>
      <h1>勉強タスク</h1>

      {/* タスク追加フォーム */}
      <input
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="新しいタスクを入力"
      />
      
      {/* 優先度入力 */}
      <select value={priority} onChange={(e) => setPriority(e.target.value)}>
        <option value="">優先度を選択</option>
        <option value="高">高</option>
        <option value="中">中</option>
        <option value="低">低</option>
      </select>

      {/* 期限入力 */}
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />

      <button onClick={addTask}>追加</button>

      {/* フィルタリングオプション */}
      <div>
        <button onClick={() => setFilter("all")}>すべて</button>
        <button onClick={() => setFilter("completed")}>完了</button>
        <button onClick={() => setFilter("notCompleted")}>未完了</button>
      </div>

      {/* タスク表示 */}
      <ul>
        {sortTasks(filteredTasks).map((task) => (
          <li key={task.id} style={{ cursor: 'pointer', textDecoration: task.completed ? 'line-through' : 'none' }}>
            <span onClick={() => toggleTaskCompletion(task.id, task.completed)}>
              {task.name} - {task.completed ? "完了" : "未完了"} 
              - 優先度: {task.priority} 期限: {task.dueDate}
            </span>
            <button onClick={() => deleteTask(task.id)} style={{ marginLeft: '10px', color: 'red' }}>
              削除
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
