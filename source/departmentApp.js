import { DepartmentAppView} from "./DepartmentAppView";
import { DepartmentAppController } from "./DepartmentAppController";

const departmentAppView = new DepartmentAppView();
const departmentApp = new DepartmentAppController(departmentAppView);

window.onload = () => {
  departmentApp.render();
}

window.onhashchange = () => {
  console.log('pop')
  departmentApp.render();
}

window.onpopstate = () => {
  console.log('pop')
  departmentApp.render();
}

