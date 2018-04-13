# Mailchimp Export API for NodeJS

Mailchimp api wrapper for the mailchimp export API v1

## Install from github(TODO: add NPM package)
`npm install --save https://github.com/shierro/node-mailchimp-export/tarball/master`

## Usage
```javascript
const MailchimpExport = require('node-mailchimp-export');
const mailchimpExport = new MailchimpExport(YOUR_MAILCHIMP_API_KEY);

/* Export list */
mailchimpExport
  .list({
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
  .on('data', (chunk) => {
    const list = JSON.parse(chunk.toString('utf8'));
    // Do something with the JSON list
  })
  .on('complete', () => console.log('request completed!'))
  .on('error', console.error);

/* Export campaignSubscriberActivity */
mailchimpExport
  .campaignSubscriberActivity({
    // required - the campaign id to get subscriber activity from
    id: "CampaignID",
    // optional – if set to “true” a record for every email address sent to will be returned even if there is no activity data. defaults to “false”
    include_empty: "true|false",
    // optional – only return member whose data has changed since a GMT timestamp – in YYYY-MM-DD HH:mm:ss format
    since: "YYYY-MM-DD HH:mm:ss"
  })
  .on('data', (chunk) => {
    const subscriberActivities = JSON.parse(chunk.toString('utf8'));
    // Do something with the JSON campaign activity by subscriber
  })
  .on('complete', () => console.log('request completed!'))
  .on('error', console.error);
```

For an updated list of params, check the API Docs [here](http://developer.mailchimp.com/documentation/mailchimp/guides/how-to-use-the-export-api/#list-export)
