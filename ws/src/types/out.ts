export type OutMessage = {
    yes: {
        price: number;
        totalQuantity: number;
    }[];
    no: {
        price: number;
        totalQuantity: number;
    }[];
}