import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';

import './message.html';

Template.message.helpers({
    isSelf(owner) {
        return Meteor.userId() === owner;
    },
});

Template.message.events({

});
