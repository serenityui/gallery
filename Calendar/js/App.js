"use strict";

var Calendar = {
    root: "/Templates/Calendar/",
    Models: {},
    Views: {},
    Stores: {}
};

Calendar.App = function ($, serenity) {

    var _search = null;
    var _searchResults = null;
    var _calendar = null;
    
    function _showCalendar() {
        
        // Hide the search results view.
        $("#searchResults").hide();
        
        // Show the calendar view.
        $("#scheduler").show();
    }
    
    function _getShowResults() {
        
    }

    function _showSearchResults(criteria) {
        
        if (_searchResults === null) {
            _searchResults = new Calendar.Views.SearchResults({
                back: function () {
                    // Clear the search criteria from the search view.
                    _search.clear();
                    
                    // Show the calandar.
                    _showCalendar();
                },
                dateSelect: function (e) {

                    // Clear the search criteria from the search view.
                    _search.clear();
                    
                    // Show the calandar.
                    _showCalendar();
                    
                    // Show the selected date.
                    _calendar.select(e.date);
                }
            });
        }
        
        // Hide the calendar view.
        $("#scheduler").hide();
        
        // Show the search results view.
        $("#searchResults").show();
        
        // Execute the search and show the results.
        _searchResults.search(criteria);
    }
    
    function init() {

        // Create the navigation for the page.
        _search = new Calendar.Views.Search({
            search: function (criteria) {
                _showSearchResults(criteria);
            }
        });

        // Create the view for the page.
        _calendar = new Calendar.Views.Calendar();
    }

    function calendar() {

        return _calendar;
    }

    return {
        init: init,
        calendar: calendar
    }
}(jQuery, window.serenity);

$(function () {
    Calendar.App.init();
});
