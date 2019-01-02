var state,
  current_department,
  current_employee;
  Route = {
    '/' : () => buildPage('Choose department you are interesting in, or add your own.'),
    '/no-dep' : () => buildPage('No department left. Add new department.'),
    '/add-employee': renderAddEmployeeForm,
    '/edit-employee': renderEditEmployeeForm,
    '/add-department': renderAddDepartmentForm,
    '/edit-department': renderEditDepartmentForm
  };

window.onload = function() {
  //fetching data
  fetch('http://www.mocky.io/v2/5c2c7a402e0000070ae87586')
  .then(res => res.json())
  .then(data => {
    if(JSON.parse(sessionStorage.getItem('state')) === null) {
      init(data);
    } else {
      init(JSON.parse(sessionStorage.getItem('state')));
    }
  });
}

function init(data) {
  state = data;
  buildNavigation(data);
  render(window.location.pathname);
}

function navigate(route) {
  windowHistoryPushState(route);
  render(window.location.pathname);
}

function averageSalary({ employees }){
  if(employees.length === 0) return 0;
  var salaries = employees.map(employee => employee.salary).reduce((accumulator, current) => current + accumulator);
  return Math.round(salaries/employees.length);
}

function totalSalary({ employees }) {
  if (employees.map(employee => employee.salary).length) {
    return employees.map(employee => employee.salary).reduce((accumulator, current) => current + accumulator);
  }
    return 0;
}

function getList(){
    var list = '<p>Employees with salary lower than average in the department:<ul>';
    current_department.employees.forEach(employee => {
        if(employee.salary < averageSalary(current_department)){
            list += `<li>${employee.firstName} ${employee.secondName}</li>`
        }
    })
    list += '</ul></p>';
    return list;
}

function windowHistoryPushState(data){
   window.history.pushState(
  {},
    data,
    data
  );
}

function render(param) {
  if(Route[param]){
      Route[param]();
  } else {
    current_department = state.filter(dep => dep.id === +param.substring(1))[0];
    buildContent();
  }
}

function buildPage(string) {
  $('#app').html('<div class="jumbotron"><h1 class="display-4">' + string + '</h1></div>');
}

//Building navigation
function buildNavigation(data) {
  $('nav').empty();

  data.forEach(dep => {
    renderButton(dep.department_title, 'btn btn-secondary m-3', 'nav',() => navigate(dep.id))
  });

  renderButton('Add new department', 'btn btn-success m-3', 'nav',() => {
    windowHistoryPushState('/add-department');
    render(window.location.pathname);
  })
}

function buildContent() {
    if (current_department === undefined) {
        $('#app').html('This page does not exist');
    } else {
        $('#app').html(`
    <div class="jumbotron">
      <h3 class="display-4 d-inline">${current_department.department_title}</h3>
      <p>Head of department - <b>${current_department.head}</b></p>
      <p>Average salary : ${averageSalary(current_department)}</p>
      <p>Total salary : ${totalSalary(current_department)}</p>
      ${getList()}
      <hr/>
      <p>${current_department.description}</p>
      <h4>Employees:</h4> 
    </div>`);
    renderButton('Delete department', 'btn btn-danger ml-5 mb-3', 'h3', () => {
      state = state.filter(item => item !== current_department);
        buildNavigation(state);
        if (state.length) {
            windowHistoryPushState(state[state.length - 1].id);
            render(window.location.pathname);
        } else {
            windowHistoryPushState('no-dep');
            render('/no-dep');
        }
    });

    renderButton('Edit department', 'btn btn-warning ml-5 mb-3', 'h3', () => {
      windowHistoryPushState('edit-department');
      render(window.location.pathname);
    });

    renderButton('Add New Employee', 'btn btn-success', '.jumbotron', () => {
        windowHistoryPushState('add-employee');
        render(window.location.pathname);
    });

    $('h4').after(buildTable(current_department));
  }
}

function buildTable({employees}) {
  var table = $('<table/>').addClass('table');
  if (employees.length === 0) {
    table.append('You have not any employees');
  } else {
      employees.forEach(employee => {
         table.append(renderTableRow(employee))
      })
  }
    return table;
}

function renderTableRow(employee){
  var row = $('<tr>');
  $('<td>').html(employee.firstName).appendTo(row);
  $('<td>').html(employee.secondName).appendTo(row);
  $('<td>').html(employee.date).appendTo(row);
  $('<td>').html(employee.salary).appendTo(row);

  renderButton('Delete', 'btn btn-danger', row,() => {
    state = state.map(dep => {
      if (dep === current_department) {
        return {
          ...dep,
          employees: dep.employees.filter(emploee => {
            if (emploee !== employee) {
              return emploee;
                }
             })
          }
      } else {
        return dep;
        }
     })
      render(window.location.pathname)
    });

  renderButton('Edit', 'btn btn-warning mr-2', row,() => {
    current_employee = employee;
    windowHistoryPushState('edit-employee');
    render(window.location.pathname);
  });
    return row;
}

