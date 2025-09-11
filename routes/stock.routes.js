const { Router } = require('express');
const dotenv = require("dotenv")
const router = Router();
const {addRecord,updateCell,readData} = require("../controllers/excelController")

router.post('/addStock', async (req,res)=>{
    try{
        const body = req.body
        const payload = Object.values(body);
        const result = await addRecord(payload)
        res.status(200).json(result)
    }catch(err){
        res.status(500).send(err)
    }
})
router.get('/stock', async (req,res)=>{
    try{
        const result = await readData()
        res.status(200).json(result)
    }catch(err){
        res.status(500).send(err)
    }
})

module.exports = router;