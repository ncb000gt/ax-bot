importPackage(Packages.org.jibble.pircbot);

var ircbot = {
    onMessageFunctions: [],
    onJoinFunctions: [],
    joinFunctions: [],
    create: function(bot) {
	// our own implementations of PircBot API
	return new PircBot() {
	    onMessage: function(channel, sender, login, hostname, message) {
		for each (var mf in ircbot.onMessageFunctions) {
		    mf.apply(this, arguments);
		}
	    },
	    onJoin: function(channel, sender, login, hostname) {
		for each (var jf in ircbot.onJoinFunctions) {
		    jf.apply(this, arguments);
		}
	    },
	    joinChannel: function(channel, key, params) {
		for each (var jf in ircbot.joinFunctions) {
		    jf.apply(this, arguments);
		}
		this.joinChannel('#'+channel);
	    },
	    bot: bot
	}
    }
};