/// <reference path="../../../assets/js/widgets/widgets.d.ts"/>

import {View, Component} from "../component";
import {EntryService} from "../../shared/entry/entry.service";
import * as Models from "../../shared/entry/entry.models";
import {App} from "../../app.module";

@View({
  componentPath: "entry",
  template: "entry.component.html",
  styles: ["entry.component.css"],
  sourcecode: "entry.sourcecode.html"
})
class EntryComponent extends Component {
  
  private _context: any = {};
  
  entry: Models.Entry = null;
  date: string = null;
  
  load(params: any): JQueryDeferred<void> {
    /// <summary>Load the component.</summary>
    
    var that = this;
    
    return $.Deferred((deferred: JQueryDeferred<void>): void => {
      this.date = params.date;
      this._context.currentMoment = moment(params.date, "MM-DD-YYYY");

      // Get the entry for the current day.
      EntryService.getEntry(this.date).then((entry: Models.Entry) => {
        
        this.entry = entry;
        
        this.attach();

        deferred.resolve();
      });
    });
  }
  
  unload(): void {
    /// <summary>Unload the component.</summary>
    
    this.detach();
  }
  
  viewList(): void {
    /// <summary>Navigate to the list of workouts.</summary>
    
    this.router.navigate("/");
  }
  
  previousDay(): void {
    /// <summary>Navigate to the previous day.</summary>
    
    this._context.currentMoment.subtract(1, 'd');
    let date = this._context.currentMoment.format("MM-DD-YYYY");
    this.router.navigate(serenity.format("/entry/{0}", date));
  }
  
  nextDay(): void {
    /// <summary>Navigate to the next day.</summary>
    
    this._context.currentMoment.add(1, 'd');
    let date = this._context.currentMoment.format("MM-DD-YYYY");
    this.router.navigate(serenity.format("/entry/{0}", date));
  }

  viewExcercise(event: JQueryEventObject, ui: any): void {

    let excercise = ui.item;
    let route = serenity.format("/edit/{0}/{1}/{2}", 
      this.date,
      excercise.type.toLowerCase(),
      excercise.id);

    this.router.navigate(route);
  }
}

export {EntryComponent}