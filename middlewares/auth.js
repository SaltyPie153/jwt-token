const jwt = require('jsonwebtoken')

const authMiddleware = (req, res, next) => {
    const token = req.headers['x-access-token'] || req.query.token

    //토큰이 없을 때
    if(!token) {
        return res.status(403).json({
            success: false,
            message: 'not logged in'
        })
    }
    
    const p = new Promise(
        (resolve, reject) => {
            jwt.verify(token, req.app.get('jwt-secret'), (err, decoded) => {
                if(err) reject(err)
                resolve(decoded)
            })
        }
    )

    //확인 실패시 오류메세지
    const onError = (error) => {
        res.status(403).json({
            success: false,
            message: error.message
        })
    }

    p.then((decoded)=>{
        req.decoded = decoded
        next()
    }).catch(onError)
}

module.exports = authMiddleware