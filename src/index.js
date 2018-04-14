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

  parseRawList(rawExport) {
    const membersWithFields = rawExport.split(`\n`); // eslint-disable-line
    /* fields are in the first row */
    const fields = JSON.parse(membersWithFields.splice(0, 1));
    return membersWithFields.map((member) => {
      const memberInArray = JSON.parse(member);
      const memberWithFields = {};
      fields.forEach((field, index) => {
        memberWithFields[field] = memberInArray[index];
      });
      return memberWithFields;
    });
  }

  listMembers(params) {
    return new Promise((resolve, reject) => {
      let rawList = '';
      this.getFromExportApi('list', params)
        .on('data', (chunk) => {
          const parsedChunk = chunk.toString('utf8');
          rawList += parsedChunk;
        })
        .on('complete', () => {
          require('fs').writeFileSync('listMembers.txt', rawList);
          return resolve(this.parseRawList(rawList.trim()));
        })
        .on('error', reject);
    });
  }

  campaignSubscriberActivity(params) {
    return this.getFromExportApi('campaignSubscriberActivity', params);
  }

  campaignSubscriberActivityBulk(params) {
    return new Promise((resolve, reject) => {
      const subscriberList = [];
      this.getFromExportApi('campaignSubscriberActivity', params)
        .on('data', chunk => subscriberList.push(JSON.parse(chunk.toString('utf8'))))
        .on('complete', () => resolve(subscriberList))
        .on('error', reject);
    });
  }

  getFromExportApi(domain, params) {
    this.validateParams(params);
    const queryString = this.serializeObject({ ...params, apikey: this.apiKey });
    const requestUrl = `${this.baseUrl}/${domain}?${queryString}`;
    return request.get(requestUrl);
  }
}

module.exports = MailchimpExport;
