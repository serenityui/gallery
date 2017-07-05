"use strict";

(function(Performance, $, serenity) {
    Performance.Models.Goal = serenity.Model.extend({
        id: null,
        section_id: null,
        title: null, 
        measurement: null, 
        dueDate: null, 
        status: null, 
        employeeComments: null, 
        supervisorComments: null,
        period: null,
        achievements: null,

        constructor: function (values, options) {

            serenity.Model.call(this, values, options);
            
            if (typeof this.dueDate === "string") {
                this.dueDate = new Date(this.dueDate);
            }

            if ($.isArray(this.achievements)) {
                for (var idx = 0; idx < this.achievements.length; idx++) {
                    var achievement = this.achievements[idx];
                    if (achievement instanceof Performance.Models.Achievement === false) {
                        this.achievements[idx] = new Performance.Models.Achievement(achievement);
                        this.achievements[idx].goal = this;
                    }
                }
            }
        },
        
        shortDueDate: {
            get: function () {
                return serenity.format("{0:MM/dd/yyyy}", this.dueDate);
            }
        },

        sectionId: {
            get: function () {
                return this.section_id;
            },
            set: function (value) {
                this.section_id = value;
            }
        }
    });
}(window.Performance, window.jQuery, window.serenity));
