import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    trim: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    select: false,
  },

  role: {
    type: String,
    default: 'user',
  },

  firstname: {
    type: String,
    trim: true,
    maxlength: 25,
  },
  lastname: {
    type: String,
    trim: true,
    maxlength: 25,
  },
  gender: {
    type: String,
    default: 'unknown',
  },
  usertype: {
    type: String,
    default: 'user',
  },
  country: {
    type: String,
  },

  city: {
    type: String,
  },
  postalcode: {
    type: String,
  },
  phonenumber: {
    type: String,
  },

  language: {
    type: String,
    default: 'EN',
  },
  dateofbirth: {
    type: Date,
  },
  avatar: {
    type: String,
    default:
      'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png',
  },
  saved: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'post',
    },
  ],
  story: {
    type: String,
    default: '',
    maxlength: 200,
  },
  website: {
    type: String,
    default: '',
  },
  followers: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'user',
    },
  ],
  following: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'user',
    },
  ],
});

UserSchema.set('timestamps', true).toString();

const UserModel = mongoose.model<IUser & mongoose.Document>('User', UserSchema);

export default UserModel;
