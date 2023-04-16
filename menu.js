const inquirer = require('inquirer');
const { viewAllDepartments, viewAllRoles, viewAllEmployees, addDepartment, addRole, addEmployee, updateEmployeeRole, exit } = require('./query');
const cTable = require('console.table');

const actions = {
    'View all departments': viewAllDepartments,
    'View all roles': viewAllRoles,
    'View all employees': viewAllEmployees,
    'Add a department': addDepartment,
    'Add a role': addRole,
    'Add an employee': addEmployee,
    'Update an employee role': updateEmployeeRole,
    'Return to main menu': mainMenu,
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

mainMenu();