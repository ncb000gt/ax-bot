function init() {
    var hp = root.get('home');
    if (!hp) {
	hp = new Homepage();
	hp.id = 'home';
	hp.title = 'Logging, Trivia, Chat - IRC - AxBot Extraordinare';
	hp.content = new XHTML('Chattery.');
	root.add(hp);
    }

    var first_bot = hp.get('first_bot');
    if (!first_bot) {
	first_bot = new Bot();
	first_bot.name = 'first_bot';
	first_bot.password = 'test';
	first_bot.servers = <>
	    <servers>
		<server domain="irc.freenode.net">
		    <channel log="true">axiomstack</channel>
		</server>
	    </servers>
	    </>;
	hp.add(first_bot);
    }

    res.commit();
}

function start() {
    ircbot.onMessageFunctions.push(log_message);
    ircbot.onJoinFunctions.push(on_join_message);
    ircbot.joinFunctions.push(join_setup);

    startBots();
}

function startBots() {
    for each(var bot in app.getObjects('Bot')) {
	var ibot = new ircbot.create(bot);
	ibot.setName(bot.name);
	for each (var server in bot.servers..server) {
	    ibot.connect(server.@domain);
	    for each(var channel in server..channel) {
		ibot.joinChannel(channel.text(), channel.@key, {log:(channel.@log == 'true')});
	    }
	}
    }
}