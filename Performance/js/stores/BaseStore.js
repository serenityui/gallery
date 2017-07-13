"use strict";

(function(Performance, $, serenity, nw) {
    Performance.Stores.Base = function () {
        /// <summary>Base store for managing accessing information using nw.js.</summary>

        var STATUS =  {
            NONE: 0,
            PENDING: 1,
            COMPLETE: 2
        };

        var StoreData = serenity.Model.extend({
            /// <summary>A model for storing information retrieved in a store.</summary>
            
            status: null,
            json: null,
            model: null,

            constructor: function () {
            /// <summary>Constructor for the StoreDate Model.</summary>

                // Call the base class constructor.
                serenity.Model.apply(this, arguments);

                // If there is no status, then set the status to NONE.
                this.status = this.status === null 
                    ? STATUS.NONE
                    : this.state;
            }
        });

        var _data = {};

        function getData(name) {
            /// <summary>Get the StoreData instance based on the name.</summary>

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
            /// <summary>Get the JSON data.</summary>

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
                        $.getJSON(serenity.format("{0}?_={1}", uri, (new Date()).getTime()), function (json) {
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

        return {
            getJson: getJson,
            getData: getData,
            setData: setData
        };
    }();
}(window.Performance, window.jQuery, window.serenity, window.nw));
