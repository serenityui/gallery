import {View, Component} from "../component";
import {EntryService} from "../../shared/entry/entry.service";
import * as Models from "../../shared/entry/entry.models";
import {App} from "../../app.module";

@View({
  componentPath: "list",
  template: "list.component.html",
  styles: ["list.component.css"],
  sourcecode: "list.sourcecode.html"
})
class ListComponent extends Component {
  
  entries: serenity.DataSource = null;
  
  load(params: any): JQueryDeferred<void> {
    /// <summary>Load the component.</summary>
    
    return $.Deferred((deferred: JQueryDeferred<void>): void => {
      EntryService.getEntries().then((entries: Array<Models.Entry>) => {
        this.entries = new serenity.DataSource({
          data: entries,
          sort: [{ field: "id", dir: "desc" }],
          filter: [{ field: "id", operator: "neq", value: 0 }]
        });
        this.attach();
        deferred.resolve();
      });
    });
  }
  
  unload(): void {
    
    this.detach();
  }
  
  selectDate(dateText: string) {
    
    // Reformat the date string passed in.
    let date = moment(dateText, "MM/DD/YYYY").format("MM-DD-YYYY");
    
    // View the entry details for the date.
    this.entryDetails(date);
  }
  
  entryDetails(date: string) {
    
    this.router.navigate(serenity.format("/entry/{0}", date));
  }
}

export {ListComponent}
