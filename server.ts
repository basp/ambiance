1/// <reference path="typings/tsd.d.ts" />

import net = require('net');
import S = require('string');
import byline = require('byline');
import { Connection } from './connection';

var connections: Connection[] = [];

var players = {
	'Rayne': {
		id: 7,
		name: 'Rayne'
	}
}

function auth(args: string[], argstr: string) {
	if (args.length === 0) {
		return false;
	}
	
	let name = args[0];
	let maybePlayer = players[name];
	if (maybePlayer) {
		return maybePlayer;
	}
	
	return false;
};

var server = net.createServer(socket => {
	let conn = new Connection(socket, auth);
	connections.push(conn);
	conn.notify('*** connected ***');
	
	byline(socket).on('data', data => {
		conn.state = conn.state.handle(data);
	});
	
	socket.on('error', err => {
		console.log(err);
	});
	
	socket.on('close', () => {
		let i = connections.indexOf(conn);
		connections.splice(i, 1);
	});
});

server.listen(6666);