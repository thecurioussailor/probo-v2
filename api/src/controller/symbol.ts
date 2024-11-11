import { Request, Response } from "express";
import { RedisManager } from "../RedisManager";
import { CREATE_STOCK_SYMBOL } from "../types/types";

export const createStockSymbol = async (req: Request, res: Response) => {
    const {stockSymbol} = req.params;
    const response = await RedisManager.getInstance().sendAndAwait({
        type: CREATE_STOCK_SYMBOL,
        data: {
            stockSymbol
        }
    })

    res.json(response);
}