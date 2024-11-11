import { WebSocket } from "ws";

export class User {

    private id: string;
    private ws: WebSocket;

    constructor(id: string, ws: WebSocket){
        this.id = id;
        this.ws = ws;
    }

    private subscriptions: string[] = [];

    public subscribe(subscription: string) {
        this.subscriptions.push(subscription);
    }

    public unsubscribe(subscription: string){
        this.subscriptions = this.subscriptions.filter(s => s !== subscription);
    }

    private addListeners(){
        this.ws.on("message", (message: string) =>{
            const parsedMessage: IncomingMessage = JSON.parse(message);
            if(parsedMessage.method === SUBSCRIBE){
                
            }
        })
    }
}