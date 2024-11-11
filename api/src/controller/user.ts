import { Request, Response } from "express";
import { RedisManager } from "../RedisManager";
import { CREATE_USER } from "../types/types";

export const createUser = async (req: Request, res: Response) => {
    const { userId } = req.params;
   
    const response = await RedisManager.getInstance().sendAndAwait({
        type: CREATE_USER,
        data: {
            userId
        }
    })
    res.json(response.payload)
}