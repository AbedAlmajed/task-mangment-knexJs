
const express = require('express');
const knex = require('./knex');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(cors());

// Create a new task
app.post('/tasks', async (req, res) => {
  const { title, description } = req.body;
  try {
    const [task] = await knex('tasks').insert({ title, description }).returning('*');
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// View all tasks
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await knex('tasks').whereNull('deleted_at');
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Update a task
app.put('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  try {
    const [task] = await knex('tasks')
      .where('id', id)
      .update({ title, description })
      .returning('*'); // return the updated task

    if (task) {
      res.status(200).json(task);
    } else {
      res.status(404).json({ error: 'Task not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// Soft delete a task
app.delete('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await knex('tasks').where('id', id).update({ deleted_at: knex.fn.now() });
    res.status(200).json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
