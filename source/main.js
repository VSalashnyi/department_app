var state,
    current_department,
    current_employer;

window.onload = function() {
        //fetching data
        fetch('http://www.mocky.io/v2/5c24f78530000087007a6224')
        .then(res => res.json())
        .then(data => {
            if(JSON.parse(sessionStorage.getItem('state')) === null) {
                return init(data)
            } else {
                // current_department = JSON.parse(sessionStorage.getItem('current_department'));
                // current_employer = JSON.parse(sessionStorage.getItem('current_employer'));
                return init(JSON.parse(sessionStorage.getItem('state')));
            }
        });
}


function init(data) {
    state = data;
    buildNavigation(data);
    render(window.location.pathname);
}

function navigate(e) {
    windowHistoryPushState(e.target.attributes.route.value);
    render(window.location.pathname);
}

function avarageSalary({ employers }){
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
    return window.history.pushState(
        {},
        data,
        data
    );
}

function render(param) {
    if (param === '/') {
        generatePage('Choose department you are interesting in, or add your own.')
    } else if (param === '/no-dep') {
        generatePage('No department left. Add new department.')
    }else if(param === '/add-employer'){
        $('#app').html(renderAddEmployerForm())
    } else if(param === '/edit-employer'){
        $('#app').html(renderEditEmployerForm())
    }else if(param === '/add-department'){
        $('#app').html(renderAddDepartmentForm())
    }else if(param === '/edit-department'){
        $('#app').html(renderEditDepartmentForm())
    } else {
        current_department = state.filter(dep => dep.id === +param.substring(1))[0];
        buildContent(current_department)
    }
}

function generatePage(string) {
    return $('#app').html('<div class="jumbotron"><h1 class="display-4">' + string + '</h1></div>');
}

//Building navigation
function buildNavigation(data) {
    $('nav').empty();
    data.forEach(dep => {
        $('nav').append(`<button route="${dep.id}" class="btn btn-secondary m-3">${dep.department_title}</button>`);
    });

    $('nav').append(`<button class="btn btn-warning m-3" id="add_dep">Add new department</button>`);

    $('#add_dep').click(() => {
        windowHistoryPushState('/add-department');
        render(window.location.pathname);
    })

    Array.from(document.querySelectorAll('[route]')).forEach(btn => {
        btn.addEventListener('click', navigate, false);
    });
}

function buildContent(data){
    if(data === undefined) $('#app').html('This page does not exist');
    $('#app').html(`
          <div class="jumbotron">
          <h3 class="display-4 d-inline">${data.department_title}</h3>
          <p>Head of department_title - <b>${data.head}</b></p>
          <p>Avarage salary : ${avarageSalary(data)}</p>
          <p>Total salary : ${totalSalary(data)}</p>
          <hr/>
          <p>${data.description}</p>
          <h4>Employers:</h4>
          <button class="btn btn-success" id="add_new_employer">Add New Employer</button>       
         </div>`)
    $('h3').after(buildDeleteDepartmentButton(data));
    $('h3').after(buildEditDepartmentButton());
    $('h4').after(buildTable(data));
    addListeners(data);
}


function buildTable({ employers }) {
    var table = $('<table/>').addClass('table');
    if (employers.length == 0) {
        table.append("You have not any employers");
    } else {
        employers.forEach(employer => {
            table.append(`<tr>
                               <td>${employer.firstName}</td>
                               <td>${employer.secondName}</td>
                               <td>${employer.date}</td>
                               <td>${employer.salary}</td>
                               <td>
                                   <button id="route-${employer.id}" class="btn btn-warning" >Edit</button>
                                   <button del_id="${employer.id}" class="btn btn-danger">Delete</button>
                                </td>
                         </tr>`)
        })
    }
    return table;
}

function buildDeleteDepartmentButton(data){
    var button = $('<button/>').addClass('btn btn-danger ml-5 mb-3')
        .text('Delete department')
        .click(() => {
            state = state.filter(item => item !== data);
            buildNavigation(state);
            if (state.length) {
                windowHistoryPushState(state[state.length - 1].id);
                render(window.location.pathname);
            } else {
                windowHistoryPushState('no-dep');
                render('/no-dep');
            }
        });
    return button;
}

