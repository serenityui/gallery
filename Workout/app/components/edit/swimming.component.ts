import {View, Component} from "../component";
import {EditComponent} from "./edit.component";
import * as Models from "../../shared/entry/entry.models";
import * as Shared from "../../shared/profile/profile.service";

@View({
  componentPath: "edit",
  template: "swimming.component.html",
  target: ".app-excercise-values"
})
class EditSwimmingComponent extends EditComponent {

  strokes: serenity.DataSource;
  measurements: serenity.DataSource;
  
  render(element?: JQuery): JQueryDeferred<void> {
    
    return $.Deferred((deferred: JQueryDeferred<void>): void => {
      super.render().then((): void => {
        
        this.strokes = new serenity.DataSource({
          data: [
            {stroke: "Freestyle, Leisurely"},
            {stroke: "Freestyle, Moderate"},
            {stroke: "Freestyle, Fast"},
            {stroke: "Backstroke"},
            {stroke: "Breaststroke"},
            {stroke: "Butterfly"}
          ]
        });
        
        this.measurements = new serenity.DataSource({
          data: [
            {measurement: "meters"},
            {measurement: "yards"}
          ]
        });
        
        deferred.resolve();
      });
    });
  }
}

export {EditSwimmingComponent}