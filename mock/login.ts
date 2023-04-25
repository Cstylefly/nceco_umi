export default{
    'POST /api/login':(req,res) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        const {userName,password} = req.body
        console.log(req.query)
        if(userName === 'admin' && password === '123456'){
            res.send({
                status:true,
                data:{
                    userName:'admin',
                    type:'admin',
                    id:'1123598821738675201',
                    name:'管理员',
                    avatar:''
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