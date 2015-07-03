angular.module('events').directive('lowerThan', ['Utilities',
    function(Utils) {

        var link = function($scope, $element, $attrs, ctrl) {

            var date = new Date(), interval=5;

            date.setHours(0);
            date.setMinutes(0);

            var toTimes = [];

            for(var i=0; i < 288; i++){
                date.setMinutes(date.getMinutes() + interval);
                toTimes.push({text: date.getHours() + ':' + Utils.padMinutes(date.getMinutes(),2), id: i});
            }

            var validate = function(viewValue) {
                var comparisonModel = $attrs.lowerThan;

                if(!viewValue || !comparisonModel){
                    // It's valid because we have nothing to compare against
                    ctrl.$setValidity('lowerThan', true);
                }
                if (comparisonModel) {
                    var to = comparisonModel;

                    var timeTo = toTimes[Utils.indexOfObject(toTimes, to)];
                }
                if (viewValue) {
                    var from = viewValue;
                    var timeFrom = toTimes[Utils.indexOfObject(toTimes, from)];
                }

                ctrl.$setValidity('lowerThan', timeTo.id > timeFrom.id);
                // It's valid if model is lower than the model we're comparing against

                return viewValue;
            };

            ctrl.$parsers.unshift(validate);
            ctrl.$formatters.push(validate);

            $attrs.$observe('lowerThan', function(comparisonModel){
                return validate(ctrl.$viewValue);
            });

        };

        return {
            require: 'ngModel',
            link: link
        };

    }
]);