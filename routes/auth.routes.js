const {Router} = require('express')
const bcrypt = require('bcryptjs')
const User = require( '../models/User')
const config = require('config')
const router = Router()
const jwt = require ('jsonwebtoken')
const{check,validationResult} = require ('express-validator')


router.post('/register',
    [ check('email','некоректний email').isEmail(),
    check('password','dluna 6 sumvolov ').isLength({ min: 6})
    ],

    async (req ,res) => {
    try {
        console.log("Body:",req.body);
        const errors = validationResult(req)


     if (!errors.isEmpty()){
         return res.status(400).json({
             errors:errors.array(),
             message:'nekorektnue danue '
         })
     }

     const {email,password} = req.body
        console.log(email);
        console.log(password);
        const  candidate = await User.findOne({email})
     if (candidate) {
         return res.status(400).json({messege: 'Uje est takoy polzovatel '})
     }
const hashedPassword = await bcrypt.hash(password,12)
     const user = new User ({ email, password:hashedPassword })
     await user.save()
     res.status(201).json({messege:'polzovatel sozdan '})
 }catch (e){
        console.log(e);
        res.status(500).json({messege:'Chtoto ne tak '})

}
})
router.post
('/login',
    [
        check('email','vvedute korectnuy email').normalizeEmail().isEmail(),
        check ('password','Vvedute parol').exists()
    ],
    async (req,res)=>{
    try {
            const errors = validationResult(req)
            if (!errors.isEmpty()){
                return res.status(400).json({
                    errors:errors.array(),
                    messege:'nekorektnue danue  pru vhode  '
                })
            }

            const {email,password}=req.body
            const  user  = await User.findOne({email})
            if (!user) {
                return res.status(400).json({messege: 'polzovatel ne nayden '})
            }
            const isMatch = await bcrypt.compare(password,user.password)
        if (!isMatch) {
            return res.status(400).json({messege:'nevernuy parol, poprobuyte snova'})
        }
     const token =jwt.sign(
    { userId:user.id},
         config.get("jwtSecret"),
     {expiresIn: '1h'}

)
        res.json({token,userId:user.id})

       }catch (e){
            res.status(500).json({messege:'Chtoto ne tak '})

        }
    })


//router.get('/test', async (req, res) => {
//   res.status(200).json({message: 'Hello'})
//})


module.exports = router