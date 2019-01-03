/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var state, current_department, current_employee;

window.onload = function () {
  //fetching data
  fetch('http://www.mocky.io/v2/5c2ce2ee2e00004e06e877f1').then(function (res) {
    return res.json();
  }).then(function (data) {
    if (JSON.parse(sessionStorage.getItem('state')) === null) {
      init(data);
    } else {
      init(JSON.parse(sessionStorage.getItem('state')));
    }
  });
};

var init = function init(data) {
  state = data;
  buildNavigation(data);
  render(window.location.pathname);
};

var navigate = function navigate(route) {
  windowHistoryPushState(route);
  render(window.location.pathname);
};

var averageSalary = function averageSalary(_ref) {
  var employees = _ref.employees;
  if (employees.length === 0) return 0;
  var salaries = employees.map(function (employee) {
    return employee.salary;
  }).reduce(function (accumulator, current) {
    return current + accumulator;
  });
  return Math.round(salaries / employees.length);
};

var totalSalary = function totalSalary(_ref2) {
  var employees = _ref2.employees;

  if (employees.map(function (employee) {
    return employee.salary;
  }).length) {
    return employees.map(function (employee) {
      return employee.salary;
    }).reduce(function (accumulator, current) {
      return current + accumulator;
    });
  } else {
    return 0;
  }
};

var getList = function getList() {
  var count = 0,
      list = '<p>Employees with salary lower than average in the department:<ul>';
  current_department.employees.forEach(function (employee) {
    if (employee.salary < averageSalary(current_department)) {
      list += "<li>".concat(employee.firstName, " ").concat(employee.secondName, "</li>");
      count++;
    }
  });
  list += '</ul></p>';
  if (count) return list;
};

var windowHistoryPushState = function windowHistoryPushState(data) {
  window.history.pushState({}, data, data);
};

var render = function render(param) {
  if (Route[param]) {
    Route[param]();
  } else {
    current_department = state.filter(function (dep) {
      return dep.id === +param.substring(1);
    })[0];
    buildContent();
  }
};

var buildPage = function buildPage(string) {
  $('#app').html('<div class="jumbotron"><h1 class="display-4">' + string + '</h1></div>');
}; //Building navigation


var buildNavigation = function buildNavigation(data) {
  $('nav').empty();
  data.forEach(function (dep) {
    renderButton(dep.department_title, 'btn btn-secondary m-3', 'nav', function () {
      return navigate(dep.id);
    });
  });
  renderButton('Add new department', 'btn btn-success m-3', 'nav', function () {
    windowHistoryPushState('/add-department');
    render(window.location.pathname);
  });
};

var buildContent = function buildContent() {
  if (current_department === undefined) {
    $('#app').html('This page does not exist');
  } else {
    var div = $('<div/>').addClass('jumbotron');
    $('<h3/>').addClass('display-4 d-inline').text(current_department.department_title).appendTo(div);
    renderButton('Delete department', 'btn btn-danger ml-5 mb-3', div, function () {
      state = state.filter(function (item) {
        return item !== current_department;
      });
      buildNavigation(state);

      if (state.length) {
        windowHistoryPushState(state[state.length - 1].id);
        render(window.location.pathname);
      } else {
        windowHistoryPushState('no-dep');
        render('/no-dep');
      }
    });
    renderButton('Edit department', 'btn btn-warning ml-5 mb-3', div, function () {
      windowHistoryPushState('edit-department');
      render(window.location.pathname);
    });
    $('<p/>').html('Head of department - ' + '<b>' + current_department.head + '</b>').appendTo(div);
    $('<p/>').html('Average salary : ' + averageSalary(current_department)).appendTo(div);
    $('<p/>').html('Total salary : ' + totalSalary(current_department)).appendTo(div);
    $('<p/>').html(getList()).appendTo(div);
    $('<hr/>').appendTo(div);
    $('<p/>').html(current_department.description).appendTo(div);
    $('<h4/>').html('Employees:').appendTo(div);
    buildTable(current_department).appendTo(div);
    renderButton('Add New Employee', 'btn btn-success', div, function () {
      windowHistoryPushState('add-employee');
      render(window.location.pathname);
    });
    $('#app').html(div);
  }
};

var buildTable = function buildTable(_ref3) {
  var employees = _ref3.employees;
  var table = $('<table/>').addClass('table');

  if (employees.length === 0) {
    table.append('You have not any employees');
  } else {
    employees.forEach(function (employee) {
      table.append(renderTableRow(employee));
    });
  }

  return table;
};

var renderTableRow = function renderTableRow(employee) {
  var row = $('<tr>');
  $('<td>').html(employee.firstName).appendTo(row);
  $('<td>').html(employee.secondName).appendTo(row);
  $('<td>').html(employee.date).appendTo(row);
  $('<td>').html(employee.salary).appendTo(row);
  renderButton('Delete', 'btn btn-danger', row, function () {
    state = state.map(function (dep) {
      if (dep === current_department) {
        return _objectSpread({}, dep, {
          employees: dep.employees.filter(function (emploee) {
            if (emploee !== employee) {
              return emploee;
            }
          })
        });
      } else {
        return dep;
      }
    });
    render(window.location.pathname);
  });
  renderButton('Edit', 'btn btn-warning mr-2', row, function () {
    current_employee = employee;
    windowHistoryPushState('edit-employee');
    render(window.location.pathname);
  });
  return row;
};

var renderButton = function renderButton(buttonTitle, buttonClass, appendPlace, callBack) {
  var button = $('<button/>').text(buttonTitle).addClass(buttonClass).click(callBack);
  $(appendPlace).append($(button));
};

