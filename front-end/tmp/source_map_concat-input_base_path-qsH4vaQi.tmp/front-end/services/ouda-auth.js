define('front-end/services/ouda-auth', ['exports', 'npm:crypto-browserify'], function (exports, _npmCryptoBrowserify) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Service.extend({
    router: Ember.inject.service(),
    key: 'SE3350b Winter 2016',
    userAccountName: null,
    encryptedPassword: null,
    isAuthenticated: false,
    store: Ember.inject.service(),
    isLoginRequested: false,
    userCList: null,
    isAdmin: false,
    isPhysiotherapist: false,
    isPatient: false,
    getRole: function getRole() {
      if (this.get('userCList')) {
        return this.get('userCList').substring(0, 2);
      } else {
        return null;
      }
    },
    getPerson: function getPerson() {
      if (this.get('userCList')) {
        return this.get('userCList').substring(2, 26);
      } else {
        return null;
      }
    },
    getUserAccount: function getUserAccount() {
      if (this.get('userCList')) {
        return this.get('userCList').substring(26, 50);
      } else {
        return null;
      }
    },

    getName: Ember.computed(function () {
      var identity = localStorage.getItem('sas-session-id');
      if (identity) {
        return this.decrypt(identity);
      } else {
        return null;
      }
    }),
    setName: function setName(name) {
      this.set('userAccountName', name.toLowerCase());
      var identity = this.encrypt(this.get('userAccountName'));
      localStorage.setItem('sas-session-id', identity);
    },
    setPassword: function setPassword(password) {
      this.set('encryptedPassword', this.hash(password));
    },
    hash: function hash(text) {
      var hash = _npmCryptoBrowserify.default.createHash('sha256');
      hash.update(text);
      return hash.digest('binary');
    },
    encrypt: function encrypt(plainText) {
      var cipher = _npmCryptoBrowserify.default.createCipher('aes256', 'SE3350b Winter 2016');
      var crypted = cipher.update(plainText, 'ascii', 'binary');
      crypted += cipher.final('binary');
      return crypted;
    },
    decrypt: function decrypt(cipherText) {
      if (!cipherText) {
        return '';
      }
      var decipher = _npmCryptoBrowserify.default.createDecipher('aes256', this.get('key'));
      var dec = decipher.update(cipherText, 'binary', 'ascii');
      dec += decipher.final('ascii');
      return dec;
    },
    open: function open(name, password) {
      var self = this;
      var myStore = self.get('store');

      var loginRequest = myStore.createRecord('login', {
        userAccountName: name,
        password: null,
        nonce: null,
        response: null,
        token: null,
        requestType: 'open',
        wrongUserAccountName: null,
        wrongPassword: null,
        passwordMustChanged: null,
        passwordReset: null,
        loginFailed: null,
        accountIsDisabeld: null,
        sessionIsActive: null
      });
      return loginRequest.save().then(function (serverResponse) {
        console.log('serverResponse:');
        console.log(JSON.stringify(serverResponse));
        if (serverResponse.get('loginFailed')) {
          self.close(name);
          throw new Error('Login failed...');
        } else if (serverResponse.get('wrongUserAccountName')) {
          throw new Error('User Account Name does not exist.');
        } else if (serverResponse.get('accountIsDisabled')) {
          console.log('Account is disabled.');
          throw new Error('Your account is disabled.');
        } else {
          var NONCE = self.encrypt(serverResponse.get('nonce'));
          self.set('encryptedPassword', self.hash(password));
          var clientResponse = myStore.createRecord('login', {
            userAccountName: name,
            password: self.get('encryptedPassword'),
            nonce: null,
            response: NONCE,
            token: null,
            requestType: 'openResponse',
            wrongUserAccountName: null,
            wrongPassword: null,
            passwordMustChanged: null,
            passwordReset: null,
            loginFailed: null,
            accountIsDisabled: null,
            sessionIsActive: null
          });

          return clientResponse.save().then(function (serverResponse2) {
            if (serverResponse2.get('loginFailed')) {
              throw new Error('Login failed...');
            } else if (serverResponse2.get('wrongPassword')) {
              throw new Error('Incorrect Password.');
            } else if (serverResponse2.get('passwordReset')) {
              throw new Error('Your password must be reset.');
            } else {
              self.setName(name);
              var userRole = self.decrypt(serverResponse2.get('token'));
              self.set('isAuthenticated', true);
              self.set('userCList', userRole);
              if (self.getRole() === 'ad') {
                self.set('isPhysiotherapist', false);
                self.set('isPatient', false);
                self.set('isAdmin', true);
              } else if (self.getRole() === 'ph') {
                self.set('isAdmin', false);
                self.set('isPatient', false);
                self.set('isPhysiotherapist', true);
              } else {
                self.set('isAdmin', false);
                self.set('isPhysiotherapist', false);
                self.set('isPatient', true);
              }
            }
          });
        }
      });
    },
    fetch: function fetch() {
      var self = this;
      var identity = localStorage.getItem('sas-session-id');
      if (identity) {
        var name = self.decrypt(identity);
        self.set('userAccountName', name);
        var myStore = self.get('store');
        var fetchRequest = myStore.createRecord('login', {
          userAccountName: name,
          password: null,
          nonce: null,
          response: null,
          requestType: 'fetch'
        });
        return fetchRequest.save().then(function (serverResponse) {
          if (serverResponse.get('loginFailed')) {
            self.close(name);
            throw new Error('fetchFailed');
          } else {
            var NONCE = self.encrypt(serverResponse.get('nonce'));
            var clientResponse = myStore.createRecord('login', {
              userAccountName: name,
              password: null,
              nonce: null,
              response: NONCE,
              requestType: 'fetchResponse'
            });
            return clientResponse.save();
          }
        }).then(function (givenToken) {
          if (givenToken.get('loginFailed')) {
            self.close(name);
            throw new Error('fetchFailed');
          } else {
            var plainToken = self.decrypt(givenToken.get('token'));
            self.set('isAuthenticated', true);
            self.set('userCList', plainToken);
            if (self.getRole() === 'ad') {
              self.set('isPhysiotherapist', false);
              self.set('isPatient', false);
              self.set('isAdmin', true);
            } else if (self.getRole() === 'ph') {
              self.set('isAdmin', false);
              self.set('isPatient', false);
              self.set('isPhysiotherapist', true);
            } else {
              self.set('isAdmin', false);
              self.set('isPhysiotherapist', false);
              self.set('isPatient', true);
            }
            return plainToken;
          }
        });
      } else {
        throw new Error('userNotActive');
      }
    },
    close: function close(user) {
      var self = this;
      var myStore = this.get('store');

      window.localStorage.setItem('sas-session-id', '');
      this.set('userCList', null);
      this.set('getName', null);
      this.set('userAccountName', null);
      this.set('encryptedPassword', null);
      this.set('isAuthenticated', false);
      this.set('isLoginRequested', false);
      this.set('isAdmin', false);
      this.set('isPhysiotherapist', false);
      this.set('isPatient', false);

      myStore.findAll('login', { reload: true }).then(function (logins) {
        logins.forEach(function (record) {
          if (record.get('userAccountName') === user) {
            record.destroyRecord();
          }
        });
        self.get('router').transitionTo('home');
      });
    }
  });
});