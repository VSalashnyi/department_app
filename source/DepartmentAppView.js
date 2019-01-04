// import { state } from "./DepartmentAppController";

// import { Route } from './Route'

export class DepartmentAppView{

  renderNavbar(data) {
    $('nav').empty();

    data.forEach(dep => {
      this.renderButton(dep.department_title, 'btn btn-secondary m-3', 'nav', () => this.windowHistoryPushState('/gfdsgdfg'))
    });

    this.renderButton('Add new department', 'btn btn-success m-3', 'nav',() => {
      this.windowHistoryPushState('/add-department');
    });
  }

  render(route){

    console.log('rebilding')
  }

  renderContent() {
    if (current_department === undefined) {
      $('#app').html('This page does not exist');
    } else {
      let div = $('<div/>').addClass('jumbotron');
      $('<h3/>').addClass('display-4 d-inline').text(current_department.department_title).appendTo(div);
      this.renderButton('Delete department', 'btn btn-danger ml-5 mb-3', div, () => {
        state = state.filter(department => department !== current_department);
        this.renderNavigation(state);
        if (state.length) {
          this.windowHistoryPushState(state[state.length - 1].id);
          this.render(window.location.pathname);
        } else {
          this.windowHistoryPushState('no-dep');
          this.render(window.location.pathname);
        }
      });
      this.renderButton('Edit department', 'btn btn-warning ml-5 mb-3', div, () => {
        this.windowHistoryPushState('edit-department');
        this.render(window.location.pathname);
      });
      $('<p/>').html(`Head of department - <b>${current_department.head}</b>`).appendTo(div);
      $('<p/>').html(`Average salary : ${this.averageSalary(current_department)}`).appendTo(div);
      $('<p/>').html(`Total salary : ${this.totalSalary(current_department)}`).appendTo(div);
      $('<p/>').html(this.renderList()).appendTo(div);
      $('<hr/>').appendTo(div);
      $('<p/>').html(current_department.description).appendTo(div);
      $('<h4/>').html('Employees:').appendTo(div);
      this.renderTable(current_department).appendTo(div);
      $('#app').html(div);
    }
  }

  renderTable({employees}) {
    let table = $('<table/>').addClass('table');
    if(employees.length === 0) {
      table.append('You have not any employees');
    } else {
      employees.forEach(function(employee) {
        table.append(this.renderTableRow(employee));
      }.bind(this));
    }
    return table;
  }

  renderTableRow(employee) {
    let row = $('<tr>');
    $('<td>').html(employee.firstName).appendTo(row);
    $('<td>').html(employee.secondName).appendTo(row);
    $('<td>').html(employee.date).appendTo(row);
    $('<td>').html(employee.salary).appendTo(row);

    this.renderButton('Delete', 'btn btn-danger', row,() => {
      state = state.map(dep => {
        if (dep === current_department) {
          let deletedEmployees = dep.employees.filter(currentEmployee => {
            return currentEmployee !== employee;
          });
          return {
            ...dep,
            employees: deletedEmployees
          };
        } else {
          return dep;
        }
      })
      this.render(window.location.pathname);
    });

    this.renderButton('Edit', 'btn btn-warning mr-2', row,() => {
      current_employee = employee;
      this.windowHistoryPushState('edit-employee');
      this.render(window.location.pathname);
    });
    return row;
  }


  averageSalary({employees}) {
    if(employees.length === 0){
      return 0;
    } else {
      return Math.round(this.getSalary(employees) / employees.length);
    }
  }

  totalSalary({employees}) {
    if (employees.length) {
      return this.getSalary(employees);
    } else {
      return 0;
    }
  }

  getSalary(employees) {
    return employees.map(employee => employee.salary).reduce((accumulator, current) => current + accumulator);
  }

  renderList() {
    let count = 0,
      paragraph = $('<p/>').html('Employees with salary lower than average in the department:'),
      list = $('<ul>');
    current_department.employees.forEach(function (employee) {
      if(employee.salary < this.averageSalary(current_department)) {
        list.append($('<li>').text(`${employee.firstName} ${employee.secondName}`));
        count++;
      }
    }.bind(this));
    if(count) return paragraph.append(list);
  }

  navigate(route) {
    this.windowHistoryPushState(route);
    this.render(window.location.pathname);
  }

  windowHistoryPushState(data) {
    window.history.pushState(
      {},
      data,
      data
    );
  }

  renderDefaultPage() {
    $('#app').html(`<div class="jumbotron"><h1 class="display-4"></h1></div>`);
  }

