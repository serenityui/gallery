import {View, Component} from "../component";
import {EntryService} from "../../shared/entry/entry.service";
import * as Models from "../../shared/entry/entry.models";
import * as Shared from "../../shared/profile/profile.service";

@View({
  componentPath: "edit",
  template: "edit.component.html",
  styles: ["edit.component.css"],
  sourcecode: "edit.sourcecode.html"
})
class EditComponent extends Component {
  
  protected _context: any = {};
  
  entryDate: string = null;
  entry: Models.Entry = null;
  excercise: Models.Excercise = null;
  errors: serenity.DataSource = null;
  saving: boolean = null;

  onExcerciseChange(): void {
    /// <summary>When there is a change to excercise, determine whether there are any errors.</summary>
    
    this.saving = false;
    let errorList: Array<string> = this.excercise.validate();
    this.errors.data(errorList);
  }
  
  load(params: any): JQueryDeferred<void> {
    /// <summary>Load the component.</summary>

    this.errors = new serenity.DataSource({ 
      data: [],
      trackChanges: false
    });
    
    return $.Deferred((deferred: JQueryDeferred<void>): void => {
      this.entryDate = params.date;
      
      EntryService.getEntry(this.entryDate).then((entry: Models.Entry) => {
        this.entry = entry;
        
        this.excercise = entry.getExcercise(params.id);
        
        this.excercise.bind("change", this.onExcerciseChange, this);
        
        this.attach();
        
        deferred.resolve();
      });
    });
  }
  
  unload(): void {
    
    this.detach();
    
    this.excercise.unbind("change", this.onExcerciseChange, this);
  }
  
  viewEntry(): void {
    /// <summary>Navigate to the entry for this excercise.</summary>
    
    this.excercise.rollback();
    
    this.router.navigate(serenity.format("/entry/{0}", this.entryDate));
  }
  
  hasErrors(): boolean {
    
    return this.saving === true && this.errors.data().length > 0;
  }
  
  save(): void {
    /// <summary>Save changes to the excercise.</summary>
    
    this.saving = true;
    
    if (this.errors.data().length > 0) {
      this.trigger("change");
    } else {
      this.excercise.commit();
      EntryService.saveEntry(this.entry);
    }
  }
}

export {EditComponent}