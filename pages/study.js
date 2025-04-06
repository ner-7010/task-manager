// pages/study.js

import { useEffect, useState } from 'react';
import { collection, addDoc, onSnapshot, updateDoc, doc, deleteDoc, query, where } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase';

const Study = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [newTask, setNewTask] = useState("");
  const [priority, setPriority] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [tasksList, setTasksList] = useState([]);
  const [filter, setFilter] = useState("all");

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

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, 'tasks'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasks = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasksList(tasks);
    });

    return () => unsubscribe();
  }, [user]);

  const addTask = async () => {
    if (newTask.trim() === "" || priority.trim() === "" || dueDate.trim() === "") return;

    try {
      await addDoc(collection(db, 'tasks'), {
        name: newTask,
        completed: false,
        priority: priority,
        dueDate: dueDate,
        userId: user.uid,
      });
      setNewTask("");
      setPriority("");
      setDueDate("");
    } catch (error) {
      console.error("タスクの追加エラー:", error);
    }
  };

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

  const deleteTask = async (taskId) => {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      await deleteDoc(taskRef);
    } catch (error) {
      console.error("タスク削除エラー:", error);
    }
  };

  const sortTasks = (tasks) => {
    return tasks.sort((a, b) => {
      const priorityOrder = { 高: 1, 中: 2, 低: 3 };
      if (a.priority === b.priority) {
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  };

  const filteredTasks = (tasksList || []).filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "notCompleted") return !task.completed;
    return true;
  });

  return (
    <div>
      <h1>勉強タスク管理</h1>

      <input
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="新しいタスクを入力"
      />
      
      <select value={priority} onChange={(e) => setPriority(e.target.value)}>
        <option value="">優先度を選択</option>
        <option value="高">高</option>
        <option value="中">中</option>
        <option value="低">低</option>
      </select>

      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />

      <button onClick={addTask}>追加</button>

      <div>
        <button onClick={() => setFilter("all")}>すべて</button>
        <button onClick={() => setFilter("completed")}>完了</button>
        <button onClick={() => setFilter("notCompleted")}>未完了</button>
      </div>

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

export default Study;
