import postService from "../services/postService.js";

let getPost = async (req, res) => {
    if (req.query.id) {
        let data = await postService.handleGetPost(req.query.id);
        return res.status(200).json({
            code: data.code,
            message: data.message,
            result: data.result ? data.result : {},
        });
    }
    return res.status(200).json({
        code: 1,
        message: "missing parameter(s)",
    });
};

let createPost = async (req, res) => {
    let post = {};
    post.title = req.body.title;
    post.overview = req.body.overview;
    post.content = req.body.content;
    post.imageUrl = req.body.imageUrl;
    post.author = req.body.author;

    let data = await postService.handleCreatePost(post);

    return res.status(200).json({
        code: data.code,
        message: data.message,
    });
};

let updatePost = async (req, res) => {
    let post = {};
    post.id = req.body.id;
    post.title = req.body.title;
    post.overview = req.body.overview;
    post.content = req.body.content;
    post.imageUrl = req.body.imageUrl;
    post.author = req.body.author;

    let data = await postService.handleUpdatePost(post);

    return res.status(200).json({
        code: data.code,
        message: data.message,
    });
};

let deletePost = async (req, res) => {
    if (req.body.id) {
        let data = await postService.handleDeletePost(req.body.id);
        console.log(data);
        return res.status(200).json({
            code: data.code,
            message: data.message,
        });
    }
    return res.status(200).json({
        code: 1,
        message: "missing parameter(s)",
    });
};

export default {
    getPost,
    createPost,
    updatePost,
    deletePost,
};