function buildEditDepartmentButton(){
    var button = $('<button/>').addClass('btn btn-warning ml-5 mb-3')
        .text('Edit department')
        .click(() => {
            windowHistoryPushState('edit-department');
            render(window.location.pathname);
        });
    return button;
}



function addListeners({employers}) {
    (Array.from(document.querySelectorAll('table tr td button[route]'))).forEach(btn => {
        btn.addEventListener('click', (e) => {
            current_employer = employers.filter(employer => employer.id === +e.target.attributes.route.value)[0];
            windowHistoryPushState('edit-employer');
            render(window.location.pathname);
        });
    });

    (Array.from(document.querySelectorAll('table tr td button[del_id]'))).forEach(btn => {
        btn.addEventListener('click', (e) => {
            state = state.map(dep => {
                if (dep === current_department) {
                    return {
                        ...dep,
                        employers: employers.filter(employer => {
                            if (employer.id != e.target.attributes.del_id.value) {
                                return employer;
                            }
                        })
                    }
                } else {
                    return dep;
                }
            })
            render(window.location.pathname)
        });
    });

    $('#add_new_employer').click(() => {
        windowHistoryPushState('add-employer');
        render(window.location.pathname);
    })
}


function renderDepartmentForm(){
    return $('#app').html(`
        <div class="jumbotron w-50 m-auto">
                <form>
                    <label for="dep_name">Name of department:</label>
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
    return $('#app').html(`
        <div class="jumbotron w-50 m-auto">
            <form>
                <label for="dep_name">Employer first name:</label>
                <input class="form-control" id="employer_first_name" placeholder="Enter the name of department...">

                <label for="dep_head_name">Employer second name:</label>
                <input class="form-control" id="employer_second_name" placeholder="Enter the name of department head...">

                <label for="dep_description">Employer date of birth:</label>
                <input class="form-control" type="date" id="employer_date" placeholder="Enter the name of department head...">
                
                <label for="dep_description">Employer salary:</label>
                <input class="form-control" type="number" id="employer_salary" placeholder="Enter the name of department head...">
                
                <div class="department-modal-footer"></div>
            </form>
        </div>`);
}


function renderButton (buttonTitle, callBack) {
    var button = $('<button/>')
        .text(buttonTitle)
        .addClass('btn btn-secondary float-right mt-2')
        .click(() => callBack())
    $('.department-modal-footer').html($(button));
    return button;
}

function renderAddDepartmentForm() {
    renderDepartmentForm();
    var button = $('<button/>').attr('id', 'add-department')
                                .text('Add new department')
                                .addClass('btn btn-secondary float-right mt-2')
                                .click((e) => {
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
        e.preventDefault();
    });
    $('.department-modal-footer').html($(button));
}

function renderEditDepartmentForm() {
    renderDepartmentForm();
    $('#dep_name').val(current_department.department);
    $('#dep_head_name').val(current_department.head);
    $('#dep_description').val(current_department.description);

    var button = $('<button/>')
        .text('Edit department')
        .addClass('btn btn-secondary float-right mt-2')
        .click((e) => {
            // current department editing
            state = state.map(dep => {
                if(dep === current_department){
                    return {
                        id: dep.id,
                        department: $('#dep_name').val(),
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
            e.preventDefault();
        });
    $('.department-modal-footer').html($(button));
}

function renderEditEmployerForm(){
    renderEmployerForm();
    $('#employer_first_name').val(current_employer.firstName);
    $('#employer_second_name').val(current_employer.secondName);
    $('#employer_date').val(current_employer.date);
    $('#employer_salary').val(current_employer.salary);

    renderButton('Edit employer', (e) => {
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
        e.preventDefault();
    });
}

function renderAddEmployerForm() {
    renderEmployerForm();
    renderButton('Add New Employer', (e) => {
        state = state.map(dep => {
            if (dep == current_department) {
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
        e.preventDefault();
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

