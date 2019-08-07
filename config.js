if(process.env.NODE_ENV='production'){
    module.exports={
        'secret-key-school':process.env.MY_SECRET,
        'secret-key-teacher':process.env.MY_SECRET,
        'secret-key-user':process.env.MY_SECRET,
        'mongoUrl':process.env.MONGO_URL
    } 
}else{
    module.exports={
        'secret-key-school':'1246-xjzk-dkckfnj76pppib72',
        'secret-key-teacher':'1246-sdyu8o9-uyujh',
        'secret-key-user':'1246-fsvdfdf-dkcsdnfkjepnj7672',
        'mongoUrl':'mongodb://localhost:27017/School_Api'
    }
}

