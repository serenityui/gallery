import {IHttpData, HttpService} from "../../shared/http.service";
import * as Models from "./entry.models";
import * as Profile from "../../shared/profile/profile.service";

class EntryService extends HttpService {
  /// <summary>Mange excercise entries for the application components.</summary>

  private static _entryUrl: string = "data/Entry.json";
  
  private static _profile: Profile.Models.Profile = null;
  
  private static getProfile(): JQueryDeferred<Profile.Models.Profile> {
    /// <summary>Get the profile for the current user.</summary>
    /// <return type="Shared.Models.Profile">The profile for the current user.</return>
    
    return $.Deferred((deferred: JQueryDeferred<Profile.Models.Profile>): void => {
      if (this._profile === null) {
        Profile.Service.get().then((profile: Profile.Models.Profile) => {
          this._profile = profile;
          deferred.resolve(profile);
        })
      } else {
        deferred.resolve(this._profile);
      }
    });
  }
  
  static getEntries(): JQueryDeferred<Array<Models.Entry>> {
    /// <summary>Get the list of journal entries.</summary>
    
    return $.Deferred((deferred: JQueryDeferred<Array<Models.Entry>>): void => {
      // Get the list of completed excercises from the server.
      HttpService.getJson("entries", EntryService._entryUrl).then((data: IHttpData) => {
        // This is the first time getting the data from the server.
        if (data.models.length === 0) {
          // Get the user profile. The excercise items use the user profile to calculate calories.
          EntryService.getProfile().then((profile: Profile.Models.Profile) => {
            // Create an instance of a model for each completed excercise.  Store a reference to the
            // profile with each excercise model.
            data.json.forEach(item => {
              let entry: Models.Entry = new Models.Entry({
                id: item.id,
                date: item.date
              });
              entry.profile = profile;

              let list: Array<Models.Excercise> = new Array<Models.Excercise>();
              
              item.excercises.forEach(exerciseItem => {
                if (typeof Models[exerciseItem.type] !== "undefined") {
                  exerciseItem.profile = profile;
                  list.push(new Models[exerciseItem.type](exerciseItem));
                }
              });
              entry.excercises = list;
              
              data.models.push(entry);
            });
            deferred.resolve(data.models as Array<Models.Entry>);
          });
        } else {
          deferred.resolve(data.models as Array<Models.Entry>);
        }          
      });
    });
  }
  
  static getEntry(date: string): JQueryDeferred<Models.Entry> {
    /// <summary>Get the entry for a specific date.</summary>
    
    return $.Deferred((deferred: JQueryDeferred<Models.Entry>): void => {
      // Get the list of entries.
      EntryService.getEntries().then((entries: Array<Models.Entry>) => {
        // Find the entry for this date.
        var entry = Enumerable.From(entries)
          .Where(e => e.date === date)
          .FirstOrDefault();
        
        // There is no entry for this date.
        if (typeof entry === "undefined") {
          // Get the user profile. The excercise items use the user profile to calculate calories.
          EntryService.getProfile().then((profile: Profile.Models.Profile) => {
            // Create an entry.
            entry = new Models.Entry({
              id: 0,
              date: date
            });
            entry.profile = profile;
            entry.excercises = new Array<Models.Excercise>();
            
            entries.push(entry);
            
            deferred.resolve(entry);
          });
        } else {
          deferred.resolve(entry);
        }
      });
    });
  }

  static saveEntry(entry: Models.Entry) {
    
    if (entry.id === 0) {
      entry.id = moment(entry.date, "MM-DD-YYYY").toDate().getTime();
    }
    
    // Save to a persisent store.
  }
}

export {EntryService}