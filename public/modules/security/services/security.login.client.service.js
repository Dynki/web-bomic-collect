// Static Look ups services used to retrieve static lookup data.
angular.module('security').factory('Login', ['$http', '$q', '$location', 'Auth', 'settings', 'pouchDB',
    function($http, $q, $location, Authentication, settings, pouchDB) {

        var db = pouchDB('WBCollect', {adapter : 'websql'});

        var service = {
            loggedIn: false,
            key: '',
            hash: '',
            user: ''
        };

        var error = false;

        var encryptPassword = function(password, salt){
            return Rjindel(password + salt);
        };

        var hash = function(payload){
            // Hash whatever passed over.
            return CryptoJS.SHA256(payload);
        };

        service.encrypt = function(payload){
            // Create temporary key for encryption/decryption (Hash in Hex), as soon as user logs out or times out then this is reset to ''
            var key = CryptoJS.enc.Hex.parse(service.key);
            var iv  = CryptoJS.enc.Hex.parse('101112131415161718191a1b1c1d1e1f');

            // Encrypt using temporary key.
            var encrypted = CryptoJS.AES.encrypt(payload, key, {iv:iv});

            return encrypted;
        };

        service.decrypt = function(payload){
            // Create temporary key for encryption/decryption (Hash in Hex), as soon as user logs out or times out then this is reset to ''
            var key = CryptoJS.enc.Hex.parse(service.key);
            var iv  = CryptoJS.enc.Hex.parse('101112131415161718191a1b1c1d1e1f');

            // Encrypt using temporary key.
            var decrypted = CryptoJS.AES.decrypt(payload, key, {iv:iv}).toString(CryptoJS.enc.Utf8);

            return decrypted;
        };

        service.logIn = function(username, pin, redirect){
            var deferred = $q.defer();

            username = username.toLowerCase();    

            var authAPI = {};
            authAPI.username = username;
            authAPI.pin = pin;

            settings.$get().$promise.then(function(apiLocation) {
                $http.post(apiLocation + '/Authentication', authAPI).
                    success(function(userResponse, status, headers, config) {
                        var key = CryptoJS.enc.Hex.parse(userResponse.hash);
                        var iv  = CryptoJS.enc.Hex.parse('101112131415161718191a1b1c1d1e1f');

                        var encryptedCreds = CryptoJS.AES.encrypt(username.trim()+pin, key, {iv:iv} ).toString(CryptoJS.enc.Utf8);

                        // Hash of username and PIN stored in memory, as soon as user logs out or times out then this is reset to ''
                        var hashedCreds = hash(encryptedCreds);

                        var user ={
                            HashId: userResponse.hash
                        };

                        service.loggedIn = true;
                        service.key = hashedCreds;
                        service.hash = userResponse.hash;
                        service.user = username;

                        // Add a new user to the users table.
                        var newUser = {_id: user.HashId, table: 'users', HashId: user.HashId};
                        db.put(newUser);

                        // Logged in successfully so redirect to events view.
                        if (redirect === true){
                            $location.path('/events');
                        }
                        
                        deferred.resolve("Success");
                    }).
                    error(function(data, status, headers, config) {
                        var newhash = hash(username.trim()+pin);

                        var key = CryptoJS.enc.Hex.parse(newhash.toString());
                        var iv  = CryptoJS.enc.Hex.parse('101112131415161718191a1b1c1d1e1f');

                        var encryptedCreds = CryptoJS.AES.encrypt(username.trim()+pin, key, {iv:iv} ).toString(CryptoJS.enc.Utf8);

                        // Hash of username and PIN stored in memory, as soon as user logs out or times out then this is reset to ''
                        var hashedCreds = hash(encryptedCreds);

                        db.allDocs({
                            include_docs: true, 
                            attachments: true,
                            key: newhash.toString()
                        }).then(function (result) {
                            
                            if (result.rows.length >0){
                                if (newhash.toString() == result.rows[0].key){
                                    service.loggedIn = true;
                                    service.key = hashedCreds;
                                    service.hash = newhash.toString();
                                    service.user = username;
                                    
                                    if (redirect === true) {
                                        $location.path('/events');
                                    }
                                    
                                    deferred.resolve("Success");
                                }
                            } else {
                                
                                error = {message: 'Invalid Credentials or Not Connected to WB'};
                                service.key = '';
                                service.hash = '';
                                service.loggedIn = false;
                                service.user = '';
                                $location.path('/login-offline');
                                deferred.reject(error.message);
                                
                            }
                            
                            // handle result
                        }).catch(function (err) {
                            
                            error = {message: 'Invalid Credentials or Not Connected to WB'};
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

        service.logOut = function(){
            service.loggedIn = false;
            service.key = '';
            $location.path('/login-offline');
        };

        return service;
    }
]);


