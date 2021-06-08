const searchModel = require("./Search.model");
const { regexStr } = require("../../Config/regex.config")

class Search {
    searchAll(req, res) {
        let data = {
            body: "",
            params: "",
        };
        if (req.body) {
            (data.body = req.body.filter), (data.params = req.params.query.toLowerCase());
        }
        searchModel.searchAllModel(data, (err, result) => {
            if (err) return res.status(500).json(err);
            return res.json(result);
        });
    }
    searchUser(req, res) {
        let data = {
            filter: "",
            params: "",
        };
        if (req.body) {
            let query = regexStr(req.query.name).toLowerCase();
            (data.filter = req.query.filter), (data.params = query);
        }
        searchModel.searchUserModel(data, (err, result) => {
            if (err) return res.status(500).json(err);
            return res.json(result);
        });
    }
    searchGroup(req, res) {
        let data = {
            filter: "",
            params: "",
        };
        if (req.body) {
            let query = regexStr(req.query.name).toLowerCase();
            (data.filter = req.query.filter), (data.params = query);
        }
        searchModel.searchGroupModel(data, (err, result) => {
            if (err) return res.status(500).json(err);
            return res.json(result);
        });
    }
}

module.exports = new Search();