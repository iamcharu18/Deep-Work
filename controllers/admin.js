const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const Admin = require('../models/admin');
const Category = require('../models/category');
const Blog = require('../models/blog');
const Tag = require('../models/tag');

require('dotenv').config();

// UTIL FUNCTION
function escapeValue(value) {
    if (typeof value === 'string') {
        return value.replace(/'/g, "''");
    } else {
        return value;
    }
}

// GET - LOGIN
exports.get_login = (req, res) => {
    let jwtToken;
    const authHeader = req.headers["cookie"];
    if (authHeader !== undefined) {
        jwtToken = authHeader.split("=")[1];
    }
    if (jwtToken === undefined) {
        res.status(201);
        res.render("admin/login", {
            title: "Login"
        });
    } else {
        jwt.verify(jwtToken, process.env.JWT_SECRET, async (error, payload) => {
            if (error) {
                res.status(201);
                res.render("admin/login", {
                    title: "Login"
                });
            } else {
                res.redirect("/admin/dashboard");
            }
        });
    }
}

// POST - LOGIN
exports.post_login = async (req, res) => {
    const { username, password } = req.body;
    console.log(username, password);

    try {
        const user = await Admin.findOne({
            where: { username: username }
        });

        if (!user) {
            return res.status(401).send({ error: 'Invalid user' });
        }

        const isPasswordMatched = (password === user.password);
        if (isPasswordMatched) {
            const payload = { username };
            const jwtToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2h' });

            res.cookie('token', jwtToken, { httpOnly: true });
            res.redirect('/admin/dashboard');
        } else {
            res.status(401).send({ error: 'Invalid password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Internal server error' });
    }
};

// GET - LOGOUT
exports.get_logout = (req, res) => {
    // Clear the token cookie
    res.clearCookie("token");
    // Redirect the user to the login page
    res.redirect("/admin/login");
}

// GET - DASHBOARD
exports.get_dashboard = async (req, res) => {
    try {
        // Retrieve the category count from the database
        const categoryCount = await Category.count();
        const blogCount = await Blog.count();
        const adminCount = await Admin.count();

        res.render("admin/index", {
            user: req.username,
            categoryCount: categoryCount,
            blogCount: blogCount,
            adminCount: adminCount,
            title: "Dashboard"
        });
    } catch (error) {
        console.error('Error retrieving category count', error);
        res.status(500).send('Internal Server Error');
    }
}

// CATEGORIES
// GET - CREATE CATEGORY
exports.get_create_category = async (req, res) => {
    try {
        const categoryObject = await Category.findAll({
            attributes: ['id', 'categoryName'],
            order: [['id', 'ASC']]
        });
        res.render("admin/categories", {
            user: req.username,
            categories: categoryObject
        });
    } catch (err) {
        console.log(err);
        res.status(500).send('Internal server error');
    }
}

// POST - CREATE CATEGORY
exports.add_category = async (req, res) => {
    const categoryName = req.body.categoryName;
    try {
        const categoryObject = await Category.create({
            categoryName
        });
        res.status(200).send('OK');
    } catch (err) {
        console.log(err);
        if (err.name === 'SequelizeUniqueConstraintError') {
            res.status(400).send('Category already exists');
        } else {
            res.status(500).send('Internal server error');
        }
    }
}

// DELETE - CATEGORY
exports.delete_category = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).send('Blog not found');
        }
        await category.destroy();
        res.status(200).send('OK');
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
}

// UPDATE - CATEGORY
exports.update_category = async (req, res) => {
    try {
        const { id } = req.params;
        const { categoryName } = req.body;
        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).send('Category not found');
        }
        await category.update({ categoryName });
        res.status(200).send('Category updated successfully');
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
}

