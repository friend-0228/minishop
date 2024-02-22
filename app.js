import express from 'express';
import connect from './schemas/index.js';
import products from './routes/products.router.js';

const app = express();
const PORT = 3001;

connect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const router = express.Router();

router.get('/', (req, res) => {
    return res.json({ message: 'Hi!' });
});

app.use('/api', [router, products]);

app.listen(PORT, () => {
    console.log(PORT, '포트로 서버가 열렸습니다!');
});
