import {IRoute} from "../module";
import {ListComponent} from "./list.component";

class Module {
  static routes: Array<IRoute> = [
    { path: "list", component: "ListComponent" }
  ];
}

export {Module, ListComponent}