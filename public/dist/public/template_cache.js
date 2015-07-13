angular.module('templates-main', ['modules/core/views/core.client.basic-panel.html', 'modules/core/views/core.client.clear-data.view.html', 'modules/core/views/core.client.mega-menu.html', 'modules/core/views/core.client.settings.html', 'modules/core/views/core.client.sync.html', 'modules/core/views/core.client.version.view.html', 'modules/core/views/date-picker-dialog.html', 'modules/core/views/date-picker-input.html', 'modules/core/views/header.client.sidebar.html', 'modules/core/views/header.client.view.html', 'modules/core/views/home.client.view.html', 'modules/events/views/event.client.view.html', 'modules/events/views/list-events.client.view.html', 'modules/security/views/security.login.client.view.html']);

angular.module("modules/core/views/core.client.basic-panel.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/core/views/core.client.basic-panel.html",
    "<div class=row><div class=col-md-12><form class=form-horizontal novalidate><div class=\"panel panel-primary\"><div class=panel-heading><h3 class=panel-title>{{panelTitle}}</h3></div><div class=panel-body><div class=\"row left-indent\"><div class=col-md-12><div ng-transclude></div></div></div></div></div></form></div></div>");
}]);

angular.module("modules/core/views/core.client.clear-data.view.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/core/views/core.client.clear-data.view.html",
    "<md-dialog aria-label=Settings style=\"min-width: 600px; min-height:450px\"><md-content layout=column class=md-padding layout-align=\"center center\"><div class=md-headline>Clear Data</div><div layout-sm=column layout-gt-sm=row layout-align=\"center center\" layout-fill flex><div layout=column layout-align=\"center center\" flex><div class=welcome-banner>Enter Credentials</div><md-input-container><label>Username</label><input id=inputUserName ng-model=username></md-input-container></div><div layout=column layout-align=\"center center\" flex layout-fill><div layout=column layout-align=\"center center\"><div layout=row class=\"md-padding pin-labels col-center\"><input class=pin-label ng-model=passcode1 ng-disabled=true readonly> <input class=pin-label ng-model=passcode2 ng-disabled=true readonly> <input class=pin-label ng-model=passcode3 ng-disabled=true readonly> <input class=pin-label ng-model=passcode4 ng-disabled=true readonly></div><div layout=row><md-button id=btnAdd1 class=\"md-raised md-primary btn-pin\" ng-click=\"add(1, false)\">1</md-button><md-button id=btnAdd2 class=\"md-raised md-primary btn-pin\" ng-click=\"add(2, false)\">2</md-button><md-button id=btnAdd3 class=\"md-raised md-primary btn-pin\" ng-click=\"add(3, false)\">3</md-button></div><div layout=row><md-button id=btnAdd4 class=\"md-raised md-primary btn-pin\" ng-click=\"add(4, false)\">4</md-button><md-button id=btnAdd5 class=\"md-raised md-primary btn-pin\" ng-click=\"add(5, false)\">5</md-button><md-button id=btnAdd6 class=\"md-raised md-primary btn-pin\" ng-click=\"add(6, false)\">6</md-button></div><div layout=row><md-button id=btnAdd7 class=\"md-raised md-primary btn-pin\" ng-click=\"add(7, false)\">7</md-button><md-button id=btnAdd8 class=\"md-raised md-primary btn-pin\" ng-click=\"add(8, false)\">8</md-button><md-button id=btnAdd9 class=\"md-raised md-primary btn-pin\" ng-click=\"add(9, false)\">9</md-button></div><div layout=row><md-button class=\"md-raised md-primary btn-pin\" ng-disabled=true></md-button><md-button id=btnAdd0 class=\"md-raised md-primary btn-pin\" ng-click=\"add(0, false)\">0</md-button><md-button id=btnDelete class=\"md-raised md-primary btn-pin\" ng-click=delete()><i class=\"fa fa-arrow-left\"></i></md-button></div></div></div><br></div><div class=md-actions><md-button ng-click=save() class=\"md-raised md-primary\" ng-disabled=!localLogin>Clear Data</md-button><span flex></span><md-button ng-click=hide() class=\"md-raised md-warn\">Cancel</md-button></div></md-content></md-dialog>");
}]);

