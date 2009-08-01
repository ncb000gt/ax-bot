importPackage(Packages.org.jibble.pircbot);

var log_queue = [];

function process_queue() {
    for each(var entry in log_queue) {
	var l = app.getObjects('Log', {id: entry.id})[0];
	l.log_line(entry.line);
	log_queue.remove(entry);
    }
}

var ircbot = {
    create: function(bot) {
	// our own onMessage function
	return new PircBot() {
	    onMessage: function(channel, sender, login, hostname, message) {
		if (channel in this.logChannels) {
		    var time = new Date().format('yyyyMMdd-hhmmss');
		    global.log_queue.push(
			{
			    id: this.logChannels[channel],
			    line: time + ' ' + sender + ': ' + message
			}
		    );
		}
	    },
	    logChannels: {},
	    joinChannel: function(channel, key, log) {
		var time = new Date().format('yyyyMMdd-hhmmss');
		var server = this.getServer();
		if (log) {
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

		    this.logChannels['#'+channel] = l.id;
		}
		this.joinChannel('#'+channel);
	    },
	    bot: bot
	}
    }
};