var Slack  = require('slack-client');
var LastFm = require('./services/lastfm');

var token         = process.env.SLACK_TOKEN;
var autoReconnect = true;
var autoMark      = true;

var slack = new Slack(token, autoReconnect, autoMark);

//
// When bot is connected
// --------------------------------------------------
slack.on('open', function() {
	var channels = [];
	var groups   = [];
	var key;

	for (key in slack.channels) {
		if (slack.channels[key].is_member) {
			channels.push('#' + slack.channels[key].name);
		}
	}

	for (key in slack.groups) {
		if (slack.groups[key].is_open && !slack.groups[key].is_archived) {
			groups.push(slack.groups[key].name);
		}
	}

	console.log('Welcome to Slack. You are @%s of %s', slack.self.name, slack.team.name);
	console.log('You are in: %s', channels.join(', '));
	console.log('As well as: %s', groups.join(', '));
});

//
// When a message is received
// --------------------------------------------------
slack.on('message', function (message) {
	var type     = message.type;
	var channel  = slack.getChannelGroupOrDMByID(message.channel);
	var text     = message.text;

	if (type === 'message') {
		// Respond with now playing song of user
		if (text.indexOf('np') > -1) {
			LastFm
				.getLastfm(text)
				.then(function (data) {
					channel.send(data);
				});
		}
	}
});

// Error
slack.on('error', function (error) {
	console.error('Error: %s', error);
});

slack.login();
