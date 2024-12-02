type OrderType =  {
    [price: string]: {
        total: number,
        orders: {
            [userId: string]: {
                totalQuantity: number,
                direct: number,
                indirect: number
            }
        }
    }
}
        
export class Order {
    public stockSymbol: string;
    private yes: OrderType;
    private no: OrderType;

    constructor(stockSymbol: string){
        this.stockSymbol = stockSymbol;
        this.yes = {}
        this.no = {}
    }

    getStockType(stockType: string){
        return stockType === "yes" ? this.yes : this.no
    }

    checkPriceExist(price: string, SymbolType: "yes" | "no"){
        const priceLevels = this.getStockType(SymbolType);
        if(priceLevels[price]){
            return true;
        }
        return false;
    };
    initializePrice(price: string, stockType: "yes" | "no"){
        const priceLevels = this.getStockType(stockType);
        if(!priceLevels[price]){
            priceLevels[price] = {
                total: 0,
                orders: {
    
                }
            }
        }
        
    }
    initializeUser(userId: string, price: string, stockType: "yes" | "no"){
        const priceLevels = this.getStockType(stockType);
        if(!priceLevels[price].orders[userId]){
            priceLevels[price].orders[userId] = {
                totalQuantity: 0,
                direct: 0,
                indirect: 0
            };
        }
    }
    addOrder(price: string, userId: string, quantity: number,stockType: "yes" | "no", orderType: "direct" | "indirect"){
        console.log("inside add order.")
        const priceLevels = this.getStockType(stockType);
        priceLevels[price].total += quantity;
        priceLevels[price].orders[userId].totalQuantity += quantity;
        if(orderType === "direct"){
            console.log("inside direct");
            priceLevels[price].orders[userId].direct += quantity;
        }
        
        if(orderType === "indirect"){
            console.log("inside indirect");
            priceLevels[price].orders[userId].indirect += quantity;
        }
    };
    substractOrder(price: string, userId: string, quantity: number,stockType: "yes" | "no", orderType: "direct" | "indirect"){
        const priceLevels = this.getStockType(stockType);
        console.log("inside substract order")
        if(priceLevels[price]){
            const userOrder = priceLevels[price].orders[userId];

            if(userOrder){
                priceLevels[price].total -= quantity;
                userOrder.totalQuantity -= quantity;
                if(orderType === "direct"){
                    userOrder.direct -= quantity;
                }
                if(orderType === "indirect"){
                    userOrder.indirect -= quantity;
                }

                if(userOrder.totalQuantity === 0){
                    this.removeUserId(userId, price, stockType)
                }
                
            }
           
        }
    };
    removeUserId(userId: string, price: string, stockType: "yes" | "no"){

        const priceLevels = this.getStockType(stockType)

        if(priceLevels[price]){
            if(priceLevels[price].orders[userId]){
                delete priceLevels[price].orders[userId];
            }
        }

        if(Object.keys(priceLevels[price].orders).length === 0){
            if(priceLevels[price].total === 0) {
                this.removeOrder(price, stockType)
            }
        }
    };
    removeOrder(price: string, stockType: "yes" | "no"){
        const priceLevels = this.getStockType(stockType);
        if(priceLevels[price]){
            delete priceLevels[price]
        }
    };

    placeReversedOrders(userId: string, stockType: "yes" | "no", quantity: number, price: number){
        const reversedStockType = stockType === "yes" ? "no" : "yes";
        const complementPrice = 10 - price;
        console.log("inside placereverseorder");
        if(quantity){
            if(!this.checkPriceExist(complementPrice.toString(), reversedStockType)){
                this.initializePrice(complementPrice.toString(), reversedStockType);
                this.initializeUser(userId, complementPrice.toString(), reversedStockType);
                this.addOrder(complementPrice.toString(), userId, quantity, reversedStockType, "indirect")
            }else {
                this.initializeUser(userId, complementPrice.toString(), reversedStockType);
                this.addOrder(complementPrice.toString(), userId, quantity, reversedStockType, "indirect")
            }
        }
    };
    placeOrders(userId: string, stockType: "yes" | "no", quantity: number, price: number){
        if(quantity){
            if(!this.checkPriceExist(price.toString(), stockType)){
                this.initializePrice(price.toString(), stockType);
                this.initializeUser(userId, price.toString(), stockType);
                this.addOrder(price.toString(), userId, quantity, stockType, "direct")
            }else {
                this.initializeUser(userId, price.toString(), stockType);
                this.addOrder(price.toString(), userId, quantity, stockType, "direct")
            }
        }
    }
    getOrderbook(){
        const yesPriceLevels = this.getStockType("yes");
        const noPriceLevels = this.getStockType("no");

        const yesStock = Object.keys(yesPriceLevels).sort().map(priceLevel => ({
            price: parseInt(priceLevel),
            totalQuantity: yesPriceLevels[priceLevel].total
        }))
        const noStock = Object.keys(noPriceLevels).sort().map(priceLevel =>({
            price: parseInt(priceLevel),
            totalQuantity: noPriceLevels[priceLevel].total
        }))
        return {
            yes: yesStock,
            no: noStock
        }
    }
}