import mongoose from 'mongoose';

interface IAdmin {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    salt?: string;
    address?: string;
    phone?: string;
    otp?: number;
    otp_expiry?: Date;
    verified?: boolean;
    role?: string;
  }

const adminSchema = new mongoose.Schema<IAdmin>({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
      message: 'Please provide a valid email address',
    },
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  salt: {
    type: String,
  },
  address: {
    type: String,
  },
  phone: {
    type: String,
    validate: {
      validator: (phone: string) => /^[0-9]{10}$/g.test(phone),
      message: 'Please provide a valid phone number',
    },
  },
  otp: {
    type: Number,
    
  },
  otp_expiry: {
    type: Date,
    
  },
  verified: {
    type: Boolean,

  },
  role: {
    type: String,
  },
}, {
  timestamps: true,
  collection: 'admin',
});

const Admin = mongoose.model<IAdmin>('Admin', adminSchema);

export default Admin;