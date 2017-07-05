"use strict";

(function(Performance, $, serenity) {
    Performance.Stores.Lookup = function (base) {
        /// <summary>Store for managing the Lookup information.</summary>

        var _uri = {
            periodStatus: "data/PeriodStatus.json",
            goalStatus: "data/GoalStatus.json"
        };

        function periodStatus() {
            /// <summary>Get the list of period status.</summary>

            return $.Deferred(function (deferred) {

                base.getJson(_uri.periodStatus).then(function (data) {

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

        function goalStatus() {
            /// <summary>Get the list of goal status.</summary>

            return $.Deferred(function (deferred) {

                base.getJson(_uri.goalStatus).then(function (data) {

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

        return {
            periodStatus: periodStatus,
            goalStatus: goalStatus
        };
    }(Performance.Stores.Base);
}(window.Performance, window.jQuery, window.serenity));
