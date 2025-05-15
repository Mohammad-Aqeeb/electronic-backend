// const mongoose = require('mongoose');

// const UserSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required : true,
//     default : null
//   },
  
//   email: {
//     type: String,
//     unique: true,
//     sparse: true, // Allows nulls even with `unique`
//     default: null
//   },
  
//   phone: {
//     type: String,
//     unique: true,
//     sparse: true,
//     default: null
//   },
  
//   email_verified_at: {
//     type: Date,
//     default: null
//   },
  
//   password: {
//     type: String,
//     required : true
//   }
// }, {
//   timestamps: true // Adds createdAt and updatedAt like Laravel's $table->timestamps()
// });

// module.exports = mongoose.model('User', UserSchema);
