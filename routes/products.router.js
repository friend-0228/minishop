import express from 'express';
import Product from '../schemas/products.schema.js';
import Joi from 'joi';

const router = express.Router();

const createdProductSchema = Joi.object({
    productName: Joi.string().min(1).max(20).required(),
    content: Joi.string().min(1).max(50).required(),
    userName: Joi.string().min(2).max(10).required(),
    password: Joi.string().min(1).max(10).required(),
});

/*** 상품 작성 API ***/
// + 상품이 성공적으로 등록되었습니다 메세지 출력되게 추가!
router.post('/products', async (req, res, next) => {
    // 클라이언트에게 전달받은 데이터를 변수에 저장한다.
    // const { productName, content, userName, password, status, createdAt } = req.body;
    try {
        const validation = await createdProductSchema.validateAsync(req.body);
        const { productName, content, userName, password, status, createdAt } =
            validation;
        if (!productName || !content || !userName || !password) {
            return res.status(400).json({
                errorMessage: '필수 입력 항목을 입력하지 않았습니다.',
            });
        }
        // 새로운 상품 생성
        const newProduct = new Product({
            productName,
            content,
            userName,
            password,
            status,
            createdAt,
        });
        // 상품 저장
        await newProduct.save();

        return res
            .status(201)
            .json({ newProduct: newProduct, message: '상품을 등록했습니다.' });
    } catch (error) {
        // Router 다음에 있는 에러 처리 미들웨어를 실행한다.
        next(error);
    }
});

/*** 상품 목록 조회 API ***/
router.get('/products', async (req, res, next) => {
    try {
        const products = await Product.find(
            {},
            { productName: 1, userName: 1, status: 1, createdAt: 1 }
        )
            .sort({ createdAt: -1 })
            .exec();
        if (!products) {
            res.status(404).json({ message: '상품을 찾을 수 없습니다.' });
        }
        return res.status(200).json({ products });
    } catch (error) {
        next(error);
    }
});

/*** 상품 상세 조회 API ***/
router.get('/products/:productId', async (req, res, next) => {
    try {
        const { productId } = req.params;
        // 클라이언트가 상품의 ID를 제공하지 않은 경우
        if (!productId) {
            return res.status(400).json({
                errorMessage: '해당 상품의 ID가 제공되지 않았습니다.',
            });
        }
        const product = await Product.findById(productId).exec();
        // 클라이언트가 올바른 요청을 보냈지만, 요청한 상품이 존재하지 않는 경우
        if (!product) {
            return res
                .status(404)
                .json({ errorMessage: '해당 상품이 존재하지 않습니다.' });
        }
        return res.status(200).json({ product });
    } catch (error) {
        next();
    }
});

/*** 상품 정보 수정 API ***/
router.patch('/products/:productId', async (req, res, next) => {
    try {
        const { productId } = req.params;
        // 클라이언트가 상품의 ID를 제공하지 않은 경우
        if (!productId) {
            return res.status(400).json({
                errorMessage: '해당 상품의 ID가 제공되지 않았습니다.',
            });
        }
        const { productName, content, password, status, createdAt } = req.body;

        const currentProduct = await Product.findById(productId).exec();

        // 클라이언트가 수정하려는 상품이 존재하지 않는 경우
        if (!currentProduct) {
            res.status(404).json({
                errorMessage: '해당 상품이 존재하지 않습니다.',
            });
        }
        // 클라이언트가 수정하려는 상품의 비밀번호가 일치하지 않는 경우
        if (currentProduct.password !== password) {
            res.status(401).json({
                errorMessage: '비밀번호가 일치하지 않습니다.',
            });
        }
        // 상품 정보 수정
        currentProduct.productName = productName;
        currentProduct.content = content;
        currentProduct.status = status;
        currentProduct.createdAt = createdAt;
        await currentProduct.save();

        return res.status(200).json({
            updatedProduct: currentProduct,
            message: '상품 정보가 수정되었습니다.',
        });
    } catch (error) {
        next();
    }
});

/*** 상품 삭제 API ***/
router.delete('/products/:productId', async (req, res, next) => {
    try {
        const { productId } = req.params;
        // 클라이언트가 상품의 ID를 제공하지 않은 경우
        if (!productId) {
            return res.status(400).json({
                errorMessage: '해당 상품의 ID가 제공되지 않았습니다.',
            });
        }
        const { password } = req.body;
        const product = await Product.findById(productId).exec();
        // 클라이언트가 삭제하려는 상품이 존재하지 않는 경우
        if (!productId) {
            return res.status(404).json({
                errorMessage: '해당 상품이 존재하지 않습니다.',
            });
        }
        // 클라이언트가 삭제하려는 상품의 비밀번호가 일치하지 않는 경우
        if (product.password !== password) {
            return res
                .status(401)
                .json({ errorMessage: '비밀번호가 일치하지 않습니다.' });
        }
        await product.deleteOne({ _id: productId });
        return res.status(200).json({ message: '상품을 삭제했습니다.' });
    } catch (error) {
        next();
    }
});

export default router;