angular.module("modules/core/views/core.client.mega-menu.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/core/views/core.client.mega-menu.html",
    "<div><aside id=left-panel class=\"sidebar pull-left hidden-xs left-panel\"><nav><ul class=\"nav nav-list\"><li data-ng-repeat=\"item in menu.items | orderBy: 'position'\" ng-switch=item.menuItemType ui-route={{item.uiRoute}} ng-class=\"{active: ($uiRoute && !item.expanded)}\" class=multi-menu><a ng-switch-when=topitem ng-click=expandSubmenu(item)><i class=\"fa fa-lg fa-fw {{item.icon}}\"></i> <span ng-show=expandedMenu data-ng-bind=item.title></span> <b ng-show=expandedMenu data-ng-if=item.items; class=collapse-sign><div ng-show=!item.expanded><em class=\"fa fa-plus-square-o\"></em></div><div ng-show=item.expanded><em class=\"fa fa-minus-square-o\"></em></div></b></a><ul ng-switch-when=topitem collapse=!item.expanded><li data-ng-repeat=\"subitem in item.items | orderBy: 'position'\" ui-route={{subitem.uiRoute}} ng-class=\"{active: $uiRoute}\"><a href=/#!/{{subitem.link}} data-ng-bind=subitem.title></a></li></ul><a ng-switch-default href=/#!/{{item.link}}><i class=\"fa fa-lg fa-fw {{item.icon}}\"></i> <span ng-show=expandedMenu class=menu-item-main data-ng-bind=item.title></span></a></li></ul></nav><div ng-transclude></div></aside></div>");
}]);

angular.module("modules/core/views/core.client.settings.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/core/views/core.client.settings.html",
    "<md-dialog aria-label=Settings style=\"min-width: 400px\"><md-content layout=column class=md-padding layout-align=\"center center\"><div class=md-headline>Settings</div><lx-text-field label=\"API Location\" style=\"min-width: 300px\"><input ng-model=ApiLocation required></lx-text-field><div class=md-actions><md-button ng-click=save() class=md-primary>Save</md-button><span flex></span><md-button ng-click=hide() class=md-warn>Cancel</md-button></div></md-content></md-dialog>");
}]);

angular.module("modules/core/views/core.client.sync.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/core/views/core.client.sync.html",
    "<md-dialog aria-label=\"List dialog\"><md-content layout=column class=md-padding layout-align=\"center center\"><md-progress-linear md-mode=indeterminate></md-progress-linear><div class=\"md-display-2 md-padding\" style=\"padding-left: 20px\">Synchronising Events</div><div class=md-actions></div></md-content></md-dialog>");
}]);

angular.module("modules/core/views/core.client.version.view.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/core/views/core.client.version.view.html",
    "<md-dialog aria-label=Version style=\"min-width: 300px\"><md-content layout=column class=md-padding layout-align=\"center center\"><div class=md-headline>Version</div><md-input-container><label>1.1.3</label></md-input-container><div class=md-actions><md-button ng-click=hide() class=md-primary>Close</md-button></div></md-content></md-dialog>");
}]);

angular.module("modules/core/views/date-picker-dialog.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/core/views/date-picker-dialog.html",
    "<md-dialog class=mdc-date-picker><div md-theme={{mdTheme}}><md-toolbar class=\"md-hue-2 mdc-date-picker__current-day-of-week\" layout-align=\"center center\"><span>{{ moment(selected.date).format('dddd') }}</span></md-toolbar><md-toolbar class=mdc-date-picker__current-date><div layout=row layout-align=\"center center\"><span class=date-picker-labels>{{ moment(selected.date).format('MMM') }}</span> <strong class=date-picker-labels>{{ moment(selected.date).format('DD') }}</strong><div class=date-picker-labels ng-click=displayYearSelection()>{{ moment(selected.date).format('YYYY') }}</div></div></md-toolbar><div class=mdc-date-picker__calendar ng-if=!yearSelection><div class=mdc-date-picker__nav><md-button class=\"md-fab md-primary\" aria-label=\"Previous month\" ng-click=previousMonth()><i class=\"mdi mdi-chevron-left\"></i></md-button><span>{{ activeDate.format('MMMM YYYY') }}</span><md-button class=\"md-fab md-primary\" arial-label=\"Next month\" ng-click=nextMonth()><i class=\"mdi mdi-chevron-right\"></i></md-button></div><div class=mdc-date-picker__days-of-week><span ng-repeat=\"day in daysOfWeek\">{{ day }}</span></div><div class=mdc-date-picker__days><span class=\"mdc-date-picker__day mdc-date-picker__day--is-empty\" ng-repeat=\"x in emptyFirstDays\">&nbsp;</span><div class=mdc-date-picker__day ng-class=\"{ 'mdc-date-picker__day--is-selected': day.selected,\n" +
    "                                     'mdc-date-picker__day--is-today': day.today }\" ng-repeat=\"day in days\"><a ng-click=select(day)>{{ day ? day.format('D') : '' }}</a></div><span class=\"mdc-date-picker__day mdc-date-picker__day--is-empty\" ng-repeat=\"x in emptyLastDays\">&nbsp;</span></div></div><div class=mdc-date-picker__year-selector ng-show=yearSelection><a class=mdc-date-picker__year ng-class=\"{ 'mdc-date-picker__year--is-active': year == activeDate.format('YYYY') }\" ng-repeat=\"year in years\" ng-click=selectYear(year) ng-if=yearSelection><span>{{year}}</span></a></div></div></md-dialog>");
}]);

