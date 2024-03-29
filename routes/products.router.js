import express from 'express';
import Product from '../schemas/products.schema.js';

const router = express.Router();

/** 제품 등록 **/
router.post('/products', async (req, res) => {
    try {
        const { title, content, author, password } = req.body;

        if (!req.body) {
            return res.status(400).json({ errorMessage: '데이터 형식이 올바르지 않습니다.' });
        }

        const status = 'FOR_SALE';
        const product = await Product.create({ title, content, author, password, status });

        return res.status(201).json({ message: '판매 상품을 등록하였습니다.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errorMessage: '내부 서버 오류' });
    }
});

/** 제품 목록 조회 API **/
router.get('/products', async (req, res) => {
    try {
        const { name, author, status } = req.query;

        const query = {};
        if (name) {
            query.title = { $regex: new RegExp(name, 'i') };
        }
        if (author) {
            query.author = { $regex: new RegExp(author, 'i') };
        }
        if (status) {
            query.status = status;
        }

        const sortedProducts = await Product.find(query).sort({ createdAt: -1 });

        const responseData = {
            data: sortedProducts.map(product => ({
                _id: product._id,
                title: product.title,
                author: product.author,
                status: product.status,
                createdAt: product.createdAt
            }))
        };

        return res.status(200).json(responseData);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errorMessage: '내부 서버 오류' });
    }
});

/** 제품 상세 조회 API **/
router.get('/products/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: '상품 조회에 실패하였습니다.' });
        }

        const responseData = {
            data: {
                _id: product._id,
                title: product.title,
                content: product.content,
                author: product.author,
                status: product.status,
                createdAt: product.createdAt
            }
        };

        return res.status(200).json(responseData);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errorMessage: '내부 서버 오류' });
    }
});

/** 제품 정보 수정 API **/
router.put('/products/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const { title, content, password, status } = req.body;

        if (!req.body) {
            return res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: '상품 조회에 실패하였습니다.' });
        }

        if (password !== product.password) {
            return res.status(401).json({ message: '상품을 수정할 권한이 존재하지 않습니다.' });
        }

        product.title = title;
        product.content = content;
        product.status = status;

        await product.save();

        return res.status(200).json({ message: '상품 정보를 수정하였습니다.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errorMessage: '내부 서버 오류' });
    }
});

/** 제품 삭제 API **/
router.delete('/products/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: '상품 조회에 실패하였습니다.' });
        }

        if (password !== product.password) {
            return res.status(401).json({ message: '상품을 수정할 권한이 존재하지 않습니다.' });
        }

        await Product.findByIdAndDelete(productId);

        return res.status(200).json({ message: '상품을 삭제하였습니다.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errorMessage: '내부 서버 오류' });
    }
});

export default router;