import { RedisManager } from "../RedisManager"
import { BUY_ORDER, CREATE_STOCK_SYMBOL, CREATE_USER, GET_ALL_INR_BALANCES, GET_ALL_STOCK_BALANCES, GET_INR_BALANCE_BY_USER_ID, GET_ORDERBOOK, GET_ORDERBOOK_BY_SYMBOL, GET_STOCK_BALANCE_BY_USER_ID, MessageFromAPI, MINT_TRADE, ON_RAMP_INR_TO_USER_ID, RESET_ALL_BALANCES, SELL_ORDER } from "../types/types"

type Inr_Balances = {
    [userId: string] : {
        balance: number,
        locked: number
    }
}

type B = "yes" | "no"
type Stock_Balances = {
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
                    const payload = this.createUser(message.data.stockSymbol);
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

                }catch (err){
                    
                }
                break;
            case GET_ALL_STOCK_BALANCES:
                try{

                }catch (err){
                    
                }
                break;
            case RESET_ALL_BALANCES:
                try{

                }catch (err){
                    
                }
                break;
            case GET_INR_BALANCE_BY_USER_ID:
                try{

                }catch (err){
                    
                }
                break;
            case ON_RAMP_INR_TO_USER_ID:
                try{

                }catch (err){
                    
                }
                break;
            case GET_STOCK_BALANCE_BY_USER_ID:
                try{

                }catch (err){
                    
                }
                break;
            case BUY_ORDER:
                try{

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

                }catch (err){
                    
                }
                break;
            case MINT_TRADE:
                try{

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
        
    }

    getOrderbook(){

    }
    getAllINRBalances(){

    }
    getAllStockBalances(){

    }
    resetAllBalances(){

    }
    getINRBalanceByUserId(){

    }
    onRampINRToUser(){

    }
    getStockBalanceByUserId(){

    }
    buyOrder(){

    }
    sellOrder(){

    }
    orderbookBySymbol(){

    }
    mintTrade(userId: string, stockSymbol: string, quantity: string){

    }
}