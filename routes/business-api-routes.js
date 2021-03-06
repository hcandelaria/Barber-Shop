var db = require("../models");

module.exports = app => {
  //Get all Business
  app.get("/api/business", (req, res) => {
    db.Business.findAll({}).then( dbBusiness => {
      res.json(dbBusiness);
    });
  });
  //Get Business where id
  app.get("/api/business/:id", (req, res) => {
    db.Business.findOne({
      where: {
        id: req.params.id
      },
      include: [{ all: true, nested: true }]
    }).then( dbBusiness => {
      res.json(dbBusiness);
    });
  });
  //Create new Business
  app.post("/api/business", (req, res) => {
    db.Business.create(req.body).then( dbBusiness => {
      res.json(dbBusiness);
    });
  });
  //Delete Business where id
  app.delete("/api/business/:id", (req, res) => {
    db.Business.destroy({
      where: {
        id: req.params.id
      }
    }).then( dbBusiness => {
      res.json(dbBusiness);
    });
  });
  //Update Business where id
  app.put("/api/business", (req, res) => {
    db.Business.update(
      req.body,
      {
        where: {
          id: req.body.id
        }
      }).then( bdBusiness => {
        res.json(dbBusiness);
      });
  });
};
