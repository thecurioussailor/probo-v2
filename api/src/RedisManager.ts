import { createClient, RedisClientType } from "redis";
import crypto from "crypto"
import { MessageFromOrderbook, MessageToEngine } from "./types/types";
export class RedisManager{
    private client: RedisClientType;
    private publisher: RedisClientType;
    private static instance: RedisManager;

    private constructor() {
        this.client = createClient({
            url: "redis://default:password@redis:6379" // Updated for authentication
        });
        this.client.connect();

        this.publisher = createClient();
        this.publisher.connect();
    }

    public static getInstance() {
        if(!this.instance) {
            this.instance = new RedisManager();
        }

        return this.instance;
    }

    public sendAndAwait(message: MessageToEngine) {
        return new Promise<MessageFromOrderbook>((resolve) => {
            const id = crypto.randomUUID.toString();
            this.client.subscribe(id, (message)=> {
                this.client.unsubscribe(id);
                resolve(JSON.parse(message));
            })
            this.publisher.lPush("message", JSON.stringify({clientId: id, message}));
        })
    }
}