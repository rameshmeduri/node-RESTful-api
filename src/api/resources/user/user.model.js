import mongoose from 'mongoose'

// avoid error : Cannot overwrite `user` model once compiled.
function _getModel(modelName, schema) {
  if (mongoose.models[modelName]) {
    return mongoose.model(modelName);
  } else {
    return mongoose.model(modelName, schema);
  }
}

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  passwordHash: {
    required: true,
    type: String,
  }
}, {timestamps: true})

userSchema.methods = {
  authenticate(plaintTextPassword) {
    return bcrypt.compareSync(plainTextPword, this.password)
  },
  hashPassword(plaintTextPassword) {
    if (!plaintTextPassword) {
      throw new Error('Could not save user')
    }

    const salt = bcrypt.genSaltSync(10)
    return bcrypt.hashSync(plaintTextPassword, salt)
  }
}

export const User = _getModel('user', userSchema);
// mongoose.model('user', userSchema)
