/// <reference path="typings/tsd.d.ts" />

import net = require('net');
import byline = require('byline');
import { tokenize } from './tokenizer';
import { parse } from './parser';
import { Object, Nothing } from './world'

const VERSION = "0.1";

interface ConnectionState {
	handle(data: Buffer): ConnectionState;
}

class Connection {
	public socket: net.Socket;
	public state: ConnectionState;
	public player: Object;
	
	constructor(socket: net.Socket) {
		this.socket = socket;
		this.state = new ConnectedState(this);
		this.player = Nothing;
	}
	
	notify(msg: string) {
		this.socket.write(`${msg}\r\n`);
	}
}

class ConnectedState implements ConnectionState {
	private conn: Connection;
	
	constructor(conn: Connection) {
		this.conn = conn;
	}
	
	handle(data) {
		var args = tokenize(data);
		this.conn.notify(JSON.stringify(args));
		return new ConnectedState(this.conn);				
	}
}

class IdentifiedState implements ConnectionState {
	private conn: Connection;
	
	constructor(conn: Connection) {
		this.conn = conn;
	}
	
	handle(data) {
		var spec = parse(data);
		this.conn.notify(JSON.stringify(spec));
		return new IdentifiedState(this.conn);		
	}
}

var connections: Connection[] = [];

var server = net.createServer(socket => {
	var conn = new Connection(socket);
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