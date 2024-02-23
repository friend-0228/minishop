import express from 'express';
import Product from '../schemas/products.schema.js';
// import Joi from 'joi';

const router = express.Router();

/*** 상품 작성 API ***/
// + 상품이 성공적으로 등록되었습니다 메세지 출력되게 추가!
router.post('/products', async (req, res, next) => {
    // 클라이언트에게 전달받은 데이터를 변수에 저장한다.
    const { productName, content, userName, password, status, createdAt } =
        req.body;
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
        if(!products) {
            res.status(404).json({message: '상품을 찾을 수 없습니다.'})
        }
        return res.status(200).json({ products });
    } catch {}
});

/*** 상품 상세 조회 API ***/
router.get('/products/:productId', async (req, res, next) => {
    const { productId } = req.params;
    if (!productId) {
        return res.status(400).json({
            errorMessage: '해당 상품이 존재하지 않습니다.',
        });
    }
    const product = await Product.findById(productId).exec();
    return res.status(200).json({ product });
});

/*** 상품 정보 수정 API ***/
router.patch('/products/:productId', async (req, res, next) => {
    const { productId } = req.params;
    const { productName, content, password, status, createdAt } = req.body;

    const currentProduct = await Product.findById(productId).exec();

    if (!currentProduct) {
        res.status(400).json({
            errorMessage: '해당 상품이 존재하지 않습니다.',
        });
    }
    if (currentProduct.password !== password) {
        res.status(401).json({ errorMessage: '비밀번호가 일치하지 않습니다.' });
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
});

/*** 상품 삭제 API ***/
router.delete('/products/:productId', async (req, res, next) => {
    const { productId } = req.params;
    const { password } = req.body;
    const product = await Product.findById(productId).exec();
    if (!productId) {
        return res.status(404).json({
            errorMessage: '해당 상품이 존재하지 않습니다.',
        });
    }
    if (product.password !== password) {
        return res
            .status(401)
            .json({ errorMessage: '비밀번호가 일치하지 않습니다.' });
    }
    await product.deleteOne({ _id: productId });
    return res.status(200).json({ message: '상품을 삭제했습니다.' });
});

export default router;
