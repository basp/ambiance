/// <reference path="typings/tsd.d.ts" />

import net = require('net');
import S = require('string');
import byline = require('byline');
import { Connection } from './connection';

var connections: Connection[] = [];

var players = {
	'Vanity': {}
}

function auth(args: string[], argstr: string) {
	if(S(argstr).isEmpty()) {
		return false;
	}
	
	return players[args[0]];
};

var server = net.createServer(socket => {
	var conn = new Connection(socket, auth);
	connections.push(conn);
	conn.notify('*** connected ***');
	
	byline(socket).on('data', data => {
		conn.state = conn.state.handle(data);
	});
	
	socket.on('error', err => {
		console.log(err);
	});
	
	socket.on('close', () => {
		var i = connections.indexOf(conn);
		connections.splice(i, 1);
	});
});

server.listen(6666);