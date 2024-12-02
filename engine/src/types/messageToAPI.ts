import { B, Inr_Balances, Stock_Balances } from "../trade/engine"
import { Order } from "../trade/orderbook"

export const USER_CREATED = "USER_CREATED"
export const USER_EXIST = "USER_EXIST"
export const SYMBOL_CREATED ="SYMBOL_CREATED"
export const ORDERBOOK = "ORDERBOOK"
export const INR_BALANCES = "INR_BALANCES"
export const STOCK_BALANCES = "STOCK_BALANCES"
export const RESET_BALANCES = "RESET_BALANCES"
export const USER_INR_BALANCE = "USER_INR_BALANCE";
export const ONRAMP_INR_USER = "ONRAMP_INR_USER";
export const USER_STOCK_BALANCE = "USER_STOCK_BALANCE";
export const ORDERBOOK_SYMBOL = "ORDERBOOK_SYMBOL";
export const BUY_ORDER = "BUY_ORDER";
export const SELL_ORDER = "SELL_ORDER";
export const MINTED = "MINTED";
export const MINT_TRADE = "MINT_TRADE";

export type MessageToAPI = {
    type: "ERROR",
    payload: {
        message: string
    }
}| {
    type: typeof USER_CREATED | typeof USER_EXIST,
    payload: {
        userId: string
    }
} | {
    type: typeof SYMBOL_CREATED,
    payload: {
        stockSymbol: string,
        message: string
    }
} | {
    type: typeof ORDERBOOK,
    payload: Order[]
} | {
    type: typeof INR_BALANCES,
    payload: Inr_Balances
} | {
    type: typeof STOCK_BALANCES,
    payload: Stock_Balances
} | {
    type: typeof RESET_BALANCES,
    payload: {
        message: string
    }
} | {
    type: typeof USER_INR_BALANCE,
    payload: {
        balance: number
    }
} | {
    type: typeof ONRAMP_INR_USER,
    payload: {
        balance: number,
        locked: number
    }
} | {
    type: typeof USER_STOCK_BALANCE,
    payload: {
        [stockSymbol: string]: {
            [stockType in B]: {
                quantity: number,
                locked: number
            }
        }
    }
} | {
    type: typeof ORDERBOOK_SYMBOL,
    payload: Order
} | {
    type: typeof MINTED,
    payload: {
        [stockType in B]: {
            quantity: number,
            locked: number
        }
    }
} | {
    type: typeof BUY_ORDER,
    payload: {
        quantity: number,
        remainingQuantity: number, // Corrected typo here
        status: string
    }
} | {
    type: typeof SELL_ORDER,
    payload: {
        quantity: number,
        remainingQuantity: number, // Corrected typo here
        status: string
    }
}