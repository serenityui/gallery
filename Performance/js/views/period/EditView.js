"use strict";

(function(Performance, $, serenity) {
    Performance.Views.Period.Edit = Performance.Views.Base.extend({

        __data: null,

        render: function () {

            this._widgets.startDate = this.element.find("#startDate");
            this._widgets.startDate.datepicker();

            this._widgets.endDate = this.element.find("#endDate");
            this._widgets.endDate.datepicker();

            this._widgets.status = this.element.find("#status").serenityDropdownlist({
                valueField: "id",
                textField: "title"
            }).data("serenityDropdownlist");
        },

        load: function (data) {

            this.__data = data;

            this._widgets.startDate.datepicker("setDate", data.period.shortStartDate);
            this._widgets.endDate.datepicker("setDate", data.period.shortEndDate);

            this._widgets.status.dataSource().data(data.statusList);
            this._widgets.status.text(data.period.status);
        }
    });
}(window.Performance, window.jQuery, window.serenity));
