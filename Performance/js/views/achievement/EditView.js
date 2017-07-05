"use strict";

(function(Performance, $, serenity) {
    Performance.Views.Achievement.Edit = Performance.Views.Base.extend({

        __data: null,

        render: function () {

            this._widgets.description = this.element.find("#achievementDescription");
            this._widgets.startDate = this.element.find("#startDate");
            this._widgets.startDate.datepicker();
            this._widgets.endDate = this.element.find("#endDate");
            this._widgets.endDate.datepicker();
        },

        load: function (data) {

            this.__data = data;

            this._widgets.description.val(data.achievement.description);
            this._widgets.startDate.datepicker("setDate", data.achievement.shortStartDate);
            this._widgets.endDate.datepicker("setDate", data.achievement.shortEndDate);
        }
    });
}(window.Performance, window.jQuery, window.serenity));
