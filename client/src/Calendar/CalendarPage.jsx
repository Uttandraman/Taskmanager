import React, { useEffect, useState, useContext } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "../Calendar/CalendarPage.css";
import { AuthContext } from "../AuthContext";
import axios from "axios";
import { List, Calendar as CalendarIcon, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CalendarPage() {
  const { user } = useContext(AuthContext);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/tasks?userEmail=${user.email}`
        );
        console.log(`http://localhost:5000/api/tasks?userEmail=${user.email}`);
        setTasks(res.data);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
    };

    fetchTasks();
  }, [user.email]);

  const dateHasTask = (date) => {
    const dateStr = date.toISOString().split("T")[0];
    return tasks.some((task) => task.dueDate?.startsWith(dateStr));
  };

  const selectedDateStr = selectedDate.toISOString().split("T")[0];
  const filteredTasks = tasks.filter((task) =>
    task.dueDate?.startsWith(selectedDateStr)
  );

  const selectedMonth = selectedDate.getMonth();
  const selectedYear = selectedDate.getFullYear();

  const tasksInMonth = tasks.filter((task) => {
    const taskDate = new Date(task.dueDate);
    return (
      taskDate.getMonth() === selectedMonth &&
      taskDate.getFullYear() === selectedYear
    );
  });

  // Prepare pie chart data from completed tasks
  const completedTasks = tasksInMonth.filter(
    (task) => task.category === "Completed"
  );
  const incompleteTasks = tasksInMonth.filter(
    (task) => task.category !== "Completed"
  );

  const categoryColorMap = new Map(); // to collect category names and color totals

  completedTasks.forEach((task) => {
    const category = task.originalCategory || "Unknown";
    const color = task.categoryColor || "#4caf50";

    if (!categoryColorMap.has(category)) {
      categoryColorMap.set(category, {
        name: category,
        value: 0,
        color: color,
      });
    }
    categoryColorMap.get(category).value += 1;
  });

  // Final pie data array
  const pieData = [
    ...categoryColorMap.values(),
    {
      name: "Incomplete",
      value: incompleteTasks.length,
      color: "#9e9e9e", // gray
    },
  ];

  console.log("Pie Data:", pieData);


  const COLORS = ["#4caf50", "#f44336"];

  return (
    <div>
    <div className="calendar-page">
      <h2 className="page-title"> CALENDAR</h2>

      <div className="calendar-main-wrapper">
        <div className="calendar-box">
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            className="custom-calendar"
            tileContent={({ date, view }) =>
              view === "month" && dateHasTask(date) ? (
                <div className="dot" />
              ) : null
            }
          />

          <div className="task-list-section">
            <h3 className="task-section-title">
              Tasks for {selectedDate.toDateString()}
            </h3>
            {filteredTasks.length > 0 ? (
              <ul className="task-list">
                {filteredTasks.map((task, index) => (
                  <li
                    key={`${task.title}-${task.dueDate}-${index}`}
                    className="task-card"
                    style={{ borderLeft: `5px solid ${task.categoryColor}` }}
                  >
                    <div className="task-title-row">
                      <p className="task-title">{task.title}</p>
                      <span
                        className="task-category-badge"
                        style={{ backgroundColor: task.categoryColor }}
                      >
                        {task.category}
                      </span>
                    </div>
                    <p className="task-desc">{task.description}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-task">No tasks for this date.</p>
            )}
          </div>
        </div>

        <div className="summary-box">
          <div className="summary-card">
            <h4> Tasks This Month</h4>
            <p className="summary-count">{tasksInMonth.length}</p>
          </div>
          <div className="summary-card">
            <h4> Completed This Month</h4>
            <p className="summary-count">{completedTasks.length}</p>

          </div>
          <div className="chart-card">
            <h4> Task Completion</h4>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  label={({ name }) => name}
                  dataKey="value"
                  isAnimationActive={false} // helpful for debugging
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="chart-legend">
              {pieData.map((item, index) => (
                <div key={index} className="legend-item">
                  <span
                    className="legend-color"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="legend-label">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="navBar">
        <div className="navItem" onClick={() => navigate("/task")}>
          <List size={20} />
          <span>Task</span>
        </div>
        <div className="navItem">
          <CalendarIcon size={20} />
          <span>Calendar</span>
        </div>
        <div className="navItem" onClick={() => navigate("/")}>
          <Settings size={20} />
          <span>Settings</span>
        </div>
      </div>
    </div>
  );
}
