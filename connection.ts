/// <reference path="typings/tsd.d.ts" />

import net = require('net');
import { tokenize } from './tokenizer';
import { parse } from './parser';

interface ConnectionState {
	handle(data: Buffer): ConnectionState;
}

interface AuthCallback {
	(args: string[], argstr: string): any;
}

class Connection {
	constructor(socket: net.Socket, auth?: AuthCallback) {
		this.socket = socket;
		this.state = new ConnectedState(this, auth);
		this.endpoint = `${socket.remoteAddress}`;
		this.player = undefined;
	}
	
	notify(msg: string) {
		this.socket.write(`${msg}\r\n`);
	}
	
	toString(): string {
		return this.endpoint;
	}

	public socket: net.Socket;
	public state: ConnectionState;
	public player: any;

	private endpoint: string;
}

class ConnectedState implements ConnectionState {
	constructor(conn: Connection, auth?: AuthCallback) {
		this.conn = conn;
		this.callback = auth || this.defaultAuthCallback;
	}
	
	defaultAuthCallback(args: string[]) {
		this.conn.notify(JSON.stringify(args));
		return false;
	}
	
	handle(data: Buffer): ConnectionState {
		let args = tokenize(data);
		let argstr = data.toString('ascii');
		let player = this.callback(args, argstr);
		if (player) {
			return new IdentifiedState(this.conn);	
		}
		return new ConnectedState(this.conn);
	}

	private callback: AuthCallback;
	private conn: Connection;
}

class IdentifiedState implements ConnectionState {
	constructor(conn: Connection) {
		this.conn = conn
		this.conn.player = { name: 'fubar' }
	}
	
	handle(data) {
		let spec = parse(data)
		this.conn.notify(JSON.stringify(spec))
		return new IdentifiedState(this.conn)
	}

	private conn: Connection
}

export { ConnectionState, Connection }