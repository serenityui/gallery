"use strict";

(function(Performance, $, serenity) {
    Performance.Views.Period.List = Performance.Views.Base.extend({

        __data: null,

        events: ["select"],

        __templates: {
            tile: Handlebars.compile("<div data-id='{{id}}'></div>")
        },

        _onTileSelect: function (event, args) {

            var id = args.sender.element.attr("data-id");
            this.trigger("select", { id: id });
        },

        render: function () {

            this._widgets.periods = this.element.find("#periods");
        },

        load: function (data) {

            var that = this;

            this.__data = data;

            Enumerable.From(data.periods)
                .ForEach(function (period) {
                    that._widgets.periods.append(that.__templates.tile(period));
                    that._widgets.periods.find(serenity.format("div[data-id='{0}']", period.id)).serenityTile({
                        title: period.year,
                        backgroundColor: "gainsboro",
                        select: $.proxy(that._onTileSelect, that)
                    });
                });
        }
    });
}(window.Performance, window.jQuery, window.serenity));
