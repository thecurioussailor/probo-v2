export const CREATE_USER = "CREATE_USER"
export const CREATE_STOCK_SYMBOL = "CREATE_STOCK_SYMBOL"
export const GET_ORDERBOOK ="GET_ORDERBOOK"
export const GET_ALL_INR_BALANCES = "GET_ALL_INR_BALANCES"
export const GET_ALL_STOCK_BALANCES = "GET_ALL_STOCK_BALANCES"
export const RESET_ALL_BALANCES = "RESET_ALL_BALANCES"
export const GET_INR_BALANCE_BY_USER_ID = "GET_INR_BALANCE_BY_USER_ID"
export const ON_RAMP_INR_TO_USER_ID = "ON_RAMP_INR_TO_USER_ID";
export const GET_STOCK_BALANCE_BY_USER_ID = "GET_STOCK_BALANCE_BY_USER_ID";
export const BUY_ORDER = "BUY_ORDER";
export const SELL_ORDER = "SELL_ORDER";
export const GET_ORDERBOOK_BY_SYMBOL = "GET_ORDERBOOK_BY_SYMBOL"
export const MINT_TRADE = "MINT_TRADE"

export type MessageFromAPI = {
    type: typeof CREATE_USER,
    data: {
        userId: string
    }
} | {
    type: typeof CREATE_STOCK_SYMBOL,
    data: {
        stockSymbol: string
    }
} | {
    type: typeof GET_ORDERBOOK,
} | {
    type: typeof GET_ALL_INR_BALANCES
} | {
    type: typeof GET_ALL_STOCK_BALANCES
} | {
    type: typeof RESET_ALL_BALANCES
} | {
    type: typeof GET_INR_BALANCE_BY_USER_ID,
    data: {
        userId: string
    }
} | {
    type: typeof ON_RAMP_INR_TO_USER_ID,
    data: {
        userId: string,
        amount: number
    }
} | {
    type: typeof GET_STOCK_BALANCE_BY_USER_ID,
    data: {
        userId: string
    }
} | {
    type: typeof BUY_ORDER,
    data: {
        userId: string,
        stockSymbol: string,
        quantity: number,
        price: number,
        stockType: "yes" | "no"
    }
} | {
    type: typeof SELL_ORDER,
    data: {
        userId: string,
        stockSymbol: string,
        quantity: number,
        price: number,
        stockType: "yes" | "no"
    }
} | {
    type: typeof GET_ORDERBOOK_BY_SYMBOL,
    data: {
        stockSymbol: string
    }
}|{
    type: typeof MINT_TRADE,
    data: {
        userId: string,
        stockSymbol: string,
        quantity: number
    }
}

export type MessageFromOrderbook = {

}

export type WsMessage = {
        yes: {
            price: number;
            totalQuantity: number;
        }[];
        no: {
            price: number;
            totalQuantity: number;
        }[];
}