// CHECK - CATEGORY
exports.check_category = async (req, res) => {
    try {
        const { newCategoryName } = req.params;
        const category = await Category.findOne({ where: { categoryName: newCategoryName } });
        if (category) {
            res.json({ exists: true });
        } else {
            res.json({ exists: false });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
}

// GET - CREATE
exports.get_create = async (req, res) => {
    const categories = await Category.findAll({
        attributes: ['id', 'categoryName']
    });
    const tags = await Tag.findAll();
    res.render("admin/create", {
        user: req.username,
        blog: {},
        categories: categories,
        tags: tags,
        blogTagIds: []
    });
}

// POST - CREATE
exports.post_create = async (req, res) => {
    // console.log(req.body);
    try {
        const file = req.file;
        const date = new Date();
        const imagePath = `assets/uploads/coverImages/${date.getTime() + file.originalname}`;

        const directoryPath = path.dirname(imagePath);
        fs.mkdirSync(directoryPath, { recursive: true });

        fs.writeFile(imagePath, file.buffer, (err) => {
            if (err) {
                console.log(err);
                return res.status(500).send(err);
            }
        });

        let { title, urlSlug, metaTitle, metaDescription, metaKeywords, description, category, content, isDraft, newCategory, tags } = req.body;
        title = escapeValue(title);
        metaTitle = escapeValue(metaTitle);
        metaDescription = escapeValue(metaDescription);
        metaKeywords = escapeValue(metaKeywords);
        description = escapeValue(description);
        const imagePathWithSlash = '/' + imagePath; // Remove unnecessary '/' from imagePath

        const blog = await Blog.create({
            title,
            urlSlug,
            metaTitle,
            metaDescription,
            metaKeywords,
            bannerImg: imagePathWithSlash,
            description,
            content,
            draft: isDraft
        });

        // console.log(newCategory);

        if (category == '-1') {
            const createdCategory = await Category.create({
                categoryName: newCategory
            });
            await blog.setCategory(createdCategory);
        } else {
            const existingCategory = await Category.findByPk(category);
            if (existingCategory) {
                await blog.setCategory(existingCategory);
            } else {
                return res.status(404).send('Category not found');
            }
        }

        // Assign tags to the blog
        const tagIds = tags.split(',').map(tag => tag.trim());
        for (const tagId of tagIds) {
            if (!isNaN(tagId)) {
                // Tag is a pre-existing tag ID
                const existingTag = await Tag.findByPk(tagId);
                if (existingTag) {
                    await blog.addTag(existingTag);
                } else {
                    return res.status(404).send('Tag not found');
                }
            } else {
                // Tag is a new tag to be created
                const createdTag = await Tag.create({
                    tagName: tagId
                });
                await blog.addTag(createdTag);
            }
        }

        res.status(200).send("OK");
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
}

// CHECK - CATEGORY
exports.check_category = async (req, res) => {
    try {
        const { newCategoryName } = req.params;
        const category = await Category.findOne({ where: { categoryName: newCategoryName } });
        if (category) {
            res.json({ exists: true });
        } else {
            res.json({ exists: false });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
}

// CHECK - URL SLUG
exports.check_urlslug = async (req, res) => {
    try {
        const { newSlug } = req.params;
        const blog = await Blog.findOne({ where: { urlSlug: newSlug } });
        if (blog) {
            res.json({ exists: true });
        } else {
            res.json({ exists: false });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
}

// UPDATE BLOG IMAGE
exports.add_blogcontent_image = async (req, res) => {
    let file = req.file;
    let date = new Date();
    const imagePath = `assets/uploads/blogContent/${date.getTime() + "_" + file.originalname}`;
    const directoryPath = path.dirname(imagePath);
    fs.mkdirSync(directoryPath, { recursive: true });
    fs.writeFile(imagePath, file.buffer, (err) => {
        if (err) {
            console.log(err)
            return res.status(500).send(err);
        }
        console.log(`Image saved to ${imagePath}`);
        res.send(imagePath);
    });
}

// GET - ALL BLOGS
exports.get_view_blogs = async (req, res) => {
    try {
        const blogsObject = await Blog.findAll({
            attributes: ['id', 'title', 'urlSlug', 'bannerImg', 'description', 'draft', 'content']
        });
        res.render("admin/view", {
            user: req.username,
            blogs: blogsObject
        });
    } catch (err) {
        console.log(err);
        res.status(500).send('Internal server error');
    }
}

// GET - SINGLE BLOG
exports.get_blog = async (req, res) => {
    const id = req.params.id;
    try {
        const blogContent = await Blog.findByPk(id);
        const categories = await Category.findAll({
            attributes: ['id', 'categoryName']
        });
        const tags = await Tag.findAll();

        // Get the IDs of the tags associated with the blog
        const blogTags = await blogContent.getTags();
        const blogTagIds = blogTags.map(tag => tag.id);

        res.render("admin/update", {
            user: req.username,
            blog: blogContent,
            categories: categories,
            tags: tags,
            blogTagIds: blogTagIds
        });
    } catch (err) {
        console.error(err);
        res.render("404", {
            title: "Page not found - I'm VK",
            nav: "404"
        });
    }
}


exports.update_blog = async (req, res) => {
    let file = req.file;
    const id = req.params.id;
    let date = new Date();
    let imagePath;
    if (file?.originalname) {
        imagePath = `assets/uploads/coverImages/${date.getTime() + file.originalname}`;
        fs.writeFile(imagePath, file.buffer, (err) => {
            if (err) {
                console.log(err);
                return res.status(500).send(err);
            }
        });
        imagePath = '/' + imagePath;
    } else {
        imagePath = new URL(req.body.bannerImg);
        imagePath = imagePath.pathname;
    }
    let { title, urlSlug, metaTitle, metaDescription, metaKeywords, description, category, content, isDraft, tags } = req.body;
    title = escapeValue(title);
    metaTitle = escapeValue(metaTitle);
    metaDescription = escapeValue(metaDescription);
    metaKeywords = escapeValue(metaKeywords);
    description = escapeValue(description);

    try {
        const updatedBlog = await Blog.update({
            title,
            urlSlug,
            metaTitle,
            metaDescription,
            metaKeywords,
            bannerImg: imagePath,
            description,
            content,
            draft: isDraft
        }, {
            where: {
                id: id
            }
        });

        const blog = await Blog.findByPk(id);

        // Update category
        if (category === '-1') {
            // Add new category to the database
            const createdCategory = await Category.create({
                categoryName: req.body.newCategory
            });
            await blog.setCategory(createdCategory);
        } else {
            // Assign existing category to the blog
            const existingCategory = await Category.findByPk(category);
            if (existingCategory) {
                await blog.setCategory(existingCategory);
            } else {
                return res.status(404).send('Category not found');
            }
        }

        // Update tags
        const tagIds = tags.split(',').map(tag => tag.trim());
        const existingTags = await blog.getTags();

        // Dismiss tags that are not in the updated list
        for (const tag of existingTags) {
            if (!tagIds.includes(tag.id.toString())) {
                await blog.removeTag(tag);
            }
        }

        // Assign new tags and create new ones if needed
        for (const tagId of tagIds) {
            if (!isNaN(tagId)) {
                // Tag is a pre-existing tag ID
                const existingTag = await Tag.findByPk(tagId);
                if (existingTag) {
                    await blog.addTag(existingTag);
                } else {
                    return res.status(404).send('Tag not found');
                }
            } else {
                // Tag is a new tag to be created
                const createdTag = await Tag.create({
                    tagName: tagId
                });
                await blog.addTag(createdTag);
            }
        }

        res.status(200).send('OK');
    } catch (error) {
        console.log(error.message);
        res.status(500).send(error);
    }
}


// DELETE BLOG
exports.delete_blog = async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await Blog.findByPk(id);
        if (!blog) {
            return res.status(404).send('Blog not found');
        }
        await blog.destroy();
        res.status(200).send('OK');
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
}

// VIEW USERS
exports.get_users = async (req, res) => {
    try {
        const adminObject = await Admin.findAll({
            attributes: ['id', 'username', 'super_admin'],
            order: [['id', 'ASC']]
        });

        // Find the admin object for the current user
        const currentUserAdmin = adminObject.find(admin => admin.username === req.username);

        res.render("admin/users", {
            user: req.username,
            super_admin: currentUserAdmin.super_admin,
            admins: adminObject
        });
    } catch (err) {
        console.log(err);
        res.status(500).send('Internal server error');
    }
}

// VIEW USERS
exports.add_admin = async (req, res) => {
    const { username, password } = req.body;
    // console.log(username, password)
    try {
        const isAdminSuperAdmin = await Admin.findOne({
            where: {
                username: req.username,
                super_admin: 1
            }
        });

        if (!isAdminSuperAdmin) {
            return res.status(403).send('Not authorized');
        }

        const adminObject = await Admin.create({
            username,
            password
        });

        res.status(200).send('OK');
    } catch (err) {
        // console.log(err);
        if (err.name === 'SequelizeUniqueConstraintError') {
            res.status(400).send('Admin already exists');
        } else {
            res.status(500).send('Internal server error');
        }
    }
};

exports.del_admin = async (req, res) => {
    try {
        const { id } = req.params;
        const admin = await Admin.findByPk(id);
        if (!admin) {
            return res.status(404).send('Admin not found');
        }

        const isAdminSuperAdmin = await Admin.findOne({
            where: {
                username: req.username,
                super_admin: true
            }
        });

        if (!isAdminSuperAdmin) {
            return res.status(403).send('Not authorized');
        }
        if (req.username !== admin.username) {
            await admin.destroy();
            res.status(200).send('OK');
        }
        else {
            res.status(200);
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
};