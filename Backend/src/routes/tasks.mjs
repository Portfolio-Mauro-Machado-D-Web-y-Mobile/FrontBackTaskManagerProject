import express from "express";
const router = express.Router();

// Sample data (tasks)
let tasks = [
  {
    id: "1",
    title: "Task 1",
    description: "Description for Task 1",
    assignedTo: "Rodrigo Lujambio",
    startDate: "01-01-2024",
    endDate: "2024-12-31",
    status: "todo",
    priority: "Low",
    comments: [],
    order: 2
  },
  {
    id: "2",
    title: "Task 2",
    description: "Description for Task 2",
    assignedTo: "Michel Sampil",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    status: "todo",
    priority: "Medium",
    comments: [],
    order: 1
  },
  {
    id: "3",
    title: "Task 3",
    description: "Description for Task 3",
    assignedTo: "Jose Abadie",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    status: "done",
    priority: "High",
    comments: [],
    order: 3
  },
];

// GET all tasks
router.get("/tasks", (req, res) => {
  res.json(tasks);
});

// GET task by status

router.get("/tasks/:taskStatus", (req, res) => {
  const taskStatus = req.params.taskStatus;
  const filteredTasks = tasks.filter((task) => task.status.toLowerCase() === taskStatus.toLowerCase());
  
  if (filteredTasks.length > 0) {
    res.json(filteredTasks);
  } else {
    res.status(404).json({ message: `No tasks found with status: ${taskStatus}` });
  }
});

// GET task by ID
router.get("/tasks/id/:taskId", (req, res) => {
  const taskId = req.params.taskId;
  const task = tasks.find((task) => task.id === taskId);

  if (task) {
    res.json(task);
  } else {
    res.status(404).json({ message: `No task found with id: ${taskId}` });
  }
});

// POST a new task
router.post("/tasks", (req, res) => {
  const task = req.body;

  console.log(task)
  task.id = (tasks.length + 1).toString();
  task.order = (tasks.length + 1).toString();
  tasks.push(task);
  res.status(201).json(task);
});

// DELETE a task by ID
router.delete("/tasks/:taskId", (req, res) => {
  const taskId = req.params.taskId;
  tasks = tasks.filter((task) => task.id !== taskId);
  res.sendStatus(204);
});

// PUT (update) a task by ID
router.put("/tasks/:taskId", (req, res) => {
  const taskId = req.params.taskId;
  const updatedTask = req.body;

  tasks = tasks.map((task) => {
    if (task.id === taskId) {
      return { ...task, ...updatedTask, id: taskId };
    }
    return task;
  });

  res.json(tasks.find((task) => task.id === taskId));
});

export default router;
