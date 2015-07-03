'use strict';

// Security controller
angular.module('security').controller('SecurityLoginController', ['$scope','$timeout','Login','$mdToast','settings','StaticLookup', '$mdDialog', 'pouchDB',
    function($scope, $timeout, Login, $mdToast, settings, StaticLookup, $mdDialog, pouchDB) {

        settings.$get('ApiLocation');

        $scope.passcode = "";
        $scope.username = "";
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

        $scope.clearPin = function(){
            $scope.passcode = "";

            $scope.passcode1 = '';
            $scope.passcode2 = '';
            $scope.passcode3 = '';
            $scope.passcode4 = '';
        };

        // Called when user types in the 4th digit into the pin code.
        $scope.checkcreds = function(redirect){
            $scope.loggingIn = true;

            // Hash of username and PIN stored in memory, as soon as user logs out or times out then this is reset to ''
            Login.logIn($scope.username.trim(),$scope.passcode, redirect).then(function(message){
                $scope.loggingIn = true;
                $scope.message = message;
                $scope.localLogin = true;
            },function(message){
                $scope.loggingIn = false;
                $scope.localLogin = false;
                $mdToast.show(
                    $mdToast.simple()
                        .content(message)
                        .position('bottom')
                        .hideDelay(3000)
                );
            });
        };

        // Add a number to the pin code string.
        $scope.add = function(value, redirect) {
            if($scope.passcode.length < 4) {
                $scope.passcode = $scope.passcode + value;

                $scope.passcode1 = $scope.passcode.substring(0,1);
                $scope.passcode2 = $scope.passcode.substring(2,1);
                $scope.passcode3 = $scope.passcode.substring(3,2);
                $scope.passcode4 = $scope.passcode.substring(4,3);

                if($scope.passcode.length == 4) {
                    $timeout(function() {
                        $scope.checkcreds(redirect);
                    }, 50);
                } else {
                    $scope.message = "";
                }
            }
        };

        // Delete a number from the pin code string.
        $scope.delete = function() {
            if($scope.passcode.length > 0) {
                $scope.passcode = $scope.passcode.substring(0, $scope.passcode.length - 1);

                $scope.passcode1 = $scope.passcode.substring(0,1);
                $scope.passcode2 = $scope.passcode.substring(2,1);
                $scope.passcode3 = $scope.passcode.substring(3,2);
                $scope.passcode4 = $scope.passcode.substring(4,3);

                $scope.message = "";
            }
        }

        $scope.hide = function() {
            $mdDialog.hide();
        };

        $scope.save = function(){
	       var db = pouchDB('WBCollect', {adapter : 'websql'});
	       db.destroy();
            $mdToast.show(
                $mdToast.simple()
                    .content('Data has been destroyed')
                    .position('bottom')
                    .hideDelay(3000)
            );
            $mdDialog.hide();
        };

    }
]);