  renderButton(buttonTitle, buttonClass, appendPlace, callBack) {
    let button = $('<button/>')
      .text(buttonTitle)
      .addClass(buttonClass)
      .click(callBack);
    $(appendPlace).append($(button));
  }

  renderDefaultPage(){
    let div = $('<div/>').addClass('jumbotron');
    $('<h2>').text('Choose department you are interesting in or add your own').appendTo(div);
    $('#app').append(div);
  }

  renderDepartmentForm() {
    let div = $('<div/>').addClass('jumbotron w-50 m-auto');
    let form = $('<form/>').appendTo(div);
    renderInputField('dep_name', 'Department label', 'Enter the name of department...', 'text', form);
    renderInputField('dep_head_name', 'Department head name:', 'Enter the name of the head of department...', 'text', form);
    renderTextareaField('dep_description', 'Department description:', 'Enter the department description...', 'text', form);
    $('#app').html(div);
  }

  renderEmployeeForm() {
    let div = $('<div/>').addClass('jumbotron w-50 m-auto');
    let form = $('<form/>').appendTo(div);
    renderInputField('employee_first_name', 'Employee first name', 'Enter employee first name...', 'text', form);
    renderInputField('employee_second_name', 'Employee second name:', 'Enter employee second name...', 'text', form);
    renderInputField('employee_date', 'Employee birth date:', 'Enter employee\'s date of birth...', 'date', form);
    renderInputField('employee_salary', 'Employee salary:', 'Enter employee\'s salary...', 'number', form);
    $('#app').html(div);
  }

  renderAddDepartmentForm() {
    renderDepartmentForm();
    renderButton('Add new department','btn btn-secondary float-right mt-2' , 'form', () => {
      //adding new department
      state.push({
        id: state.length ? state[state.length - 1].id + 1 : 1,
        department_title: $('#dep_name').val(),
        description: $('#dep_description').val(),
        head: $('#dep_head_name').val(),
        employees: []
      });

      //navigation rebuilding
      buildNavigation(state);
      windowHistoryPushState(state[state.length - 1].id);
      render(window.location.pathname);
    });
  }

  renderEditDepartmentForm() {
    renderDepartmentForm();
    $('#dep_name').val(current_department.department_title);
    $('#dep_head_name').val(current_department.head);
    $('#dep_description').val(current_department.description);

    renderButton('Edit department', 'btn btn-secondary float-right mt-2', 'form', () => {
      // current department editing
      state = state.map(dep => {
        if(dep === current_department){
          return {
            id: dep.id,
            department_title: $('#dep_name').val(),
            head: $('#dep_head_name').val(),
            description: $('#dep_description').val(),
            employees: dep.employees
          }
        } else {
          return dep;
        }
      })

      //navigation rebuilding
      buildNavigation(state);
      windowHistoryPushState(current_department.id);
      render(window.location.pathname);
    });
  }


  renderEditEmployeeForm() {
    renderEmployeeForm();
    $('#employee_first_name').val(current_employee.firstName);
    $('#employee_second_name').val(current_employee.secondName);
    $('#employee_date').val(current_employee.date);
    $('#employee_salary').val(current_employee.salary);

    renderButton('Edit employee', 'btn btn-secondary float-right mt-3', 'form',() => {
      state = state.map(dep => {
        if(dep === current_department){
          let editedEmployees = dep.employees.map(employee => {
            if(employee.id === current_employee.id) {
              return {
                id: employee.id,
                firstName: $('#employee_first_name').val(),
                secondName: $('#employee_second_name').val(),
                date: $('#employee_date').val(),
                salary: +$('#employee_salary').val()
              };
            } else {
              return employee;
            }
          });
          return {
            ...dep,
            employees: editedEmployees
          }
        } else {
          return dep;
        }
      })

      windowHistoryPushState(current_department.id);
      render(window.location.pathname);
    });
  }

  renderAddEmployeeForm() {
    renderEmployeeForm();
    renderButton('Add New Employee','btn btn-secondary float-right mt-3', 'form', () => {
      state = state.map(dep => {
        if(dep === current_department){
          dep.employees.push({
            id: dep.employees.length ? dep.employees[dep.employees.length - 1].id + 1 : 1,
            firstName: $('#employee_first_name').val(),
            secondName: $('#employee_second_name').val(),
            date: $('#employee_date').val(),
            salary: +$('#employee_salary').val()
          })
          return dep;
        } else {
          return dep;
        }
      });

      $('#dep_name, #dep_head_name, #dep_description').val('');

      windowHistoryPushState(current_department.id);
      render(window.location.pathname);
    });
  }
}