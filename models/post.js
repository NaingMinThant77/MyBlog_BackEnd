const mongodb = require("mongodb");
const { getDatabase } = require("../utils/database");

class Post {
    constructor(title, description, imgUrl, id) {
        this.title = title;
        this.description = description;
        this.imgUrl = imgUrl;
        this._id = id ? new mongodb.ObjectId(id) : null;
    }

    //this - {title: title.value, description: description.value, imgUrl: imgUrl.value }

    create() {
        const db = getDatabase();      // object
        let dbTemp;

        if (this._id) {
            //update post
            dbTemp = db.collection("posts").updateOne({ _id: this._id }, { $set: this })
        } else {
            //create post
            dbTemp = db.collection("posts").insertOne(this)
        }
        return dbTemp.then(
            result => console.log(result)
        ).catch(err => console.log(err))
    }

    static getPosts() {
        const db = getDatabase();
        return db.collection("posts", { locale: "en", caseLevel: true }).find().sort({ title: 1 }).toArray().then(
            posts => {
                console.log(posts)
                return posts;
            }
        ).catch(err => console.log(err))
    }

    static getPost(postId) {
        const db = getDatabase();
        return db.collection("posts").find({ _id: new mongodb.ObjectId(postId) }).next().then(
            post => {
                console.log(post)
                return post;
            }
        ).catch(err => console.log(err))
    }

    static deletePost(postId) {
        const db = getDatabase();
        return db.collection("posts").deleteOne({ _id: new mongodb.ObjectId(postId) }).then(result => console.log("post Deleted")).catch(err => console.log(err))
    }
}

module.exports = Post;