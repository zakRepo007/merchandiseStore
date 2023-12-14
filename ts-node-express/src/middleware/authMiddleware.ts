const jwt = require('jsonwebtoken');

const secretKey = 'supersecretkey123!@#';

const verifyToken = (req:any, res:any, next:any) => {
  const token = req.headers['authorization'];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const tokenWithoutBearer = token.replace('Bearer ', '');

  jwt.verify(tokenWithoutBearer, secretKey, (err:any, decoded:any) => {
    if (err) {
      return res.status(403).json({ error: 'Failed to authenticate token' });
    }

    req.user = decoded;
    next();
  });
};

export const generateAccessToken = (userData:any) => {
  
  const payload = {
    user: userData,
    
  };

  
  const expiresIn = '1h';

  
  const accessToken = jwt.sign(payload, secretKey, { expiresIn });

  return accessToken;
};


export const validateRefreshToken = (refreshToken:any) => {
  return new Promise((resolve, reject) => {
    jwt.verify(refreshToken, secretKey, (err:any, decoded:any) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
};
module.exports = { verifyToken };
