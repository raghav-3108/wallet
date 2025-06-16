import { sql } from "../config/db.js";



export async function getTransactionByUserid(req,res) {
     
        try { 
            const {userid}=req.params
          const transactions = await sql`
                SELECT * FROM transactions WHERE user_id = ${userid}  ORDER BY created_at DESC
                `;
            res.status(200).json(transactions)
    
        } catch (error) {
            console.error("Error getting  the transactions:", error);
        res.status(500).json({ message: "internal error" });
            
        }
    
    
    
}

export async function createTransaction(req,res) {
    
      try {
        const { title, amount, category, user_id } = req.body;
    
        if (!title || amount === undefined || !category || !user_id) {
          return res.status(400).json({ message: "all fields required" });
        }
    
        const transaction = await sql`
          INSERT INTO transactions(user_id, title, amount, category)
          VALUES (${user_id}, ${title}, ${amount}, ${category})
          RETURNING *
        `;
    
        res.status(201).json(transaction[0]);
      } catch (error) {
        console.error("Error creating the transaction:", error);
        res.status(500).json({ message: "internal error" });
      }
  
    
}

export async function deleteTransaction(req,res) {

    try {
        const {id}= req.params

        if (isNaN(parseInt(id))) {
        return res.status(400).json({ message: "Invalid ID" });
          }


        const result= await sql `
         DELETE FROM transactions WHERE id=${id} RETURNING *
         `
         if(result.length===0){
            res.status(404).json({message:"transaction not found"})

         }

         res.status(200).json({message:"transaction deleted successfully"})
        
    } catch (error) {
        console.error("Error deleting the transaction:", error);
    res.status(500).json({ message: "internal error" });
    }

 
}

export async function getTransactionSummary(req,res) {

  

  try {
    const {userId}=req.params
    const balanceResult = await sql`
  SELECT COALESCE(SUM(amount), 0) as balance 
  FROM transactions 
  WHERE user_id = ${userId}
`;

const incomeResult = await sql`
  SELECT COALESCE(SUM(amount), 0) as income 
  FROM transactions 
  WHERE user_id = ${userId} AND amount > 0
`;

const expensesResult = await sql`
  SELECT COALESCE(SUM(amount), 0) as expenses 
  FROM transactions 
  WHERE user_id = ${userId} AND amount < 0
`;

res.status(200).json({
  balance: balanceResult[0].balance,
  income: incomeResult[0].income,
  expenses: expensesResult[0].expenses,
});

    
  } catch (error) {
    console.error("Error getting the  summary:", error);
    res.status(500).json({ message: "internal error" });
    
  }

    
}