import express from 'express';
import Product from '../schemas/products.schema.js';

const router = express.Router();

/*** 상품 작성 API ***/
router.post('/products', async (req, res, next) => {
    // 클라이언트에게 전달받은 value 데이터를 변수에 저장한다.
    const { productName, value, userName, password, status, createdAt } =
        req.body;
    if (!productName || !value || !userName || !password) {
        return res.status(400).json({
            errorMessage: '필수 입력 항목을 입력하지 않았습니다.',
        });
    }

    // 새로운 상품 생성
    const newProduct = new Product({
        productName,
        value,
        userName,
        password,
        status,
        createdAt,
    });
    //const savedProduct = await newProduct.save();
    //res.json(savedProduct);
    // 상품 저장
    await newProduct.save();

    return res.status(201).json({ newProduct: newProduct });
});

// // /*** 상품 목록 조회 API ***/
router.get('/products', async (req, res, next) => {
    const products = await Product.find(
        {},
        { productName: 1, userName: 1, status: 1, createdAt: 1 }
    )
        .sort({ createdAt: -1 })
        .exec();
    return res.status(200).json({ products });
});

router.delete('/products/:productId', async (req, res, next) => {
    const { productId } = req.params;
    const product = await Product.findById(productId).exec();
    if (!product) {
        res.status(404).json({
            errorMessage: '해당 상품이 존재하지 않습니다.',
        });
    }
    await product.deleteOne({ _id: productId });
    return res.status(200).json({});
});

export default router;
