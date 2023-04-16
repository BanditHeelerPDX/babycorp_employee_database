const inquirer = require('inquirer');
const db = require('./connection');
const cTable = require('console.table');

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
        name: 'department_name',
        message: 'What is the name of the department you would like to add?'
    }).then(answer => {
    db.query('INSERT INTO department SET ?', {
        department_name: department_name },
        (err, res) => {
            if (err) throw err;
            console.log('Department has been added to the database.');
            console.table(res);
            mainMenu();
        });
})
}

function addRole() {
    inquirer.prompt({
        type: 'input',
        title: 'title',
        message: 'What is the name of the role you would like to add?'
    },
    {
        type: 'input',
        salary: 'salary',
        message: 'What is the salary of the new role?'
    },
    {
        type: 'input',
        department_id: 'department_id',
        message: 'To which department does the new role belong?'
    }).then(answer => {
    db.query('INSERT INTO role SET ?', {
        title: title, salary: salary, department_id: department_id },
        (err, res) => {
            if (err) throw err;
            console.log('Role has been added to the database.');
            console.table(res);
            mainMenu();
        });
})
}

function addEmployee() {
    inquirer.prompt({
        type: 'input',
        first_name: 'first_name',
        message: 'What is the first name of the employee you would like to add?'
    },
    {
        type: 'input',
        last_name: 'last_name',
        message: 'What is the last name of the employee you would like to add?'
    },
    {
        type: 'input',
        role_id: 'role_id',
        message: 'What is the role ID of the employee you would like to add?'
    },
    {
        type: 'input',
        manager_id: 'manager_id',
        message: 'What is the manager ID of the employee you would like to add?'
    }).then(answer => {
    db.query('INSERT INTO employee SET ?', {
        first_name: first_name, last_name: last_name, role_id: role_id, manager_id: manager_id },
        (err, res) => {
            if (err) throw err;
            console.log('Employee has been added to the database.');
            console.table(res);
            mainMenu();
        });
})
}

function updateEmployeeRole() {
    inquirer.prompt({
        type: 'input',
        employee_id: 'employee_id',
        message: 'What is the ID of the employee whose role you would like to update?'
    },
    {
        type: 'input',
        role_id: 'role_id',
        message: 'What is the new role ID of the employee you would like to update?'
    }).then(answer => {
    db.query('UPDATE employee SET role_id = ? WHERE id = ?',
    [role_id, employee_id],
    (err, res) => {
        if (err) throw err;
        console.log('Employee role has been updated.');
        console.table(res);
        mainMenu();
    });
})
}

module.exports = {
    viewAllDepartments,
    viewAllRoles,
    viewAllEmployees,
    addDepartment,
    addRole,
    addEmployee,
    updateEmployeeRole
};