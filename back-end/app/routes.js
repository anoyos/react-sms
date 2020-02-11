const Message = require("./models/Message");
const User = require("./models/User");
const Favorite = require("./models/Favorite");
const crypto = require("crypto");
const http = require("http");
const nodemailer = require("nodemailer");

module.exports = function(app, io) {
  app.post("/userchk", function(req, res) {
    User.findOne(
      {
        email: req.body.email
      },
      function(err, result) {
        if (!result) {
          const userData = {
            email: req.body.email
          };
          User.create(userData, function(err1, res1) {
            if (err1) {
              return;
            } else {
              res.send([]);
            }
          });
        } else {
          res.send(result);
        }
      }
    );
  });
  app.post("/callback", function(req, res) {
    let callback = req.body[0];
    if (callback && callback.type === "message-received") {
      let message = callback.message;
      const setTime = new Date(new Date().getTime() - 30 * 60 * 1000);
      const msgTime = new Date(callback.time);
      if (setTime < msgTime) {
        Message.findOne(
          {
            message_id: message.id
          },
          function(err, result) {
            if (!result) {
              let msgData;
              if (result && result.media) {
                msgData = {
                  from_number: message.from,
                  to_number: callback.to,
                  text: message.text,
                  direction: "in",
                  state: "0",
                  media: message.media[0],
                  message_id: message.id
                };
              } else {
                msgData = {
                  from_number: message.from,
                  to_number: callback.to,
                  text: message.text,
                  state: "0",
                  direction: "in",
                  message_id: message.id
                };
              }
              Message.create(msgData, function(err1, res1) {
                if (res1) {
                  let data = {
                    state: "success",
                    fromNumber: res1.from_number,
                    toNumber: res1.to_number
                  };
                  io.emit("incomMessage", data);
                }
              });
            }
          }
        );
      }
    }
    if (callback && callback.type === "message-delivered") {
      let message = callback.message;
      const setTime = new Date(new Date().getTime() - 30 * 60 * 1000);
      const msgTime = new Date(callback.time);
      if (setTime < msgTime) {
        Message.findOne(
          {
            message_id: message.id
          },
          function(err, result) {
            if (result && result.state === "0" && result.media) {
              let data = {
                state: "success",
                fromNumber: result.from_number,
                toNumber: result.to_number
              };
              io.emit("incomMessage", data);
            }
          }
        );
      }
    }
  });
  app.post("/sendmessage", function(req, res) {
    const { from_number, to_number, text } = req.body.sendMsgData;
    Message.create(req.body.sendMsgData, function(err, resu) {
      if (err) {
        res.send(err);
      } else {
        Message.find(
          {
            $or: [
              { from_number: from_number, to_number: to_number },
              { from_number: to_number, to_number: from_number }
            ]
          },
          null,
          { sort: { createdAt: "asc" } },
          function(err, result) {
            if (err) {
              console.log(err);
            } else {
              res.send(result);
            }
          }
        );
      }
    });
  });
  app.post("/getmessages", function(req, res) {
    const { fromNumber, toNumber } = req.body.msgData;
    if (toNumber && fromNumber) {
      Message.find(
        {
          $or: [
            { from_number: fromNumber, to_number: toNumber },
            { from_number: toNumber, to_number: fromNumber }
          ]
        },
        null,
        { sort: { createdAt: "asc" } },
        function(err, result) {
          if (err) {
            console.log(err);
          } else {
            res.send(result);
            Message.updateMany(
              {
                $or: [
                  { from_number: fromNumber, to_number: toNumber },
                  { from_number: toNumber, to_number: fromNumber }
                ]
              },
              { $set: { state: 1 } },
              function(err, result) {
                if (err) {
                  return err;
                }
              }
            );
          }
        }
      );
    }
  });
  app.post("/getprintmessages", function(req, res) {
    const { fromNumber, toNumber, startDate, endDate } = req.body.msgData;

    if (startDate === endDate) {
      Message.find(
        {
          $or: [
            { from_number: fromNumber, to_number: toNumber },
            { from_number: toNumber, to_number: fromNumber }
          ],
          createdAt: {
            $gte: startDate
          }
        },
        null,
        { sort: { createdAt: "asc" } },
        function(err, result) {
          if (err) {
            console.log(err);
          } else {
            res.send(result);
          }
        }
      );
    } else {
      Message.find(
        {
          $or: [
            { from_number: fromNumber, to_number: toNumber },
            { from_number: toNumber, to_number: fromNumber }
          ],
          createdAt: {
            $gte: startDate,
            $lte: endDate
          }
        },
        null,
        { sort: { createdAt: "asc" } },
        function(err, result) {
          if (err) {
            console.log(err);
          } else {
            res.send(result);
          }
        }
      );
    }
  });
  app.post("/getnumbers", function(req, res) {
    const { userNumber, email } = req.body;
    const array = [];
    let numberArray = [];

    Favorite.find(
      {
        email: email,
        from_number: userNumber
      },
      function(err, result) {
        if (err) {
          console.log(err);
        } else {
          numberArray = result;
        }
      }
    );

    Message.find(
      { $or: [{ from_number: userNumber }, { to_number: userNumber }] },
      { from_number: 1, to_number: 1, _id: 0 },
      { sort: { createdAt: "desc" } },
      function(err, result) {
        if (err) {
          console.log(err);
        } else {
          result &&
            result.map(res => {
              if (res.from_number === userNumber) {
                array.push({ memberNum: res.to_number });
              }
              if (res.to_number === userNumber) {
                array.push({ memberNum: res.from_number });
              }
            });

          const arr = array.filter(
            (v, i, a) => a.findIndex(t => t.memberNum === v.memberNum) === i
          );

          let notifies = [];
          let index = 0;

          arr.forEach(num => {
            Message.find(
              {
                $or: [
                  {
                    from_number: num.memberNum,
                    to_number: userNumber,
                    state: "0",
                    direction: "in",
                    media: { $eq: "" }
                  },
                  {
                    from_number: num.memberNum,
                    to_number: userNumber,
                    state: "0",
                    direction: "out",
                    media: { $ne: "" }
                  }
                ]
              },
              null,
              { sort: { createdAt: "desc" } },
              function(err, result) {
                if (result && result.length > 0) {
                  notifies.push({
                    number: num.memberNum,
                    newMsg: result.length
                  });
                }
                index++;
                if (index === arr.length) {
                  let normal =
                    numberArray.length === 0
                      ? arr
                      : arr.filter(
                          o1 =>
                            !numberArray.some(
                              o2 => o1.memberNum === o2.to_number
                            )
                        );
                  let favorite = arr.filter(o1 =>
                    numberArray.some(
                      o2 =>
                        o1.memberNum === o2.to_number &&
                        o2.email === email &&
                        o2.favorite === "1"
                    )
                  );
                  res.send({
                    members: arr,
                    notifies: notifies,
                    normalMem: normal,
                    favoriteMem: favorite
                  });
                  return;
                }
              }
            );
          });
        }
      }
    );
  });

  app.post("/getunreadmessage", function(req, res) {
    const { userNumber } = req.body;
    Message.find(
      {
        $or: [
          {
            to_number: userNumber,
            state: "0",
            direction: "in",
            media: { $eq: "" }
          },
          {
            to_number: userNumber,
            state: "0",
            direction: "out",
            media: { $ne: "" }
          }
        ]
      },
      null,
      { sort: { createdAt: "desc" } },
      function(err, result) {
        if (result && result.length > 0) {
          res.send({ count: result.length });
        } else {
          res.send({ count: 0 });
        }
      }
    );
  });

  app.post("/saveusernumber", function(req, res) {
    User.findOneAndUpdate(
      {
        email: req.body.email
      },
      { $set: { phoneNumber: req.body.phoneNumber } },
      function(err, result) {
        if (err) {
          return err;
        } else {
          res.send(result);
        }
      }
    );
  });
  app.post("/savestylemode", function(req, res) {
    User.findOneAndUpdate(
      {
        email: req.body.email
      },
      { $set: { style_mode: req.body.styleMode } },
      function(err, result) {
        if (err) {
          return err;
        } else {
          res.send(result);
        }
      }
    );
  });
  app.post("/fileupload", (req, res, next) => {
    let imageFile = req.files.file;
    var filename = crypto.randomBytes(15).toString("hex");
    imageFile.mv(`${__dirname}/../public/mms_images/${filename}.jpg`, function(
      err
    ) {
      if (err) {
        return res.status(500).send(err);
      }
      res.json({ file: `${filename}.jpg` });
    });
  });

  app.post("/sendcontact", (req, res, next) => {
    const client = nodemailer.createTransport({
      port: 25,
      host: "https://venturetelsms.app",
      tls: {
        rejectUnauthorized: false
      },
      service: "SendGrid",
      auth: {
        user: "webDev713",
        pass: "dragon713!"
      }
    });
    const email = {
      from: req.body.fromMail,
      to: req.body.toMail,
      subject: req.body.subject,
      text: req.body.text
    };
    client.sendMail(email, function(err, info) {
      if (err) {
        console.log("error");
      } else {
        res.send("Message sent: " + info.response);
      }
    });
  });
  app.post("/deleteconversation", (req, res) => {
    const { fromNumber, toNumber } = req.body.msgData;
    Message.deleteMany(
      {
        $or: [
          { from_number: fromNumber, to_number: toNumber },
          { from_number: toNumber, to_number: fromNumber }
        ]
      },
      function(err, resu) {
        if (!resu) {
          console.log(err);
        } else {
          res.send(resu);
        }
      }
    );
  });
  app.post("/addfavorite", (req, res) => {
    const { fromNumber, toNumber, email } = req.body.msgData;
    Favorite.findOne(
      {
        email: email,
        from_number: fromNumber,
        to_number: toNumber
      },
      function(err, result) {
        if (!result) {
          const saveData = {
            email: email,
            from_number: fromNumber,
            to_number: toNumber,
            favorite: "1"
          };
          Favorite.create(saveData, function(err1, res1) {
            if (err1) {
              return;
            } else {
              res.send(res1);
            }
          });
        }
      }
    );
  });

  app.post("/deletefavorite", (req, res) => {
    const { fromNumber, toNumber, email } = req.body.msgData;
    Favorite.deleteOne(
      {
        email: email,
        from_number: fromNumber,
        to_number: toNumber
      },
      function(err, result) {
        if (result) {
          res.send(result);
        }
      }
    );
  });

  app.get("*", function(req, res) {
    res.sendFile(__dirname + "/public/index.html"); // load the single view file (angular will handle the page changes on the front-end)
  });
};
