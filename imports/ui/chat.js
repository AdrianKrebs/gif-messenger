import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';
import {ReactiveDict} from 'meteor/reactive-dict';
import {Tracker} from 'meteor/tracker'
import {HTTP} from 'meteor/http'
import 'slick-carousel';
import 'bootstrap/dist/css/bootstrap.min.css'


import {Messages} from '../api/messages.js';
import {Chats} from '../api/chats.js';
import {_} from 'lodash';

import './chat.html';

const scrollBottom = function () {
    // window.scrollTo(0, document.body.scrollHeight);
    let messages = document.getElementById('messages');
    setTimeout(() => {
        messages.scrollTop = messages.scrollHeight;
    }, 400);
};

const carouselInit = () => {
    $('.multiple-items').slick({
        infinite: false,
        lazyLoad: 'ondemand',
        slidesToShow: 3,
        slidesToScroll: 3,
        arrows: true,
        variableWidth: true
    });
};

const destroyCarousel = () => {
    if ($('.skills_section').hasClass('slick-initialized')) {
        $('.skills_section').slick('destroy');
    }
};

const isUserNew = () => {
    const channel = FlowRouter.getParam("channel");
    if (!channel) {
        return true;
    }
    return false;
};

const getMessages = () => {
    const chatId = FlowRouter.getParam("chatId");
    let values = Messages.find({chatId}, {sort: {createdAt: 1}});
    return values;
}

let next = 0;
let currentText = '';


Template.chat.onCreated(function () {
    $('.spinner').hide();
    Meteor.subscribe('messages', function () {
        var messages = Messages.find().observe({
            added: function (res) {
                [5, 25, 75, 150].map(seconds => {
                    setTimeout(function () {
                        scrollBottom();
                    }, seconds);
                })
            },
        })
    });
    Meteor.subscribe("allUsers");
    this.searchResults = new ReactiveDict();
    this.noResultsFound = new ReactiveVar(false);

});

Template.chat.onRendered(function () {
    scrollBottom();
    var self = this;
    self.autorun(function () {
        self.subscribe("chats", function () {
        });
    });

    destroyCarousel();
    carouselInit();
    Meteor.call('messages.getGifsFromTenor', 'hi', function (error, result) {
        var imgs = result.data.results.map(i => {
            return {imageUrl: i.media[0].tinygif.url, origin: i.media[0].gif.url}
        });
        for (let i of imgs) {
            $(".multiple-items").slick('slickAdd', '<div><img  data-origin="' + i.origin + '" class="gif img-send" data-lazy = "' + i.imageUrl + '"></div>');
        }
    });
});
Template.chat.helpers({
    username() {
        return FlowRouter.getParam('channel');
    },
    messages() {
        return getMessages();
    },
    inputTemplate() {
        return {
            template: 'text',
            data: []
        };
    },
    chats() {
        let chats = Chats.find({'$or': [{'counterpart.userId': Meteor.userId()}, {userId: Meteor.userId()}]}, {sort: {createdAt: -1}});

        return chats;
    },
    chatIsSelected(id) {
        return id == FlowRouter.getParam("channel");
    },
    users() {
        return Meteor.users.find();
    },
    sidebarContent() {
        return 'foundUsers';
    },
    searchResults() {
        return Template.instance().searchResults.get('searchResults');
    },
    noResultsFound() {
        return Template.instance().noResultsFound.get();
    },
    isSelf(owner) {
        return Meteor.userId() === owner;
    },
    isUserNew() {
        return isUserNew();
    },
    isInConversation() {
        let msgs = getMessages();
        return !isUserNew() && msgs;
    }
});

Template.chat.events({
    'click .search-chat-user'(event) {
        const username = $('#search-input').val();

        //TODO search by nickname
        let regex = new RegExp('.*' + username + '.*');
        const matchingUsers = Meteor.users.find({'profile.name': regex}).fetch(); // search like
        const filteredUsers = matchingUsers.filter(u => u._id !== Meteor.userId());
        if (filteredUsers.length === 0) {
            Template.instance().noResultsFound.set(true);
        } else {
            Template.instance().noResultsFound.set(false);
        }
        Template.instance().searchResults.set('searchResults', filteredUsers);

    },
    'click .user-item'(event) {
        let counterpartId = event.target.getAttribute("data-user-id");
        let ownerId = Meteor.userId();
        let chat = Chats.findOne({'$or': [{'counterpart.userId': Meteor.userId()}, {userId: Meteor.userId()}]}, {sort: {createdAt: -1}});
        if (chat) {
            FlowRouter.go('/messages/' + counterpartId);
            $('.chat-window').show();
            if (window.matchMedia('(max-width: 760px)').matches) {
                $('.back').show();
            }
            ;
        } else {
            const counterpart = Meteor.users.findOne({_id: counterpartId});

            const counterpartObj = {
                userId: counterpartId,
                imgUrl: counterpart.services.twitter.profile_image_url,
                name: counterpart.profile.name
            };
            const owner = Meteor.users.findOne({_id: ownerId});

            const ownerObj = {
                userId: ownerId,
                imgUrl: owner.services.twitter.profile_image_url,
                name: owner.profile.name
            };
            Meteor.call('chats.insert', ownerObj, counterpartObj, function (error, result) {


            });
            FlowRouter.go('/messages/' + counterpartId);
            $('.chat-window').show();
            $('.back').show();
        }
    },
    'click .img-send'(event) {

        const chatId = FlowRouter.getParam("chatId");
        const origin = $(event.target).data('origin');
        // if (!_checkIfSelf(message)) {
        //     _assignDestination(message);
        // } else {
        //     throw new Meteor.Error('500', 'Can\'t send messages to yourself.');
        // }
        // user has no delay
        Meteor.call('messages.insert', '<img class="img-send message_image" src = "' + origin + '">', chatId, Meteor.userId(), FlowRouter.getParam('channel'));


        scrollBottom();
    },
    'click .logout-btn'(event) {
        Meteor.logout();
        FlowRouter.go('/login');
        $('.back').hide();
    },
    'submit .new-message-form, keyup .search-input'(event) {
        event.preventDefault();
        const text = $("#messageBox").val();
        currentText = text;
        //TODO desktop tinygif, mobile nanogif as preview
        _getGifsFromTenor(text);
    }
});

const _getGifsFromTenor = _.debounce((text) => {

    Meteor.call('messages.getGifsFromTenor', text, function (error, result) {
        next = result.data.next;
        var imgs = result.data.results.map(i => {
            return {imageUrl: i.media[0].tinygif.url, origin: i.media[0].gif.url}
        });
        let length = $('.slick-slide').length;
        for (let i = 0; i < length; i++) {
            $(".multiple-items").slick('slickRemove', i);
        }
        $(".multiple-items").slick('refresh');
        for (let i of imgs) {
            $(".multiple-items").slick('slickAdd', '<div><img  data-origin="' + i.origin + '" class="gif img-send" data-lazy = "' + i.imageUrl + '"></div>');
        }
    });
}, 400);
