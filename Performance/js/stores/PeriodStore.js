"use strict";

(function(Performance, $, serenity) {
    Performance.Stores.Period = function (base) {
        /// <summary>Store for managing the Period information.</summary>

        var _uri = {
            list: "data/Period.json"
        };

        function list() {
            /// <summary>Get the list of periods.</summary>

            return $.Deferred(function (deferred) {

                base.getJson("periods", _uri.list).then(function (data) {
                    // If the JSON data was retrieved for the first time, then instantiate
                    // each JSON object as a Performance.Models.Period model.
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
            /// <summary>Get a period for the id passed in.</summary>

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
        
        function add() {
            /// <summary>Add a period.</summary>
            
            return $.Deferred(function (deferred) {
                list().then(function (periods) {
                    var period = Enumerable.From(periods)
                        .Where("period => period.id === '0'")
                        .FirstOrDefault();

                    if (typeof period === "undefined") {
                        var currentDate = new Date();

                        periods.unshift(new Performance.Models.Period({
                            id: "0",
                            startDate: currentDate,
                            endDate: currentDate,
                            status: "New"
                        }));
                    }
                    deferred.resolve();
                });
            });
        }

        function goal(id) {
            /// <summary>Get a goal for the id passed in.</summary>
            
            return $.Deferred(function (deferred) {
                
                // Get the list of periods.
                list().then(function (periods) {
                    var goal = null;
                    
                    // Loop over each period to look for the goal.
                    Enumerable.From(periods)
                        .Where(function (period) {
                            // Search for the goal in the current period.
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
            /// <summary>Get an achievement for the id passed in.</summary>
            
            return $.Deferred(function (deferred) {
                
                // Get the list of periods.
                list().then(function (periods) {
                    var achievement = null;
                    
                    // Loop over each period.
                    Enumerable.From(periods)
                        .Where(function (period) {
                            // Loop over the goals for the current period.
                            Enumerable.From(period.goals)
                                .Where(function (goal) {
                                    // Search for the achievement in the current goal.
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
        
        function savePeriod(period) {
            /// <summary>Save the period that was passed in.</summary>
            
            return $.Deferred(function (deferred) {
                // If this is a new period, then set the guid for the period.
                if (period.id === "0") {
                    period.id = serenity.guid();
                }
                // Commit the changes to the period.
                period.commit();
                deferred.resolve({ result: "success" });
            });
        }
        
        function saveGoal(goal) {
            /// <summary>Save the goal that was passed in.</summary>
            
            return $.Deferred(function (deferred) {
                // If this is a new goal, then set the guid for the goal.
                if (goal.id === "0") {
                    goal.id = serenity.guid();
                }
                // Commit the changes to the goal.
                goal.commit();
                deferred.resolve({ result: "success" });
            });
        }

        function saveAchievement(achievement) {
            /// <summary>Save the achievement that was passed in.</summary>
            
            return $.Deferred(function (deferred) {
                // If this is a new achievement, then set the guid for the achievement.
                if (achievement.id === "0") {
                    achievement.id = serenity.guid();
                }
                // Commit the changes to the achievement.
                achievement.commit();
                deferred.resolve({ result: "success" });
            });
        }
        
        return {
            list: list,
            get: get,
            add: add,
            goal: goal,
            achievement: achievement,
            savePeriod: savePeriod,
            saveGoal: saveGoal,
            saveAchievement: saveAchievement
        };
    }(Performance.Stores.Base);
}(window.Performance, window.jQuery, window.serenity));
