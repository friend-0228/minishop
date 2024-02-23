import express from 'express';
import connect from './schemas/index.js';
import products from './routes/products.router.js';
import errorHandlerMiddleware from './middlewares/error-handler.middleware.js';

const app = express();
const PORT = 3001;

connect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    console.log('Request URL:', req.originalUrl, ' - ', new Date());
    next();
});

const router = express.Router();

// router.get(...) 으로 사용하고 있으면, 도메인 연결 시 /api를 꼭 붙여야함.
// 왜냐하면 라우터 라우터 실행하는 주소가 /api를 받고 있기 때문에.
// app.get으로 변경하면 localhost:3001 으로 가도 Hi 메세지를 확인할 수 있다.
router.get('/', (req, res) => {
    return res.json({ message: 'Hi!' });
});


app.use('/api', [router, products]);

// 에러 처리 미들웨어를 등록한다.
app.use(errorHandlerMiddleware);

app.listen(PORT, () => {
    console.log(PORT, '포트로 서버가 열렸습니다!');
});
