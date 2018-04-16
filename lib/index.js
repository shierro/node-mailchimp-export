'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
  eslint-disable no-restricted-syntax,
  no-prototype-builtins,
  no-useless-escape,
  guard-for-in,
  quotes
*/
var request = require('request');

var MailchimpExport = function () {
  function MailchimpExport(apiKey) {
    _classCallCheck(this, MailchimpExport);

    var apiKeyRegex = /.+\-.+/;
    if (!apiKeyRegex.test(apiKey)) {
      throw new Error('missing or invalid api key: ' + apiKey);
    }
    this.apiKey = apiKey;
    this.baseUrl = 'https://' + apiKey.split('-')[1] + '.api.mailchimp.com/export/1.0';
  }

  _createClass(MailchimpExport, [{
    key: 'serializeObject',
    value: function serializeObject(obj) {
      var str = [];
      for (var p in obj) {
        str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
      }
      return str.join('&');
    }
  }, {
    key: 'validateParams',
    value: function validateParams(params) {
      if ((typeof params === 'undefined' ? 'undefined' : _typeof(params)) !== 'object') {
        throw new Error('params must be an object');
      }
      if (!params.id) {
        throw new Error('id not found');
      }
      return true;
    }
  }, {
    key: 'parseRawList',
    value: function parseRawList(rawExport) {
      var membersWithFields = rawExport.split('\n'); // eslint-disable-line
      /* fields are in the first row */
      var fields = JSON.parse(membersWithFields.splice(0, 1));
      return membersWithFields.map(function (member) {
        var memberInArray = JSON.parse(member);
        var memberWithFields = {};
        fields.forEach(function (field, index) {
          memberWithFields[field] = memberInArray[index];
        });
        return memberWithFields;
      });
    }
  }, {
    key: 'listMembers',
    value: function listMembers(params) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        var rawList = '';
        _this.getFromExportApi('list', params).on('data', function (chunk) {
          var parsedChunk = chunk.toString('utf8');
          rawList += parsedChunk;
        }).on('complete', function () {
          return resolve(_this.parseRawList(rawList.trim()));
        }).on('error', reject);
      });
    }
  }, {
    key: 'campaignSubscriberActivity',
    value: function campaignSubscriberActivity(params) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        var rawArray = [];
        _this2.getFromExportApi('campaignSubscriberActivity', params).on('data', function (buffer) {
          return rawArray.push(buffer.toString('utf8'));
        }).on('complete', function () {
          var rawString = rawArray.join('').trim();
          var subscribers = !rawString ? [] : rawString.split('\n').map(JSON.parse);
          return resolve(subscribers);
        }).on('error', reject);
      });
    }
  }, {
    key: 'getFromExportApi',
    value: function getFromExportApi(domain, params) {
      this.validateParams(params);
      var queryString = this.serializeObject(_extends({}, params, { apikey: this.apiKey }));
      var requestUrl = this.baseUrl + '/' + domain + '?' + queryString;
      return request.get(requestUrl);
    }
  }]);

  return MailchimpExport;
}();

module.exports = MailchimpExport;
