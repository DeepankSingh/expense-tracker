# expense-tracker
Express.js expense tracker for interviews

#Expense Tracker
Expense Tracker is an Express server application designed to manage expenses within an expense table. It facilitates the creation, updating, and deletion of expenses, with special attention given to recurring expenses.

#Objective
The main objective of this application is to provide a backend solution for managing expenses effectively. It supports CRUD (Create, Read, Update, Delete) operations on expenses, including handling recurring expenses with different frequencies.

#Features
Create new expenses with various attributes such as date, amount, description, and frequency.
Retrieve a list of all expenses.
Update existing expenses by ID.
Delete expenses by ID.
Automatic updating of recurring expenses based on their frequency using a cron-based scheduler.
#Technologies Used
Node.js
Express.js
Axios (for making HTTP requests)
Node-cron (for scheduling recurring expense updates)
#Getting Started
Clone the repository: git clone https://github.com/koders-in/expense-tracker.git
Install dependencies: npm install
Start the server: node index.js
Access the server at: http://localhost:3000
#Usage
Use HTTP requests (POST, GET, PUT, DELETE) to interact with the endpoints for managing expenses.
Refer to the API documentation or code comments for detailed usage instructions.
Contributing
Contributions are welcome! Please follow the guidelines for code contributions and submit your changes as a pull request.

#Authors
Deepank Singh - Backend Developer Intern
