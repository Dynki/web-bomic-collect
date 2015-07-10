'use strict';
// Init the application configuration module for AngularJS application
var ApplicationConfiguration = function () {
    // Init module configuration options
    var applicationModuleName = 'WBConnect';
    var applicationModuleVendorDependencies = [
        'ngResource',
        'ngAnimate',
        'ui.router',
        'ngMaterial',
        'ui.utils',
        'ng-mfb',
        'ngMaterial.components',
        'ngIdle',
        'lumx',
        'pouchdb',
        'ngMdIcons',
        'templates-main'
      ];
    // Add a new vertical module
    var registerModule = function (moduleName, dependencies) {
      // Create angular module
      angular.module(moduleName, dependencies || []);
      // Add the module to the AngularJS configuration file
      angular.module(applicationModuleName).requires.push(moduleName);
    };
    return {
      applicationModuleName: applicationModuleName,
      applicationModuleVendorDependencies: applicationModuleVendorDependencies,
      registerModule: registerModule
    };
  }();// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies).config([
  '$locationProvider',
  function ($locationProvider) {
    $locationProvider.hashPrefix('!');
  }
]);
//Then define the init function for starting up the application
angular.element(document).ready(function () {
  //Fixing facebook bug with redirect
  if (window.location.hash === '#_=_')
    window.location.hash = '#!';
  //Then init the app
  angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});'use strict';
// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');'use strict';
// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('events');'use strict';
// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('general-lookups');'use strict';
// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('security');'use strict';
// Config HTTP Error Handling
angular.module('core').config([
  '$httpProvider',
  '$mdThemingProvider',
  function ($httpProvider, $mdThemingProvider) {
    $mdThemingProvider.theme('datePickerTheme').primaryPalette('teal');
    // Delete this from header requests to enable CORS to work.
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
  }
]).run([
  '$rootScope',
  'Login',
  '$location',
  '$window',
  '$timeout',
  '$http',
  'settings',
  function ($rootScope, Login, $location, $window, $timeout, $http, settings) {
    $rootScope.ApiLocation = '';
    settings.$get('ApiLocation').$promise.then(function (value) {
      $rootScope.ApiLocation = value;
    });
    $rootScope.$on('$stateChangeStart', function (e, toState) {
      if (toState.url != '/login-offline' && !Login.loggedIn) {
        $location.path('login-offline');
      }
    });
    $rootScope.online = navigator.onLine;
    $window.addEventListener('offline', function () {
      $rootScope.$apply(function () {
        $rootScope.online = false;
      });
    }, false);
    $window.addEventListener('online', function () {
      $rootScope.$apply(function () {
        $rootScope.online = true;
      });
    }, false);
    function loop() {
      // When the timeout is defined, it returns a
      // promise object.
      var timer = $timeout(function () {
        }, 10000);
      timer.then(function () {
        settings.$get('ApiLocation').$promise.then(function (apiLocation) {
          $http({
            method: 'GET',
            url: apiLocation + '/ApiStatus'
          }).success(function () {
            $rootScope.connected = true;
            loop();
          }).error(function () {
            $rootScope.connected = false;
            loop();
          });
        });
      });
    }
    loop();
  }
]);'use strict';
// Setting up route
angular.module('core').config([
  '$stateProvider',
  '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {
    // Redirect to home view when route not found
    $urlRouterProvider.otherwise('/');
    // Home state routing
    $stateProvider.state('home', {
      url: '/',
      templateUrl: 'modules/events/views/list-events.client.view.html'
    });
  }
]);'use strict';
angular.module('core').controller('SettingsController', [
  '$scope',
  '$mdDialog',
  'settings',
  '$rootScope',
  function ($scope, $mdDialog, settings, $rootScope) {
    $scope.ApiLocation = '';
    settings.$get().$promise.then(function (response) {
      $scope.ApiLocation = response;
    });
    $scope.hide = function () {
      $mdDialog.hide();
    };
    $scope.save = function () {
      var newSetting = {
          Id: 'ApiLocation',
          Value: $scope.ApiLocation
        };
      settings.$save(newSetting).$promise.then(function () {
        $scope.hide();
      });
    };
  }
]);'use strict';
angular.module('core').controller('SyncController', [
  '$scope',
  'StaticLookup',
  '$mdDialog',
  'Events',
  '$timeout',
  '$mdToast',
  '$rootScope',
  function ($scope, StaticLookup, $mdDialog, Events, $timeout, $mdToast, $rootScope) {
    $scope.loadArrays = function () {
      StaticLookup.loadArrays();
    };
    $scope.hide = function () {
      $mdDialog.hide();
    };
    $scope.$on('sync-start', function (event, args) {
      $rootScope.toSync = args;
      $rootScope.syncSuccess = 0;
      $rootScope.syncFail = 0;
    });
    $scope.$on('sync-event-success', function (event, args) {
      $rootScope.syncSuccess = $rootScope.syncSuccess + 1;
      if ($rootScope.toSync === $rootScope.syncSuccess + $rootScope.syncFail) {
        $rootScope.$broadcast('sync-complete');
      }
    });
    $scope.$on('sync-event-fail', function (event, args) {
      $rootScope.syncFail = $rootScope.syncFail + 1;
      if ($rootScope.toSync === $rootScope.syncSuccess + $rootScope.syncFail) {
        $rootScope.$broadcast('sync-complete');
      }
    });
    $scope.$on('sync-nothing', function (event, args) {
      $timeout(function () {
        $scope.hide();
        $mdToast.show($mdToast.simple().content('No Events to Sync').position('bottom').hideDelay(3000));
      }, 3000);
    });
    $scope.$on('sync-complete', function (event, args) {
      $timeout(function () {
        $scope.hide();
        $mdToast.show($mdToast.simple().content('Synchronisation Complete (' + $rootScope.syncSuccess + ')').position('bottom').hideDelay(3000));
      }, 3000);
    });
    $scope.syncEvents = function () {
      $scope.loadArrays();
      Events.$sync();
    };
    $scope.syncEvents();
  }
]);'use strict';
angular.module('core').controller('HeaderController', [
  '$scope',
  'Menus',
  'Login',
  '$mdSidenav',
  '$location',
  'StaticLookup',
  '$mdDialog',
  '$state',
  '$rootScope',
  'settings',
  'pouchDB',
  function ($scope, Menus, Login, $mdSidenav, $location, StaticLookup, $mdDialog, $state, $rootScope, settings, pouchDB) {
    settings.$get('ApiLocation').$promise.then(function (value) {
      $rootScope.ApiLocation = value;
    });
    $scope.Login = Login;
    $scope.isCollapsed = false;
    $scope.menu = Menus.getMenu('topbar');
    $scope.openMenu = function () {
      $mdSidenav('left').toggle().then(function () {
      });
    };
    $scope.loadEvents = function () {
      $location.path('/events');
    };
    $scope.toggleCollapsibleMenu = function () {
      $scope.isCollapsed = !$scope.isCollapsed;
    };
    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function () {
      $scope.isCollapsed = false;
    });
    StaticLookup.loadArrays();
    $scope.logout = function () {
      $state.go('login');
    };
    $scope.showSyncDialog = function (ev) {
      $mdDialog.show({
        controller: 'SyncController',
        templateUrl: 'modules/core/views/core.client.sync.html',
        targetEvent: ev
      }).then(function (answer) {
      }, function () {
      });
    };
    $scope.showSettings = function (ev) {
      $mdDialog.show({
        controller: 'SettingsController',
        templateUrl: 'modules/core/views/core.client.settings.html',
        targetEvent: ev
      }).then(function (answer) {
      }, function () {
      });
    };
    $scope.showVersion = function (ev) {
      $mdDialog.show({
        controller: 'SettingsController',
        templateUrl: 'modules/core/views/core.client.version.view.html',
        targetEvent: ev
      }).then(function (answer) {
      }, function () {
      });
    };
    $scope.clearData = function (ev) {
      $mdDialog.show({
        controller: 'SecurityLoginController',
        templateUrl: 'modules/core/views/core.client.clear-data.view.html',
        targetEvent: ev
      }).then(function (answer) {
      }, function () {
      });
    };
  }
]);'use strict';
angular.module('core').controller('MegaMenuController', [
  '$scope',
  'Menus',
  function ($scope, Menus) {
    $scope.isCollapsed = false;
    $scope.menu = Menus.getMenu('topbar');
    $scope.expandedMenu = true;
    $scope.toggleCollapsibleMenu = function () {
      $scope.isCollapsed = !$scope.isCollapsed;
    };
    $scope.expandMenu = function () {
      $scope.expandedMenu = !$scope.expandedMenu;
    };
    $scope.expandSubmenu = function (item) {
      angular.forEach($scope.menu.items, function (menuitem) {
        if (item !== menuitem) {
          menuitem.expanded = false;
        }
      });
      item.expanded = !item.expanded;
    };
  }
]);'use strict';
angular.module('core').controller('SidebarController', [
  '$scope',
  'Menus',
  'Login',
  function ($scope, Menus, Login) {
    $scope.loggedIn = Login.loggedIn;
  }
]);'use strict';
angular.module('core').directive('megaMenu', function () {
  return {
    restrict: 'EA',
    templateUrl: 'modules/core/views/core.client.mega-menu.html',
    transclude: true,
    scope: { menu: '=' },
    controller: 'MegaMenuController'
  };
});
angular.module('core').directive('basicPanel', function () {
  return {
    restrict: 'EA',
    transclude: true,
    templateUrl: 'modules/core/views/core.client.basic-panel.html',
    scope: { panelTitle: '=' }
  };
});
angular.module('core').directive('d3Bars', [function () {
    return {
      restrict: 'EA',
      scope: {
        data: '=',
        label: '@',
        onClick: '&'
      },
      link: function (scope, iElement, iAttrs) {
        var svg = d3.select(iElement[0]).append('svg').attr('width', '100%');
        // on window resize, re-render d3 canvas
        window.onresize = function () {
          return scope.$apply();
        };
        scope.$watch(function () {
          return angular.element(window)[0].innerWidth;
        }, function () {
          return scope.render(scope.data);
        });
        // watch for data changes and re-render
        scope.$watch('data', function (newVals, oldVals) {
          return scope.render(newVals);
        }, true);
        // define render function
        scope.render = function (data) {
          nv.addGraph(function () {
            var chart = nv.models.cumulativeLineChart().x(function (d) {
                return d[0];
              }).y(function (d) {
                return d[1] / 100;
              }).color(d3.scale.category10().range()).useInteractiveGuideline(true);
            chart.xAxis.tickValues([
              1078030800000,
              1122782400000,
              1167541200000,
              1251691200000
            ]).tickFormat(function (d) {
              return d3.time.format('%x')(new Date(d));
            });
            chart.yAxis.tickFormat(d3.format(',.1%'));
            d3.select('#chart svg').datum(data).call(chart);
            //TODO: Figure out a good way to do this automatically
            nv.utils.windowResize(chart.update);
            return chart;
          });
        };
      }
    };
  }]);/**
 * @ngdoc module
 * @name material.components.input
 */
