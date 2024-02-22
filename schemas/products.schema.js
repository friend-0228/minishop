import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    // 상품명, 작성 내용, 작성자명, 비밀번호, 상품 판매 여부, 작성 날짜
    productName: {
        type: String,
        required: true,
    },
    value: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['FOR_SALE', 'SOLD_OUT'],
        default: 'FOR_SALE',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model('Product', productSchema);
