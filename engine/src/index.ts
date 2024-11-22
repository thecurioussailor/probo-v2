import { createClient } from "redis";
import { Engine } from "./trade/engine"
async function main(){
    const engine = new Engine();
    const redisClient = createClient({
        url: "redis://default:my_redis_password@localhost:6379", // Correct credentials
    });

    await redisClient.connect();
    console.log("connected to redis");

    while(true) {
        const response = await redisClient.rPop("message" as string);
        if(!response){
            
        }else {
            engine.process(JSON.parse(response));
        }
    }
}

main();