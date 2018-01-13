import {IRoute} from "../module";
import {EditComponent} from "./edit.component";
import {EditSwimmingComponent} from "./swimming.component";
import {EditTreadmillComponent} from "./treadmill.component";

class Module {
  static routes: Array<IRoute> = [
    { path: "edit/:date/swimming/:id", component: "EditSwimmingComponent" },
    { path: "edit/:date/treadmill/:id", component: "EditTreadmillComponent" }
  ];
}

export {Module, EditComponent, EditSwimmingComponent, EditTreadmillComponent}