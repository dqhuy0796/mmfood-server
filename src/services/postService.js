import db from "../models";
import { ResponseCode } from "../constant";

let handleGetPost = (paramId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = {};
            if (paramId && paramId === "all") {
                let posts = await db.Posts.findAll({
                    order: [["id", "DESC"]],
                });
                data.code = 0;
                data.message = "get post(s) success";
                data.result = posts;
            }
            if (paramId && paramId !== "all") {
                let post = await db.Posts.findOne({
                    where: { id: paramId },
                });
                if (post) {
                    data.code = 0;
                    data.message = "get post success";
                    data.result = post;
                } else {
                    data.code = 2;
                    data.message = "get post failed";
                }
            }
            resolve(data);
        } catch (error) {
            reject(error);
        }
    });
};

let handleCreatePost = (post) => {
    return new Promise(async (resolve, reject) => {
        let data = {};
        await db.Posts.create({
            title: post.title,
            overview: post.overview,
            content: post.content,
            imageUrl: post.imageUrl,
            author: post.author,
        });
        data.code = 0;
        data.message = "create post success";
        try {
            resolve(data);
        } catch (error) {
            reject(error);
        }
    });
};

let handleUpdatePost = (post) => {
    return new Promise(async (resolve, reject) => {
        let data = {};
        try {
            let targetPost = await db.Posts.findOne({
                where: { id: post.id },
            });
            if (targetPost) {
                await db.Posts.update(
                    {
                        title: post.title,
                        overview: post.overview,
                        content: post.content,
                        imageUrl: post.imageUrl,
                        author: post.author,
                    },
                    {
                        where: { id: post.id },
                    },
                );
                data.code = 0;
                data.message = "update post success";
            } else {
                data.code = 1;
                data.message = "invalid post";
            }
            resolve(data);
        } catch (error) {
            reject(error);
        }
    });
};

let handleDeletePost = (postId) => {
    return new Promise(async (resolve, reject) => {
        let data = {};
        try {
            let targetPost = await db.Posts.findOne({
                where: { id: postId },
            });
            if (targetPost) {
                await db.Posts.destroy({
                    where: { id: postId },
                });
                data.code = 0;
                data.message = "delete post success";
            } else {
                data.code = 1;
                data.message = "invalid post";
            }
            resolve(data);
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    handleGetPost,
    handleCreatePost,
    handleUpdatePost,
    handleDeletePost,
};
