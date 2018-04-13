/* eslint-disable no-underscore-dangle */
const MailchimpExport = require('./index');
const { expect } = require('chai');

describe('src/index.js - Instance', () => {
  it('should create new instance without fail', () => {
    const MAILCHIMP_TOKEN = 'testToken-us17';
    const mailchimpExport = new MailchimpExport(MAILCHIMP_TOKEN);
    expect(typeof mailchimpExport.list).to.equal('function');
    expect(typeof mailchimpExport.campaignSubscriberActivity).to.equal('function');
  });

  it('should throw error when no token is passed', () => {
    let mailchimpExport;
    try {
      mailchimpExport = new MailchimpExport();
    } catch (e) {
      console.log(typeof e);
      expect(e).to.be.an('Error');
      expect(e.message).to.equal('missing or invalid api key: undefined');
      expect(mailchimpExport).to.equal(undefined);
    }
  });
});
describe('src/index.js - Usage', () => {
  const MAILCHIMP_TOKEN = 'testToken-us17';
  const mailchimpExport = new MailchimpExport(MAILCHIMP_TOKEN);
  it('should return a request object successfully when list is called', () => {
    const requestObject = mailchimpExport.list({ id: 'listId' });
    expect(requestObject).to.contain.keys(['__isRequestRequest', 'httpModule', 'agent']);
  });

  it('should return a request object successfully when campaignSubscriberActivity is called', () => {
    const requestObject = mailchimpExport.campaignSubscriberActivity({ id: 'campaignId' });
    expect(typeof requestObject).to.equal('object');
    expect(requestObject).to.contain.keys(['__isRequestRequest', 'httpModule', 'agent']);
  });

  it('should throw error when validation params is not an object', () => {
    try {
      mailchimpExport.validateParams();
    } catch (e) {
      expect(e.message).to.equal('params must be an object');
    }
  });

  it('should throw error when validation params does not have an `id`', () => {
    try {
      mailchimpExport.validateParams({ test: 'test' });
    } catch (e) {
      expect(e.message).to.equal('id not found');
    }
  });
});
