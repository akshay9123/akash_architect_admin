import express from 'express'
import multer from 'multer'
import { architecure, createProject, getAllProjectNames, getAllProjectNamesAndImagesArchitecture, getAllProjectNamesAndImagesInterior, projectdetails, updateProjectImages } from '../controllers/Admin_Controller.js'
import { changePassword, Login, Logout, signup } from '../auth.js/Auth.js'
import authenticate from '../middleware/authorize.js'

const router = express.Router()

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  },
})

const upload = multer({ storage })

// authentication 
router.post("/login" , Login)
router.get("/logout", Logout)

// AUTHENTICATION MIDDLEWARE LGA HUA HAI TAKI KOI V ROUTER WITHOUT LOGIN NAHI CHAL SKTA
router.post("/signup" ,authenticate, signup)
router.put('/changepassword', authenticate, changePassword)
router.post('/create', authenticate, upload.single('mainImage'), createProject);
router.get('/project/name', getAllProjectNames)
router.get('/projectdetails', getAllProjectNamesAndImagesArchitecture)
router.get('/projectinterior', getAllProjectNamesAndImagesInterior)
router.get('/project/details/:id', projectdetails)


router.get('/project/architecture',authenticate, architecure)
router.put(
  '/update/images/:id',authenticate,upload.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'galleryImages', maxCount: 10 },
  ]),

  updateProjectImages
);

export default router
