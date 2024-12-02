import { Request, Response } from "express"
import { RedisManager } from "../RedisManager"
import { GET_ALL_INR_BALANCES, GET_ALL_STOCK_BALANCES, GET_INR_BALANCE_BY_USER_ID, GET_STOCK_BALANCE_BY_USER_ID, ON_RAMP_INR_TO_USER_ID, RESET_ALL_BALANCES } from "../types/types"

export const getAllINRBalances = async( req: Request, res: Response) => {
    const response = await RedisManager.getInstance().sendAndAwait({
        type: GET_ALL_INR_BALANCES
    })

    res.json(response);
}

export const getAllStockBalances = async( req: Request, res: Response) => {
    const response = await RedisManager.getInstance().sendAndAwait({
        type: GET_ALL_STOCK_BALANCES
    })

    res.json(response);
}

export const resetAllBalances = async( req: Request, res: Response) => {
    const response = await RedisManager.getInstance().sendAndAwait({
        type: RESET_ALL_BALANCES
    })

    res.json(response);
}

export const getINRBalancesByUserId = async( req: Request, res: Response) => {

    const { userId } = req.params;
    const response = await RedisManager.getInstance().sendAndAwait({
        type: GET_INR_BALANCE_BY_USER_ID,
        data: {
            userId
        }
    })

    res.json(response)
}


export const onRampINRToUserId = async( req: Request, res: Response) => {
    const { userId, amount } = req.body;

    const response = await RedisManager.getInstance().sendAndAwait({
        type: ON_RAMP_INR_TO_USER_ID,
        data: {
            userId,
            amount
        }
    })

    res.json(response);
}

export const getStockBalanceByUserId = async( req: Request, res: Response) => {
    const { userId } = req.body;
    const response = await RedisManager.getInstance().sendAndAwait({
        type: GET_STOCK_BALANCE_BY_USER_ID,
        data: {
            userId
        }
    })

    res.json(response);
}