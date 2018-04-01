import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';
import moment from 'moment';

import './login.js';
import './message.js';
import './body.html';
import './header.html';
import './tracking.js';
import './chat.js';
import './header.js';


Template.body.onCreated(function bodyOnCreated() {
  Meteor.subscribe('chats');
  Meteor.subscribe('messages');
});

const handleRedirect = ( routes, redirect ) => {
    let currentRoute = FlowRouter.getRouteName();
    if ( routes.indexOf( currentRoute ) > -1 ) {
        FlowRouter.go( redirect );
        return true;
    }
};

Template.mainlayout.helpers({
    loggingIn() {
        return Meteor.loggingIn();
    },
    authenticated() {
        return Meteor.user();
    }
});

Template.mainlayout.events({

});

Template.registerHelper('formatDate', function(date) {
    return moment(date).format('HH:MM');
});

Template.registerHelper('formatFullDate', function(date) {
    if (date) {
        return moment(date).format('HH:mm / DD.MM.YYYY');
    } else {
        return '';
    }
});