angular.module('material.components.input', ['material.core']).directive('mdInputContainer', mdInputContainerDirective).directive('label', labelDirective).directive('input', inputTextareaDirective).directive('textarea', inputTextareaDirective).directive('mdMaxlength', mdMaxlengthDirective).directive('placeholder', placeholderDirective);
/**
 * @ngdoc directive
 * @name mdInputContainer
 * @module material.components.input
 *
 * @restrict E
 *
 * @description
 * `<md-input-container>` is the parent of any input or textarea element.
 *
 * Input and textarea elements will not behave properly unless the md-input-container
 * parent is provided.
 *
 * @param md-is-error {expression=} When the given expression evaluates to true, the input container will go into error state. Defaults to erroring if the input has been touched and is invalid.
 * @param md-no-float {boolean=} When present, placeholders will not be converted to floating labels
 *
 * @usage
 * <hljs lang="html">
 *
 * <md-input-container>
 *   <label>Username</label>
 *   <input type="text" ng-model="user.name">
 * </md-input-container>
 *
 * <md-input-container>
 *   <label>Description</label>
 *   <textarea ng-model="user.description"></textarea>
 * </md-input-container>
 *
 * </hljs>
 */
function mdInputContainerDirective($mdTheming, $parse) {
  return {
    restrict: 'E',
    link: postLink,
    controller: ContainerCtrl
  };
  function postLink(scope, element, attr) {
    $mdTheming(element);
  }
  function ContainerCtrl($scope, $element, $attrs) {
    var self = this;
    self.isErrorGetter = $attrs.mdIsError && $parse($attrs.mdIsError);
    self.delegateClick = function () {
      self.input.focus();
    };
    self.element = $element;
    self.setFocused = function (isFocused) {
      $element.toggleClass('md-input-focused', !!isFocused);
    };
    self.setHasValue = function (hasValue) {
      $element.toggleClass('md-input-has-value', !!hasValue);
    };
    self.setInvalid = function (isInvalid) {
      $element.toggleClass('md-input-invalid', !!isInvalid);
    };
    $scope.$watch(function () {
      return self.label && self.input;
    }, function (hasLabelAndInput) {
      if (hasLabelAndInput && !self.label.attr('for')) {
        self.label.attr('for', self.input.attr('id'));
      }
    });
  }
}
function labelDirective() {
  return {
    restrict: 'E',
    require: '^?mdInputContainer',
    link: function (scope, element, attr, containerCtrl) {
      if (!containerCtrl || attr.mdNoFloat)
        return;
      containerCtrl.label = element;
      scope.$on('$destroy', function () {
        containerCtrl.label = null;
      });
    }
  };
}
/**
 * @ngdoc directive
 * @name mdInput
 * @restrict E
 * @module material.components.input
 *
 * @description
 * Use the `<input>` or the  `<textarea>` as a child of an `<md-input-container>`.
 *
 * @param {number=} md-maxlength The maximum number of characters allowed in this input. If this is specified, a character counter will be shown underneath the input.<br/><br/>
 * The purpose of **`md-maxlength`** is exactly to show the max length counter text. If you don't want the counter text and only need "plain" validation, you can use the "simple" `ng-maxlength` or maxlength attributes.
 * @param {string=} aria-label Aria-label is required when no label is present.  A warning message will be logged in the console if not present.
 * @param {string=} placeholder An alternative approach to using aria-label when the label is not present.  The placeholder text is copied to the aria-label attribute.
 *
 * @usage
 * <hljs lang="html">
 * <md-input-container>
 *   <label>Color</label>
 *   <input type="text" ng-model="color" required md-maxlength="10">
 * </md-input-container>
 * </hljs>
 * <h3>With Errors</h3>
 *
 * <hljs lang="html">
 * <form name="userForm">
 *   <md-input-container>
 *     <label>Last Name</label>
 *     <input name="lastName" ng-model="lastName" required md-maxlength="10" minlength="4">
 *     <div ng-messages="userForm.lastName.$error" ng-show="userForm.lastName.$dirty">
 *       <div ng-message="required">This is required!</div>
 *       <div ng-message="md-maxlength">That's too long!</div>
 *       <div ng-message="minlength">That's too short!</div>
 *     </div>
 *   </md-input-container>
 *   <md-input-container>
 *     <label>Biography</label>
 *     <textarea name="bio" ng-model="biography" required md-maxlength="150"></textarea>
 *     <div ng-messages="userForm.bio.$error" ng-show="userForm.bio.$dirty">
 *       <div ng-message="required">This is required!</div>
 *       <div ng-message="md-maxlength">That's too long!</div>
 *     </div>
 *   </md-input-container>
 *   <md-input-container>
 *     <input aria-label='title' ng-model='title'>
 *   </md-input-container>
 *   <md-input-container>
 *     <input placeholder='title' ng-model='title'>
 *   </md-input-container>
 * </form>
 * </hljs>
 *
 * Requires [ngMessages](https://docs.angularjs.org/api/ngMessages).
 * Behaves like the [AngularJS input directive](https://docs.angularjs.org/api/ng/directive/input).
 *
 */
