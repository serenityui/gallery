"use strict";

(function(Performance, $, serenity) {
    Performance.Models.Period = Performance.Models.Document.extend({
        type: null, 
        employee_id: null, 
        startDate: null, 
        endDate: null, 
        status: null,
        goals: null,

        constructor: function (values, options) {

            Performance.Models.Document.call(this, values, options);

            if ($.isArray(this.goals)) {
                for (var idx = 0; idx < this.goals.length; idx++) {
                    var goal = this.goals[idx];
                    if (goal instanceof Performance.Models.Goal === false) {
                        this.goals[idx] = new Performance.Models.Goal(goal);
                        this.goals[idx].period = this;
                    }
                }
            }
        },

        shortStartDate: {
            get: function () {
                return serenity.format("{0:MM/dd/yyyy}", new Date(this.startDate));
            }
        },

        shortEndDate: {
            get: function () {
                return serenity.format("{0:MM/dd/yyyy}", new Date(this.endDate));
            }
        },

        year: {
            get: function () {
                return serenity.format("{0:yyyy}", new Date(this.startDate));
            }
        },

        isCurrent: function (currentDate) {

            var sd = new Date(this.startDate);
            var ed = new Date(this.endDate);

            return currentDate > sd && currentDate < ed;
        }
    });
}(window.Performance, window.jQuery, window.serenity));
