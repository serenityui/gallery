"use strict";

(function(Performance, $, serenity) {
    Performance.Stores.Lookup = function (base) {
        /// <summary>Store for managing the Lookup information.</summary>

        var _uri = {
            periodStatus: "data/PeriodStatus.json",
            goalStatus: "data/GoalStatus.json",
            rating: "data/Rating.json"
        };
        
        function _getLookupValues(name, uri) {
            /// <summary>Get the lookup values for the name and uri.</summary>
            
            return $.Deferred(function (deferred) {

                base.getJson(name, uri).then(function (data) {
                    // If the JSON data was retrieved for the first time, then instantiate
                    // each JSON object as a Performance.Models.Lookup model.
                    if (data.model === null) {
                        data.model = Enumerable.From(data.json)
                            .Select(function (json) {
                                return new Performance.Models.Lookup(json);
                            })
                            .OrderBy("p => p.order")
                            .ToArray();
                    }
                    deferred.resolve(data.model);
                });
            });
        }

        function periodStatus() {
            /// <summary>Get the list of period status.</summary>

            return _getLookupValues("periodStatus", _uri.periodStatus);
        }

        function goalStatus() {
            /// <summary>Get the list of goal status.</summary>

            return _getLookupValues("goalStatus", _uri.goalStatus);
        }

        function rating() {
            /// <summary>Get the list of ratings.</summary>

            return $.Deferred(function (deferred) {
                _getLookupValues("ratings", _uri.rating).then(function (ratings) {
                    // If an empty rating has not been defined, then add an empty rating.
                    var emptyRating = Enumerable.From(ratings)
                        .Where("rating => rating.id === '0'")
                        .FirstOrDefault();
                    if (typeof emptyRating === "undefined") {
                        ratings.unshift(new Performance.Models.Lookup({
                            _id: "0",
                            type: "Rating",
                            order: 0,
                            title: ""
                        }));
                    }
                    deferred.resolve(ratings);
                });
            });
        }

        return {
            periodStatus: periodStatus,
            goalStatus: goalStatus,
            rating: rating
        };
    }(Performance.Stores.Base);
}(window.Performance, window.jQuery, window.serenity));