function renderButton(buttonTitle, buttonClass, appendPlace, callBack) {
    var button = $('<button/>')
        .text(buttonTitle)
        .addClass(buttonClass)
        .click(callBack);
    $(appendPlace).append($(button));
}


function renderInputField (id, title, placeholder, type){
  var field = $('<div/>');
    $('<label/>').attr('for', id).text(title).appendTo(field);
    $('<input/>').attr('id', id).attr('placeholder', placeholder).attr('type', type).addClass('form-control').appendTo(field);
    return field;

}

function renderTextareaField (id, title, placeholder, type){
  var field = $('<div/>');
    $('<label/>').attr('for', id).text(title).appendTo(field);
    $('<textarea/>').attr('id', id).attr('placeholder', placeholder).attr('type', type).addClass('form-control').appendTo(field);
    return field;

}

function renderDepartmentForm(){
  var div = $('<div/>').addClass('jumbotron w-50 m-auto');
  var form = $('<form/>').appendTo(div);
   renderInputField('dep_name', 'Department label', 'Enter the name of department...', 'text').appendTo(form);
   renderInputField('dep_head_name', 'Department head name:', 'Enter the name of the head of department...', 'text').appendTo(form);
   renderTextareaField('dep_description', 'Department description:', 'Enter the department description...', 'text').appendTo(form);
   $(form).append('<div class="department-modal-footer"></div>')
  $('#app').html(div);
}

function renderEmployeeForm(){
    var div = $('<div/>').addClass('jumbotron w-50 m-auto');
    var form = $('<form/>').appendTo(div);
    renderInputField('employee_first_name', 'Employee first name', 'Enter employee first name...', 'text').appendTo(form);
    renderInputField('employee_second_name', 'Employee second name:', 'Enter employee second name...', 'text').appendTo(form);
    renderInputField('employee_date', 'Employee birth date:', 'Enter employee\'s date of birth...', 'date').appendTo(form);
    renderInputField('employee_salary', 'Employee salary:', 'Enter employee\'s salary...', 'number').appendTo(form);
    $(form).append('<div class="department-modal-footer"></div>')
    $('#app').html(div);
}


function renderAddDepartmentForm() {
  renderDepartmentForm();
  renderButton('Add new department','btn btn-secondary float-right mt-2' , '.department-modal-footer', () => {
      //adding new department
      state.push({
          id: state.length ? state[state.length - 1].id + 1 : 1,
          department_title: $('#dep_name').val(),
          description: $('#dep_description').val(),
          head: $('#dep_head_name').val(),
          employees: []
      });

      //clearing input fields
      $('#dep_name, #dep_head_name, #dep_description').val('');
      //navigation rebuilding
      buildNavigation(state);
      windowHistoryPushState(state[state.length - 1].id);
      render(window.location.pathname);
  });
}

function renderEditDepartmentForm() {
  renderDepartmentForm();
  $('#dep_name').val(current_department.department_title);
  $('#dep_head_name').val(current_department.head);
  $('#dep_description').val(current_department.description);

  renderButton('Edit department', 'btn btn-secondary float-right mt-2', '.department-modal-footer', () => {
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

      $('#dep_name, #dep_head_name, #dep_description').val('');

      //navigation rebuilding
      buildNavigation(state);
      windowHistoryPushState(current_department.id);
      render(window.location.pathname);
  });
}

function renderEditEmployeeForm(){
  renderEmployeeForm();
  $('#employee_first_name').val(current_employee.firstName);
  $('#employee_second_name').val(current_employee.secondName);
  $('#employee_date').val(current_employee.date);
  $('#employee_salary').val(current_employee.salary);

  renderButton('Edit employee', 'btn btn-secondary float-right mt-3', '.department-modal-footer',() => {
    state = state.map(dep => {
      if(dep === current_department){
        return {
          ...dep,
            employees: dep.employees.map(employee => {
            if(employee.id === current_employee.id) {
              return {
                  id: employee.id,
                  firstName: $('#employee_first_name').val(),
                  secondName: $('#employee_second_name').val(),
                  date: $('#employee_date').val(),
                  salary: +$('#employee_salary').val()
              }
            } else {
                return employee;
            }
          })
        }
      } else {
          return dep;
      }
    })

    $('#dep_name, #dep_head_name, #dep_description').val('');
    windowHistoryPushState(current_department.id);
    render(window.location.pathname);
  });
}

function renderAddEmployeeForm() {
  renderEmployeeForm();
  renderButton('Add New Employee','btn btn-secondary float-right mt-3', '.department-modal-footer', () => {
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

window.onpopstate = function(){
  render(window.location.pathname);
}

window.onbeforeunload = function(){
  sessionStorage.setItem('state', JSON.stringify(state));
}