angular.module("modules/core/views/date-picker-input.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/core/views/date-picker-input.html",
    "<md-input-container ng-click=openPicker($event)><label>{{label}}</label><input class=date-picker-control ng-model=selected.model ng-disabled=true ng-click=openPicker($event)></md-input-container>");
}]);

angular.module("modules/core/views/header.client.sidebar.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/core/views/header.client.sidebar.html",
    "<div layout=column tabindex=-1 layout-fill flex ng-controller=HeaderController></div>");
}]);

angular.module("modules/core/views/header.client.view.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/core/views/header.client.view.html",
    "");
}]);

angular.module("modules/core/views/home.client.view.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/core/views/home.client.view.html",
    "<section data-ng-controller=HomeController ng-init=checkLoggedIn()><div class=row><div class=\"col-sm-12 col-md-12 col-lg-11\"><div class=\"jumbotron jumbotron-header text-center\"><div class=row><div class=\"col-md-6 col-md-offset-3 col-sm-6 col-sm-offset-3 col-xs-12\"><img alt=MSI class=\"img-responsive text-center\" src=\"modules/core/img/brand/marie-stopes-logo.png\"></div></div><br><div class=row><p class=lead>Blithe Systems - Marie Stopes Rapid Prototyping using a MEAN Stack</p></div></div><div><h2>Welcome to the Blithe Systems prototype for MSI</h2><p>This prototype is intended to provide proof of concepts for the following</p><ul><li>Financial Elements (Service Providers, Services, Activities, Contracts etc...)</li></ul><br><p>Click <a href=/#!/signin>Sign In</a> or if not already registered <a href=/#!/signup>Sign Up</a> to get started</p></div></div><div class=\"col-sm-0 col-md-0 col-lg-1\"></div></div></section>");
}]);

angular.module("modules/events/views/event.client.view.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/events/views/event.client.view.html",
    "<div layout=column flex data-ng-controller=EventsController><md-toolbar class=\"demo-toolbar md-default-theme\"><div class=md-toolbar-tools><div layout=column layout-align=\"start center\"><span class=ng-binding>Event Details</span> <span id=showcode class=showcode><md-button id=btnCreate ng-if=\"currentState('create')\" class=\"md-fab md-primary md-fab-top-right event-button\" aria-label=\"\" ng-click=create() ng-disabled=\"eventForm.$invalid || formErrors\"><md-icon md-svg-src=lib/font-awesome-svg-png/white/svg/floppy-o.svg></md-icon></md-button><md-button id=btnUpdate ng-if=\"currentState('edit')\" class=\"md-fab md-primary md-fab-top-right event-button\" aria-label=\"\" ng-click=update() ng-disabled=\"eventForm.$invalid || formError\"><md-icon md-svg-src=lib/font-awesome-svg-png/white/svg/floppy-o.svg></md-icon></md-button></span></div><div layout=column flex layout-align=\"end end\"></div></div></md-toolbar><md-whiteframe class=\"md-whiteframe-z1 md-padding\" layout=column layout-fill flex><md-toolbar class=\"md-primary event-error-banner\" ng-show=formErrors><h2 class=md-toolbar-tools><span>{{formError}}</span></h2></md-toolbar><md-content layout-fill><form name=eventForm><lx-text-field label=\"WB Number\"><input ng-model=wbevent.WBNumber required></lx-text-field><div layout=row layout-sm=column><md-input-container flex><label>Event Date</label><input id=inputEventDate type=date ng-model=wbevent.EventDate required></md-input-container><div layout=column flex><label class=select-label>Start Time</label><select class=md-select-replica ng-model=wbevent.Start ng-options=\"time.text for time in timeOpts\" required><option value=\"\" ng-if=!foo></option></select></div><div layout=column flex><label class=select-label>End Time</label><select class=md-select-replica ng-model=wbevent.End ng-options=\"time.text for time in timeOpts\" required><option value=\"\" ng-if=!foo></option></select></div></div><div layout-gt-sm=row layout-sm=column><div layout=column flex><label class=select-label>Keyworker</label><select class=md-select-replica ng-model=wbevent.Keyworker ng-options=\"keyworker.text for keyworker in lookupData.keyworkers\" required><option value=\"\" ng-if=!foo></option></select></div><div layout=column flex><label class=select-label>Event Type</label><select class=md-select-replica ng-model=wbevent.EventType ng-options=\"option.text for option in lookupData.eventTypes\" required><option value=\"\" ng-if=!foo></option></select></div><div layout=column flex><label class=select-label>Location</label><select class=md-select-replica ng-model=wbevent.Location ng-options=\"option.text for option in lookupData.locations\" required><option value=\"\" ng-if=!foo></option></select></div><div layout=column flex><label class=select-label>Status</label><select class=md-select-replica ng-model=wbevent.Status ng-options=\"option.text for option in lookupData.eventStatus\" required><option value=\"\" ng-if=!foo></option></select></div></div><lx-text-field label=\"Event Notes\"><textarea ng-model=wbevent.Notes required></textarea></lx-text-field></form></md-content></md-whiteframe></div>");
}]);

