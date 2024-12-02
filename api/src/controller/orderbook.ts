import { Request, Response } from "express";
import { RedisManager } from "../RedisManager";
import { BUY_ORDER, GET_ORDERBOOK, GET_ORDERBOOK_BY_SYMBOL, SELL_ORDER } from "../types/types";

export const getOrderbook = async (req: Request, res: Response) => {
    const response = await RedisManager.getInstance().sendAndAwait({
        type: GET_ORDERBOOK,
    });
    res.json(response);
}

export const getOrderbookBySymbol = async (req: Request, res: Response) => {
    const { stockSymbol } = req.params;
    const response = await RedisManager.getInstance().sendAndAwait({
        type: GET_ORDERBOOK_BY_SYMBOL,
        data: {
            stockSymbol
        }
    });
    res.json(response)
}

export const buyOrder = async (req: Request, res: Response) => {
    const {userId, stockSymbol, quantity, price, stockType} = req.body;

    const response = await RedisManager.getInstance().sendAndAwait({
        type: BUY_ORDER,
        data: {
            userId,
            stockSymbol,
            quantity,
            price,
            stockType
        }
    })

    res.json(response)
}

export const sellOrder = async (req: Request, res: Response) => {
    const { userId, stockSymbol, quantity, price, stockType } = req.body;

    const response = await RedisManager.getInstance().sendAndAwait({
        type: SELL_ORDER,
        data: {
            userId,
            stockSymbol,
            quantity,
            price,
            stockType
        }
    })
    res.json(response);
}