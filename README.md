# Mailchimp Export API for NodeJS(4.0+)

[![Greenkeeper badge](https://badges.greenkeeper.io/shierro/node-mailchimp-export.svg)](https://greenkeeper.io/)
[![npm version](https://badge.fury.io/js/node-mailchimp-export.svg)](https://badge.fury.io/js/node-mailchimp-export)
[![Build Status](https://travis-ci.org/shierro/node-mailchimp-export.svg?branch=master)](https://travis-ci.org/shierro/node-mailchimp-export)
[![Maintainability](https://api.codeclimate.com/v1/badges/f60e0883a1c98f548293/maintainability)](https://codeclimate.com/github/shierro/node-mailchimp-export/maintainability)
[![codecov](https://codecov.io/gh/shierro/node-mailchimp-export/branch/master/graph/badge.svg)](https://codecov.io/gh/shierro/node-mailchimp-export)
[![dependency status](https://david-dm.org/shierro/node-mailchimp-export/status.svg)](https://david-dm.org/shierro/node-mailchimp-export/status.svg)
[![devDependency status](https://david-dm.org/shierro/node-mailchimp-export/dev-status.svg)](https://david-dm.org/shierro/node-mailchimp-export/dev-status.svg)
[![Known Vulnerabilities](https://snyk.io/test/github/shierro/node-mailchimp-export/badge.svg)](https://snyk.io/test/github/shierro/node-mailchimp-export)

[![NPM](https://nodei.co/npm/node-mailchimp-export.png)](https://nodei.co/npm/node-mailchimp-export/)

Mailchimp api wrapper for the mailchimp export API v1

## Install
`npm install node-mailchimp-export --save`

## Available functions
*name* | `description` 
--- | ---
listMembers | Export list members in a single JSON
listMembersRaw | Export list members & return a [request/request](https://github.com/request/request) object
campaignSubscriberActivity | Get subscribers w/activity in a JSON array
campaignSubscriberActivityRaw | Get subscribers w/activity & return a [request/request](https://github.com/request/request) object

## Usage
```javascript
const MailchimpExport = require('node-mailchimp-export');
const fs = require('fs');
const mailchimpExport = new MailchimpExport(YOUR_MAILCHIMP_API_KEY);

/* Export list members in a single JSON */
mailchimpExport
  .listMembers({
    // required - the list id to get members from
    id: "ListID",
    // optional – the status to get members for - one of (subscribed, unsubscribed, cleaned), defaults to subscribed
    status: "subscribed|unsubscribed|cleaned",
    // optional – pull only a certain Segment of your list.
    segment: "SEGMENT",
    // optional – only return member whose data has changed since a GMT timestamp – in YYYY-MM-DD HH:mm:ss format
    since: "YYYY-MM-DD HH:mm:ss",
    // optional – if, instead of full list data, you’d prefer a hashed list of email addresses, set this to the hashing algorithm you expect. Currently only “sha256” is supported.
    hashed: "hash"
  })
  .then((listMembers) => {
    // Do something with list members
  })
  .catch(console.error);

/* Export list members & return a request/request object */
mailchimpExport
  .listMembersRaw({
    // required - the list id to get members from
    id: "ListID",
    // optional – the status to get members for - one of (subscribed, unsubscribed, cleaned), defaults to subscribed
    status: "subscribed|unsubscribed|cleaned",
    // optional – pull only a certain Segment of your list.
    segment: "SEGMENT",
    // optional – only return member whose data has changed since a GMT timestamp – in YYYY-MM-DD HH:mm:ss format
    since: "YYYY-MM-DD HH:mm:ss",
    // optional – if, instead of full list data, you’d prefer a hashed list of email addresses, set this to the hashing algorithm you expect. Currently only “sha256” is supported.
    hashed: "hash"
  })
  .pipe(fs.createWriteStream('yourRawListMembers.txt'));

/* Export campaignSubscriberActivity - Get a single JSON Object */
mailchimpExport
  .campaignSubscriberActivity({
    // required - the campaign id to get subscriber activity from
    id: "CampaignID",
    // optional – if set to “true” a record for every email address sent to will be returned even if there is no activity data. defaults to “false”
    include_empty: "true|false",
    // optional – only return member whose data has changed since a GMT timestamp – in YYYY-MM-DD HH:mm:ss format
    since: "YYYY-MM-DD HH:mm:ss"
  })
  .then((subscriberList) => {
    // Do something with subscriber list
  });

  /* Export campaignSubscriberActivity - Get a request/request object */
  mailchimpExport
    .campaignSubscriberActivityRaw({
      // required - the campaign id to get subscriber activity from
      id: "CampaignID",
      // optional – if set to “true” a record for every email address sent to will be returned even if there is no activity data. defaults to “false”
      include_empty: "true|false",
      // optional – only return member whose data has changed since a GMT timestamp – in YYYY-MM-DD HH:mm:ss format
      since: "YYYY-MM-DD HH:mm:ss"
    })
    .pipe(fs.createWriteStream('yourRawCampaignSubscriberActivities.txt'));
```

For more info on other ways to pipe the data, [check this](https://github.com/request/request#streaming)

For an updated list of params, check the API Docs [here](http://developer.mailchimp.com/documentation/mailchimp/guides/how-to-use-the-export-api/#list-export)
