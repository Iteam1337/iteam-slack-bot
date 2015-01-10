var Slack  = require('slack-client');
var Bot    = require('./services/bot');

var token         = process.env.SLACK_TOKEN;
var autoReconnect = true;
var autoMark      = true;

var slack = new Slack(token, autoReconnect, autoMark);

function showHelp (channel) {
	var text = [
		'*Användning:*',
		'@iteam [alternativ]',
		'*Alternativ:*',
		'_help/hjälp_\t\t\t\t\tvisar denna hjälp',
		'_np_\t\t\t\t\t\t\t\tvisar vilken låt som spelas',
		'_np:{användarnamn}_\tvisar vilken låt du spelar (Last.fm-användarnamn)'
	];

	channel.send(text.join('\n'));
}

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
	var botID   = '<@U03AW9QEV>';

	var command = text.substr(0,12) === botID && text.length > 12 ? text.match(/\s[a-zåäö]*/i)[0].trim() : '';

	// Show help
	if (text === botID || command === 'help' || command === 'hjälp') {
		showHelp(channel);
		return;
	}

	// If message with command
	if (type === 'message' && command) {
		if (Bot.service()[command]) {
			Bot.service()[command](text, channel);
		} else {
			showHelp(channel);
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
