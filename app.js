import express from 'express';
import connect from './schemas/index.js';
import productRouter from './routes/products.router.js';

connect();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', productRouter);

app.listen(PORT, () => {
    console.log(PORT, '포트로 서버가 열렸어요!');
});