importPackage(Packages.org.jibble.pircbot);

var ircbot = {
    create: function(bot) {
	// our own onMessage function
	return new PircBot() {
	    onMessage: function(channel, sender, login, hostname, message) {
		if (channel in this.logChannels) {
		    app.log('Found: ' +channel);
		    app.log('Logging - ' + sender +': ' +message);
		    var time = new Date().format('yyyyMMdd-hhmmss');
		    var log = this.logChannels[channel.replace('#','')];
		    spp.log('logid: ' + log.id);
		    log.content += ((!(log.content) || log.content == '')?'\n':'') +
			time + ' ' + sender + ': ' + message;
		}
	    },
	    logChannels: {},
	    joinChannel: function(channel, key, log) {
		var time = new Date().format('yyyyMMdd-hhmmss');
		var server = this.getServer();
		if (log) {
		    app.log('Adding logging for ' +channel);
		    var lb = this.bot.get(server+'-'+channel);
		    if (!lb) {
			lb = new LogBucket();
			lb.server = server;
			lb.channel = channel;
			this.bot.add(lb);
		    }
		    var l = new Log();
		    l.id = time;
		    lb.add(l);

		    this.logChannels['#'+channel] = l;
		}

		/*app.log('key: -'+key+'-');
		if (key && key != '') {
		    app.log('using key');
		    this.joinChannel(channel, key);
		}*/

		this.joinChannel('#'+channel);
	    },
	    bot: bot
	}
    }
};