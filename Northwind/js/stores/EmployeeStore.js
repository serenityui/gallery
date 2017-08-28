"use strict";

(function(Northwind, $, serenity) {
    Northwind.Stores.Employee = function (base) {
        /// <summary>Store for managing the Employee information.</summary>

        var _url = {
            employees: "data/Employees.json",
            territories: "data/EmployeeTerritories.json"
        };

        function list() {

            return $.Deferred(function (deferred) {

                base.getJson("Employees", _url.employees).then(function (data) {
                    if (data.model === null) {
                        var list = [];

                        data.model = Enumerable.From(data.json)
                            .Select(function (item) {
                                var values = base.mixedToCamelCase(item);

                                values.employeeID = parseInt(values.employeeID);
                                values.reportsToID = values.reportsTo.length > 0 ? parseInt(values.reportsTo) : null;
                                delete values.reportsTo;
                                values.birthDate = new Date(values.birthDate);
                                values.hireDate = new Date(values.hireDate);

                                return new Northwind.Models.Employee(values);
                            })
                            .ToArray();

                        Enumerable.From(data.model)
                            .ForEach(function (employee) {
                                employee.reportsTo = employee.reportsToID !== null
                                    ? Enumerable.From(data.model)
                                        .Where(serenity.format("item => item.employeeID === {0}", employee.reportsToID))
                                        .FirstOrDefault()
                                    : {};
                            });
                    }
                    
                    deferred.resolve(data.model);
                });
            });
        }
        
        function get(id) {
            /// <summary>Get an employee by id.</summary>
            
            return $.Deferred(function (deferred) {
                // Get the list of all the employees.
                list().then(function (employees) {
                    // Get the employee.
                    var employee = Enumerable.From(employees)
                        .Where(serenity.format("employee => employee.employeeID === {0}", id))
                        .FirstOrDefault();
                    deferred.resolve(employee);
                });
            });
        }

        function territories() {

            return $.Deferred(function (deferred) {

                base.getJson("EmployeeTerritories", _url.territories).then(function (data) {
                    if (data.model === null) {
                        var list = [];

                        data.model = Enumerable.From(data.json)
                            .Select(function (item) {
                                var values = base.mixedToCamelCase(item);

                                values.employeeID = parseInt(values.employeeID);

                                return new Northwind.Models.EmployeeTerritory(values);
                            })
                            .ToArray();
                    }
                    
                    deferred.resolve(data.model);
                });
            });
        }

        return {
            list: list,
            get: get,
            territories: territories
        };
    }(Northwind.Stores.Base);
}(window.Northwind, window.jQuery, window.serenity));
