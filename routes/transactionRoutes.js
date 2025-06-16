import express from "express"
import { sql } from "../config/db.js";
import {getTransactionByUserid,createTransaction, deleteTransaction, getTransactionSummary} from "../controllers/transactionsControllers.js"

const router =express.Router();
router.get("/:userid",getTransactionByUserid)

router.post("/",createTransaction);


router.delete("/:id",deleteTransaction)

router.get("/summary/:userId",getTransactionSummary)



export default router
