import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {_} from 'lodash';

export const Chats = new Mongo.Collection('chat');

if (Meteor.isServer) {

    Meteor.publish('chats', function tasksPublication() {
        return Chats.find({});
    });

    Meteor.publish("allUsers", function () {
        return Meteor.users.find({}, {fields: {profile: 1, services: 1}})
    });

    Meteor.methods({
        'chats.insert'(owner,destination) {
            return Chats.insert({
                createdAt: new Date(),
                userId: Meteor.user()._id,
                owner: owner,
                counterpart: destination,
                errors: [],
                packages: [],
            });
        },

        'chats.updateStep'(_id, step) {
            return Chats.update(_id, {$set: {step: step}});
        },

        'chats.updateSessionContext'(_id, sessionContext) {
            return Chats.update(_id, {$set: {sessionContext: sessionContext}});
        },

        'chats.appendError'(_id, error) {
            return Chats.update(_id, {$push: {errors: error}});
        }
    });
}