function inputTextareaDirective($mdUtil, $window, $mdAria) {
  return {
    restrict: 'E',
    require: [
      '^?mdInputContainer',
      '?ngModel'
    ],
    link: postLink
  };
  function postLink(scope, element, attr, ctrls) {
    var containerCtrl = ctrls[0];
    var ngModelCtrl = ctrls[1] || $mdUtil.fakeNgModel();
    var isReadonly = angular.isDefined(attr.readonly);
    if (!containerCtrl)
      return;
    if (containerCtrl.input) {
      throw new Error('<md-input-container> can only have *one* <input> or <textarea> child element!');
    }
    containerCtrl.input = element;
    if (!containerCtrl.label) {
      $mdAria.expect(element, 'aria-label', element.attr('placeholder'));
    }
    element.addClass('md-input');
    if (!element.attr('id')) {
      element.attr('id', 'input_' + $mdUtil.nextUid());
    }
    if (element[0].tagName.toLowerCase() === 'textarea') {
      setupTextarea();
    }
    var isErrorGetter = containerCtrl.isErrorGetter || function () {
        return ngModelCtrl.$invalid && ngModelCtrl.$touched;
      };
    scope.$watch(isErrorGetter, containerCtrl.setInvalid);
    ngModelCtrl.$parsers.push(ngModelPipelineCheckValue);
    ngModelCtrl.$formatters.push(ngModelPipelineCheckValue);
    element.on('input', inputCheckValue);
    if (!isReadonly) {
      element.on('focus', function (ev) {
        containerCtrl.setFocused(true);
      }).on('blur', function (ev) {
        containerCtrl.setFocused(false);
        inputCheckValue();
      });
    }
    //ngModelCtrl.$setTouched();
    //if( ngModelCtrl.$invalid ) containerCtrl.setInvalid();
    scope.$on('$destroy', function () {
      containerCtrl.setFocused(false);
      containerCtrl.setHasValue(false);
      containerCtrl.input = null;
    });
    /**
     *
     */
    function ngModelPipelineCheckValue(arg) {
      containerCtrl.setHasValue(!ngModelCtrl.$isEmpty(arg));
      return arg;
    }
    function inputCheckValue() {
      // An input's value counts if its length > 0,
      // or if the input's validity state says it has bad input (eg string in a number input)
      containerCtrl.setHasValue(element.val().length > 0 || (element[0].validity || {}).badInput);
    }
    function setupTextarea() {
      var node = element[0];
      var onChangeTextarea = $mdUtil.debounce(growTextarea, 1);
      var minTextareaHeight;
      function pipelineListener(value) {
        onChangeTextarea();
        return value;
      }
      if (ngModelCtrl) {
        ngModelCtrl.$formatters.push(pipelineListener);
        ngModelCtrl.$viewChangeListeners.push(pipelineListener);
      } else {
        onChangeTextarea();
      }
      element.on('keydown input', onChangeTextarea);
      element.on('scroll', onChangeTextarea);
      angular.element($window).on('resize', onChangeTextarea);
      scope.$on('$destroy', function () {
        angular.element($window).off('resize', onChangeTextarea);
      });
      function growTextarea() {
        node.style.height = 'auto';
        node.scrollTop = 0;
        var height = getHeight();
        if (height)
          node.style.height = height + 'px';
      }
      function getHeight() {
        var line = node.scrollHeight - node.offsetHeight;
        var height = Number(window.getComputedStyle(node)['height'].replace('px', ''));
        var lineHeight = Number(window.getComputedStyle(node)['line-height'].replace('px', ''));
        var newHeight = height + (line >= 0 ? line : lineHeight * -1);
        //cache the initial height that can be adjusted using 'rows'
        if (!minTextareaHeight) {
          minTextareaHeight = height;
        }
        if (newHeight <= minTextareaHeight) {
          return minTextareaHeight;
        } else {
          return newHeight;
        }
      }
      function onScroll(e) {
        node.scrollTop = 0;
        // for smooth new line adding
        var line = node.scrollHeight - node.offsetHeight;
        var height = node.offsetHeight + line;
        node.style.height = height + 'px';
      }
    }
  }
}
function mdMaxlengthDirective($animate) {
  return {
    restrict: 'A',
    require: [
      'ngModel',
      '^mdInputContainer'
    ],
    link: postLink
  };
  function postLink(scope, element, attr, ctrls) {
    var maxlength;
    var ngModelCtrl = ctrls[0];
    var containerCtrl = ctrls[1];
    var charCountEl = angular.element('<div class="md-char-counter">');
    // Stop model from trimming. This makes it so whitespace
    // over the maxlength still counts as invalid.
    attr.$set('ngTrim', 'false');
    containerCtrl.element.append(charCountEl);
    ngModelCtrl.$formatters.push(renderCharCount);
    ngModelCtrl.$viewChangeListeners.push(renderCharCount);
    element.on('input keydown', function () {
      renderCharCount();  //make sure it's called with no args
    });
    scope.$watch(attr.mdMaxlength, function (value) {
      maxlength = value;
      if (angular.isNumber(value) && value > 0) {
        if (!charCountEl.parent().length) {
          $animate.enter(charCountEl, containerCtrl.element, angular.element(containerCtrl.element[0].lastElementChild));
        }
        renderCharCount();
      } else {
        $animate.leave(charCountEl);
      }
    });
    ngModelCtrl.$validators['md-maxlength'] = function (modelValue, viewValue) {
      if (!angular.isNumber(maxlength) || maxlength < 0) {
        return true;
      }
      return (modelValue || element.val() || viewValue || '').length <= maxlength;
    };
    function renderCharCount(value) {
      charCountEl.text((element.val() || value || '').length + '/' + maxlength);
      return value;
    }
  }
}
function placeholderDirective($log) {
  var blackListElements = ['MD-SELECT'];
  return {
    restrict: 'A',
    require: '^^?mdInputContainer',
    priority: 200,
    link: postLink
  };
  function postLink(scope, element, attr, inputContainer) {
    if (!inputContainer)
      return;
    if (blackListElements.indexOf(element[0].nodeName) != -1)
      return;
    if (angular.isDefined(inputContainer.element.attr('md-no-float')))
      return;
    var placeholderText = attr.placeholder;
    element.removeAttr('placeholder');
    if (inputContainer.element.find('label').length == 0) {
      var placeholder = '<label ng-click="delegateClick()">' + placeholderText + '</label>';
      inputContainer.element.addClass('md-icon-float');
      inputContainer.element.prepend(placeholder);
    } else {
      $log.warn('The placeholder=\'' + placeholderText + '\' will be ignored since this md-input-container has a child label element.');
    }
  }
}// Static Look ups services used to retrieve static lookup data.
angular.module('core').service('settings', [
  '$q',
  'pouchDB',
  function ($q, pouchDB) {
    var db = pouchDB('WBCollect', { adapter: 'websql' });
    var service = {};
    service.apiLocation = false;
    service.$query = function () {
      var deferred = $q.defer();
      db.get('settings').then(function (doc) {
        service.apiLocation = doc.apiLocation;
        deferred.resolve(service.apiLocation);
      }).catch(function (err) {
        var newSetting = {
            _id: 'settings',
            table: 'settings',
            apiLocation: ''
          };
        db.put(newSetting).then(function (response) {
          service.apiLocation = response.apiLocation;
          deferred.resolve(service.apiLocation);
        });
      });
      return { $promise: deferred.promise };
    };
    service.$get = function (id) {
      var deferred = $q.defer();
      db.get('settings').then(function (doc) {
        service.apiLocation = doc.apiLocation;
        deferred.resolve(service.apiLocation);
      }).catch(function (err) {
        var newSetting = {
            _id: 'settings',
            table: 'settings',
            apiLocation: ''
          };
        db.put(newSetting).then(function (response) {
          service.apiLocation = response.apiLocation;
          deferred.resolve(service.apiLocation);
        });
      });
      return { $promise: deferred.promise };
    };
    service.$save = function (setting) {
      var deferred = $q.defer();
      db.get('settings').then(function (doc) {
        return db.put({
          _id: 'settings',
          table: 'settings',
          _rev: doc._rev,
          apiLocation: setting.Value
        });
      }).then(function (response) {
        deferred.resolve();
      }).catch(function (err) {
        console.log(err);
      });
      return { $promise: deferred.promise };
    };
    return service;
  }
]);'use strict';
//Menu service used for managing  menus
angular.module('core').service('Utilities', function () {
  this.indexOfObject = function (arr, obj) {
    for (var i = 0; i < arr.length; i++) {
      if (angular.equals(arr[i].text, obj)) {
        return i;
      }
    }
    return -1;
  };
  this.padMinutes = function (num, size) {
    var s = num + '';
    while (s.length < size)
      s = '0' + s;
    return s;
  };
  this.getRoundedTime = function () {
    var date = new Date();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    minutes = 5 * Math.round(minutes / 5);
    if (minutes < 10) {
      var mins = '0' + minutes.toString();
    } else {
      if (minutes == 60) {
        var hours = hours + 1;
        var mins = '00';
      } else {
        var mins = minutes.toString();
      }
    }
    if (hours < 10) {
      hours = '0' + hours.toString();
    } else {
      hours = hours.toString();
    }
    var time = hours + ':' + mins;
    return time;
  };
});'use strict';
//Menu service used for managing  menus
angular.module('core').service('Menus', [function () {
    // Define a set of default roles
    this.defaultRoles = ['*'];
    // Define the menus object
    this.menus = {};
    // A private function for rendering decision 
    var shouldRender = function (user) {
      if (user) {
        if (!!~this.roles.indexOf('*')) {
          return true;
        } else {
          for (var userRoleIndex in user.roles) {
            for (var roleIndex in this.roles) {
              if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
                return true;
              }
            }
          }
        }
      } else {
        return this.isPublic;
      }
      return false;
    };
    // Validate menu existance
    this.validateMenuExistance = function (menuId) {
      if (menuId && menuId.length) {
        if (this.menus[menuId]) {
          return true;
        } else {
          throw new Error('Menu does not exists');
        }
      } else {
        throw new Error('MenuId was not provided');
      }
      return false;
    };
    // Get the menu object by menu id
    this.getMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Return the menu object
      return this.menus[menuId];
    };
    // Add new menu object by menu id
    this.addMenu = function (menuId, isPublic, roles) {
      // Create the new menu
      this.menus[menuId] = {
        isPublic: isPublic || false,
        roles: roles || this.defaultRoles,
        items: [],
        shouldRender: shouldRender
      };
      // Return the menu object
      return this.menus[menuId];
    };
    // Remove existing menu object by menu id
    this.removeMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Return the menu object
      delete this.menus[menuId];
    };
    // Add menu item object
    this.addMenuItem = function (menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position, icon) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Push new menu item
      this.menus[menuId].items.push({
        title: menuItemTitle,
        link: menuItemURL,
        menuItemType: menuItemType || 'item',
        menuItemClass: menuItemType,
        uiRoute: menuItemUIRoute || '/' + menuItemURL,
        isPublic: isPublic === null || typeof isPublic === 'undefined' ? this.menus[menuId].isPublic : isPublic,
        roles: roles === null || typeof roles === 'undefined' ? this.menus[menuId].roles : roles,
        position: position || 0,
        items: [],
        icon: icon,
        shouldRender: shouldRender
      });
      // Return the menu object
      return this.menus[menuId];
    };
    // Add submenu item object
    this.addSubMenuItem = function (menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position, icon) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Search for menu item
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
          // Push new submenu item
          this.menus[menuId].items[itemIndex].items.push({
            title: menuItemTitle,
            link: menuItemURL,
            uiRoute: menuItemUIRoute || '/' + menuItemURL,
            isPublic: isPublic === null || typeof isPublic === 'undefined' ? this.menus[menuId].items[itemIndex].isPublic : isPublic,
            roles: roles === null || typeof roles === 'undefined' ? this.menus[menuId].items[itemIndex].roles : roles,
            position: position || 0,
            icon: icon,
            shouldRender: shouldRender
          });
        }
      }
      // Return the menu object
      return this.menus[menuId];
    };
    // Remove existing menu object by menu id
    this.removeMenuItem = function (menuId, menuItemURL) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
          this.menus[menuId].items.splice(itemIndex, 1);
        }
      }
      // Return the menu object
      return this.menus[menuId];
    };
    // Remove existing menu object by menu id
    this.removeSubMenuItem = function (menuId, submenuItemURL) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
          if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
            this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
          }
        }
      }
      // Return the menu object
      return this.menus[menuId];
    };
    //Adding the topbar menu
    this.addMenu('topbar');
  }]);'use strict';
