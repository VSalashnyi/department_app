var state,
  current_department,
  current_employer;
  Map = {
    '/' : () => buildPage('Choose department you are interesting in, or add your own.'),
    '/no-dep' : () => buildPage('No department left. Add new department.'),
    '/add-employer': () => $('#app').html(renderAddEmployerForm()),
    '/edit-employer': () => $('#app').html(renderEditEmployerForm()),
    '/add-department': () => $('#app').html(renderAddDepartmentForm()),
    '/edit-department': () => $('#app').html(renderEditDepartmentForm())
  };

window.onload = function() {
  //fetching data
  fetch('http://www.mocky.io/v2/5c24f78530000087007a6224')
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

function averageSalary({ employers }){
  if(employers.length === 0) return 0;
  var salaries = employers.map(employer => employer.salary).reduce((accumulator, current) => current + accumulator);
  return Math.round(salaries/employers.length);
}

function totalSalary({ employers }) {
  if (employers.map(employer => employer.salary).length) {
    return employers.map(employer => employer.salary).reduce((accumulator, current) => current + accumulator);
  }
    return 0;
}

function windowHistoryPushState(data){
   window.history.pushState(
  {},
    data,
    data
  );
}

function render(param) {
  if(Map[param]){
      Map[param]();
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
        renderButton(`${dep.department_title}`, 'btn btn-secondary m-3', 'nav',() => navigate(dep.id))
    });

    renderButton('Add new department', 'btn btn-warning m-3', 'nav',() => {
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
      <p>Head of department_title - <b>${current_department.head}</b></p>
      <p>Average salary : ${averageSalary(current_department)}</p>
      <p>Total salary : ${totalSalary(current_department)}</p>
      <hr/>
      <p>${current_department.description}</p>
      <h4>Employers:</h4> 
    </div>`)

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

    renderButton('Add New Employer', 'btn btn-success', '.jumbotron', () => {
        windowHistoryPushState('add-employer');
        render(window.location.pathname);
    });

    $('h4').after(buildTable(current_department));
    addListeners(current_department);
    }
}

function buildTable({employers}) {
  var table = $('<table/>').addClass('table');
  if (employers.length === 0) {
    table.append("You have not any employers");
  } else {
    employers.forEach(emploee => {
      table.append(renderTableRow(emploee))})
  }
    return table;
}

function renderTableRow(emploee){
    var row = $('<tr>');
    $('<td>').html(emploee.firstName).appendTo(row);
    $('<td>').html(emploee.secondName).appendTo(row);
    $('<td>').html(emploee.date).appendTo(row);
    $('<td>').html(emploee.salary).appendTo(row);
    renderButton('Edit', 'btn btn-warning', "row)",() => {
        current_employer = emploee;
        windowHistoryPushState('edit-employer');
        render(window.location.pathname);
    });
    return row;
}

//-----------------------------------------------------------
// function addListeners({employers}) {
//     (Array.from(document.querySelectorAll('table tr td button[route]'))).forEach(btn => {
//         btn.addEventListener('click', (e) => {
//             current_employer = employers.filter(employer => employer.id === +e.target.attributes.route.value)[0];
//             windowHistoryPushState('edit-employer');
//             render(window.location.pathname);
//         });
//     });
//
// //---------------------------------------------------------------------------------
//     (Array.from(document.querySelectorAll('table tr td button[del_id]'))).forEach(btn => {
//         btn.addEventListener('click', (e) => {
//             state = state.map(dep => {
//                 if (dep === current_department) {
//                     return {
//                         ...dep,
//                         employers: employers.filter(employer => {
//                             if (employer.id != e.target.attributes.del_id.value) {
//                                 return employer;
//                             }
//                         })
//                     }
//                 } else {
//                     return dep;
//                 }
//             })
//             render(window.location.pathname)
//         });
//     });
// }


function renderButton(buttonTitle, buttonClass, appendPlace, callBack) {
    var button = $('<button/>')
        .text(buttonTitle)
        .addClass(buttonClass)
        .click(() => callBack())
    $(appendPlace).append($(button));
}

function renderDepartmentForm(){
  $('#app').html(`
    <div class="jumbotron w-50 m-auto">
      <form>
        <label for="dep_name">Department label:</label>
        <input class="form-control" id="dep_name" placeholder="Enter the name of department...">

         <label for="dep_head_name">Head name:</label>
         <input class="form-control" id="dep_head_name" placeholder="Enter the name of department head...">        
                       
         <label for="dep_description">Department description:</label>
         <textarea name="" id="dep_description" placeholder="Enter the department description..." class="form-control" cols="30" rows="10"></textarea>
                    
         <div class="department-modal-footer"></div>
      </form>
    </div>`);
}

function renderEmployerForm(){
  $('#app').html(`
    <div class="jumbotron w-50 m-auto">
      <form>
        <label for="dep_name">Employee first name:</label>
        <input class="form-control" id="employer_first_name" placeholder="Enter the name of department...">
        
        <label for="dep_head_name">Employee second name:</label>
        <input class="form-control" id="employer_second_name" placeholder="Enter the name of department head...">

        <label for="dep_description">Employee birth date:</label>
        <input class="form-control" type="date" id="employer_date" placeholder="Enter the name of department head...">
                
        <label for="dep_description">Employee salary:</label>
        <input class="form-control" type="number" id="employer_salary" placeholder="Enter the name of department head...">
                
        <div class="department-modal-footer"></div>
      </form>
    </div>`);
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
          employers: []
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
                  employers: dep.employers
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

function renderEditEmployerForm(){
  renderEmployerForm();
  $('#employer_first_name').val(current_employer.firstName);
  $('#employer_second_name').val(current_employer.secondName);
  $('#employer_date').val(current_employer.date);
  $('#employer_salary').val(current_employer.salary);

  renderButton('Edit employer', 'btn btn-warning ml-5 mb-3', '.department-modal-footer',() => {
    state = state.map(dep => {
      if(dep === current_department){
        return {
          ...dep,
          employers: dep.employers.map(employer => {
            if(employer.id === current_employer.id) {
              return {
                  id: employer.id,
                  firstName: $('#employer_first_name').val(),
                  secondName: $('#employer_second_name').val(),
                  date: $('#employer_date').val(),
                  salary: +$('#employer_salary').val()
              }
            } else {
                return employer;
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

function renderAddEmployerForm() {
  renderEmployerForm();
  renderButton('Add New Employer','btn btn-warning ml-5 mb-3', '.department-modal-footer', () => {
    state = state.map(dep => {
    if(dep === current_department){
       dep.employers.push({
          id: dep.employers.length ? dep.employers[dep.employers.length - 1].id + 1 : 1,
          firstName: $('#employer_first_name').val(),
          secondName: $('#employer_second_name').val(),
          date: $('#employer_date').val(),
          salary: +$('#employer_salary').val()
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
  console.log(state, current_department, current_employer);
  render(window.location.pathname);
}

window.onbeforeunload = function(){
  sessionStorage.setItem('state', JSON.stringify(state));
    // sessionStorage.setItem('current_department', JSON.stringify(current_department));
    // sessionStorage.setItem('current_employer', JSON.stringify(current_employer));
}
