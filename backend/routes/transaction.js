const express = require('express')
const Order = require('../models/Order');
const transactionRouter = express.Router();

transactionRouter.post('/create', async (req, res) => {
    try {
        const { userId, orderId, paymentId, status } = req.body;
        const Transaction = require('../models/Transaction');
        const transaction = new Transaction({ userId, orderId, paymentId, status });
        await transaction.save();
        await transaction.updateOrderStatus();
        res.status(201).send(transaction);
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
});

transactionRouter.post('/fetch', async (req, res) => {
    try {
        const { userId } = req.body;
        const Transaction = require('../models/Transaction');
        const transactions = await Transaction.find({ userId: userId });
        res.status(200).send(transactions);
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
});

module.exports = transactionRouter;