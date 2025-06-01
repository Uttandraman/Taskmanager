import React, { useState, useRef, useEffect, useContext } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Plus, Calendar, Settings, List, X, Edit, Trash2 } from "lucide-react";
import "../Task/Task.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import SettingsSidebar from "../Settingpage/SettingsSidebar";

export default function TaskListPage() {
  const datePickerRef = useRef();
  const { user } = useContext(AuthContext);
  const [showPopup, setShowPopup] = useState(false);
  const [taskInput, setTaskInput] = useState({
    title: "",
    dueDate: "",
    description: "",
    category: "General",
    userEmail: user?.email || "",
  });

  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState(["General", "Completed"]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [newCategory, setNewCategory] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const navigate = useNavigate();
  const navigate1 = useNavigate();
  const [settingsOpen, setSettingsOpen] = useState(false);

  //console.log(user);
  useEffect(() => {
    if (user?.email) {
      axios
        .get(`http://localhost:5000/api/tasks?userEmail=${user.email}`)
        .then((res) => {
          const fetchedTasks = res.data;
          setTasks(fetchedTasks);

          // Dynamically calculate active categories (excluding "Completed")
          const activeCategories = Array.from(
            new Set(
              fetchedTasks
                .filter((task) => task.category !== "Completed")
                .map((task) => task.category)
            )
          );

          const finalCategories = [...activeCategories, "Completed"];
          setCategories(finalCategories);
        });
    }
  }, [user]);

  useEffect(() => {
    const activeCategories = Array.from(
      new Set(
        tasks
          .filter((task) => task.category !== "Completed")
          .map((task) => task.category)
      )
    );

    const finalCategories = [...activeCategories, "Completed"];
    setCategories(finalCategories);
  }, [tasks]);

  useEffect(() => {
    if (!categories.includes(selectedCategory)) {
      setSelectedCategory("All");
    }
  }, [categories, selectedCategory]);

  const addTask = () => {
    if (taskInput.title.trim()) {
      if (editIndex !== null) {
        const taskToUpdate = { ...taskInput, _id: tasks[editIndex]._id };
        axios
          .put(
            `http://localhost:5000/api/tasks/${taskToUpdate._id}`,
            taskToUpdate
          )
          .then((res) => {
            const updatedTasks = [...tasks];
            updatedTasks[editIndex] = res.data;
            setTasks(updatedTasks);
            setEditIndex(null);
          });
      } else {
        axios
          .post("http://localhost:5000/api/tasks", {
            ...taskInput,
            userEmail: user.email,
          })
          .then((res) => {
            setTasks([...tasks, res.data]);
            if (!categories.includes(newTask.category)) {
              setCategories((prev) => [...prev, newTask.category]);
            }
          });
      }
      setTaskInput({
        title: "",
        dueDate: "",
        description: "",
        category: "General",
      });
      setShowPopup(false);
    }
  };

  const handleDeleteTask = (index) => {
    const taskId = tasks[index]._id;
    axios.delete(`http://localhost:5000/api/tasks/${taskId}`).then(() => {
      const updatedTasks = [...tasks];
      updatedTasks.splice(index, 1);
      setTasks(updatedTasks);
    });
  };

  const handleEditTask = (index) => {
    setTaskInput(tasks[index]);
    setEditIndex(index);
    setShowPopup(true);
  };

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory("");
    }
  };

  const handleToggleComplete = (index) => {
    const task = tasks[index];
    const updatedTask = { ...task };

    if (task.category !== "Completed") {
      // Store original category if marking complete
      updatedTask.originalCategory = task.category;
      updatedTask.category = "Completed";
    } else {
      // Restore original category if unmarking complete
      updatedTask.category = task.originalCategory || "General";
      delete updatedTask.originalCategory;
    }

    axios
      .put(`http://localhost:5000/api/tasks/${task._id}`, updatedTask)
      .then((res) => {
        const updatedTasks = [...tasks];
        updatedTasks[index] = res.data;
        setTasks(updatedTasks);
      });
  };

  const visibleTasks = tasks.filter(
    (t) => selectedCategory === "All" || t.category === selectedCategory
  );

  const getDueLabel = (dateStr) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dateStr);
    due.setHours(0, 0, 0, 0);

    const oneDay = 24 * 60 * 60 * 1000;
    const diffDays = Math.floor((due - today) / oneDay);

    const thisYear = today.getFullYear();
    const thisMonth = today.getMonth();
    const dueYear = due.getFullYear();
    const dueMonth = due.getMonth();

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const startOfNextWeek = new Date(endOfWeek);
    startOfNextWeek.setDate(endOfWeek.getDate() + 1);
    const endOfNextWeek = new Date(startOfNextWeek);
    endOfNextWeek.setDate(startOfNextWeek.getDate() + 6);

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (due >= today && due <= endOfWeek) return "This Week";
    if (due >= startOfNextWeek && due <= endOfNextWeek) return "Next Week";
    if (dueMonth === thisMonth + 1 && dueYear === thisYear) return "Next Month";
    if (dueYear > thisYear) return "Next Year";
    return "Later";
  };

  const handlecalendar = () => {
    navigate1("/calendar");
  };

  return (
    <div className="container">
      <div className="topBar">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="select"
        >
          <option value="All">All</option>
          {categories.map((cat, i) => (
            <option key={i} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <button onClick={() => setShowPopup(true)} className="addButton">
          <Plus size={18} />
        </button>
      </div>

      <div className="taskList">
        {visibleTasks.map((task, index) => (
          <div
            key={index}
            className="taskItem"
            onClick={() => setSelectedTask(task)}
          >
            <div className="taskHeader">
              <input
                type="checkbox"
                checked={task.category === "Completed"}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => {
                  handleToggleComplete(index);
                }}
              />
              <h3>{task.title}</h3>
              <span className="categoryTag">{task.category}</span>
              <div className="taskActions">
                <button
                  className="editBtn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditTask(index);
                  }}
                >
                  <Edit size={16} />
                </button>
                <button
                  className="deleteBtn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteTask(index);
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <p className="taskMeta">
              Due: {task.dueDate}
              {getDueLabel(task.dueDate) && (
                <span className="dueLabel"> — {getDueLabel(task.dueDate)}</span>
              )}
            </p>
          </div>
        ))}
      </div>

      <div className="navBar">
        <div className="navItem">
          <List size={20} />
          <span>Task</span>
        </div>
        <div className="navItem" onClick={() => handlecalendar()}>
          <Calendar size={20} />
          <span>Calendar</span>
        </div>
        <div className="navItem" onClick={() => setSettingsOpen(true)}>
          <Settings size={20} />
          <span>Settings</span>
        </div>
      </div>
      <SettingsSidebar
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />

      {showPopup && (
        <div className="popupOverlay">
          <div className="popup">
            <h2>{editIndex !== null ? "Edit Task" : "Add Task"}</h2>
            <input
              type="text"
              placeholder="Title"
              value={taskInput.title}
              onChange={(e) =>
                setTaskInput({ ...taskInput, title: e.target.value })
              }
              className="input"
            />
            <div className="dateFieldWrapper">
              <input
                type="text"
                value={taskInput.dueDate}
                placeholder="Due Date"
                readOnly
                className="taskInput"
              />
              <Calendar
                size={18}
                className="calendarIcon"
                onClick={() => datePickerRef.current.setOpen(true)}
              />
              <DatePicker
                selected={
                  taskInput.dueDate ? new Date(taskInput.dueDate) : null
                }
                onChange={(date) =>
                  setTaskInput({
                    ...taskInput,
                    dueDate: date.toISOString().slice(0, 10),
                  })
                }
                dateFormat="yyyy-MM-dd"
                ref={datePickerRef}
                customInput={<div />}
                withPortal
              />
            </div>
            <textarea
              placeholder="Description"
              value={taskInput.description}
              onChange={(e) =>
                setTaskInput({ ...taskInput, description: e.target.value })
              }
              className="input textarea"
            />
            <div>
              <label>Select Category: </label>
              <select
                value={taskInput.category}
                onChange={(e) =>
                  setTaskInput({ ...taskInput, category: e.target.value })
                }
                className="select"
              >
                {categories.map((cat, i) => (
                  <option key={i} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div className="categoryInput">
              <input
                type="text"
                placeholder="New category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="input"
              />
              <button onClick={handleAddCategory} className="popupButton">
                Add Category
              </button>
            </div>
            <div className="popupButtons">
              <button onClick={addTask} className="popupButton">
                {editIndex !== null ? "Edit" : "Add"}
              </button>
              <button
                onClick={() => {
                  setShowPopup(false);
                  setEditIndex(null);
                }}
                className="popupButton"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedTask && (
        <div className="popupOverlay">
          <div className="popup">
            <div className="popupHeader">
              <h2>Task Details</h2>
              <X
                onClick={() => setSelectedTask(null)}
                style={{ cursor: "pointer" }}
              />
            </div>
            <p>
              <strong>Title:</strong> {selectedTask.title}
            </p>
            <p>
              <strong>Due Date:</strong> {selectedTask.dueDate}
            </p>
            <p>
              <strong>Category:</strong> {selectedTask.category}
            </p>
            <p>
              <strong>Description:</strong> {selectedTask.description}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
