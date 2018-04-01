import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {check} from 'meteor/check';
import {HTTP} from 'meteor/http';
import {_} from 'lodash';


export const Messages = new Mongo.Collection('message');

if (Meteor.isServer) {
    Meteor.publish('messages', function tasksPublication() {
        return Messages.find({});
    });
}

if (Meteor.isServer) {
    Meteor.methods({
        'messages.insert'(text, chatId, owner,destination) {
            Messages.insert({
                text,
                chatId,
                owner: owner,
                destination: destination,
                createdAt: new Date()
            });
        },
        'messages.remove'(messageId) {
            check(messageId, String);
            const message = Message.findOne(messageId);
            Messages.remove(taskId);
        },
        'messages.getGifsFromTenor'(text) {
            return HTTP.get('https://api.tenor.com/v1/search', {
                params: {
                    key: Meteor.settings.tenorApiKey,
                    q: text,
                    limit: 20,
                    media_filter: 'minimal'
                },
            });
        }
    });
}
