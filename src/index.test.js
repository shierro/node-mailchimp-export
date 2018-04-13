/* eslint-disable no-underscore-dangle */
const MailchimpExport = require('./index');
const { expect } = require('chai');

describe('src/index.js', () => {
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

  it('should return a request object successfully when list is called', () => {
    const MAILCHIMP_TOKEN = 'testToken-us17';
    const mailchimpExport = new MailchimpExport(MAILCHIMP_TOKEN);
    const requestObject = mailchimpExport.list({ id: 'testId' });
    expect(requestObject).to.contain.keys(['__isRequestRequest', 'httpModule', 'agent']);
  });

  it('should return a request object successfully when campaignSubscriberActivity is called', () => {
    const MAILCHIMP_TOKEN = 'testToken-us17';
    const mailchimpExport = new MailchimpExport(MAILCHIMP_TOKEN);
    const requestObject = mailchimpExport.campaignSubscriberActivity({ id: 'testId' });
    expect(requestObject).to.contain.keys(['__isRequestRequest', 'httpModule', 'agent']);
  });

  it('should throw error when validation params is not an object', () => {
    try {
      const MAILCHIMP_TOKEN = 'testToken-us17';
      const mailchimpExport = new MailchimpExport(MAILCHIMP_TOKEN);
      mailchimpExport.validateParams();
    } catch (e) {
      expect(e.message).to.equal('params must be an object');
    }
  });

  it('should throw error when validation params does not have an `id`', () => {
    try {
      const MAILCHIMP_TOKEN = 'testToken-us17';
      const mailchimpExport = new MailchimpExport(MAILCHIMP_TOKEN);
      mailchimpExport.validateParams({ test: 'test' });
    } catch (e) {
      expect(e.message).to.equal('id not found');
    }
  });
});
