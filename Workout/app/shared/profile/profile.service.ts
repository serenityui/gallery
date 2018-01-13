import {IHttpData, HttpService} from "../http.service";
import * as Models from "./profile.models";

class Service extends HttpService {
  private static profileUrl: string = "data/Profile.json";
  
  static get(): JQueryDeferred<Models.Profile> {
    return $.Deferred((deferred: JQueryDeferred<Models.Profile>): void => {
      HttpService.getJson("profile", Service.profileUrl).then((data: IHttpData) => {
        if (data.models.length === 0) {
          data.json.forEach(item => data.models.push(new Models.Profile(item)));
        }
        deferred.resolve(data.models[0] as Models.Profile);
      });
    });
  }
}

export {Service, Models}