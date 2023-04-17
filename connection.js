const inquirer = require('inquirer');
const cTable = require('console.table');
const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) throw err;
    console.log('You have made a connection to the database.');
});

function exit() {
    console.log('Later, skater!');
    process.exit();
}

const actions = {
    'View all departments': viewAllDepartments,
    'View all roles': viewAllRoles,
    'View all employees': viewAllEmployees,
    'Add a department': addDepartment,
    'Add a role': addRole,
    'Add an employee': addEmployee,
    'Update an employee role': updateEmployeeRole,
    'Exit': exit
};

function mainMenu() {
    inquirer.prompt({
        type: 'list',
        name: 'action',
        message: 'Whatchagonnado?',
        choices: Object.keys(actions)
    }).then(answer => {
        actions[answer.action]();
    });
}

function viewAllDepartments() {
    db.query('SELECT * FROM department', (err, res) => {
        if (err) throw err;
        console.table(res);
        mainMenu();
    });
}

function viewAllRoles() {
    db.query('SELECT * FROM role', (err, res) => {
        if (err) throw err;
        console.table(res);
        mainMenu();
    });
}

function viewAllEmployees() {
    db.query('SELECT * FROM employee', (err, res) => {
        if (err) throw err;
        console.table(res);
        mainMenu();
    });
}

function addDepartment() {
    inquirer.prompt({
        type: 'input',
        name: 'name',
        message: 'What is the name of the department you would like to add?'
    }).then(answer => {
    db.query('INSERT INTO department SET ?', {
        name: answer.name },
        (err, res) => {
            if (err) throw err;
            console.log('Department has been added to the database.');
            console.table(res);
            mainMenu();
        });
})
}

function addRole() {
    inquirer.prompt([
        {
        type: 'input',
        name: 'title',
        message: 'What is the name of the role you would like to add?'
    },
    {
        type: 'input',
        name: 'salary',
        message: 'What is the salary of the new role?'
    },
    {
        type: 'input',
        name: 'department_id',
        message: 'To which department does the new role belong?'
    }
    ]).then(answer => {
    db.query('INSERT INTO role SET ?', [ {
        title: answer.title, salary: answer.salary, department_id: answer.department_id } ],
        (err, res) => {
            if (err) throw err;
            console.log('Role has been added to the database.');
            console.table(res);
            mainMenu();
        });
})
}

function addEmployee() {
    inquirer.prompt([
    {
        type: 'input',
        name: 'first_name',
        message: 'What is the first name of the employee you would like to add?'
    },
    {
        type: 'input',
        name: 'last_name',
        message: 'What is the last name of the employee you would like to add?'
    },
    {
        type: 'input',
        name: 'role_id',
        message: 'What is the role ID of the employee you would like to add?'
    },
    {
        type: 'input',
        name: 'manager_id',
        message: 'What is the manager ID of the employee you would like to add?'
    }
    ]).then(answer => {
    db.query('INSERT INTO employee SET ?', 
    [ { first_name: answer.first_name, last_name: answer.last_name, role_id: answer.role_id, manager_id: answer.manager_id } ],
        (err, res) => {
            if (err) throw err;
            console.log('Employee has been added to the database.');
            console.table(res);
            mainMenu();
        });
})
}

function updateEmployeeRole() {
    inquirer.prompt([
    {
        type: 'input',
        name: 'employee_id',
        message: 'What is the ID of the employee whose role you would like to update?'
    },
    {
        type: 'input',
        name: 'role_id',
        message: 'What is the new role ID of the employee you would like to update?'
    }
    ]).then(answer => {
    db.query('UPDATE employee SET role_id = ? WHERE id = ?',
    [answer.role_id, answer.employee_id],
    (err, res) => {
        if (err) throw err;
        console.log('Employee role has been updated.');
        console.table(res);
        mainMenu();
    });
})
}

mainMenu();