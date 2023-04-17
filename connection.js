const inquirer = require("inquirer");
const cTable = require("console.table");
const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createConnection({
  host: "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) throw err;
  console.log("You have made a connection to the database.");
});

function exit() {
  console.log("Later, skater!");
  process.exit();
}

const actions = {
  "View all departments": viewAllDepartments,
  "View all roles": viewAllRoles,
  "View all employees": viewAllEmployees,
  "View all managers": viewAllManagers,
  "View all employees by department": viewAllEmployeesByDepartment,
  "View all employees by manager": viewAllEmployeesByManager,
  "View all employees by role": viewAllEmployeesByRole,
  "Add a department": addDepartment,
  "Add a role": addRole,
  "Add an employee": addEmployee,
  "Update an employee role": updateEmployeeRole,
  "Update an employee manager": updateEmployeeManager,
  "Delete a department": deleteDepartment,
  "Delete a role": deleteRole,
  "Delete an employee": deleteEmployee,
  Exit: exit,
};

function mainMenu() {
  inquirer
    .prompt({
      type: "list",
      name: "action",
      message: "Whatchagonnado?",
      choices: Object.keys(actions),
    })
    .then((answer) => {
      actions[answer.action]();
    });
}

function viewAllDepartments() {
  db.query("SELECT * FROM department", (err, res) => {
    if (err) throw err;
    console.table(res);
    mainMenu();
  });
}

function viewAllRoles() {
  db.query("SELECT * FROM role", (err, res) => {
    if (err) throw err;
    console.table(res);
    mainMenu();
  });
}

function viewAllEmployees() {
  db.query(`SELECT employee.id, employee.first_name, employee.last_name, role.title AS role, role.salary, department.name AS department FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id`,
  (err, res) => {
    if (err) throw err;
    console.table(res);
    mainMenu();
  });
}

function viewAllManagers() {
  db.query(
    "SELECT * FROM employee WHERE manager_id IS NULL OR id IN (SELECT DISTINCT manager_id FROM employee WHERE manager_id IS NOT NULL)",
    (err, res) => {
      if (err) throw err;
      console.table(res);
      mainMenu();
    }
  );
}

function viewAllEmployeesByDepartment() {
  db.query(
    "SELECT employee.first_name, employee.last_name, department.name FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id;",
    (err, res) => {
      if (err) throw err;
      console.table(res);
      mainMenu();
    }
  );
}

function viewAllEmployeesByManager() {
  db.query(
    "SELECT employee.first_name, employee.last_name, employee.manager_id FROM employee JOIN employee manager ON employee.manager_id = manager.id;",
    (err, res) => {
      if (err) throw err;
      console.table(res);
      mainMenu();
    }
  );
}

function viewAllEmployeesByRole() {
  db.query(
    'SELECT role.title, GROUP_CONCAT(CONCAT(employee.first_name, " ", employee.last_name) SEPARATOR ", ") AS employees FROM employee JOIN role ON employee.role_id = role.id GROUP BY role.title;',
    (err, res) => {
      if (err) throw err;
      console.table(res);
      mainMenu();
    }
  );
}

function addDepartment() {
  inquirer
    .prompt({
      type: "input",
      name: "name",
      message: "What is the name of the department you would like to add?",
    })
    .then((answer) => {
      db.query(
        "INSERT INTO department SET ?",
        {
          name: answer.name,
        },
        (err, res) => {
          if (err) throw err;
          console.log("Department has been added to the database.");
          console.table(res);
          mainMenu();
        }
      );
    });
}

function addRole() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "title",
        message: "What is the name of the role you would like to add?",
      },
      {
        type: "input",
        name: "salary",
        message: "What is the salary of the new role?",
      },
      {
        type: "input",
        name: "department_id",
        message: "To which department does the new role belong?",
      },
    ])
    .then((answer) => {
      db.query(
        "INSERT INTO role SET ?",
        [
          {
            title: answer.title,
            salary: answer.salary,
            department_id: answer.department_id,
          },
        ],
        (err, res) => {
          if (err) throw err;
          console.log("Role has been added to the database.");
          console.table(res);
          mainMenu();
        }
      );
    });
}

