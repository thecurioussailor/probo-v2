import { createClient, RedisClientType } from "redis";
import { WsMessage } from "./types/types";
import { MessageToAPI } from "./types/messageToAPI";

export class RedisManager {
    private client: RedisClientType;
    private static instance: RedisManager;

    constructor(){
        this.client = createClient();
        this.client.connect();
    }

    public static getInstance() {
        if(!this.instance) {
            this.instance = new RedisManager();
        }

        return this.instance;
    }

    public publishMessage(channel: string, message: WsMessage){
        this.client.publish(channel, JSON.stringify(message))
    }

    public sendToAPI(clientId: string, message: MessageToAPI){
        this.client.publish(clientId, JSON.stringify(message));
    }
}