/// <reference path="../../../../src/ts/serenityui.d.ts"/>

import {IDictionary} from "../shared/interfaces";

interface IHttpData {
  json: any;
  models: Array<serenity.Model>;
}

abstract class HttpService {
    private static _data: IDictionary<IHttpData> = {};

    static getJson(name: string, uri: string, reload: boolean = false): JQueryDeferred<any> {
        return $.Deferred(function (deferred: JQueryDeferred<any>) {
            if (typeof HttpService._data[name] === "undefined" || reload === true) {
              let url: string = serenity.format("{0}{1}_={2}",
                  uri,
                  uri.indexOf('?') > 0 ? "&" : "?",
                  (new Date()).getTime());

              $.getJSON(url, (json: any) => {
                  HttpService._data[name] = {
                    json: json,
                    models: new Array<serenity.Model>()
                  }
                  deferred.resolve(HttpService._data[name]);
                });
            } else {
              deferred.resolve(HttpService._data[name]);
            }
        });
    }
}

export {IHttpData, HttpService}