function addEmployee() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "first_name",
        message:
          "What is the first name of the employee you would like to add?",
      },
      {
        type: "input",
        name: "last_name",
        message: "What is the last name of the employee you would like to add?",
      },
      {
        type: "input",
        name: "role_id",
        message: "What is the role ID of the employee you would like to add?",
      },
      {
        type: "input",
        name: "manager_id",
        message:
          "What is the manager ID of the employee you would like to add?",
      },
    ])
    .then((answer) => {
      db.query(
        "INSERT INTO employee SET ?",
        [
          {
            first_name: answer.first_name,
            last_name: answer.last_name,
            role_id: answer.role_id,
            manager_id: answer.manager_id,
          },
        ],
        (err, res) => {
          if (err) throw err;
          console.log("Employee has been added to the database.");
          console.table(res);
          mainMenu();
        }
      );
    });
}

function updateEmployeeRole() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "employee_id",
        message:
          "What is the ID of the employee whose role you would like to update?",
      },
      {
        type: "input",
        name: "role_id",
        message:
          "What is the new role ID of the employee you would like to update?",
      },
    ])
    .then((answer) => {
      db.query(
        "UPDATE employee SET role_id = ? WHERE id = ?",
        [answer.role_id, answer.employee_id],
        (err, res) => {
          if (err) throw err;
          console.log("Employee role has been updated.");
          console.table(res);
          mainMenu();
        }
      );
    });
}

function deleteDepartment() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "choice",
        message:
          "Would you like to delete by department ID or department name?",
        choices: ["ID", "Name"],
      },
      {
        type: "input",
        name: "value",
        message: (answers) =>
          `What is the ${answers.choice} of the department you would like to delete?`,
      },
    ])
    .then((answers) => {
      let query = "";
      if (answers.choice === "ID") {
        query = "DELETE FROM department WHERE id = ?";
      } else {
        query = "DELETE FROM department WHERE name = ?";
      }
      db.query(query, [answers.value], (err, res) => {
        if (err) throw err;
        console.log(
          "I sincerely hope you meant to delete that department, because it has now been destroyed."
        );
        console.table(res);
        mainMenu();
      });
    });
}

function deleteRole() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "choice",
        message: "Would you like to delete by role ID or role title?",
        choices: ["ID", "Title"],
      },
      {
        type: "input",
        name: "value",
        message: (answers) =>
          `What is the ${answers.choice} of the role you would like to delete?`,
      },
    ])
    .then((answers) => {
      let query = "";
      if (answers.choice === "ID") {
        query = "DELETE FROM role WHERE id = ?";
      } else {
        query = "DELETE FROM role WHERE title = ?";
      }
      db.query(query, [answers.value], (err, res) => {
        if (err) throw err;
        console.log(
          "I sincerely hope you meant to delete that role, because it has now been destroyed."
        );
        console.table(res);
        mainMenu();
      });
    });
}

function deleteEmployee() {
  inquirer
    .prompt({
      type: "input",
      name: "employee_id",
      message: "What is the ID of the employee you would like to delete?",
    })
    .then((answer) => {
      db.query(
        "DELETE FROM employee WHERE id = ?",
        [answer.employee_id],
        (err, res) => {
          if (err) throw err;
          console.log(
            "I sincerely hope you meant to delete that employee, because they have now been banished from the database."
          );
          console.table(res);
          mainMenu();
        }
      );
    });
}

function updateEmployeeManager() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "employee_id",
        message:
          "What is the ID of the employee whose manager you would like to update?",
      },
      {
        type: "input",
        name: "manager_id",
        message:
          "What is the new manager ID of the employee you would like to update?",
      },
    ])
    .then((answer) => {
      db.query(
        "UPDATE employee SET manager_id = ? WHERE id = ?",
        [answer.manager_id, answer.employee_id],
        (err, res) => {
          if (err) throw err;
          console.log(
            "There is a new sheriff in town - for that employee, anyway."
          );
          console.table(res);
          mainMenu();
        }
      );
    });
}

mainMenu();
