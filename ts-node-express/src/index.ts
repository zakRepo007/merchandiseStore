
import express, { Express, Request, Response, Router } from "express";
import dotenv from "dotenv";
import bodyParser from 'body-parser';
import fs from 'fs'; 
import merchandiseRoutes from './routes/merchandiseRoutes';

dotenv.config();
const jwt = require('jsonwebtoken');
const { verifyToken } = require('./middleware/authMiddleware'); // Import the verifyToken function

const app: Express = express();
app.use(bodyParser.json());
var cors = require('cors')
const expressOasGenerator = require('express-oas-generator');
expressOasGenerator.init(app, {});

const corsOptions = {
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  credentials: true, 
  optionsSuccessStatus: 204, 
};

app.use(cors(corsOptions));

const secretKey = 'supersecretkey123!@#';

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  
  const userData = JSON.parse(fs.readFileSync('data/user.json', 'utf-8'));

  
  const user = userData.find((user: { username: any; password: any; }) => user.username === username && user.password === password);

  if (user) {
    
    jwt.sign({ user }, secretKey, { expiresIn: '1h' }, (err: any, token: any) => {
      if (err) {
        res.status(500).json({ error: 'Failed to create token' });
      } else {
        
        res.json({ token });
      }
    });
  } else {
    res.status(401).json({ error: 'Authentication failed' });
  }
});

app.post('/api/refresh-token', (req, res) => {
  const refreshToken = req.body.refreshToken;

  if (!refreshToken) {
    return res.status(400).json({ error: 'Refresh token is required' });
  }

  // Generate a new access token
  const newAccessToken = jwt.sign(req, secretKey, { expiresIn: '1h' });

  res.json({ accessToken: newAccessToken });
});

app.use('/api/merchandise', verifyToken, merchandiseRoutes);
const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Merchandise Store");

});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});