import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, onSnapshot, updateDoc, doc, deleteDoc } from 'firebase/firestore';

const Home = ({ initialTasks }) => {
  const [newTask, setNewTask] = useState("");
  const [priority, setPriority] = useState("");  // 優先度
  const [dueDate, setDueDate] = useState("");   // 期限
  const [tasksList, setTasksList] = useState(initialTasks);
  const [filter, setFilter] = useState("all");  // フィルタの状態

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'tasks'), (snapshot) => {
      const tasks = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasksList(tasks);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // タスクの期限を確認し、期限が近いものに通知
  const notifyNearDueTasks = () => {
    const currentTime = new Date();
    tasksList.forEach((task) => {
      const taskDueDate = new Date(task.dueDate);
      const timeDifference = taskDueDate - currentTime;

      // 優先度が高くて期限が1日以内のタスクに通知
      if (timeDifference <= 86400000 && timeDifference > 0 && task.priority === '高' && !task.hasNotified) {
        if (Notification.permission === "granted") {
          new Notification(`重要: タスク「${task.name}」の期限が近づいています！`);
        }
        // 通知済みフラグを設定
        updateDoc(doc(db, 'tasks', task.id), { hasNotified: true });
      }
    });
  };

  // 通知権限の確認
  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    const intervalId = setInterval(notifyNearDueTasks, 600000); // 10分ごとにチェック
    return () => {
      clearInterval(intervalId);
    };
  }, [tasksList]);

  const addTask = async () => {
    if (newTask.trim() === "" || priority.trim() === "" || dueDate.trim() === "") return;

    try {
      await addDoc(collection(db, 'tasks'), {
        name: newTask,
        completed: false,
        priority: priority,    // 優先度
        dueDate: dueDate,      // 期限
        hasNotified: false,    // 通知フラグを追加
      });
      setNewTask("");  // 入力フィールドをクリア
      setPriority(""); // 優先度をリセット
      setDueDate("");  // 期限をリセット
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
      await deleteDoc(taskRef);  // Firestore からタスクを削除
    } catch (error) {
      console.error("タスク削除エラー:", error);
    }
  };

  // 優先度に基づいてタスクを並べ替える
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
  const filteredTasks = tasksList.filter((task) => {
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
