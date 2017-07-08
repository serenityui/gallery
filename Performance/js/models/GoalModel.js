"use strict";

(function(Performance, $, serenity) {
    Performance.Models.Goal = serenity.Model.extend({
        id: null,
        section_id: null,
        title: null, 
        measurement: null, 
        startDate: null,
        completionDate: null,
        dueDate: null, 
        status: null, 
        employeeComments: null, 
        supervisorComments: null,
        rating: null,
        period: null,
        achievements: null,

        constructor: function (values, options) {
            
            if (typeof values.completionDate === "string") {
                values.completionDate = new Date(values.completionDate);
            }
            
            if (typeof values.dueDate === "string") {
                values.dueDate = new Date(values.dueDate);
            }
            
            values.rating = values.rating || "";

            serenity.Model.call(this, values, options);

            if ($.isArray(this.achievements)) {
                for (var idx = 0; idx < this.achievements.length; idx++) {
                    var achievement = this.achievements[idx];
                    if (achievement instanceof Performance.Models.Achievement === false) {
                        this.achievements[idx] = new Performance.Models.Achievement(achievement);
                        this.achievements[idx].goal = this;
                    }
                }
            } else {
                this.achievements = [];
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
        },
        
        validate: function () {
            
            var errors = [];
            
            if (this.title.length === 0) {
                errors.push("Title is required.");
            }
            
            return errors;
        },
        
        addAchievement: function () {
            
            var achievement = Enumerable.From(this.achievements)
                .Where("achievement => achievement.id === '0'")
                .FirstOrDefault();
            
            if (typeof achievement === "undefined") {
                var currentDate = new Date();
                this.achievements.push(new Performance.Models.Achievement({
                    id: "0",
                    description: "New Achievement",
                    createdDate: currentDate,
                    startDate: currentDate,
                    endDate: currentDate,
                    goal: this
                }));
            }
        }
    });
}(window.Performance, window.jQuery, window.serenity));
