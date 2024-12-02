import { Router } from "express";
import { createUser } from "../controller/user";
import { createStockSymbol } from "../controller/symbol";
import { buyOrder, getOrderbook, getOrderbookBySymbol, sellOrder } from "../controller/orderbook";
import { getAllINRBalances, getAllStockBalances, getINRBalancesByUserId, getStockBalanceByUserId, onRampINRToUserId, resetAllBalances } from "../controller/balances";
import { mintTrade } from "../controller/mint";

const router = Router();

router.post('/user/create/:userId', createUser);
router.post('/symbol/create/:stockSymbol', createStockSymbol);
router.get('/orderbook', getOrderbook);
router.get('/balances/inr', getAllINRBalances);
router.get('/balances/stock', getAllStockBalances);
router.get('/reset', resetAllBalances);
router.get('/balance/inr/:userId', getINRBalancesByUserId);
router.post('/onramp/inr', onRampINRToUserId);
router.get('/balance/stock/:userId', getStockBalanceByUserId);
router.post('/order/buy', buyOrder);
router.post('/order/sell', sellOrder);
router.get('/orderbook/:stockSymbol', getOrderbookBySymbol);
router.post('/trade/mint', mintTrade);

export default router;