const {Router} =require('express')
const Link = require('../models/Link')
const router = Router()
const auth = require('../middleware/auth.middleware')
const config = require('config')
const  shortid = require('shortid')

router.post('/generate',async (req,res) =>{
    try {
        const baseUrl = config.get('baseUrl')
        const {from} = req.body
        const code =shortid.generate()
     const existing = await Link.findOne({from})

        if (existing) {
            return res.json( {link: existing})
        }

    } catch (e){
        console.log(e);
        res.status(500).json({messege:'Chtoto ne tak '})

    }

})
router.get('/',async (req,res)=>{
    try {
        const links = await Link.find({owner: null}) //??
        res.json(links)
}catch (e){
    console.log(e);
    res.status(500).json({messege:'Chtoto ne tak '})

}

    })
router.get('/:id',async(req,res)=>{
    try {
        const link = await Link.findById(req.params.id)
        res.json(link)
    }catch (e){
        console.log(e);
        res.status(500).json({messege:'Chtoto ne tak '})

    }
} )

module.exports = router