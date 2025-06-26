import "bootstrap/dist/css/bootstrap.min.css";
import { Check, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/tasks")
      .then((res) => {
        console.log("Tasks from server:", res.data);
        setTasks(res.data);
      })
      .catch((err) => {
        console.error("Error fetching tasks:", err.message);
      });
  }, []);

  const addTask = async () => {
    if (!text.trim()) return;
    try {
      const res = await axios.post("http://localhost:5000/api/tasks", {
        task: text.trim(),
      });
      setTasks([...tasks, res.data]); // Append new task from backend
      setText("");
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  const toggleComplete = async (id, currentStatus) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/tasks/${id}`, {
        completed: !currentStatus,
      });
      setTasks(
        tasks.map((t) =>
          t._id === id ? { ...t, completed: res.data.completed } : t
        )
      );
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`);
      setTasks(tasks.filter((t) => t._id !== id));
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  const completedCount = tasks.filter((task) => task.completed).length;
  const totalCount = tasks.length;

  return (
    <div className="min-vh-100 bg-dark py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            {/* Header */}
            <div className="text-center mb-4">
              <h1 className="display-5 fw-bold text-info mb-2"> Todo List</h1>
              <p className="text-light">
                {completedCount} of {totalCount} tasks completed
              </p>
            </div>

            {/* Add Task Form */}
            <div
              className="card shadow-sm mb-4"
              style={{ backgroundColor: "#dedede" }}
            >
              <div className="card-body">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Add a new task..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addTask()}
                  />
                  <button
                    onClick={addTask}
                    className="btn btn-primary d-flex align-items-center gap-2"
                    type="button"
                  >
                    <Plus size={18} />
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* Tasks List */}
            <div
              className="card shadow-sm"
              style={{ backgroundColor: "#dedede" }}
            >
              {tasks.length === 0 ? (
                <div className="card-body text-center py-5">
                  <div className="text-muted">
                    <div style={{ fontSize: "3rem" }} className="mb-3">
                      📋
                    </div>
                    <p className="mb-0">No tasks yet. Add one above!</p>
                  </div>
                </div>
              ) : (
                <div className="list-group list-group-flush">
                  {tasks.map((task, index) => (
                    <div
                      key={task._id}
                      className={`list-group-item d-flex align-items-center gap-3 ${
                        task.completed ? "bg-light" : ""
                      }`}
                    >
                      {/* Checkbox */}
                      <button
                        onClick={() => toggleComplete(task._id, task.completed)}
                        className={`btn p-0 border-0 rounded-circle d-flex align-items-center justify-content-center ${
                          task.completed
                            ? "bg-success text-white"
                            : "bg-white border"
                        }`}
                        style={{
                          width: "24px",
                          height: "24px",
                          border: task.completed ? "none" : "2px solid #dee2e6",
                        }}
                      >
                        {task.completed && <Check size={14} />}
                      </button>

                      {/* Task Text */}
                      <span
                        className={`flex-grow-1 ${
                          task.completed
                            ? "text-muted text-decoration-line-through"
                            : "text-dark"
                        }`}
                      >
                        {task.task}
                      </span>

                      {/* Delete Button */}
                      <button
                        onClick={() => deleteTask(task._id)}
                        className="btn btn-sm btn-outline-danger border-0"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Stats */}
            {tasks.length > 0 && (
              <div className="mt-4 text-center">
                <small className="text-muted">
                  <span className="me-3">
                    {tasks.filter((t) => !t.completed).length} remaining
                  </span>
                  <span className="me-3">•</span>
                  <span>{completedCount} completed</span>
                </small>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
