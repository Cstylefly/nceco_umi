export default{
    'POST /api/login':(req,res) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        const {name,password} = req.body
        if(name === 'jack' && password === '123456'){
            res.send({
                status:true,
                data:{
                    name:'jack',
                    type:'admin'
                }
            })
        }else{
            res.send({
                status:false,
                message:'用户名或密码错误'
            })
        }
    }
}