import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';
import {Chats} from '../api/chats.js';
import './login.html';

Template.login.onCreated(function () {

});

Template.login.helpers({});


Template.login.events({
    'click .twitter'(event) {
        Meteor.loginWithTwitter({
            requestPermissions: ['email']
        }, (err) => {
            if (err) {
                // handle error
                console.error(err);
            } else {
                // successful login!
                console.log('login succesful');
                if (window.matchMedia('(max-width: 760px)').matches) {
                    $('.back').show();
                };
                let chat = Chats.findOne({'$or': [{'counterpart.userId': Meteor.userId()}, {userId: Meteor.userId()}]}, {sort: {createdAt: -1}});
                if (chat) {
                    if (Meteor.userId() === chat.counterpart.userId) {
                        FlowRouter.go('/messages/' + chat.owner.userId);
                    } else {
                        FlowRouter.go('/messages/' + chat.counterpart.userId);
                    }
                } else {
                    FlowRouter.go('/chat');
                }
            }
        });

    }

});
