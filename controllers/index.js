const { sendMailAndInsertData } = require("../utils/utils");

const sequelize = require("../utils/database");
const { Sequelize, Op } = require('sequelize');

const Blog = require('../models/blog');
const Category = require('../models/category');
const Tag = require('../models/tag');

exports.index = (req, res) => {
    res.render("index", {
        title: "Deepwork",
    });
}

exports.about = (req, res) => {
    res.render("about", {
        title: "About",
    });
}

exports.contact = (req, res) => {
    res.render("contact", {
        title: "Contact",
    });
}

exports.sendmail = async (req, res) => {
    const { name, email, businessType, phone } = req.body;

    try {
        await sendMailAndInsertData(name, email, phone, "New Contact Sent from website", businessType);
        res.send("success");
    } catch (error) {
        console.error(error);
        res.status(400).send("Failed to send mail and insert data");
    }
}

exports.sendmail2 = async (req, res) => {
    const { name, email, phone, subject } = req.body;
    const category = subject.split(" - ")[0];

    try {
        await sendMailAndInsertData(name, email, phone, subject, category);
        res.send("success");
    } catch (error) {
        console.error(error);
        res.status(400).send("Failed to send mail and insert data");
    }
}

exports.blogs = async (req, res) => {
    try {
        const page = req.query.page || 1;
        const resultsPerPage = 3;

        // Filter by category if specified in query parameters
        const categoryId = req.query.category;
        const categoryFilter = categoryId ? { CategoryId: categoryId } : {};

        // Filter by tag name if specified in query parameters
        const tagName = req.query.tag;
        const tagFilter = tagName ? { tagName } : {};

        const blogs = await Blog.findAll({
            attributes: ['id', 'title', 'urlSlug', 'bannerImg', 'description', 'draft', 'updatedAt'],
            where: categoryFilter,
            order: [['updatedAt', 'DESC']],
            limit: resultsPerPage,
            offset: (page - 1) * resultsPerPage,
            include: [
                { model: Category, as: 'Category' },
                {
                    model: Tag,
                    as: 'Tags',
                    attributes: [],
                    where: tagFilter,
                    through: { attributes: [] },
                },
            ],
        });

        const totalResults = await Blog.count({ where: categoryFilter });
        const totalPages = Math.ceil(totalResults / resultsPerPage);

        const categories = await Category.findAll({
            attributes: ['id', 'categoryName'],
            include: {
                model: Blog,
                as: 'Blogs',
                attributes: [],
                where: categoryFilter,
                required: false,
            },
            group: ['Category.id'],
        });

        const categoriesWithBlogCount = await Promise.all(categories.map(async (category) => {
            const blogCount = await Blog.count({ where: { categoryId: category.id } });
            return {
                id: category.id,
                categoryName: category.categoryName,
                blogCount,
            };
        }));

        const recentPosts = await Blog.findAll({
            attributes: ['id', 'title', 'urlSlug', 'bannerImg', 'description', 'draft', 'updatedAt'],
            order: [['updatedAt', 'DESC']],
            limit: 3,
            include: { model: Category, as: 'Category' },
        });

        const popularTags = await Tag.findAll({
            attributes: ['id', 'tagName'],
            include: [
                {
                    model: Blog,
                    as: 'Blogs',
                    attributes: [],
                    through: { attributes: [] },
                },
            ],
            order: [[sequelize.literal('(SELECT COUNT(*) FROM `BlogTag` WHERE `BlogTag`.`TagId` = `Tag`.`id`)'), 'DESC']],
            limit: 5,
        });

        res.render('blogs', {
            title: 'Blogs',
            blogs,
            totalPages,
            currentPage: page,
            categories: categoriesWithBlogCount,
            recentPosts,
            popularTags,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};

exports.detailed_blog = async (req, res) => {
    try {
        const urlSlug = req.params.urlSlug;

        const blog = await Blog.findOne({
            where: {
                urlSlug: urlSlug,
            },
            include: [{ model: Tag, as: 'Tags' }],
        });

        if (!blog || blog.draft) {
            return res.render('404', {
                title: 'Page Not Found',
            });
        }

        const previousBlog = await Blog.findOne({
            where: {
                updatedAt: { [Op.lt]: blog.updatedAt },
            },
            order: [['updatedAt', 'DESC']],
            include: [{ model: Tag, as: 'Tags' }],
        });

        const nextBlog = await Blog.findOne({
            where: {
                updatedAt: { [Op.gt]: blog.updatedAt },
            },
            order: [['updatedAt', 'ASC']],
            include: [{ model: Tag, as: 'Tags' }],
        });

        res.render('blog-detail', {
            title: blog.title,
            blog: blog,
            previousBlog: previousBlog,
            nextBlog: nextBlog,
            currentUrl: req.protocol + '://' + req.get('host') + req.originalUrl,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};
