const express = require('express');
const Concert = require('../models/Concert');
const router = express.Router();

router.get('/', async (req, res) => {
  const concerts = await Concert.find();
  res.json(concerts);
});

router.post('/', async (req, res) => {
  const concert = new Concert(req.body);
  await concert.save();
  res.status(201).json(concert);
});

router.put('/:id', async (req, res) => {
  const concert = await Concert.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(concert);
});

router.delete('/:id', async (req, res) => {
  await Concert.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;
