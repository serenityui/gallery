"use strict";

(function(Northwind, $, serenity, nw) {
    Northwind.Stores.Base = function () {
        /// <summary>Base store for managing accessing information using nw.js.</summary>

        var STATUS =  {
            NONE: 0,
            PENDING: 1,
            COMPLETE: 2
        };

        var StoreData = serenity.Model.extend({
            status: null,
            json: null,
            model: null,

            constructor: function () {

                serenity.Model.apply(this, arguments);

                this.status = this.status === null 
                    ? STATUS.NONE
                    : this.state;
            }
        });

        var _data = {};

        function getData(name) {

            if (typeof _data[name] === "undefined") {
                _data[name] = new StoreData();
            }
            return _data[name];
        }

        function setData(name, json, model) {

            if (typeof _data[name] === "undefined") {
                _data[name] = new StoreData();
            }

            _data[name].status = STATUS.COMPLETE;
            _data[name].json = json;
            _data[name].model = model;
        }

        function getJson(name, uri) {

            return $.Deferred(function (deferred) {

                var storedData = getData(name);

                if (storedData.status === STATUS.NONE) {
                    storedData.status = STATUS.PENDING;

                    if (typeof nw !== "undefined") {
                        try {
                            var fs = require("fs");
                            var that = this;
                            var appPath = nw.process.execPath.substr(0, nw.process.execPath.lastIndexOf("\\"));
                            fs.readFile(appPath + uri, "utf8", function (err, data) {
                                if (err) {
                                    deferred.reject(err);
                                } else {
                                    var json = JSON.parse(data);
                                    storedData.json = json;
                                    storedData.status = STATUS.COMPLETE;
                                    deferred.resolve(storedData);
                                }
                            });
                        } catch (err) {
                            deferred.reject(err);
                        }
                    } else {
                        var url = serenity.format("{0}{1}_={2}",
                            uri,
                            uri.indexOf('?') > 0 ? "&" : "?",
                            (new Date()).getTime());

                        $.getJSON(url, function (json) {
                            storedData.json = json;
                            storedData.status = STATUS.COMPLETE;
                            deferred.resolve(storedData);
                        })
                        .error(function () {
                            deferred.reject(arguments);
                        });
                    }
                } else if (storedData.status === STATUS.PENDING) {
                    // TBD
                } else {
                    deferred.resolve(storedData);
                }
            });
        }
        
        function mixedToCamelCase(mixed) {
            
            var camel = {};
            for (var key in mixed) {
                camel[key[0].toLowerCase() + key.substr(1)] = mixed[key];
            }
            return camel;
        }

        return {
            getJson: getJson,
            getData: getData,
            setData: setData,
            mixedToCamelCase: mixedToCamelCase
        };
    }();
}(window.Northwind, window.jQuery, window.serenity, window.nw));
