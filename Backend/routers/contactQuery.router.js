import express from 'express'
import { createContactQuery, deleteQuery, getContact, updateQuery } from '../controllers/Contact_Query.controller.js'
import authenticate from '../middleware/authorize.js'

const router = express.Router()
// authenticate middleware lga hua hai ki koi bhi router without login ke ni chal skta hai
router.post("/create/contact", createContactQuery)
router.get("/get/query",authenticate, getContact)
router.put("/update/status/:id",authenticate, updateQuery)
router.delete("/delete/:id",authenticate, deleteQuery)

export default router