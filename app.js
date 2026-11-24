const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

const usersPath = path.join(__dirname, 'users.json');
const users = JSON.parse(fs.readFileSync(usersPath, 'utf8'));

app.get('/api/users', (req, res) => {
  res.json(users);
});

app.get('/api/users/filter', (req, res) => {
  const { minAge, maxAge } = req.query;
  let filteredUsers = [...users];

  if (minAge !== undefined) {
    const min = Number(minAge);
    if (!isNaN(min)) {
      filteredUsers = filteredUsers.filter(user => user.age >= min);
    }
  }

  if (maxAge !== undefined) {
    const max = Number(maxAge);
    if (!isNaN(max)) {
      filteredUsers = filteredUsers.filter(user => user.age <= max);
    }
  }

  res.json(filteredUsers);
});

app.get('/api/users/:id', (req, res) => {
  const userId = Number(req.params.id);
  const user = users.find(u => u.id === userId);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json(user);
});

app.get('/user/:id', (req, res) => {
  const userId = Number(req.params.id);
  const user = users.find(u => u.id === userId);

  if (!user) {
    return res.status(404).send('<h1>404 - User Not Found</h1>');
  }

  const htmlTemplate = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>User Profile - ${user.name}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .card { border: 1px solid #ccc; border-radius: 8px; padding: 20px; max-width: 350px; background: #f9f9f9; }
        h2 { margin-top: 0; color: #333; }
        p { margin: 8px 0; }
      </style>
    </head>
    <body>
      <div class="card">
        <h2>User Details</h2>
        <p><strong>ID:</strong> ${user.id}</p>
        <p><strong>Name:</strong> ${user.name}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Age:</strong> ${user.age}</p>
      </div>
    </body>
    </html>
  `;

  res.send(htmlTemplate);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
