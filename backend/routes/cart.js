const express = require('express')
const cartRouter = express.Router();
const Cart = require('../models/Cart');
//Get all items from cart for a user
cartRouter.post('/fetchall', async (req, res) => {
    try {
        const userId = req.body.userId;
        const cart = await Cart.findOne({ userId: userId }).populate('items.item');
        if (!cart) {
            const newCart = new Cart({
                userId: userId,
                items: []
            })
            await newCart.save();
        }
        res.status(200).json({ message: "Cart fetched successfully", cart: cart });
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
})

//Add an item to cart for a user
cartRouter.post('/add', async (req, res) => {
    try {
        const userId = req.body.userId;
        let { itemId, quantity } = req.body;
        if (!quantity) {
            quantity = 1;
        }
        const cart = await Cart.findOne({ userId: userId });
        if (!cart) {
            return res.status(404).send("Cart not found for the user");
        }
        const item = cart.items.find(item => item.item.toString() === itemId.toString());
        if (item) {
            item.quantity += parseInt(quantity);
        } else {
            cart.items.push({ item: itemId, quantity: quantity });
        }
        await cart.calculateTotal();
        res.status(200).send("Item added to cart successfully");
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
})

//Remove an item from cart for a user
cartRouter.post('/remove', async (req, res) => {
    try {
        const userId = req.body.userId;
        const itemId = req.body.itemId;
        const cart = await Cart.findOne({ userId: userId });
        if (!cart) {
            return res.status(404).send("Cart not found for the user");
        }
        const item = cart.items.find(item => item.item == itemId);
        if (!item) {
            return res.status(404).send("Item not found in cart");
        }
        cart.items = cart.items.filter(item => item.item != itemId);
        await cart.calculateTotal();
        res.status(200).send("Item removed from cart successfully");
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

//Update quantity of an item in cart for a user
cartRouter.post('/update', async (req, res) => {
    try {
        const userId = req.body.userId;
        const itemId = req.body.itemId;
        const quantity = req.body.quantity;
        const cart = await Cart.findOne({ userId: userId });
        if (!cart) {
            return res.status(404).send("Cart not found for the user");
        }
        const item = cart.items.find(item => item.item == itemId);
        if (!item) {
            return res.status(404).send("Item not found in cart");
        }
        item.quantity = quantity;
        await cart.calculateTotal();
        res.status(200).json({ success: true, message: "Quantity updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Internal Server Error" })
    }
});

module.exports = cartRouter;