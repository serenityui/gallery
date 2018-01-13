import {IRoute} from "../module";
import {EntryComponent} from "./entry.component";

class Module {
  static routes: Array<IRoute> = [
    { path: "entry/:date", component: "EntryComponent" }
  ];
}

export {Module, EntryComponent}