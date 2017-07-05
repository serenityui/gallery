"use strict";

(function(Fitness, $, serenity) {
    $.widget("serenity.tile", $.serenity.widget, {

        html: {
            title: Handlebars.compile("<div style='font-weight:bold;font-size:20px;position:absolute;top:{{top}}px;left:0px;right:0px;text-align:center;'>{{title}}</div>")
        },

        options: {
            height: 150,
            width: 150,
            title: "",
            color: "black",
            backgroundColor: "white"
        },

        events: ["select"],

        _create: function () {
            /// <summary>Constructor for the tile.</summary>

            // Call the base class.
            this._super();

            this.element.css({
                height: typeof this.options.height === "number" ? serenity.format("{0}px", this.options.height) : this.options.height,
                width: typeof this.options.width === "number" ? serenity.format("{0}px", this.options.width) : this.options.width,
                position: "relative",
                "background-color": this.options.backgroundColor,
                color: this.options.color,
                display: "inline-block"
            });

            this.element.addClass("ui-widget-content");

            this.element.append(this.html.title({ top: typeof this.options.height === "number" ? (this.options.height / 2) - 10 : "0", title: this.options.title }));

            this.element.on("click", $.proxy(this._onClick, this))
        },

        _onClick: function () {

            this._trigger("select");
        }
    });
}(window.Fitness, window.jQuery, window.serenity));
