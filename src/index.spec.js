/* eslint-disable no-underscore-dangle */
const MailchimpExport = require('./index');
const { expect } = require('chai');
const nock = require('nock');

describe('src/index.js - Instance', () => {
  it('should create new instance without fail', () => {
    const MAILCHIMP_TOKEN = 'testToken-us17';
    const mailchimpExport = new MailchimpExport(MAILCHIMP_TOKEN);
    expect(typeof mailchimpExport.listMembers).to.equal('function');
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
  const rawList =
    '["Email Address","First Name","Last Name","Address","Phone Number","MEMBER_RATING","OPTIN_TIME","OPTIN_IP","CONFIRM_TIME","CONFIRM_IP","LATITUDE","LONGITUDE","GMTOFF","DSTOFF","TIMEZONE","CC","REGION","LAST_CHANGED","LEID","EUID","NOTES"]\n' +
    '["test@gmail.com","","","","",2,"2018-04-13 10:57:02",null,"2018-04-13 10:57:02","13.210.204.207",null,null,null,null,null,null,null,"2018-04-13 10:57:02","45967475","3b0a62b412",null]\n' +
    '["test2@gmail.com","","","","",2,"2018-04-13 10:57:02",null,"2018-04-13 10:57:02","13.210.204.207",null,null,null,null,null,null,null,"2018-04-13 10:57:02","45967475","3b0a62b412",null]';
  const rawSubscribers = '{"test@gmail.com":[{"action":"open","timestamp":"2018-04-08 09:01:27","url":null,"ip":"66.249.82.127"},{"action":"open","timestamp":"2018-04-09 02:42:31","url":null,"ip":"66.249.82.169"}]}';

  it('should return a promise successfully when listMembers is called', (done) => {
    nock('https://us17.api.mailchimp.com')
      .get('/export/1.0/list?id=listId&apikey=testToken-us17')
      .reply(200, rawList);
    const response = mailchimpExport.listMembers({ id: 'listId' });
    expect(typeof response).to.equal('object');
    expect(response.then).is.a('function');
    response.then(() => done());
  });

  it('should return a request/request object listMembersRaw is called & complete', (done) => {
    nock('https://us17.api.mailchimp.com')
      .get('/export/1.0/list?id=listIdRaw&apikey=testToken-us17')
      .reply(200, rawList);
    const requestObject = mailchimpExport.listMembersRaw({ id: 'listIdRaw' });
    expect(requestObject).to.contain.keys(['__isRequestRequest', 'httpModule', 'agent']);
    requestObject.on('complete', () => done());
  });

  it('should should export campaign subscribers successfully', () => {
    nock('https://us17.api.mailchimp.com')
      .get('/export/1.0/campaignSubscriberActivity?id=campaignId&apikey=testToken-us17')
      .reply(200, rawSubscribers);
    const requestObject = mailchimpExport.campaignSubscriberActivity({ id: 'campaignId' });
    expect(typeof requestObject).to.equal('object');
    expect(requestObject.then).to.be.a('function');
  });

  it('should should export campaign subscribers successfully w/empty data', () => {
    nock('https://us17.api.mailchimp.com')
      .get('/export/1.0/campaignSubscriberActivity?id=emptyCampaignId&apikey=testToken-us17')
      .reply(200, '');
    const requestObject = mailchimpExport.campaignSubscriberActivity({ id: 'emptyCampaignId' });
    expect(typeof requestObject).to.equal('object');
    expect(requestObject.then).to.be.a('function');
  });

  it('should return a request/request object campaignSubscriberActivity is called & complete', (done) => {
    nock('https://us17.api.mailchimp.com')
      .get('/export/1.0/campaignSubscriberActivity?id=campaignIdRaw&apikey=testToken-us17')
      .reply(200, rawSubscribers);
    const requestObject = mailchimpExport.campaignSubscriberActivityRaw({ id: 'campaignIdRaw' });
    expect(requestObject).to.contain.keys(['__isRequestRequest', 'httpModule', 'agent']);
    requestObject.on('complete', () => done());
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

  it('should parse list data successfully', () => {
    const result = mailchimpExport.parseRawList(rawList);
    expect(result).to.be.an('array');
    expect(result[0]).to.contain.keys(['Email Address', 'First Name', 'Last Name']);
    expect(result[0]['Email Address']).to.equal('test@gmail.com');
    expect(result[1]['Email Address']).to.equal('test2@gmail.com');
  });
});
