"use strict";

(function(Performance, $, serenity) {
    Performance.Stores.Period = function (base) {
        /// <summary>Store for managing the Period information.</summary>

        var _uri = {
            list: "data/Period.json"
        };

        function list() {

            return $.Deferred(function (deferred) {

                base.getJson(_uri.list).then(function (data) {

                    if (data.model === null) {
                        data.model = Enumerable.From(data.json)
                            .Select(function (json) {
                                return new Performance.Models.Period(json);
                            })
                            .OrderByDescending("p => p.startDate")
                            .ToArray();
                    }
                    deferred.resolve(data.model);
                });
            });
        }

        function get(id) {

            return $.Deferred(function (deferred) {

                list().then(function (periods) {
                    var period = Enumerable.From(periods)
                        .Where(function (item) {
                            return item.id === id;
                        })
                        .FirstOrDefault();

                    deferred.resolve(period);
                });
            });
        }

        function goal(id) {
            
            return $.Deferred(function (deferred) {
                
                list().then(function (periods) {
                    var goal = null;
                    
                    Enumerable.From(periods)
                        .Where(function (period) {
                            goal = Enumerable.From(period.goals)
                                .Where(function (item) {
                                    return item.id === id;
                                })
                                .FirstOrDefault();
                        
                            return goal instanceof Performance.Models.Goal;
                        })
                        .FirstOrDefault();

                    deferred.resolve(goal);
                });
            });
        }
        
        function achievement(id) {
            
            return $.Deferred(function (deferred) {
                
                list().then(function (periods) {
                    var achievement = null;
                    
                    Enumerable.From(periods)
                        .Where(function (period) {
                            Enumerable.From(period.goals)
                                .Where(function (goal) {
                                    achievement = Enumerable.From(goal.achievements)
                                        .Where(function (item) {
                                            return item.id === id;
                                        })
                                        .FirstOrDefault();
                                
                                    return achievement instanceof Performance.Models.Achievement;
                                })
                                .FirstOrDefault();
                        
                            return achievement instanceof Performance.Models.Achievement;
                        })
                        .FirstOrDefault();

                    deferred.resolve(achievement);
                });
            });
        }

        return {
            list: list,
            get: get,
            goal: goal,
            achievement: achievement
        };
    }(Performance.Stores.Base);
}(window.Performance, window.jQuery, window.serenity));