angular.module("modules/events/views/list-events.client.view.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/events/views/list-events.client.view.html",
    "<div layout=column layout-fill flex data-ng-controller=EventsController data-ng-init=find()><nav class=position:relative><md-button id=btnAddEvent class=\"md-fab md-fab-bottom-right md-accent\" aria-label=\"Add Event\" ng-click=createEvent()><md-icon md-svg-src=lib/font-awesome-svg-png/white/svg/plus.svg></md-icon></md-button></nav><md-toolbar class=\"demo-toolbar md-default-theme\"><div class=md-toolbar-tools><div layout=row layout-align=\"start center\"><span class=ng-binding>Events</span></div></div></md-toolbar><md-whiteframe class=\"md-whiteframe-z1 md-padding\" layout=column><md-content><section><md-list><md-item ng-repeat=\"wbevent in wbevents \"><md-item-content ng-click=loadEvent(wbevent.EventId)><div class=md-tile-left><img clng-src=modules/events/img/notes.jpg class=\"face circular\"></div><div class=md-tile-content><h3 ng-hide=wbevent.Error>WB Number: {{wbevent.WBNumber}}</h3><h3 ng-show=wbevent.Error class=eventError>WB Number: {{wbevent.WBNumber + ' : ' + wbevent.ErrorText}}</h3><h4>Event Date: {{wbevent.EventDate}}</h4><p>{{wbevent.Notes.substr(0,50)}}</p></div></md-item-content></md-item></md-list></section></md-content></md-whiteframe></div>");
}]);

angular.module("modules/security/views/security.login.client.view.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/security/views/security.login.client.view.html",
    "<div ng-controller=SecurityLoginController><md-progress-linear md-mode=indeterminate ng-show=loggingIn></md-progress-linear><div layout-sm=column layout-gt-sm=row layout-align=\"center center\" layout-fill flex><div layout=column layout-align=\"center center\" flex><h1 class=welcome-banner>Welcome</h1><div class=welcome-banner>Enter Credentials</div><md-input-container><label>Username</label><input id=inputUserName ng-model=username></md-input-container></div><div layout=column layout-align=\"center center\" flex layout-fill><div hide-sm><br><br><br></div><div layout=column layout-align=\"center center\"><div layout=row class=\"md-padding pin-labels col-center\"><input class=pin-label ng-model=passcode1 ng-disabled=true readonly> <input class=pin-label ng-model=passcode2 ng-disabled=true readonly> <input class=pin-label ng-model=passcode3 ng-disabled=true readonly> <input class=pin-label ng-model=passcode4 ng-disabled=true readonly></div><div layout=row><md-button id=btnAdd1 class=\"md-raised md-primary btn-pin\" ng-click=\"add(1, true)\">1</md-button><md-button id=btnAdd2 class=\"md-raised md-primary btn-pin\" ng-click=\"add(2, true)\">2</md-button><md-button id=btnAdd3 class=\"md-raised md-primary btn-pin\" ng-click=\"add(3, true)\">3</md-button></div><div layout=row><md-button id=btnAdd4 class=\"md-raised md-primary btn-pin\" ng-click=\"add(4, true)\">4</md-button><md-button id=btnAdd5 class=\"md-raised md-primary btn-pin\" ng-click=\"add(5, true)\">5</md-button><md-button id=btnAdd6 class=\"md-raised md-primary btn-pin\" ng-click=\"add(6, true)\">6</md-button></div><div layout=row><md-button id=btnAdd7 class=\"md-raised md-primary btn-pin\" ng-click=\"add(7, true)\">7</md-button><md-button id=btnAdd8 class=\"md-raised md-primary btn-pin\" ng-click=\"add(8, true)\">8</md-button><md-button id=btnAdd9 class=\"md-raised md-primary btn-pin\" ng-click=\"add(9, true)\">9</md-button></div><div layout=row><md-button class=\"md-raised md-primary btn-pin\" ng-disabled=true></md-button><md-button id=btnAdd0 class=\"md-raised md-primary btn-pin\" ng-click=\"add(0, true)\">0</md-button><md-button id=btnDelete class=\"md-raised md-primary btn-pin\" ng-click=delete()><i class=\"fa fa-arrow-left\"></i></md-button></div></div></div></div></div>");
}]);
