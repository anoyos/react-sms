const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var MessageSchema = new Schema(
  {
    from_number: {
      type: String,
      default: ""
    },
    to_number: {
      type: String,
      default: ""
    },
    text: {
      type: String,
      default: ""
    },
    message_id: {
      type: String,
      default: ""
    },
    direction: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Message", MessageSchema);
