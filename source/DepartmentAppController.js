import { getDepartments } from "./getDepartments";
// import { state, current_department } from "./settings";
//import { Route } from "./Route";

let state;

export class DepartmentAppController {
  constructor(departmentAppView){
    this.departmentAppView = departmentAppView;
    this.Route = {
      '/' : () => this.renderDefaultPage(),
      '/add-employee': () => this.renderAddEmployeeForm('add-employee'),
      '/edit-employee': () => this.renderEditEmployeeForm('edit-employee'),
      '/add-department': () => this.renderAddDepartmentForm('add-dep'),
      '/edit-department': () => this.renderEditDepartmentForm('add-dep')
    };
  }


  async render(){
    console.log(window.location);
    state = await getDepartments();
    if(this.Route[window.location.pathname]){
      this.Route[window.location.pathname]();
    } else {
      this.renderDefaultPage();
    }
  }

  renderDefaultPage() {
    console.log(state);
    this.departmentAppView.renderNavbar(state);
    this.departmentAppView.renderDefaultPage();
  }

  renderAddEmployeeForm() {
    // $('#app').html(`<div class="jumbotron"><h1 class="display-4"></h1></div>`).text('Choose department you are interesting in, or ad your own');
    //this.departmentAppView.renderParentDiv();
    console.log('add-employee');
  }

  renderEditEmployeeForm() {
    // $('#app').html(`<div class="jumbotron"><h1 class="display-4"></h1></div>`).text('Choose department you are interesting in, or ad your own');
    //this.departmentAppView.renderParentDiv();
    console.log('edit-employee');
  }

  renderAddDepartmentForm(par) {
    // $('#app').html(`<div class="jumbotron"><h1 class="display-4"></h1></div>`).text('Choose department you are interesting in, or ad your own');
    //this.departmentAppView.renderParentDiv();
    console.log('add-department');
  }

  renderEditDepartmentForm(par) {
    // $('#app').html(`<div class="jumbotron"><h1 class="display-4"></h1></div>`).text('Choose department you are interesting in, or ad your own');
    //this.departmentAppView.renderParentDiv();
    console.log('edit-department');
  }
}



