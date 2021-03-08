var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/";

const conn = () => {
    return MongoClient.connect(url, { useUnifiedTopology: true })
        .then(db => {
            return db.db("social_network");
        })
        .catch(err => {
            return err;
        });
};

module.exports = conn();