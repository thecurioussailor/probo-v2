import { RedisManager } from "../RedisManager"
import { BUY_ORDER, CREATE_STOCK_SYMBOL, CREATE_USER, GET_ALL_INR_BALANCES, GET_ALL_STOCK_BALANCES, GET_INR_BALANCE_BY_USER_ID, GET_ORDERBOOK, GET_ORDERBOOK_BY_SYMBOL, GET_STOCK_BALANCE_BY_USER_ID, MessageFromAPI, MINT_TRADE, ON_RAMP_INR_TO_USER_ID, RESET_ALL_BALANCES, SELL_ORDER } from "../types/types"
import { Order } from "./orderbook"

export type Inr_Balances = {
    [userId: string] : {
        balance: number,
        locked: number
    }
}

export type B = "yes" | "no"
export type Stock_Balances = {
    [userId: string] : {
        [stockSymbol: string]: {
            [stockType in B]: {
                quantity: number,
                locked: number
            }
        }
    }
}

export class Engine {
    private INR_BALANCES: Inr_Balances = {}
    private STOCK_BALANCES: Stock_Balances = {} 
    private ORDERBOOK: Order[]=[];

    constructor(){

    }

    process({message, clientId} : {message: MessageFromAPI, clientId: string}){
        switch(message.type){
            case CREATE_USER:
                try {
                    const payload = this.createUser(message.data.userId);
                    RedisManager.getInstance().sendToAPI(clientId, {
                        type: "USER_CREATED",
                        payload
                    })
                } catch (err) {
                    RedisManager.getInstance().sendToAPI(clientId, {
                        type: "USER_EXIST",
                        payload: {
                            userId: ""
                        }
                    })
                }
                break;
            case CREATE_STOCK_SYMBOL: 
                try{
                    const payload = this.createStockSymbol(message.data.stockSymbol);
                    RedisManager.getInstance().sendToAPI(clientId, {
                        type: "SYMBOL_CREATED",
                        payload
                    })
                }catch (err){

                }
                break;
            case GET_ORDERBOOK:
                try{
                    const payload = this.getOrderbook();
                    RedisManager.getInstance().sendToAPI(clientId, {
                        type: "ORDERBOOK",
                        payload
                    })
                }catch (err){
                    
                }
                break;
            case GET_ALL_INR_BALANCES:
                try{
                    const payload = this.getAllINRBalances();
                    RedisManager.getInstance().sendToAPI(clientId, {
                        type: "INR_BALANCES",
                        payload
                    })
                }catch (err){
                    
                }
                break;
            case GET_ALL_STOCK_BALANCES:
                try{
                    const payload = this.getAllStockBalances();
                    RedisManager.getInstance().sendToAPI(clientId, {
                        type: "STOCK_BALANCES",
                        payload
                    })
                }catch (err){
                    
                }
                break;
            case RESET_ALL_BALANCES:
                try{
                    this.resetAllBalances();
                    RedisManager.getInstance().sendToAPI(clientId, {
                        type: "RESET_BALANCES",
                        payload: {
                            message: "All balances has been reset."
                        }
                    })
                }catch (err){
                    
                }
                break;
            case GET_INR_BALANCE_BY_USER_ID:
                try{
                    const payload = this.getINRBalanceByUserId(message.data.userId);
                    RedisManager.getInstance().sendToAPI(clientId, {
                        type: "USER_INR_BALANCE",
                        payload
                    })
                }catch (err){
                    
                }
                break;
            case ON_RAMP_INR_TO_USER_ID:
                try{
                    const payload = this.onRampINRToUser(message.data.userId, message.data.amount);
                    RedisManager.getInstance().sendToAPI(clientId, {
                        type: "ONRAMP_INR_USER",
                        payload
                    })
                }catch (err){
                    
                }
                break;
            case GET_STOCK_BALANCE_BY_USER_ID:
                try{
                    const payload = this.getStockBalanceByUserId(message.data.userId);
                    RedisManager.getInstance().sendToAPI(clientId, {
                        type: "USER_STOCK_BALANCE",
                        payload
                    })
                }catch (err){
                    
                }
                break;
            case BUY_ORDER:
                try{
                    this.buyOrder(message.data);
                }catch (err){
                    
                }
                break;
            case SELL_ORDER:
                try{

                }catch (err){
                    
                }
                break;
            case GET_ORDERBOOK_BY_SYMBOL:
                try{
                    const payload = this.orderbookBySymbol(message.data.stockSymbol);
                    RedisManager.getInstance().sendToAPI(clientId, {
                        type: "ORDERBOOK_SYMBOL",
                        payload
                    })
                }catch (err){
                    
                }
                break;
            case MINT_TRADE:
                try{
                    const payload = this.mintTrade(message.data.userId, message.data.stockSymbol, message.data.quantity);
                    RedisManager.getInstance().sendToAPI(clientId, {
                        type: "MINTED",
                        payload
                    })
                }catch (err){
                    
                }
                break;
        }
    }

