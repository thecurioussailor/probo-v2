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
                    console.log(err);
                    RedisManager.getInstance().sendToAPI(clientId, {
                        type: "ERROR",
                        payload: {
                            message: "User Already exist."
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
                    RedisManager.getInstance().sendToAPI(clientId, {
                        type: "ERROR",
                        payload: {
                            message: "Error while Creating Stock Symbol"
                        }
                    })
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
                    console.log(err)
                    RedisManager.getInstance().sendToAPI(clientId, {
                        type: "ERROR",
                        payload: {
                            message: "Error while fetching Orderbook."
                        }
                    })
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
                    console.log(err)
                    RedisManager.getInstance().sendToAPI(clientId, {
                        type: "ERROR",
                        payload: {
                            message: "Error while fetching Balances."
                        }
                    })
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
                    console.log(err)
                    RedisManager.getInstance().sendToAPI(clientId, {
                        type: "ERROR",
                        payload: {
                            message: "Error while fetching Stock Balances."
                        }
                    })
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
                    console.log(err)
                    RedisManager.getInstance().sendToAPI(clientId, {
                        type: "ERROR",
                        payload: {
                            message: "Error while reseting"
                        }
                    })
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
                    console.log(err);
                    RedisManager.getInstance().sendToAPI(clientId, {
                        type: "ERROR",
                        payload: {
                            message: "Error while fetching user balance."
                        }
                    })
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
                    console.log(err)
                    RedisManager.getInstance().sendToAPI(clientId, {
                        type: "ERROR",
                        payload: {
                            message: "Error while onramping the INR."
                        }
                    })
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
                    console.log(err)
                    RedisManager.getInstance().sendToAPI(clientId, {
                        type: "ERROR",
                        payload: {
                            message: "Error while fetching User Stock Balance."
                        }
                    })
                }
                break;
            case BUY_ORDER:
                try{
                    const payload = this.buyOrder(message.data);
                    RedisManager.getInstance().sendToAPI(clientId, {
                        type: "BUY_ORDER",
                        payload
                    })
                }catch (err){
                    console.log(err)
                    RedisManager.getInstance().sendToAPI(clientId, {
                        type: "ERROR",
                        payload: {
                            message: "Error while placing the orders."
                        }
                    })
                }
                break;
            case SELL_ORDER:
                try{
                    const payload = this.sellOrder(message.data);
                    RedisManager.getInstance().sendToAPI(clientId, {
                        type: "SELL_ORDER",
                        payload
                    })
                }catch (err){
                    console.log(err)
                    RedisManager.getInstance().sendToAPI(clientId, {
                        type: "ERROR",
                        payload: {
                            message: "Error while placing the orders."
                        }
                    })
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
                    console.log(err)
                    RedisManager.getInstance().sendToAPI(clientId, {
                        type: "ERROR",
                        payload: {
                            message: "Error while fetching particular Orderbook"
                        }
                    })
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
                    console.log(err)
                    RedisManager.getInstance().sendToAPI(clientId, {
                        type: "ERROR",
                        payload: {
                            message: "Error while Minting Trade."
                        }
                    })
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
        if (!this.INR_BALANCES[userId]) {
            throw new Error(`User with ID ${userId} not found in INR_BALANCES.`);
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

        if(!this.INR_BALANCES[userId]){
            throw new Error("User does not exist.");
        }

        const filteredOrder = this.ORDERBOOK.find(order => order.stockSymbol === stockSymbol);
        console.log(filteredOrder)
        if(!filteredOrder){
            throw new Error("Stock symbol not found in the order book.")
        }

        const totalCost = price * quantity;

        if(!(this.INR_BALANCES[userId].balance > totalCost)){
            throw new Error("Insufficient Balance.")
        }

        //lock user balance
        this.INR_BALANCES[userId].balance -= totalCost;
        this.INR_BALANCES[userId].locked += totalCost;
        if(!filteredOrder.checkPriceExist(price.toString(), stockType)){
            filteredOrder.placeReversedOrders(userId, stockType, quantity, price);
            const orderBook = filteredOrder.getOrderbook()
            this.publishWsOrderbook(stockSymbol, orderBook);
            return {
                quantity,
                remainingQuantity: 0,
                status: "Order placed without matching"
            }
        }
        //matching logic
        let remainingQuantity = quantity;

        const priceLevels = filteredOrder.getStockType(stockType);
        Object.keys(priceLevels).sort().forEach(priceLevel => {
            if(parseInt(priceLevel) <= price && remainingQuantity > 0){
                const totalAvailableQuantity = priceLevels[priceLevel].total;
                let matchedQuantity = Math.min(remainingQuantity, totalAvailableQuantity);
                const ordersAtPriceLevel  = priceLevels[priceLevel].orders;
                Object.keys(ordersAtPriceLevel).forEach(userIdAtOrders => {
                    const userOrderQuantity = ordersAtPriceLevel[userIdAtOrders].totalQuantity;
                    const userDirectOrderQuantity = ordersAtPriceLevel[userIdAtOrders].direct;
                    const userIndirectOrderQuantity = ordersAtPriceLevel[userIdAtOrders].indirect;
                    if(matchedQuantity <= userOrderQuantity && remainingQuantity > 0){
                        if( userDirectOrderQuantity > 0 && remainingQuantity > 0){
                            if(userDirectOrderQuantity >= matchedQuantity){
                                console.log("userDirectOrderQuantity >= matchedQuantity")
                                //stock transfer
                                if(!this.STOCK_BALANCES[userIdAtOrders][stockSymbol]){
                                    this.initializeStockSymbolUserStockBalance(userIdAtOrders, stockSymbol);
                                }
                                if(!this.STOCK_BALANCES[userId][stockSymbol]){
                                    this.initializeStockSymbolUserStockBalance(userId, stockSymbol);
                                }
                                this.STOCK_BALANCES[userIdAtOrders][stockSymbol][stockType].locked -= matchedQuantity;
                                this.STOCK_BALANCES[userId][stockSymbol][stockType].quantity += matchedQuantity;
                                //money transfer
                                const transactionAmount = parseInt(priceLevel) * matchedQuantity;
                                this.INR_BALANCES[userId].locked -= transactionAmount;
                                this.INR_BALANCES[userIdAtOrders].balance += transactionAmount;
                                //updating orderbook
                                filteredOrder.substractOrder(priceLevel, userIdAtOrders, matchedQuantity, stockType, "direct");
                                //remaining quantity
                                remainingQuantity -= matchedQuantity;
                            }
                            if(userDirectOrderQuantity < matchedQuantity){
                                //stock transfer
                                if(!this.STOCK_BALANCES[userIdAtOrders][stockSymbol]){
                                    this.initializeStockSymbolUserStockBalance(userIdAtOrders, stockSymbol);
                                }
                                if(!this.STOCK_BALANCES[userId][stockSymbol]){
                                    this.initializeStockSymbolUserStockBalance(userId, stockSymbol);
                                }
                                this.STOCK_BALANCES[userIdAtOrders][stockSymbol][stockType].locked -= userDirectOrderQuantity;
                                this.STOCK_BALANCES[userId][stockSymbol][stockType].quantity += userDirectOrderQuantity;
                                //money transfer
                                const transactionAmount = price * userDirectOrderQuantity;
                                this.INR_BALANCES[userId].locked -= transactionAmount;
                                this.INR_BALANCES[userIdAtOrders].balance += transactionAmount;
                                //updating orderbook
                                filteredOrder.substractOrder(priceLevel, userIdAtOrders, userDirectOrderQuantity, stockType, "direct");
                                //remaining quantity
                                remainingQuantity -= userDirectOrderQuantity;
                            }
                        }
                        if(userIndirectOrderQuantity > 0 && remainingQuantity > 0){
                            if(userIndirectOrderQuantity >= matchedQuantity){
                                console.log("inside userindirectorderquantity", userIndirectOrderQuantity);
                                const reversedStockType = stockType === "yes" ? "no" : "yes";
                                const complementPrice = 10 - price;
                                //deducting the amount from both parties
                                this.INR_BALANCES[userId].locked -= matchedQuantity * price;
                                this.INR_BALANCES[userIdAtOrders].locked -= complementPrice * matchedQuantity;
                                if(!this.STOCK_BALANCES[userIdAtOrders][stockSymbol]){
                                    this.initializeStockSymbolUserStockBalance(userIdAtOrders, stockSymbol);
                                }
                                if(!this.STOCK_BALANCES[userId][stockSymbol]){
                                    this.initializeStockSymbolUserStockBalance(userId, stockSymbol);
                                }
                                //updating stock balances
                                this.STOCK_BALANCES[userId][stockSymbol][stockType].quantity += matchedQuantity;
                                this.STOCK_BALANCES[userIdAtOrders][stockSymbol][reversedStockType].quantity += matchedQuantity;
                                // updating the orderbook
                                filteredOrder.substractOrder(priceLevel, userIdAtOrders, matchedQuantity, stockType, "indirect");
                                //remaining quantity
                                remainingQuantity -= matchedQuantity;
                                console.log("remaining quantity " + remainingQuantity)
                            }
                            if(userIndirectOrderQuantity < matchedQuantity){
                                const reversedStockType = stockType === "yes" ? "no" : "yes";
                                const complementPrice = 10 - price;
                                //deducting the amount from both parties
                                this.INR_BALANCES[userId].locked -= userIndirectOrderQuantity * price;
                                this.INR_BALANCES[userIdAtOrders].locked -= complementPrice * userIndirectOrderQuantity;
                                if(!this.STOCK_BALANCES[userIdAtOrders][stockSymbol]){
                                    this.initializeStockSymbolUserStockBalance(userIdAtOrders, stockSymbol);
                                }
                                if(!this.STOCK_BALANCES[userId][stockSymbol]){
                                    this.initializeStockSymbolUserStockBalance(userId, stockSymbol);
                                }
                                //updating stock balances
                                this.STOCK_BALANCES[userId][stockSymbol][stockType].quantity += userIndirectOrderQuantity;
                                this.STOCK_BALANCES[userIdAtOrders][stockSymbol][reversedStockType].quantity += userIndirectOrderQuantity;
                                // updating the orderbook
                                filteredOrder.substractOrder(priceLevel, userIdAtOrders, userIndirectOrderQuantity, stockType, "indirect");
                                //remaining quantity
                                remainingQuantity -= userIndirectOrderQuantity;
                                console.log("remaining quantity " + remainingQuantity)
                            }
                            
                        }
                    }
                    if(matchedQuantity > userOrderQuantity && remainingQuantity > 0){
                        if(userDirectOrderQuantity > 0 && remainingQuantity > 0){
                            //stock transfer
                            if(!this.STOCK_BALANCES[userIdAtOrders][stockSymbol]){
                                this.initializeStockSymbolUserStockBalance(userIdAtOrders, stockSymbol);
                            }
                            if(!this.STOCK_BALANCES[userId][stockSymbol]){
                                this.initializeStockSymbolUserStockBalance(userId, stockSymbol);
                            }
                            this.STOCK_BALANCES[userId][stockSymbol][stockType].quantity += userDirectOrderQuantity;
                            this.STOCK_BALANCES[userIdAtOrders][stockSymbol][stockType].locked -= userDirectOrderQuantity;

                            //money transfer 
                            const transactionAmount = price * userDirectOrderQuantity;
                            this.INR_BALANCES[userId].locked -= transactionAmount;
                            this.INR_BALANCES[userIdAtOrders].balance += transactionAmount;
                            //updating orderbook
                            filteredOrder.substractOrder(priceLevel, userIdAtOrders, userDirectOrderQuantity, stockType, "direct");
                            //remaining quantity
                            remainingQuantity -= userDirectOrderQuantity;
                            matchedQuantity -= userDirectOrderQuantity;

                        }
                        if(userIndirectOrderQuantity > 0 && remainingQuantity > 0){
                            const reversedStockType = stockType === "yes" ? "no" : "yes";
                            const complementPrice = 10 - price;
                            //deducting the amount from both parties
                            this.INR_BALANCES[userId].locked -= userIndirectOrderQuantity * price;
                            this.INR_BALANCES[userIdAtOrders].locked -= complementPrice * userIndirectOrderQuantity;
                            
                            if(!this.STOCK_BALANCES[userIdAtOrders][stockSymbol]){
                                this.initializeStockSymbolUserStockBalance(userIdAtOrders, stockSymbol);
                            }
                            if(!this.STOCK_BALANCES[userId][stockSymbol]){
                                this.initializeStockSymbolUserStockBalance(userId, stockSymbol);
                            }
                            //updating stock balances
                            this.STOCK_BALANCES[userId][stockSymbol][stockType].quantity += userIndirectOrderQuantity;
                            this.STOCK_BALANCES[userIdAtOrders][stockSymbol][reversedStockType].quantity += userIndirectOrderQuantity;
                            // updating the orderbook
                            filteredOrder.substractOrder(priceLevel, userIdAtOrders, userIndirectOrderQuantity, stockType, "indirect");
                            //remaining quantity
                            remainingQuantity -= userIndirectOrderQuantity;
                    }
                }
                })
            }
        })
        if(remainingQuantity){
            filteredOrder.placeReversedOrders(userId, stockType, remainingQuantity, price);
        }
        const orderBook = filteredOrder.getOrderbook()
        this.publishWsOrderbook(stockSymbol, orderBook);
        return {
            quantity,
            remainingQuantity,
            status: remainingQuantity === 0 ? "Order Full filled." : "Order Partially filled."
        }
    }
    sellOrder(data: {userId: string, stockSymbol: string, stockType: B, quantity: number, price: number}){
        const {userId, stockSymbol, stockType, quantity, price} = data;

        if(!this.INR_BALANCES[userId]){
            throw new Error("User does not exist.");
        }

        if(!this.STOCK_BALANCES[userId][stockSymbol]){
            throw new Error("Not have Stock to sell.");
        }

        if(this.STOCK_BALANCES[userId][stockSymbol][stockType].quantity < quantity){
            throw new Error("Insufficient Stocks");
        }

        const filteredOrder = this.ORDERBOOK.find(order => order.stockSymbol === stockSymbol);
        console.log(filteredOrder)
        if(!filteredOrder){
            throw new Error("Stock symbol not found in the order book.")
        }

        //locking the stocks
        this.STOCK_BALANCES[userId][stockSymbol][stockType].quantity -= quantity;
        this.STOCK_BALANCES[userId][stockSymbol][stockType].locked += quantity;

        //only initialize but not place orders as to check the indirect orders
        if(!filteredOrder.checkPriceExist(price.toString(), stockType)){
            filteredOrder.initializePrice(price.toString(), stockType);
            filteredOrder.initializeUser(userId, price.toString(), stockType);
        }

        //match logic
        let remainingQuantity = quantity;

        
        const priceLevels = filteredOrder.getStockType(stockType);
        Object.keys(priceLevels).sort().reverse().forEach( priceLevel => {
            if(parseInt(priceLevel) >= price && remainingQuantity > 0){
                const ordersAtPriceLevel = priceLevels[priceLevel].orders;
                Object.keys(ordersAtPriceLevel).forEach(userIdAtOrders => {
                    const userOrderQuantity = ordersAtPriceLevel[userIdAtOrders].totalQuantity;
                    const userIndirectOrderQuantity = ordersAtPriceLevel[userIdAtOrders].indirect;
                    if(userIndirectOrderQuantity > 0 && remainingQuantity > 0){
                        const matchedQuantity = Math.min(remainingQuantity, userIndirectOrderQuantity)
                        const reversedStockType = stockType === "yes" ? "no" : "yes";
                        const complementPrice = 10 - parseInt(priceLevel);
                        if(userIndirectOrderQuantity >= matchedQuantity && remainingQuantity > 0){

                            //stock transfer
                            this.STOCK_BALANCES[userId][stockSymbol][stockType].locked -= matchedQuantity;
                            this.STOCK_BALANCES[userIdAtOrders][stockSymbol][reversedStockType].quantity += matchedQuantity;
                            //inr transfer
                            this.INR_BALANCES[userId].balance += matchedQuantity * parseInt(priceLevel);
                            this.INR_BALANCES[userIdAtOrders].locked -= matchedQuantity * complementPrice;

                            //updating orderbook
                            filteredOrder.substractOrder(priceLevel, userIdAtOrders, matchedQuantity, stockType, "indirect");
                            remainingQuantity -= matchedQuantity;

                        }
                        if(userIndirectOrderQuantity < matchedQuantity && remainingQuantity > 0){
                            //stock transfer
                            this.STOCK_BALANCES[userId][stockSymbol][stockType].locked -= userIndirectOrderQuantity;
                            this.STOCK_BALANCES[userIdAtOrders][stockSymbol][reversedStockType].quantity += userIndirectOrderQuantity;
                            //inr transfer
                            this.INR_BALANCES[userId].balance += userIndirectOrderQuantity * parseInt(priceLevel);
                            this.INR_BALANCES[userIdAtOrders].locked -= userIndirectOrderQuantity * complementPrice;

                            //updating orderbook
                            filteredOrder.substractOrder(priceLevel, userIdAtOrders, userIndirectOrderQuantity, stockType, "indirect");
                            remainingQuantity -= userIndirectOrderQuantity;
                        }

                    }
                })

            }
        })

        //place order
        if(remainingQuantity){
            filteredOrder.placeOrders(userId, stockType, remainingQuantity, price)
        }
        //publish to WebSocket
        
        const orderBook = filteredOrder.getOrderbook()
        this.publishWsOrderbook(stockSymbol, orderBook);
        //return the status
        return {
            quantity,
            remainingQuantity,
            status: remainingQuantity === 0 ? "Order Full filled." : "Order Partially filled."
        }
    }
    orderbookBySymbol(stockSymbol: string){
        const filteredOrders = this.ORDERBOOK.filter(order => order.stockSymbol === stockSymbol);
        if(filteredOrders.length === 0){
            throw new Error("Stock symbol not found in the order book.")
        }
        const ReqOrderBook = filteredOrders[0];
        return ReqOrderBook;
    }
    mintTrade(userId: string, stockSymbol: string, quantity: number){
        if(!this.INR_BALANCES[userId]){
            throw new Error("User does not exist.");
        }

        const filteredOrders = this.ORDERBOOK.filter(order => order.stockSymbol === stockSymbol);
        if(filteredOrders.length === 0){
            throw new Error("Stock symbol not found in orderbook");
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

    //some helper functions for buy and sell order
    initializeStockSymbolUserStockBalance(userId: string, stockSymbol: string){
        this.STOCK_BALANCES[userId][stockSymbol] = {
            "yes": {
                quantity: 0,
                locked: 0
            },
            "no": {
                quantity: 0,
                locked: 0
            }
        }
    }
    publishWsOrderbook(stockSymbol: string, orderbook: {
        yes: {
            price: number;
            totalQuantity: number;
        }[];
        no: {
            price: number;
            totalQuantity: number;
        }[];
    }){
        RedisManager.getInstance().publishMessage(stockSymbol, orderbook);
    }
}