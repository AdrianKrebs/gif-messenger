import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';

import './header.html';

Template.header.helpers({});

Template.header.onRendered(function () {
    if (!Meteor.user()) {
        $('.back').hide();
    }
});

Template.header.events({
    'click .arrow-btn'(event) {
        $('.sidebar').show();
        $('.chat-window').hide();
        $('.back').hide();
    },
});