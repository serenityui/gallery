import {View, Component} from "../component";
import {EditComponent} from "./edit.component";
import * as Models from "../../shared/entry/entry.models";
import * as Shared from "../../shared/profile/profile.service";

@View({
  componentPath: "edit",
  template: "treadmill.component.html",
  target: ".app-excercise-values"
})
class EditTreadmillComponent extends EditComponent {
  measurements: serenity.DataSource;
  
  render(element?: JQuery): JQueryDeferred<void> {
    
    return $.Deferred((deferred: JQueryDeferred<void>): void => {
      super.render().then((): void => {
        
        this.measurements = new serenity.DataSource({
          data: [
            {measurement: "kilometers"},
            {measurement: "miles"}
          ]
        });
        
        deferred.resolve();
      });
    });
  }
}

export {EditTreadmillComponent}