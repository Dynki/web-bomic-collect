'use strict';

//Menu service used for managing  menus
angular.module('core').service('Utilities', function() {

    this.indexOfObject = function(arr, obj){
        for(var i = 0; i < arr.length; i++){
            if(angular.equals(arr[i].text, obj)){
                return i;
            }
        }
        return -1;
    };

    this.padMinutes = function(num, size) {
        var s = num+"";
        while (s.length < size) s = "0" + s;
        return s;
    };

    this.getRoundedTime = function(){

        var date = new Date();

        var hours = date.getHours();
        var minutes = date.getMinutes();

        minutes = 5 * Math.round( minutes / 5 );

        if (minutes < 10)
        {
            var mins = '0' + minutes.toString();
        }else{
            if(minutes == 60){
                var hours = hours +1;
                var mins = '00';
            }else{
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
});
