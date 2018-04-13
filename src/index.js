/* eslint-disable no-restricted-syntax, no-prototype-builtins, no-useless-escape, guard-for-in */
const request = require('request');

class MailchimpExport {
  constructor(apiKey) {
    const apiKeyRegex = /.+\-.+/;
    if (!apiKeyRegex.test(apiKey)) {
      throw new Error(`missing or invalid api key: ${apiKey}`);
    }
    this.apiKey = apiKey;
    this.baseUrl = `https://${apiKey.split('-')[1]}.api.mailchimp.com/export/1.0`;
  }

  serializeObject(obj) {
    const str = [];
    for (const p in obj) {
      str.push(`${encodeURIComponent(p)}=${encodeURIComponent(obj[p])}`);
    }
    return str.join('&');
  }

  validateParams(params) {
    if (typeof params !== 'object') {
      throw new Error('params must be an object');
    }
    if (!params.id) {
      throw new Error('id not found');
    }
    return true;
  }

  list(params) {
    return this.getFromExportApi('list', params);
  }

  campaignSubscriberActivity(params) {
    return this.getFromExportApi('campaignSubscriberActivity', params);
  }

  getFromExportApi(domain, params) {
    this.validateParams(params);
    const queryString = this.serializeObject({ ...params, apikey: this.apiKey });
    return request.get(`${this.baseUrl}/${domain}?${queryString}`);
  }
}

module.exports = MailchimpExport;
