/**
 * Created by zsiri on 2016.12.05..
 */

// socket io

import Socket = SocketIO.Socket;

declare var io : (() => Socket);

declare module "io" {
    export = io;
}
