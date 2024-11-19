type OrderType =  {
    [price: string]: {
        total: number,
        orders: {
            [userId: string]: {
                quantity: number,
                type: "direct" | "indirect"
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
    


}