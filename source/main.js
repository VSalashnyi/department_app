var state,
    current_department,
    current_item;

window.onload = function() {
        //fetching data
        fetch('http://www.mocky.io/v2/5c221bc83500007400d553d7')
        .then(res => res.json())
        .then(data => { init(data) });
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

function avarageSalary({ workers }){
    if(workers.length === 0) return 0;
    var salaries = workers.map(worker => worker.salary).reduce((accumulator, current) => current + accumulator);
    return Math.round(salaries/workers.length);
}

function totalSalary({ workers }) {
    if (workers.map(worker => worker.salary).length) {
        return workers.map(worker => worker.salary).reduce((accumulator, current) => current + accumulator);
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

function generatePage(string) {
    return $('#app').html('<div class="jumbotron"><h1 class="display-4">' + string + '</h1></div>');
}

//Building navigation
function buildNavigation(data) {
    $('nav').empty();
    data.forEach(chunk => {
        $('nav').append(`<button route="${chunk.id}" class="btn btn-secondary m-3">${chunk.department}</button>`);
    })
    $('nav').append(`<button class="btn btn-warning m-3" id="add_dep">Add new department</button>`);

    $('#add_dep').click(() => {
        windowHistoryPushState('/add-department');
        render(window.location.pathname);
    })

    Array.from(document.querySelectorAll('[route]')).forEach(btn => {
        btn.addEventListener('click', navigate, false);
    });
}


function buildTable({ workers }) {
    var table = $('<table/>').addClass('table');
    if (workers.length == 0) {
        table.append("You have not any workers");
    } else {
        workers.forEach(worker => {
            table.append(`<tr>
                               <td>${worker.firstName}</td>
                               <td>${worker.secondName}</td>
                               <td>${worker.date}</td>
                               <td>${worker.salary}</td>
                               <td>
                                   <button route="${worker.id}" class="btn btn-warning" data-toggle="modal" data-target="#editWorkerModal" >Edit</button>
                                   <button del_id="${worker.id}" class="btn btn-danger">Delete</button>
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

function buildEditDepartmentButton(data){
    var button = $('<button/>').addClass('btn btn-warning ml-5 mb-3')
        .text('Edit department')
        .click(() => {
            windowHistoryPushState('edit-department');
            render(window.location.pathname);

        });
    return button;
}

function buildContent(data){
    if(data === undefined) $('#app').html('This page does not exist');
    $('#app').html(`
          <div class="jumbotron">
          <h3 class="display-4 d-inline">${data.department}</h3>
          <p>Head of department - <b>${data.head}</b></p>
          <p>Avarage salary : ${avarageSalary(data)}</p>
          <p>Total salary : ${totalSalary(data)}</p>
          <hr/>
          <p>${data.description}</p>
          <h4>Employers:</h4>
          <button class="btn btn-success" data-toggle="modal" data-target="#workerModal">Add New Worker</button>
         </div>`)
        $('h3').after(buildDeleteDepartmentButton(data));
        $('h3').after(buildEditDepartmentButton(data));
        $('h4').after(buildTable(data));
        addListeners(data);
}

function addListeners( { workers }){
    (Array.from(document.querySelectorAll('table tr td button[route]'))).forEach(btn => {
        btn.addEventListener('click', (e) => {
            current_item = e.target.attributes.route.value;
            $('#edit_worker_first_name').val(workers.filter(worker => worker.id == e.target.attributes.route.value)[0].firstName);
            $('#edit_worker_second_name').val(workers.filter(worker => worker.id == e.target.attributes.route.value)[0].secondName);
            $('#edit_worker_date').val(workers.filter(worker => worker.id == e.target.attributes.route.value)[0].date);
            $('#edit_worker_salary').val(workers.filter(worker => worker.id == e.target.attributes.route.value)[0].salary);
        });
    });

    (Array.from(document.querySelectorAll('table tr td button[del_id]'))).forEach(btn => {
        btn.addEventListener('click', (e) => {
            state = state.map(dep => {
                if (dep === current_department) {
                    return {
                        ...dep,
                        workers: workers.filter(worker => {
                            if (worker.id != e.target.attributes.del_id.value) {
                                return worker;
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
}

$('#add_worker').click((e) => {
    state = state.map(dep => {
        if(dep == current_department){
            dep.workers.push({
                id: dep.workers.length ? dep.workers[dep.workers.length - 1].id + 1 : 1,
                firstName: $('#worker_first_name').val(),
                secondName: $('#worker_second_name').val(),
                date: $('#worker_date').val(),
                salary: +$('#worker_salary').val()
            })
            return dep;
        } else {
            return dep;
        }
    });
    $('#worker_first_name, #worker_second_name, #worker_date, #worker_salary').val('');

    render(window.location.pathname);
    e.preventDefault();
})

//save worker(edit)
$('#edit_worker').click(() => {
    state = state.map(dep => {
        if(dep === current_department){
            return {
                ...dep,
                workers: dep.workers.map(worker => {
                    if(worker.id == current_item){
                        return {
                            id:worker.id,
                            firstName:$('#edit_worker_first_name').val(),
                            secondName:$('#edit_worker_second_name').val(),
                            date:$('#edit_worker_date').val(),
                            salary: +$('#edit_worker_salary').val()
                        }
                    } else {
                        return worker;
                    }
                })
            }
        } else {
            return dep;
        }
    })
    render(window.location.pathname);
});

function render(param) {
    if (param === '/') {
        generatePage('Choose department you are interesting in, or add your own.')
    } else if (param === '/no-dep') {
        generatePage('No department left. Add new department.')
    } else if(param === '/add-employer'){
        console.log('you are on the page add-employer')
    }else if(param === '/add-department'){
        $('#app').html(renderAddDepartmentForm())
    }else if(param === '/edit-department'){
        console.log(current_department);
        $('#app').html(renderEditDepartmentForm())
    } else {
        current_department = state.filter(dep => dep.id === +param.substring(1))[0] || undefined;
        buildContent(current_department)
    }
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
                    <div class="department-modal-footer">
 
                    </div>
                </form>
        </div>`);
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
            department: $('#dep_name').val(),
            description: $('#dep_description').val(),
            head: $('#dep_head_name').val(),
            workers: []
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

    var button = $('<button/>').attr('id', 'edit-department')
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
                        workers: dep.workers
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

window.onpopstate = function(){
    render(window.location.pathname);
}