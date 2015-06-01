'use strict';

var Slack  = require('slack-client');
var Bot    = require('./services/bot');
var token = process.env.SLACK_TOKEN;

console.log(token);

if (process.env.CHATGANG) {
	token = process.env.CHATGANG;
}

if (process.env.SLACK_VIMLA) {
	token = process.env.SLACK_VIMLA;
}

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
	var type    = message.type;
	var channel = slack.getChannelGroupOrDMByID(message.channel);
	var text    = message.text;
	var user    = message.user || '';
	var botID   = '<@U03AW9QEV>';

	if (process.env.CHATGANG) {
		botID = '<@U03M0AWRY>';
	}

	if (process.env.SLACK_VIMLA) {
		botID = '<@U047914HH>';
	}

	// Do nothing if there is no text
	if (!text || text.substr(0,12) !== botID) {
		return;
	}

	// Split the message on spaces and remove the first on (the bot name)
	var command = text.split(' ').slice(1)[0];
	var commands = [ command ];

	var regex = /"(?:[^"\\]|\\.)*"/g; // all inside quotation marks
	var params = text.indexOf('"') > -1 ? text.match(regex) : text.split(' ').slice(2);

	console.log(commands, params);

	if (params.length) {
		params.forEach(function (param) {
			commands.push(param.replace(/"/g,'').replace(/\s/g, '+'));
		});
	}

	console.log('Called with command ' + commands[0] + ' and params ' + commands.slice(1) + ' @ ' + new Date());

	// The command is the first array value
	if (commands.length) {
		var command = commands[0];
	}

	// Show help
	if (text === botID || text === botID + ':') {
		Bot.service().help(text, channel);
		return;
	}

	// If message with command
	if (type === 'message' && command) {
		if (Bot.service()[command]) {
			Bot.service()[command](commands, channel, user, slack);
		} else {
			Bot.service().help(text, channel);
		}
	}
});

//
// Error
// --------------------------------------------------
slack.on('error', function (error) {
	console.error('Error: %s', error);
});

slack.login();
