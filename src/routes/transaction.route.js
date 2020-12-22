const express = require('express')
const router = new express.Router()
// IMPORT MIDDLEWARE
const authenticator = require('../middleware/auth')
// IMPORT MODEL
const Transcation = require('../models/transaction.model')

router.get('/transactions', authenticator, async (request, response) => {
  try {
    const transactions = await Transcation.find({ user: request.user._id })
    !transactions && response.status(404).send()

    response.send(transactions)
  } catch (error) {
    response.status(400).send(error)
  }
})

router.post('/transactions', authenticator, async (request, response) => {
  const newTransaction = new Transcation({
    ...request.body,
    user: request.user._id
  })

  try {
    await newTransaction.save()
    response.status(201).send(newTransaction)
  } catch (error) {
    response.status(400).send(error)
  }
})

module.exports = router
