const publicRoutes = FlowRouter.group( { name: 'public' } );

publicRoutes.route( '/', {
    action() {
        FlowRouter.go( '/login' );
    }
});

publicRoutes.route( '/login', {
    name: 'login',
    action() {
        BlazeLayout.render( 'mainlayout', { main: 'login' } );
    }
});



FlowRouter.route('/', {
    action: function () {
        BlazeLayout.render("mainlayout", {main: "chat"});
    }
});



var messagesRoutes = FlowRouter.group({
    prefix: '/messages',
    name: 'messages',
    triggersEnter: [function(context, redirect) {
        if (!Meteor.userId()) {
            redirect('/login');
        }
    }]
});


messagesRoutes.route('/:channel', {
    action: function (params, queryParams) {
        BlazeLayout.render("mainlayout", {main: "chat"});
    }
});


var chatRoutes = FlowRouter.group({
    prefix: '/chat',
    name: 'chat',
    triggersEnter: [function(context, redirect) {
        if (!Meteor.userId()) {
            redirect('/login');
        }
    }]
});

chatRoutes.route('/', {
    action: function (params, queryParams) {
        BlazeLayout.render("mainlayout", {main: "chat"});
    }
});


chatRoutes.route('/:chatId', {
    action: function (params, queryParams) {
        BlazeLayout.render("mainlayout", {main: "chat"});
    }
});
chatRoutes.route('/:chatId/chat', {
    action: function () {
        BlazeLayout.render("mainlayout", {main: "chat"});
    }
});

//TODO build tracking view
FlowRouter.route('/tracking', {
    action: function () {
        BlazeLayout.render("mainlayout", {main: "tracking"});
    }
});

FlowRouter.route('/tracking/:chatId', {
    action: function () {
        BlazeLayout.render("mainlayout", {main: "tracking"});
    }
});

