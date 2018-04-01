ServiceConfiguration.configurations.remove({
    service: 'twitter',
});

ServiceConfiguration.configurations.upsert(
    { service: 'twitter' },
    {
        $set: {
            consumerKey: Meteor.settings.twitterConsumerKey,
            loginStyle: 'popup',
            secret: Meteor.settings.twitterConsumerSecret
        }
    }
);