var log_queue = [];
var logChannels = {};

function process_queue() {
    for each(var entry in log_queue) {
	var l = app.getObjects('Log', {id: entry.id})[0];
	if (!(l)){
	    app.log('No Log object found.');
	    app.log('Data: '+entry.toSource());
	}
	l.log_line(entry.line);

	log_queue.remove(entry);
    }
}

function log_message(channel, sender, login, hostname, message) {
    if (channel in logChannels) {
	var time = new Date().format('yyyyMMdd-hhmmss');
	log_queue.push(
	    {
		id: logChannels[channel],
		line: time + ' ' + sender + ': ' + message
	    }
	);
    }
}

function join_setup(channel, key, params) {
    var time = new Date().format('yyyyMMdd-hhmmss');
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

	logChannels['#'+channel] = l.id;
    }
}

function on_join_message(channel, sender, login, hostname) {
    this.sendMessage(sender, "Welcome to "+ channel+", this channel is being logged.");
}