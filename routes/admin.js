const express = require('express');
const router = express.Router();

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const authenticateToken = require('../utils/authenticate');
const admin_controller = require('../controllers/admin');

// LOGIN
router.get('/login', admin_controller.get_login);
router.post('/login', admin_controller.post_login);

// LOGOUT
router.get('/logout', admin_controller.get_logout);

// DASHBOARD
router.get('/', (req, res) => {
    res.redirect('/admin/dashboard');
})
router.get('/dashboard', authenticateToken, admin_controller.get_dashboard);

// CATEGORIES
router.get('/categories', authenticateToken, admin_controller.get_create_category);
router.post('/add_category', authenticateToken, admin_controller.add_category);
router.post('/del_category/:id', authenticateToken, admin_controller.delete_category);
router.post('/update_category/:id', authenticateToken, admin_controller.update_category);
router.get('/check_category/:newCategoryName', authenticateToken, admin_controller.check_category);

// CREATE BLOG
router.get('/create', authenticateToken, admin_controller.get_create);
router.post('/create', authenticateToken, upload.single('bannerImg'), admin_controller.post_create);

// CHECK CATEGORY - UNIQUE OR NOT
router.get('/check_category/:newCategoryName', authenticateToken, admin_controller.check_category);

// CHECK - URL SLUG
router.get('/check_urlslug/:newSlug', authenticateToken, admin_controller.check_urlslug);

// Add blog image
router.post('/add-blog-image', authenticateToken, upload.single('file'), admin_controller.add_blogcontent_image);

// VIEW AND EDIT BLOG
router.get('/view', authenticateToken, admin_controller.get_view_blogs);
router.get('/edit/:id', authenticateToken, admin_controller.get_blog);
router.post('/edit/:id', authenticateToken, upload.single('bannerImg'), admin_controller.update_blog);

// DELETE BLOG
router.post('/delete/:id', authenticateToken, admin_controller.delete_blog);

// ADMINS
router.get('/users', authenticateToken, admin_controller.get_users);
router.post('/add_admin', authenticateToken, admin_controller.add_admin);
router.post('/del_admin/:id', authenticateToken, admin_controller.del_admin);

module.exports = router;