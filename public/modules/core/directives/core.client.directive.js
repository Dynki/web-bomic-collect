    'use strict';

    angular.module('core').directive('megaMenu', function () {
        return {
            restrict: 'EA',
            templateUrl: 'modules/core/views/core.client.mega-menu.html',
            transclude: true,
            scope: {
                menu: '='
            },
            controller: 'MegaMenuController'
        };
    });


    angular.module('core').directive('basicPanel', function () {
        return {
            restrict: 'EA',
            transclude: true,
            templateUrl: 'modules/core/views/core.client.basic-panel.html',
            scope: {
                panelTitle: '='
            }
        };
    });

    angular.module('core')
        .directive('d3Bars', [function() {
            return {
                restrict: 'EA',
                scope: {
                    data: '=',
                    label: '@',
                    onClick: '&'
                },
                link: function(scope, iElement, iAttrs) {
                    var svg = d3.select(iElement[0])
                        .append('svg')
                        .attr('width', '100%');

                    // on window resize, re-render d3 canvas
                    window.onresize = function() {
                        return scope.$apply();
                    };
                    scope.$watch(function(){
                            return angular.element(window)[0].innerWidth;
                        }, function(){
                            return scope.render(scope.data);
                        }
                    );

                    // watch for data changes and re-render
                    scope.$watch('data', function(newVals, oldVals) {
                        return scope.render(newVals);
                    }, true);

                    // define render function
                    scope.render = function(data){

                        nv.addGraph(function() {
                            var chart = nv.models.cumulativeLineChart()
                                    .x(function(d) { return d[0]; })
                                    .y(function(d) { return d[1]/100; }) //adjusting, 100% is 1.00, not 100 as it is in the data
                                    .color(d3.scale.category10().range())
                                    .useInteractiveGuideline(true);

                            chart.xAxis
                                .tickValues([1078030800000,1122782400000,1167541200000,1251691200000])
                                .tickFormat(function(d) {
                                    return d3.time.format('%x')(new Date(d));
                                });

                            chart.yAxis
                                .tickFormat(d3.format(',.1%'));

                            d3.select('#chart svg')
                                .datum(data)
                                .call(chart);

                            //TODO: Figure out a good way to do this automatically
                            nv.utils.windowResize(chart.update);

                            return chart;
                        });
                    };
                }
            };
        }]);
