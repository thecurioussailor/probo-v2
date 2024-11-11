import { Request, Response } from "express"
import { RedisManager } from "../RedisManager";
import { MINT_TRADE } from "../types/types";

export const mintTrade = async (req: Request, res: Response) => {
    const { userId, stockSymbol, quantity} = req.body;

    const response = await RedisManager.getInstance().sendAndAwait({
        type: MINT_TRADE,
        data: {
            userId,
            stockSymbol,
            quantity
        }
    })

    res.json(response);
}