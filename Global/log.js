var log_queue = {};
var logChannels = {};

function process_queue() {
    for (var key in log_queue) {
	var entries = log_queue[key];
	for each (var entry in entries) {
	    for each(var log_id in entry.id) {
		var l = app.getObjects('Log', {id: log_id}, {path: '/home'})[0];
		if (!(l)){
		    app.log('No Log object found.');
		    app.log('Data: '+entry.toSource());
		}
		l.log_line(entry.line);
	    }
	    log_queue[key].remove(entry); //will remove newly duplicated information, but repeats tend to be bad anyway.
	}
    }
}

function log_message(channel, sender, login, hostname, message) {
    if (channel in logChannels) {
	var time = new Date().format('yyyy/MM/dd hh:mm:ss');
	var data = {
	    id: logChannels[channel],
	    line: time + ' ' + sender + ': ' + message
	};
	if (!(channel in log_queue)){
	    log_queue[channel] = [data];
	} else {
	    log_queue[channel].push(data);
	}
    }
}

function join_setup(channel, key, params) {
    var time = new Date().format('yyyyMMdd-hh:mm:ss');
    var server = this.getServer();
    if (params.log) {
	var lb = this.bot.get(server+'-'+channel);
	if (!lb) {
	    lb = new LogBucket();
	    lb.server = server;
	    lb.channel = channel;
	    this.bot.add(lb);
	}
	var l = new Log();
	l.id = time;
	l.stream = '';
	lb.add(l);

	if (!(('#'+channel) in logChannels)) {
	    logChannels['#'+channel] = [l.id];
	} else {
	    logChannels['#'+channel].push(l.id);
	}
    }
}

/**
 * Send message, set on a per bot basis.
 *
 * Substitutions:
 * {0} - channel
 * {1} - sender
 * {2} - login
 * {3} - hostname
 */
function on_join_message(channel, sender, login, hostname) {
    this.sendNotice(
	sender,
        this.bot.on_join_notice
	    .replace(/{0}/g, channel)
	    .replace(/{1}/g, sender)
	    .replace(/{2}/g, login)
	    .replace(/{3}/g, hostname)
    );
    log_message(channel, sender, login, hostname, '(n='+login+"@" + hostname +") has joined" + channel);
}