    createUser(userId: string){
        if(this.INR_BALANCES[userId]){
            throw new Error("User Already Exist.")
        }
        this.INR_BALANCES[userId] = {
            balance: 0,
            locked: 0
        }
        this.STOCK_BALANCES[userId] = {}
        return {
            userId
        };
    }

    createStockSymbol(stockSymbol: string){
        const symbolExists = this.ORDERBOOK.some(order => order.stockSymbol === stockSymbol)
        if(symbolExists){
            throw new Error("Stock symbol already exists.");
        }

        this.ORDERBOOK.push(new Order(stockSymbol));

        return {
            stockSymbol,
            message: "Stock symbol created."
        }
    }

    getOrderbook(){
        const orderbook = this.ORDERBOOK;
        return this.ORDERBOOK;
    }
    getAllINRBalances(){
        return this.INR_BALANCES;
    }
    getAllStockBalances(){
        return this.STOCK_BALANCES;
    }
    resetAllBalances(){
        Object.keys(this.INR_BALANCES).forEach((key) => delete this.INR_BALANCES[key]);
        Object.keys(this.STOCK_BALANCES).forEach((key) => delete this.STOCK_BALANCES[key]);
        this.ORDERBOOK = [];
    }
    getINRBalanceByUserId(userId: string){
        if(!this.INR_BALANCES[userId]){
            throw new Error("No user found.");
        }

        const balance = this.INR_BALANCES[userId].balance;
        return {
            balance
        }
    }
    onRampINRToUser(userId: string, amount: number){
        if(!this.INR_BALANCES[userId]){
            throw new Error("User not found.")
        }

        this.INR_BALANCES[userId].balance += amount;

        return this.INR_BALANCES[userId];
    }
    getStockBalanceByUserId(userId: string){
        if(!this.STOCK_BALANCES[userId]){{
            throw new Error("User not available.");
        }}

        return this.STOCK_BALANCES[userId];
    }
    buyOrder(data: {userId: string, stockSymbol: string, stockType: B, quantity: number, price: number}){
        const {userId, stockSymbol, stockType, quantity, price} = data;

    }
    sellOrder(){

    }
    orderbookBySymbol(stockSymbol: string){
        const filteredOrders = this.ORDERBOOK.filter(order => order.stockSymbol === stockSymbol);
        if(filteredOrders.length === 0){
            throw new Error("Stock symbol not found in the order book.")
        }

        return filteredOrders;
    }
    mintTrade(userId: string, stockSymbol: string, quantity: number){
        if(!this.INR_BALANCES[userId]){
            throw new Error("User does not exist.");
        }

        if(!this.STOCK_BALANCES[userId][stockSymbol]){
            this.STOCK_BALANCES[userId][stockSymbol] = {
                    yes: {
                        quantity: 0,
                        locked: 0
                    },
                    no: {
                        quantity: 0,
                        locked: 0
                    }
                }
            
        }

        this.STOCK_BALANCES[userId][stockSymbol].yes.quantity += quantity;
        this.STOCK_BALANCES[userId][stockSymbol].no.quantity += quantity;

        return this.STOCK_BALANCES[userId][stockSymbol];
    }
}