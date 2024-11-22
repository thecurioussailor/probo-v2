import { WebSocket } from "ws";
import { User } from "./User";
import { SubscribeMessage } from "./types/in";
import crypto from "crypto";
import { SubscriptionManager } from "./SubscriptionManager";
export class UserManager {
    private static instance: UserManager;
    private users: Map<string, User> = new Map();

    private constructor(){

    }

    public static getInstance() {
        if(!this.instance) {
            this.instance = new UserManager();
        }
        return this.instance;
    }

    public addUser(ws: WebSocket){
        const id = crypto.randomUUID.toString();
        const user = new User(id, ws);
        this.users.set(id, user);
        this.registerOnClose(ws, id);
    }
    private registerOnClose(ws: WebSocket, id: string) {
        ws.on("close", () => {
            this.users.delete(id);
            SubscriptionManager.getInstance().userLeft(id);
        });
    }
    public getUser(id: string) {
        return this.users.get(id);
    }
}