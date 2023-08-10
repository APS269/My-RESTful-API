const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/wikiDB", {useNewUrlParser: true});

const articleSchema = {
    title: String,
    content: String
};
const Article = mongoose.model("Article", articleSchema);

/////////////////////request targeting all articles/////////////////////
app.route("/articles")
    .get((req, res) => {
        Article.find()
            .then(articles => {
                res.send(articles[0].content);
            })
            .catch(error => {
                res.send(error);
            });
    })
    .post((req, res) => {
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });
        newArticle.save()
            .then(() => {
                res.send("Article saved successfully");
            })
            .catch(error => {
                res.send(error);
            });
    })
    .delete((req, res) => {
        Article.deleteMany()
            .then(() => {
                res.send("Successfully deleted all articles!");
            })
            .catch(error => {
                res.send(error);
            });
    });

/////////////////////request targeting a specific article/////////////////////

app.route("/articles/:articleTitle")
    .get((req, res) => {
        Article.findOne({ title: req.params.articleTitle })
            .then(foundArticle => {
                if (foundArticle)
                    res.send(foundArticle.content);
                else
                    res.send("Not found such article");
            })
            .catch(error => {
                res.send(error);
            });
    })
    .put((req, res) => {
        Article.updateOne(
            { title: req.params.articleTitle },
            {
                title: req.body.title,
                content: req.body.content
            }
        )
            .then(() => {
                res.send("Successfully Updated the article");
            })
            .catch(error => {
                console.error(error);
                res.status(500).send("Internal Server Error");
            });
    })
    .patch((req, res) => {

        Article.updateOne(
            { title: req.params.articleTitle },
            {
                $set: req.body
            }
        )
            .then(() => {
                res.send("Succesfully updated!!!!");
            })
            .catch((err) => {
            
                res.send("Something not working!!!!");
            })
    })
    .delete((req, res) => {
     
        Article.deleteOne({
             title:req.params.articleTitle
        })
            .then(() => res.send("Successfully deleted!!!"))
            .catch((error) => res.send("Something went wrong!!"));

    });

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
