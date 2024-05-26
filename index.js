const express = require('express');
const axios = require('axios');
const cron = require('node-cron');
const app = express();
const port = 3000;

// Middleware to parse incoming JSON requests
app.use(express.json());

// Base URL for the Strapi API
const BASE_URL = 'http://strapi.koders.in/api/expenses/';

// Middleware to handle errors
const errorHandler = (err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
};

// Fetch expenses from Strapi
const fetchExpenses = async () => {
  try {
    const response = await axios.get(BASE_URL);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching expenses:', error);
    throw error;
  }
};

// Update expense in Strapi
const updateExpense = async (id, updatedData) => {
  try {
    await axios.put(`${BASE_URL}${id}`, updatedData, {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(`Error updating expense with ID ${id}:`, error);
    throw error;
  }
};

// Endpoint to create a new expense
app.post('/expenses', async (req, res, next) => {
  try {
    const newExpense = req.body;
    const response = await axios.post(BASE_URL, newExpense, {
      headers: { 'Content-Type': 'application/json' },
    });
    res.status(201).json(response.data);
  } catch (error) {
    next(error);
  }
});

// Endpoint to get all expenses
app.get('/expenses', async (req, res, next) => {
  try {
    const expenses = await fetchExpenses();
    res.status(200).json(expenses);
  } catch (error) {
    next(error);
  }
});

// Endpoint to update an existing expense by ID
app.put('/expenses/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const updatedData = req.body;
    await updateExpense(id, updatedData);
    res.status(200).json({ message: 'Expense updated successfully' });
  } catch (error) {
    next(error);
  }
});

// Endpoint to delete an expense by ID
app.delete('/expenses/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    await axios.delete(`${BASE_URL}${id}`);
    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// Middleware to handle errors
app.use(errorHandler);

// A function to update recurring expenses
const updateRecurringExpenses = async () => {
  // Frequency mapping to days
  const frequencies = {
    'Daily': 1,
    'Weekly': 7,
    'Monthly': 30,
    'Quarterly': 91,
    'Yearly': 365
  };

  try {
    const expenses = await fetchExpenses();
    const now = new Date();

    // Iterate over each expense
    expenses.forEach(async (expense) => {
      const { id, attributes } = expense;
      const { frequency, base, date } = attributes;

      if (frequency !== 'One-Time') {
        const lastUpdate = new Date(date);
        const diffDays = Math.floor((now - lastUpdate) / (1000 * 60 * 60 * 24));

        if (diffDays >= frequencies[frequency]) {
          const increments = Math.floor(diffDays / frequencies[frequency]);
          const newAmount = attributes.amount + increments * base;
          const newDate = new Date(lastUpdate.getTime() + increments * frequencies[frequency] * 24 * 60 * 60 * 1000);

          // Update expense with new amount and date
          await updateExpense(id, {
            ...attributes,
            amount: newAmount,
            date: newDate.toISOString().split('T')[0]
          });
        }
      }
    });
  } catch (error) {
    console.error('Error updating recurring expenses:', error);
  }
};

// Schedule the cron job to run daily at midnight
cron.schedule('0 0 * * *', updateRecurringExpenses);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
