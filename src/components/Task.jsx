import React, { useState, useEffect } from "react";
import axios from "axios";
import "./task.css";
function Task() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const toggleCompleted = async (id) => {
    try {
      await axios.put(`http://localhost:3000/tasks/${id}/toggle-completed`);

      setTasks(
        tasks.map((task) =>
          task.id === id ? { ...task, completed: !task.completed } : task
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:3000/tasks");
      setTasks(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const addTask = async () => {
    try {
      const response = await axios.post("http://localhost:3000/tasks", {
        title,
        description,
        completed: false,
      });
      setTasks([...tasks, response.data]);
      setTitle("");
      setDescription("");
    } catch (error) {
      console.error(error);
    }
  };

  const editTask = (task) => {
    setSelectedTask(task);
    setTitle(task.title);
    setDescription(task.description);
  };

  // const updateTask = async () => {
  //   try {
  //     await axios.put(`http://localhost:3000/tasks/${selectedTask.id}`, {
  //       title,
  //       description,
  //       completed: selectedTask.completed,
  //     });
  //     const updatedTasks = tasks.map((task) =>
  //       task.id === selectedTask.id ? selectedTask : task
  //     );
  //     setTasks(updatedTasks);
  //     setSelectedTask(null);
  //     setTitle("");
  //     setDescription("");
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };
  const updateTask = async () => {
    try {
      await axios.put(`http://localhost:3000/tasks/${selectedTask.id}`, {
        title,
        description,
        completed: selectedTask.completed, 
      });
      
      const updatedTasks = tasks.map((task) =>
        task.id === selectedTask.id ? { ...task, title, description } : task
      );
      setTasks(updatedTasks);
    
      setSelectedTask(null);
      setTitle("");
      setDescription("");
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/tasks/${id}`);
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="TaskList">
      <h1>Task Management App</h1>
      <div>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        {selectedTask ? (
          <button onClick={updateTask}>Update Task</button>
        ) : (
          <button onClick={addTask}>Add Task</button>
        )}
      </div>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleCompleted(task.id, !task.completed)}
            />

            <span
              style={{
                textDecoration: task.completed ? "line-through" : "none",
              }}
            >
              {task.title}
            </span>
            <p>{task.description}</p>
            <button onClick={() => editTask(task)}>Edit</button>
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Task;