// Configuring the Articles module
angular.module('events').run([
  'Menus',
  'Idle',
  function (Menus, Idle) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', 'Events', 'events', 'normal', '/events', false, ['*'], 0, 'fa-bookmark');
    Idle.watch();
  }
]).config(function (IdleProvider) {
  // ng-idle - configure Idle settings.
  IdleProvider.idle(300);
  // in seconds
  IdleProvider.timeout(30);  // in seconds
});'use strict';
//Setting up route
angular.module('events').config([
  '$stateProvider',
  function ($stateProvider) {
    // Activity groups state routing
    $stateProvider.state('listEvents', {
      url: '/events',
      templateUrl: 'modules/events/views/list-events.client.view.html'
    }).state('createEvent', {
      url: '/events/create',
      templateUrl: 'modules/events/views/event.client.view.html'
    }).state('viewEvent', {
      url: '/events/:EventId',
      templateUrl: 'modules/events/views/event.client.view.html'
    }).state('editEvent', {
      url: '/events/:EventId/edit',
      templateUrl: 'modules/events/views/event.client.view.html'
    });
  }
]);'use strict';
// Activities controller
angular.module('events').controller('EventsController', [
  '$scope',
  '$stateParams',
  '$state',
  'Events',
  'StaticLookup',
  '$location',
  'Login',
  '$rootScope',
  'Utilities',
  'Idle',
  function ($scope, $stateParams, $state, Events, StaticLookup, $location, Login, $rootScope, Utils, Idle) {
    // If not logged in the redirect the user back to the log in screen.
    if (!Login.loggedIn) {
      $state.go('login');
    }
    // If we have timed out due to inactivity then redirect the user back to the login screen.
    // This event is broadcast by ng-idle and is set up in event.client.config.js 
    $scope.$on('IdleTimeout', function () {
      $state.go('login');
    });
    // When synchronisation is complete then reload the event list.
    $scope.$on('sync-complete', function (event, args) {
      $scope.find();
    });
    $scope.wbevent = {};
    // Add a blank event to the view model.
    $scope.createBlankEvent = function () {
      var time = Utils.padMinutes(Utils.getRoundedTime(), 2);
      StaticLookup.query('times').$promise.then(function (response) {
        $scope.timeOpts = response;
        var timeFrom = $scope.timeOpts[Utils.indexOfObject($scope.timeOpts, time)];
        // Clear form fields
        $scope.wbevent = {
          WBNumber: '',
          Notes: '',
          Start: timeFrom,
          end: '',
          End: '',
          EventDate: moment().toDate(),
          CreatedDate: moment().toDate(),
          Uploaded: false,
          Error: false,
          ErrorText: '',
          User: Login.user
        };
      });
    };
    // Used by ng-if statements in events.client.view.html to determine if in create or edit state.
    $scope.currentState = function (stateToCheck) {
      stateToCheck = stateToCheck + 'Event';
      return $state.is(stateToCheck) ? true : false;
    };
    // Used by floating fab button (bottom right) in list-events.client.view to trigger new event and 
    // force the app to go to the 'createEvent' state that loads the view to enter the event details.
    $scope.createEvent = function () {
      $location.path('/events/create');
      $state.go('createEvent');
      $rootScope.showBack = true;
    };
    // Used when you click on an event in the list in list-events.client.view. This then loads the 'editEvent'
    // state that loads the view to edit the event details.
    $scope.loadEvent = function (id) {
      $rootScope.showBack = true;
      $state.go('editEvent', { EventId: id });
      $location.path('/events/' + id + '/edit');
    };
    // Calls find() that loads an array of events into $scope.wbevents
    $scope.loadEvents = function () {
      $scope.find();
    };
    // Listen to broadcast of sync-complete event. This trigger the reloading of the events in the list.
    // This should then refresh this list to only show events that have failed to be synchronised, if any.
    $scope.$on('sync-complete', function (event, args) {
      $scope.loadEvents();
    });
    $scope.init = function () {
      $scope.createBlankEvent();
    };
    // Used by datetime picker, if removed datetime picker will not work correctly.
    $scope.open = function ($event, opened) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope[opened] = true;
    };
    // Create new Event in the device storage.
    $scope.create = function () {
      var event = $scope.wbevent;
      var timeFrom = $scope.timeOpts[Utils.indexOfObject($scope.timeOpts, event.Start.text)];
      var timeTo = $scope.timeOpts[Utils.indexOfObject($scope.timeOpts, event.End.text)];
      event.Duration = (timeTo.id - timeFrom.id) * 5;
      // Redirect after save
      Events.$save(event).$promise.then(function (response) {
        $location.path('events');
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
    // Remove existing Event
    $scope.remove = function (event) {
      if ($scope.wbevents) {
        Events.$remove(event.EventId).$promise.then(function () {
          for (var i in $scope.wbevents) {
            if ($scope.wbevents[i] === event) {
              $scope.wbevents.splice(i, 1);
            }
          }
          $location.path('events');
        });
      } else {
        Events.$remove(event.EventId).$promise.then(function () {
          $location.path('events');
        });
      }
    };
    // Update existing Event
    $scope.update = function () {
      var event = $scope.wbevent;
      var timeFrom = $scope.timeOpts[Utils.indexOfObject($scope.timeOpts, event.Start.text)];
      var timeTo = $scope.timeOpts[Utils.indexOfObject($scope.timeOpts, event.End.text)];
      event.Duration = (timeTo.id - timeFrom.id) * 5;
      event.IsDirty = true;
      event.Error = false;
      event.ErrorText = '';
      Events.$update(event).$promise.then(function () {
        $location.path('events');
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
    // Get a list of Events that have not been uploaded and are for this user.
    $scope.find = function () {
      // Hide the back button on the toolbar.
      $rootScope.showBack = false;
      Events.$query().$promise.then(function (response) {
        $scope.wbevents = response;
      });
    };
    // Find existing Event based on the event id passed in on the route.
    $scope.findOne = function () {
      Events.$get({ EventId: $stateParams.EventId }).$promise.then(function (data) {
        $scope.wbevent = data;
        $scope.wbevent.Start = $scope.timeOpts[Utils.indexOfObject($scope.timeOpts, $scope.wbevent.Start.text)];
        $scope.wbevent.End = $scope.timeOpts[Utils.indexOfObject($scope.timeOpts, $scope.wbevent.End.text)];
        $scope.wbevent.Keyworker = $scope.lookupData.keyworkers[Utils.indexOfObject($scope.lookupData.keyworkers, $scope.wbevent.Keyworker.text)];
        $scope.wbevent.EventType = $scope.lookupData.eventTypes[Utils.indexOfObject($scope.lookupData.eventTypes, $scope.wbevent.EventType.text)];
        $scope.wbevent.Location = $scope.lookupData.locations[Utils.indexOfObject($scope.lookupData.locations, $scope.wbevent.Location.text)];
        $scope.wbevent.Status = $scope.lookupData.eventStatus[Utils.indexOfObject($scope.lookupData.eventStatus, $scope.wbevent.Status.text)];
      });
    };
    // This code directs the flow of execution to a function dependant on the route, i.e. edit or create.
    if ($state.is('editEvent')) {
      StaticLookup.query('times').$promise.then(function (response) {
        $scope.timeOpts = response;
        $scope.findOne();
        Idle.watch();
      });
    } else if ($state.is('createEvent')) {
      $scope.init();
      Idle.watch();
    }
    // -------------------------------- Event Start/End time validation ---------------------------------- //
    $scope.formErrors = false;
    // If the wbevent.Start value changes then call selectStart() function.
    $scope.$watch('wbevent.Start', function () {
      if ($scope.wbevent.Start) {
        $scope.selectStart();
      }
    });
    // If the wbevent.End value changes then call selectStart() function.
    $scope.$watch('wbevent.End', function () {
      if ($scope.wbevent.Start) {
        $scope.selectStart();
      }
    });
    // Check if the start time is before the end time if it is then stop the user from saving and display an error.
    $scope.selectStart = function () {
      var startTimeObj = $scope.timeOpts[Utils.indexOfObject($scope.timeOpts, $scope.wbevent.Start.text)];
      var startId = startTimeObj.id;
      var endTimeObj = $scope.timeOpts[Utils.indexOfObject($scope.timeOpts, $scope.wbevent.End.text)];
      if (endTimeObj) {
        var endId = endTimeObj.id;
        if (startId > endId) {
          $scope.formError = 'Start Time cannot be after End Time.';
          $scope.formErrors = true;
        } else {
          $scope.formErrors = false;
        }
      }
    };
    // --------------------- Load Lookups ---------------------------------------- // 
    $scope.lookupData = {};
    StaticLookup.query('eventStatus').$promise.then(function (response) {
      $scope.lookupData.eventStatus = response;
    });
    StaticLookup.query('eventTypes').$promise.then(function (response) {
      $scope.lookupData.eventTypes = response;
    });
    StaticLookup.query('locations').$promise.then(function (response) {
      $scope.lookupData.locations = response;
    });
    StaticLookup.query('keyworkers').$promise.then(function (response) {
      $scope.lookupData.keyworkers = response;
    });
  }
]);angular.module('events').directive('lowerThan', [
  'Utilities',
  function (Utils) {
    var link = function ($scope, $element, $attrs, ctrl) {
      var date = new Date(), interval = 5;
      date.setHours(0);
      date.setMinutes(0);
      var toTimes = [];
      for (var i = 0; i < 288; i++) {
        date.setMinutes(date.getMinutes() + interval);
        toTimes.push({
          text: date.getHours() + ':' + Utils.padMinutes(date.getMinutes(), 2),
          id: i
        });
      }
      var validate = function (viewValue) {
        var comparisonModel = $attrs.lowerThan;
        if (!viewValue || !comparisonModel) {
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
      $attrs.$observe('lowerThan', function (comparisonModel) {
        return validate(ctrl.$viewValue);
      });
    };
    return {
      require: 'ngModel',
      link: link
    };
  }
]);'use strict';
// Events service used to communicate Contracts REST endpoints.
// Used to post events to Web Bomic and to get lookup lists from Web Bomic.
angular.module('events').factory('WBEvent', [
  '$resource',
  'settings',
  function ($resource, settings) {
    var apiLocation = '';
    settings.$get('ApiLocation').$promise.then(function (value) {
      apiLocation = value;
    });
    return $resource(apiLocation + '/Events', {}, { update: { method: 'PUT' } });
  }
]);
// Event services used to perform CRUD/Sync operations on device storage.
angular.module('events').service('Events', [
  '$q',
  'Login',
  'WBEvent',
  '$rootScope',
  '$http',
  'settings',
  'pouchDB',
  '$timeout',
  function ($q, Login, WBEvent, $rootScope, $http, settings, pouchDB, $timeout) {
    var self = this;
    // Open the database.
    var db = pouchDB('WBCollect', { adapter: 'websql' });
    var wbEvents = [];
    // Return a list of all events that have not yet been uplaoded.
    this.$query = function () {
      var deferred = $q.defer();
      // Get a list of all events (all events have an id that starts with 'Item' e.g. Item1, Item2 etc...).
      // The endKey 'Item/uffff' is a wildcard search that will return all documents which have an id that starts with 'Item'.    
      db.allDocs({
        include_docs: true,
        startkey: 'Item',
        endkey: 'Item\uffff'
      }).then(function (results) {
        var eventsToReturn = [];
        // Loop through each event item returned and if it has not already been uploaded then add it to the array of events to return.
        angular.forEach(results.rows, function (event) {
          if (event.doc.uploaded === false) {
            // Before we can add it to the list to return we need to decrypt the data.
            var decryptedStr = Login.decrypt(event.doc.payload);
            var decryptedObj = JSON.parse(decryptedStr);
            decryptedObj.EventId = event.doc.EventId;
            decryptedObj.uploaded = event.doc.uploaded;
            // Only add the event to the list to return if the hash id stored on the event data matches the hash id of the currently logged in user.
            // Unfortunately we need to decrypt first before we can check this.
            if (decryptedObj.hash == Login.hash) {
              eventsToReturn.push(decryptedObj);
            }
          }
        });
        // Tell the promise we are done and pass in the list of events to return.    
        deferred.resolve(eventsToReturn);
      });
      return { $promise: deferred.promise };
    };
    // Save a NEW event.
    this.$save = function (wbEvent) {
      var deferred = $q.defer();
      // Set some properties on the event that the user could not enter.
      // Store the users hash id on the event. This is important as we will only retreive events where the event hash id matches the hash id of the logged in user.
      wbEvent.hash = Login.hash;
      wbEvent.EventDate = moment(wbEvent.EventDate).format('LL');
      wbEvent.Error = false;
      wbEvent.ErrorText = '';
      // Convert the event object to a string of JSON. 
      var eventStr = JSON.stringify(wbEvent);
      // Encrypt the event string. 
      var encObj = Login.encrypt(eventStr);
      var encStr = encObj.toString();
      // Get a list of all events (all events have an id that starts with 'Item' e.g. Item1, Item2 etc...).
      // The endKey 'Item/uffff' is a wildcard search that will return all documents which have an id that starts with 'Item'.
      // We are doing this so we can get the next event id to use as the document id.    
      db.allDocs({
        include_docs: false,
        startkey: 'Item',
        endkey: 'Item\uffff'
      }).then(function (results) {
        // Save the event to the device storage. 
        var eventId = results.rows.length + 1;
        db.put({
          _id: 'Item' + eventId,
          EventId: eventId,
          table: 'Events',
          payload: encStr,
          uploaded: false
        }).then(function () {
          deferred.resolve(wbEvent);
        }).catch(function (err) {
          console.log(err);
        });
      });
      return { $promise: deferred.promise };
    };
    // Update an EXISTING event.
    this.$update = function (wbEvent) {
      var deferred = $q.defer();
      var uploadedStatus = wbEvent.uploaded;
      // Format the date for storeage.
      wbEvent.EventDate = moment(wbEvent.EventDate).format('LL');
      // Convert the event object to a string of JSON. 
      var eventStr = JSON.stringify(wbEvent);
      // Encrypt the event string. 
      var encObj = Login.encrypt(eventStr);
      var encStr = encObj.toString();
      // Get the event from the document store. We need to do this in order to get the doc._rev property 
      // otherwise the db.put operation will think it is a new document and give us a key conflict.    
      var itemId = 'Item' + wbEvent.EventId;
      db.get(itemId).then(function (doc) {
        return db.put({
          _id: itemId,
          _rev: doc._rev,
          EventId: wbEvent.EventId,
          table: 'Events',
          payload: encStr,
          uploaded: uploadedStatus
        });
      }).then(function (response) {
        // Tell the promise we are done.
        deferred.resolve();
      }).catch(function (err) {
        console.log(err);
        deferred.resolve();
      });
      return { $promise: deferred.promise };
    };
    this.$sync = function () {
      var deferred = $q.defer();
      // Get a list of all events (all events have an id that starts with 'Item' e.g. Item1, Item2 etc...).
      // The endKey 'Item/uffff' is a wildcard search that will return all documents which have an id that starts with 'Item'.    
      db.allDocs({
        include_docs: true,
        startkey: 'Item',
        endkey: 'Item\uffff'
      }).then(function (events) {
        // Reset the total number of events to sync to zero. 
        var toSync = 0;
        // Count how many events that have not yet been uploaded and have the same hash id as the logged in user. 
        angular.forEach(events.rows, function (row) {
          if (row.doc.uploaded == false) {
            var ev = row.doc;
            var decryptedStr = Login.decrypt(ev.payload);
            var item = JSON.parse(decryptedStr);
            if (item.hash == Login.hash) {
              toSync = toSync + 1;
            }
          }
        });
        // If no events to sync then broadcast message that is picked up in the core.client.sync.controller    
        if (toSync === 0) {
          $rootScope.$broadcast('sync-nothing');
        } else {
          // Notifies the sync controller to start counting how many events have been synchronised.
          $rootScope.$broadcast('sync-start', toSync);
          // For each event that needs uploading, decrypt the data, create an object which contains the data to be uploaded and 
          // call the API to post it to Web Bomic.
          angular.forEach(events.rows, function (evItem) {
            if (evItem.doc.uploaded == false) {
              // Decrypt the event data.
              var event = evItem.doc;
              var decryptedStr = Login.decrypt(event.payload);
              var item = JSON.parse(decryptedStr);
              // Final check that the hash id of the event matches the hash id of the logged in user.
              if (item.hash == Login.hash) {
                // Create an object that stores the data we wish to send to Web Bomic.
                var eventItem = {
                    EventId: evItem.doc.EventId,
                    WBNumber: item.WBNumber,
                    EventDate: item.EventDate,
                    Start: item.Start.text,
                    End: item.End.text,
                    EventType: item.EventType.id,
                    Status: item.Status.id,
                    Keyworker: item.Keyworker.id,
                    Location: item.Location.id,
                    Notes: item.Notes,
                    Duration: item.Duration,
                    hash: Login.key,
                    uploaded: false,
                    User: item.User
                  };
                // Get the API location from the stored settings on the device.
                settings.$get('ApiLocation').$promise.then(function (returnedUrl) {
                  // Post the event to Web Bomic via the API.
                  $http.post(returnedUrl + '/Events', eventItem).success(function (data, status, headers, config) {
                    // Event was uploaded successfully so update the 'uploaded' flag to true.
                    item.uploaded = true;
                    self.$update(item).$promise.then(function () {
                      // Broadcast an event that is picked up the the sync controller. This tell the controller to 
                      // add 1 to the total of events successfully synchronised. 
                      $rootScope.$broadcast('sync-event-success');
                    });
                  }).error(function (data, status, headers, config) {
                    // Event failed to post to Web Bomic. Update the event with the details of the error.
                    item.Error = true;
                    item.ErrorText = data.Message;
                    item.uploaded = false;
                    if (item.EventId === undefined) {
                      item.EventId = evItem.doc.EventId;
                    }
                    self.$update(item).$promise.then(function () {
                      $rootScope.$broadcast('sync-event-fail');
                    });
                  });
                });
              }
            }
          });
        }
      });
      return deferred.promise;
    };
    // Get an event based on the id passed in.
    this.$get = function (idObj) {
      var deferred = $q.defer();
      var id = parseInt(idObj.EventId);
      // The id passed in is just a number so add the 'Item' prefix to it, otherwise nothing will be returned.
      db.get('Item' + id, { include_docs: true }).then(function (result) {
        // Decrypt the event data.    
        var decryptedStr = Login.decrypt(result.payload);
        var decryptedObj = JSON.parse(decryptedStr);
        var event = decryptedObj;
        event.EventDate = moment(event.EventDate).toDate();
        event.EventId = result.EventId;
        event.uploaded = result.uploaded;
        // Tell the promise we are done and pass in the event to return.
        deferred.resolve(event);
      });
      return { $promise: deferred.promise };
    };
  }
]);'use strict';
// Static Look ups services used to retrieve static lookup data.
angular.module('general-lookups').factory('StaticLookup', [
  '$resource',
  'settings',
  '$q',
  '$rootScope',
  'pouchDB',
  function ($resource, settings, $q, $rootScope, pouchDB) {
    var db = pouchDB('WBCollect', { adapter: 'websql' });
    // Load any static data that is defined on the client side into arrays attached to the lookupData object.
    var lookupData = {};
    lookupData.eventTypes = [
      {
        id: 1,
        text: 'Key Working'
      },
      {
        id: 2,
        text: 'Home Visit'
      }
    ];
    lookupData.locations = [
      {
        id: 1,
        text: 'Location 1'
      },
      {
        id: 2,
        text: 'Location 2'
      }
    ];
    lookupData.keyWorkers = [
      {
        id: 1,
        text: 'Key Worker 1'
      },
      {
        id: 2,
        text: 'Key Worker 2'
      }
    ];
    lookupData.eventStatus = [
      {
        id: 1,
        text: 'OK'
      },
      {
        id: 2,
        text: 'Cancelled by Client'
      }
    ];
    lookupData.times = [];
    function padMinutes(num, size) {
      var s = num + '';
      while (s.length < size)
        s = '0' + s;
      return s;
    }
    ;
    function loadLookupArrays() {
      var date = new Date(), interval = 5;
      date.setHours(0);
      date.setMinutes(0);
      lookupData.times = [];
      for (var i = 0; i < 288; i++) {
        date.setMinutes(date.getMinutes() + interval);
        lookupData.times.push({
          text: padMinutes(date.getHours(), 2) + ':' + padMinutes(date.getMinutes(), 2),
          id: i
        });
      }
      settings.$get().$promise.then(function (apiLocation) {
        // Load any $resource services and query their data to load a static list into an array attached to the lookupData object.
        var eventTypesService = $resource(apiLocation + '/EventTypes', {}, {
            query: {
              method: 'GET',
              params: {},
              isArray: true
            }
          });
        eventTypesService.query().$promise.then(function (apiResults) {
          var resultArray = [];
          // Delete all old lookup values, by getting them all and then marking them as _deleted: true.                                        
          db.allDocs({
            include_docs: true,
            startkey: 'EventType',
            endkey: 'EventType\uffff'
          }).then(function (results) {
            if (results.rows.length > 1) {
              // Add the _deleted flag to all returned items.    
              angular.forEach(results.rows, function (resultItem) {
                resultItem._deleted = true;
              });
              // Bulk update all the items marked as deleted by calling bulkDocs and passing in the updated documents.
              db.bulkDocs(results.rows).then(function (result) {
                // Re-populate the EventTypes documents from the results from the API.
                angular.forEach(apiResults, function (resultItem) {
                  var updatedDocs = [];
                  var item = {
                      _id: 'EventType' + resultItem.etype1,
                      table: 'EventTypes',
                      keyvalue: resultItem.etype1,
                      text: resultItem.name
                    };
                  updatedDocs.push(item);
                  db.bulkDocs(updatedDocs);
                  var arrayItem = {
                      id: resultItem.etype1,
                      text: resultItem.name
                    };
                  resultArray.push(arrayItem);
                });
                lookupData.eventTypes = resultArray;
              }).catch(function (err) {
                console.log('general-lookup.service: failed to delete event types');
              });
            } else {
              // Re-populate the EventTypes documents from the results from the API.
              angular.forEach(apiResults, function (resultItem) {
                var updatedDocs = [];
                var item = {
                    _id: 'EventType' + resultItem.etype1,
                    table: 'EventTypes',
                    keyvalue: resultItem.etype1,
                    text: resultItem.name
                  };
                updatedDocs.push(item);
                db.bulkDocs(updatedDocs);
                var arrayItem = {
                    id: resultItem.etype1,
                    text: resultItem.name
                  };
                resultArray.push(arrayItem);
              });
              lookupData.eventTypes = resultArray;
            }
          }).catch(function (err) {
            console.log('general-lookup.service: failed to query event types');
          });
        }, function () {
          // Get all values from local storeage as querying the API has failed.
          db.allDocs({
            include_docs: true,
            startkey: 'EventType',
            endkey: 'EventType\uffff'
          }).then(function (results) {
            var resultArray = [];
            // Re-populate the EventTypes documents from the results from the local store.
            angular.forEach(results.rows, function (resultItem) {
              var arrayItem = {
                  id: resultItem.doc.keyvalue,
                  text: resultItem.doc.text
                };
              resultArray.push(arrayItem);
            });
            lookupData.eventTypes = resultArray.sort(function (a, b) {
              var textA = a.text.toUpperCase();
              var textB = b.text.toUpperCase();
              return textA < textB ? -1 : textA > textB ? 1 : 0;
            });
          });
        });
        // Load any $resource services and query their data to load a static list into an array attached to the lookupData object.
        var eventStatusService = $resource(apiLocation + '/EventStatus', {}, {
            query: {
              method: 'GET',
              params: {},
              isArray: true
            }
          });
        eventStatusService.query().$promise.then(function (apiResults) {
          var resultArray = [];
          // Delete all old lookup values, by getting them all and then marking them as _deleted: true.                                        
          db.allDocs({
            include_docs: true,
            startkey: 'EventStatus',
            endkey: 'EventStatus\uffff'
          }).then(function (results) {
            if (results.rows.length > 1) {
              // Add the _deleted flag to all returned items.    
              angular.forEach(results.rows, function (resultItem) {
                resultItem._deleted = true;
              });
              // Bulk update all the items marked as deleted by calling bulkDocs and passing in the updated documents.
              db.bulkDocs(results.rows).then(function (result) {
                // Re-populate the EventTypes documents from the results from the API.
                angular.forEach(apiResults, function (resultItem) {
                  var updatedDocs = [];
                  var item = {
                      _id: 'EventStatus' + resultItem.estatus1,
                      table: 'EventStatus',
                      keyvalue: resultItem.estatus1,
                      text: resultItem.name
                    };
                  updatedDocs.push(item);
                  db.bulkDocs(updatedDocs);
                  var arrayItem = {
                      id: resultItem.estatus1,
                      text: resultItem.name
                    };
                  resultArray.push(arrayItem);
                });
                lookupData.eventStatus = resultArray;
              }).catch(function (err) {
                console.log('general-lookup.service: failed to delete event status');
              });
            } else {
              // Re-populate the lokkup documents from the results from the API.
              angular.forEach(apiResults, function (resultItem) {
                var updatedDocs = [];
                var item = {
                    _id: 'EventStatus' + resultItem.estatus1,
                    table: 'EventStatus',
                    keyvalue: resultItem.estatus1,
                    text: resultItem.name
                  };
                updatedDocs.push(item);
                db.bulkDocs(updatedDocs);
                var arrayItem = {
                    id: resultItem.estatus1,
                    text: resultItem.name
                  };
                resultArray.push(arrayItem);
              });
              lookupData.eventStatus = resultArray;
            }
          }).catch(function (err) {
            console.log('general-lookup.service: failed to query event status');
          });
        }, function () {
          // Get all values from local storeage as querying the API has failed.
          db.allDocs({
            include_docs: true,
            startkey: 'EventStatus',
            endkey: 'EventStatus\uffff'
          }).then(function (results) {
            var resultArray = [];
            // Re-populate the EventTypes documents from the results from the local store.
            angular.forEach(results.rows, function (resultItem) {
              var arrayItem = {
                  id: resultItem.doc.keyvalue,
                  text: resultItem.doc.text
                };
              resultArray.push(arrayItem);
            });
            lookupData.eventStatus = resultArray.sort(function (a, b) {
              var textA = a.text.toUpperCase();
              var textB = b.text.toUpperCase();
              return textA < textB ? -1 : textA > textB ? 1 : 0;
            });
          });
        });
        // Load any $resource services and query their data to load a static list into an array attached to the lookupData object.
        var locationsService = $resource(apiLocation + '/EventLocations', {}, {
            query: {
              method: 'GET',
              params: {},
              isArray: true
            }
          });
        locationsService.query().$promise.then(function (apiResults) {
          var resultArray = [];
          // Delete all old lookup values, by getting them all and then marking them as _deleted: true.                                        
          db.allDocs({
            include_docs: true,
            startkey: 'EventLocation',
            endkey: 'EventLocation\uffff'
          }).then(function (results) {
            if (results.rows.length > 1) {
              // Add the _deleted flag to all returned items.    
              angular.forEach(results.rows, function (resultItem) {
                resultItem._deleted = true;
              });
              // Bulk update all the items marked as deleted by calling bulkDocs and passing in the updated documents.
              db.bulkDocs(results.rows).then(function (result) {
                // Re-populate the EventTypes documents from the results from the API.
                angular.forEach(apiResults, function (resultItem) {
                  var updatedDocs = [];
                  var item = {
                      _id: 'EventLocation' + resultItem.evloc1,
                      table: 'EventLocations',
                      keyvalue: resultItem.evloc1,
                      text: resultItem.name
                    };
                  updatedDocs.push(item);
                  db.bulkDocs(updatedDocs);
                  var arrayItem = {
                      id: resultItem.evloc1,
                      text: resultItem.name
                    };
                  resultArray.push(arrayItem);
                });
                lookupData.locations = resultArray;
              }).catch(function (err) {
                console.log('general-lookup.service: failed to delete event location');
              });
            } else {
              // Re-populate the lokkup documents from the results from the API.
              angular.forEach(apiResults, function (resultItem) {
                var updatedDocs = [];
                var item = {
                    _id: 'EventLocation' + resultItem.evloc1,
                    table: 'EventLocations',
                    keyvalue: resultItem.evloc1,
                    text: resultItem.name
                  };
                updatedDocs.push(item);
                db.bulkDocs(updatedDocs);
                var arrayItem = {
                    id: resultItem.evloc1,
                    text: resultItem.name
                  };
                resultArray.push(arrayItem);
              });
              lookupData.locations = resultArray;
            }
          }).catch(function (err) {
            console.log('general-lookup.service: failed to query event location');
          });
        }, function () {
          // Get all values from local storeage as querying the API has failed.
          db.allDocs({
            include_docs: true,
            startkey: 'EventLocation',
            endkey: 'EventLocation\uffff'
          }).then(function (results) {
            var resultArray = [];
            // Re-populate the EventTypes documents from the results from the local store.
            angular.forEach(results.rows, function (resultItem) {
              var arrayItem = {
                  id: resultItem.doc.keyvalue,
                  text: resultItem.doc.text
                };
              resultArray.push(arrayItem);
            });
            lookupData.locations = resultArray.sort(function (a, b) {
              var textA = a.text.toUpperCase();
              var textB = b.text.toUpperCase();
              return textA < textB ? -1 : textA > textB ? 1 : 0;
            });
          });
        });
        // Load any $resource services and query their data to load a static list into an array attached to the lookupData object.
        var keyworkersService = $resource(apiLocation + '/Keyworkers', {}, {
            query: {
              method: 'GET',
              params: {},
              isArray: true
            }
          });
        keyworkersService.query().$promise.then(function (apiResults) {
          var resultArray = [];
          // Delete all old lookup values, by getting them all and then marking them as _deleted: true.                                        
          db.allDocs({
            include_docs: true,
            startkey: 'Keyworker',
            endkey: 'Keyworker\uffff'
          }).then(function (results) {
            if (results.rows.length > 1) {
              // Add the _deleted flag to all returned items.    
              angular.forEach(results.rows, function (resultItem) {
                resultItem._deleted = true;
              });
              // Bulk update all the items marked as deleted by calling bulkDocs and passing in the updated documents.
              db.bulkDocs(results.rows).then(function (result) {
                // Re-populate the EventTypes documents from the results from the API.
                angular.forEach(apiResults, function (resultItem) {
                  var updatedDocs = [];
                  var item = {
                      _id: 'Keyworker' + resultItem.keyw1,
                      table: 'Keyworkers',
                      keyvalue: resultItem.keyw1,
                      text: resultItem.name
                    };
                  updatedDocs.push(item);
                  db.bulkDocs(updatedDocs);
                  var arrayItem = {
                      id: resultItem.keyw1,
                      text: resultItem.name
                    };
                  resultArray.push(arrayItem);
                });
                lookupData.keyworkers = resultArray;
              }).catch(function (err) {
                console.log('general-lookup.service: failed to delete keyworkers');
              });
            } else {
              // Re-populate the lokkup documents from the results from the API.
              angular.forEach(apiResults, function (resultItem) {
                var updatedDocs = [];
                var item = {
                    _id: 'Keyworker' + resultItem.keyw1,
                    table: 'Keyworkers',
                    keyvalue: resultItem.keyw1,
                    text: resultItem.name
                  };
                updatedDocs.push(item);
                db.bulkDocs(updatedDocs);
                var arrayItem = {
                    id: resultItem.keyw1,
                    text: resultItem.name
                  };
                resultArray.push(arrayItem);
              });
              lookupData.keyworkers = resultArray;
            }
          }).catch(function (err) {
            console.log('general-lookup.service: failed to query keyworkers');
          });
        }, function () {
          // Get all values from local storage as querying the API has failed.
          db.allDocs({
            include_docs: true,
            startkey: 'Keyworker',
            endkey: 'Keyworker\uffff'
          }).then(function (results) {
            var resultArray = [];
            // Re-populate the keyworkers array from the results from the local store.
            angular.forEach(results.rows, function (resultItem) {
              var arrayItem = {
                  id: resultItem.doc.keyvalue,
                  text: resultItem.doc.text
                };
              resultArray.push(arrayItem);
            });
            lookupData.keyworkers = resultArray.sort(function (a, b) {
              var textA = a.text.toUpperCase();
              var textB = b.text.toUpperCase();
              return textA < textB ? -1 : textA > textB ? 1 : 0;
            });
          });
        });
      });
    }
    function getQueryData(arrayName) {
      return lookupData[arrayName];
    }
    // Internal function to get an item from an array by
    function getItemFromArrayById(arrayToSearch, id) {
      var returnVal = null;
      // Try to find a match by id.
      angular.forEach(lookupData[arrayToSearch], function (item) {
        if (item['id'] == id)
          returnVal = item;
      });
      // Find by id failed so try to find a match by text.
      if (returnVal === null) {
        // Try to find a match by text.
        angular.forEach(lookupData[arrayToSearch], function (item) {
          if (item['text'] == id)
            returnVal = item;
        });
      }
      return returnVal;
    }
    loadLookupArrays();
    return {
      query: function (arrayToQuery) {
        var deferred = $q.defer();
        deferred.resolve(getQueryData(arrayToQuery));
        return { $promise: deferred.promise };
      },
      get: function (arrayToQuery, id) {
        var deferred = $q.defer();
        var returnVal = getItemFromArrayById(arrayToQuery, id);
        if (returnVal === null) {
          deferred.reject();
        } else {
          deferred.resolve(returnVal);
        }
        return { $promise: deferred.promise };
      },
      loadArrays: loadLookupArrays
    };
  }
]);'use strict';
// Configuring the Articles module
angular.module('events').run(function () {
  FastClick.attach(document.body);
});'use strict';
//Setting up route
angular.module('security').config([
  '$stateProvider',
  function ($stateProvider) {
    $stateProvider.state('login', {
      url: '/login-offline',
      templateUrl: 'modules/security/views/security.login.client.view.html'
    });
  }
]);'use strict';
// Security controller
angular.module('security').controller('SecurityLoginController', [
  '$scope',
  '$timeout',
  'Login',
  '$mdToast',
  'settings',
  'StaticLookup',
  '$mdDialog',
  'pouchDB',
  function ($scope, $timeout, Login, $mdToast, settings, StaticLookup, $mdDialog, pouchDB) {
    settings.$get('ApiLocation');
    $scope.passcode = '';
    $scope.username = '';
    $scope.loggingIn = false;
    // Ensure user is logged out before checking if they are logged in.
    Login.logOut();
    $scope.localLogin = false;
    // Create temporary key for encryption/decryption (Hash in Hex), as soon as user logs out or times out then this is reset to ''
    // var key = CryptoJS.enc.Hex.parse(hash.toString(CryptoJS.enc.Hex));
    // var iv  = CryptoJS.enc.Hex.parse('101112131415161718191a1b1c1d1e1f');
    // // Encrypt using temporary key.
    // var encrypted = CryptoJS.AES.encrypt("A Quick Brown Fox", key, {iv:iv} );
    // // Decrypt using temporary key which is only correct and populated if user is logged in.
    // var decrypted = CryptoJS.AES.decrypt(encrypted, key, {iv:iv} ).toString(CryptoJS.enc.Utf8);
    // Strategy for checking logins this requires JCryption.JS and JCryptionNet
    // 1. Server - Generate public and private keys for RSA on server.
    // 3. Server - Set default pin (say 9999) in DB.
    // 3. Client - User types in UserName and Default Pin (e.g. "Blithe","9999")
    // 4. Client - Encrypt both username and pin using public key.
    // 5. Server - Check that username and pin match DB.
    // Strategy for changing pins this requires JCryption.JS and JCryptionNet
    // Client - User Logs In - See strategy above.
    // Client - User clicks change pin and types username in old pin and new pin
    // Client - Encrypt username, old pin and new pin using public key.
    // Server - Check if username and old pin match db, if they do then store encrypted new pin in db.
    $scope.clearPin = function () {
      $scope.passcode = '';
      $scope.passcode1 = '';
      $scope.passcode2 = '';
      $scope.passcode3 = '';
      $scope.passcode4 = '';
    };
    // Called when user types in the 4th digit into the pin code.
    $scope.checkcreds = function (redirect) {
      $scope.loggingIn = true;
      // Hash of username and PIN stored in memory, as soon as user logs out or times out then this is reset to ''
      Login.logIn($scope.username.trim(), $scope.passcode, redirect).then(function (message) {
        $scope.loggingIn = true;
        $scope.message = message;
        $scope.localLogin = true;
      }, function (message) {
        $scope.loggingIn = false;
        $scope.localLogin = false;
        $mdToast.show($mdToast.simple().content(message).position('bottom').hideDelay(3000));
      });
    };
    // Add a number to the pin code string.
    $scope.add = function (value, redirect) {
      if ($scope.passcode.length < 4) {
        $scope.passcode = $scope.passcode + value;
        $scope.passcode1 = $scope.passcode.substring(0, 1);
        $scope.passcode2 = $scope.passcode.substring(2, 1);
        $scope.passcode3 = $scope.passcode.substring(3, 2);
        $scope.passcode4 = $scope.passcode.substring(4, 3);
        if ($scope.passcode.length == 4) {
          $timeout(function () {
            $scope.checkcreds(redirect);
          }, 50);
        } else {
          $scope.message = '';
        }
      }
    };
    // Delete a number from the pin code string.
    $scope.delete = function () {
      if ($scope.passcode.length > 0) {
        $scope.passcode = $scope.passcode.substring(0, $scope.passcode.length - 1);
        $scope.passcode1 = $scope.passcode.substring(0, 1);
        $scope.passcode2 = $scope.passcode.substring(2, 1);
        $scope.passcode3 = $scope.passcode.substring(3, 2);
        $scope.passcode4 = $scope.passcode.substring(4, 3);
        $scope.message = '';
      }
    };
    $scope.hide = function () {
      $mdDialog.hide();
    };
    $scope.save = function () {
      var db = pouchDB('WBCollect', { adapter: 'websql' });
      db.destroy();
      $mdToast.show($mdToast.simple().content('Data has been destroyed').position('bottom').hideDelay(3000));
      $mdDialog.hide();
    };
  }
]);//Contracts service used to communicate Contracts REST endpoints
angular.module('security').factory('Auth', [
  '$resource',
  'settings',
  function ($resource, settings) {
    var apiLocation = '';
    settings.$get('ApiLocation').$promise.then(function (value) {
      apiLocation = value;
    });
    return $resource(apiLocation + '/Authentication', {}, { update: { method: 'PUT' } });
  }
]);// Static Look ups services used to retrieve static lookup data.
angular.module('security').factory('Login', [
  '$http',
  '$q',
  '$location',
  'Auth',
  'settings',
  'pouchDB',
  function ($http, $q, $location, Authentication, settings, pouchDB) {
    var db = pouchDB('WBCollect', { adapter: 'websql' });
    var service = {
        loggedIn: false,
        key: '',
        hash: '',
        user: ''
      };
    var error = false;
    var encryptPassword = function (password, salt) {
      return Rjindel(password + salt);
    };
    var hash = function (payload) {
      // Hash whatever passed over.
      return CryptoJS.SHA256(payload);
    };
    service.encrypt = function (payload) {
      // Create temporary key for encryption/decryption (Hash in Hex), as soon as user logs out or times out then this is reset to ''
      var key = CryptoJS.enc.Hex.parse(service.key);
      var iv = CryptoJS.enc.Hex.parse('101112131415161718191a1b1c1d1e1f');
      // Encrypt using temporary key.
      var encrypted = CryptoJS.AES.encrypt(payload, key, { iv: iv });
      return encrypted;
    };
    service.decrypt = function (payload) {
      // Create temporary key for encryption/decryption (Hash in Hex), as soon as user logs out or times out then this is reset to ''
      var key = CryptoJS.enc.Hex.parse(service.key);
      var iv = CryptoJS.enc.Hex.parse('101112131415161718191a1b1c1d1e1f');
      // Encrypt using temporary key.
      var decrypted = CryptoJS.AES.decrypt(payload, key, { iv: iv }).toString(CryptoJS.enc.Utf8);
      return decrypted;
    };
    service.logIn = function (username, pin, redirect) {
      var deferred = $q.defer();
      username = username.toLowerCase();
      var authAPI = {};
      authAPI.username = username;
      authAPI.pin = pin;
      settings.$get().$promise.then(function (apiLocation) {
        $http.post(apiLocation + '/Authentication', authAPI).success(function (userResponse, status, headers, config) {
          var key = CryptoJS.enc.Hex.parse(userResponse.hash);
          var iv = CryptoJS.enc.Hex.parse('101112131415161718191a1b1c1d1e1f');
          var encryptedCreds = CryptoJS.AES.encrypt(username.trim() + pin, key, { iv: iv }).toString(CryptoJS.enc.Utf8);
          // Hash of username and PIN stored in memory, as soon as user logs out or times out then this is reset to ''
          var hashedCreds = hash(encryptedCreds);
          var user = { HashId: userResponse.hash };
          service.loggedIn = true;
          service.key = hashedCreds;
          service.hash = userResponse.hash;
          service.user = username;
          // Add a new user to the users table.
          var newUser = {
              _id: user.HashId,
              table: 'users',
              HashId: user.HashId
            };
          db.put(newUser);
          // Logged in successfully so redirect to events view.
          if (redirect === true) {
            $location.path('/events');
          }
          deferred.resolve('Success');
        }).error(function (data, status, headers, config) {
          var newhash = hash(username.trim() + pin);
          var key = CryptoJS.enc.Hex.parse(newhash.toString());
          var iv = CryptoJS.enc.Hex.parse('101112131415161718191a1b1c1d1e1f');
          var encryptedCreds = CryptoJS.AES.encrypt(username.trim() + pin, key, { iv: iv }).toString(CryptoJS.enc.Utf8);
          // Hash of username and PIN stored in memory, as soon as user logs out or times out then this is reset to ''
          var hashedCreds = hash(encryptedCreds);
          db.allDocs({
            include_docs: true,
            attachments: true,
            key: newhash.toString()
          }).then(function (result) {
            if (result.rows.length > 0) {
              if (newhash.toString() == result.rows[0].key) {
                service.loggedIn = true;
                service.key = hashedCreds;
                service.hash = newhash.toString();
                service.user = username;
                if (redirect === true) {
                  $location.path('/events');
                }
                deferred.resolve('Success');
              }
            } else {
              error = { message: 'Invalid Credentials or Not Connected to WB' };
              service.key = '';
              service.hash = '';
              service.loggedIn = false;
              service.user = '';
              $location.path('/login-offline');
              deferred.reject(error.message);
            }  // handle result
          }).catch(function (err) {
            error = { message: 'Invalid Credentials or Not Connected to WB' };
            service.key = '';
            service.hash = '';
            service.loggedIn = false;
            service.user = '';
            $location.path('/login-offline');
            deferred.reject(error.message);
          });
        });
      });
      return deferred.promise;
    };
    service.logOut = function () {
      service.loggedIn = false;
      service.key = '';
      $location.path('/login-offline');
    };
    return service;
  }
]);