var renderInputField = function renderInputField(id, title, placeholder, type, appendPlace) {
  var field = $('<div/>');
  $('<label/>').attr('for', id).text(title).appendTo(field);
  $('<input/>').attr('id', id).attr('placeholder', placeholder).attr('type', type).addClass('form-control').appendTo(field);
  return field.appendTo(appendPlace);
};

var renderTextareaField = function renderTextareaField(id, title, placeholder, type, appendPlace) {
  var field = $('<div/>');
  $('<label/>').attr('for', id).text(title).appendTo(field);
  $('<textarea/>').attr('id', id).attr('placeholder', placeholder).attr('type', type).addClass('form-control').appendTo(field);
  return field.appendTo(appendPlace);
};

var renderDepartmentForm = function renderDepartmentForm() {
  var div = $('<div/>').addClass('jumbotron w-50 m-auto');
  var form = $('<form/>').appendTo(div);
  renderInputField('dep_name', 'Department label', 'Enter the name of department...', 'text', form);
  renderInputField('dep_head_name', 'Department head name:', 'Enter the name of the head of department...', 'text', form);
  renderTextareaField('dep_description', 'Department description:', 'Enter the department description...', 'text', form);
  $('#app').html(div);
};

var renderEmployeeForm = function renderEmployeeForm() {
  var div = $('<div/>').addClass('jumbotron w-50 m-auto');
  var form = $('<form/>').appendTo(div);
  renderInputField('employee_first_name', 'Employee first name', 'Enter employee first name...', 'text', form);
  renderInputField('employee_second_name', 'Employee second name:', 'Enter employee second name...', 'text', form);
  renderInputField('employee_date', 'Employee birth date:', 'Enter employee\'s date of birth...', 'date', form);
  renderInputField('employee_salary', 'Employee salary:', 'Enter employee\'s salary...', 'number', form);
  $('#app').html(div);
};

var renderAddDepartmentForm = function renderAddDepartmentForm() {
  renderDepartmentForm();
  renderButton('Add new department', 'btn btn-secondary float-right mt-2', 'form', function () {
    //adding new department
    state.push({
      id: state.length ? state[state.length - 1].id + 1 : 1,
      department_title: $('#dep_name').val(),
      description: $('#dep_description').val(),
      head: $('#dep_head_name').val(),
      employees: []
    }); //clearing input fields

    $('#dep_name, #dep_head_name, #dep_description').val(''); //navigation rebuilding

    buildNavigation(state);
    windowHistoryPushState(state[state.length - 1].id);
    render(window.location.pathname);
  });
};

var renderEditDepartmentForm = function renderEditDepartmentForm() {
  renderDepartmentForm();
  $('#dep_name').val(current_department.department_title);
  $('#dep_head_name').val(current_department.head);
  $('#dep_description').val(current_department.description);
  renderButton('Edit department', 'btn btn-secondary float-right mt-2', 'form', function () {
    // current department editing
    state = state.map(function (dep) {
      if (dep === current_department) {
        return {
          id: dep.id,
          department_title: $('#dep_name').val(),
          head: $('#dep_head_name').val(),
          description: $('#dep_description').val(),
          employees: dep.employees
        };
      } else {
        return dep;
      }
    });
    $('#dep_name, #dep_head_name, #dep_description').val(''); //navigation rebuilding

    buildNavigation(state);
    windowHistoryPushState(current_department.id);
    render(window.location.pathname);
  });
};

var renderEditEmployeeForm = function renderEditEmployeeForm() {
  renderEmployeeForm();
  $('#employee_first_name').val(current_employee.firstName);
  $('#employee_second_name').val(current_employee.secondName);
  $('#employee_date').val(current_employee.date);
  $('#employee_salary').val(current_employee.salary);
  renderButton('Edit employee', 'btn btn-secondary float-right mt-3', 'form', function () {
    state = state.map(function (dep) {
      if (dep === current_department) {
        return _objectSpread({}, dep, {
          employees: dep.employees.map(function (employee) {
            if (employee.id === current_employee.id) {
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
          })
        });
      } else {
        return dep;
      }
    });
    $('#dep_name, #dep_head_name, #dep_description').val('');
    windowHistoryPushState(current_department.id);
    render(window.location.pathname);
  });
};

var renderAddEmployeeForm = function renderAddEmployeeForm() {
  renderEmployeeForm();
  renderButton('Add New Employee', 'btn btn-secondary float-right mt-3', 'form', function () {
    state = state.map(function (dep) {
      if (dep === current_department) {
        dep.employees.push({
          id: dep.employees.length ? dep.employees[dep.employees.length - 1].id + 1 : 1,
          firstName: $('#employee_first_name').val(),
          secondName: $('#employee_second_name').val(),
          date: $('#employee_date').val(),
          salary: +$('#employee_salary').val()
        });
        return dep;
      } else {
        return dep;
      }
    });
    $('#dep_name, #dep_head_name, #dep_description').val('');
    windowHistoryPushState(current_department.id);
    render(window.location.pathname);
  });
};

window.onpopstate = function () {
  render(window.location.pathname);
};

window.onbeforeunload = function () {
  sessionStorage.setItem('state', JSON.stringify(state));
};

var Route = {
  '/': function _() {
    return buildPage('Choose department you are interesting in, or add your own.');
  },
  '/no-dep': function noDep() {
    return buildPage('No department left. Add new department.');
  },
  '/add-employee': renderAddEmployeeForm,
  '/edit-employee': renderEditEmployeeForm,
  '/add-department': renderAddDepartmentForm,
  '/edit-department': renderEditDepartmentForm
};

/***/ })
/******/ ]);