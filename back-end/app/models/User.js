const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var UserSchema = new Schema(
  {
    email: {
      type: String,
      default: ""
    },
    phoneNumber: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("User", UserSchema);
