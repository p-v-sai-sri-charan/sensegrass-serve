import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
  name: { type: String, required: false, default: 'user' },
  phone: { type: String, required: [true, 'Please provide a valid Phone number'], unique: [true, 'Phone number already exists'] },
  email: { type: String, required: false, unique: false, sparse: true }, // Set unique: false for the email field
  otp: { type: String, required: false },
  role: { type: String, required: false, default: 'user' },
  isAdmin: { type: Boolean, required: false, default: false },
  otpExpires: { type: Date, required: false },
  otpTries: { type: Number, required: false, default: 0 },
  otpTriesExpires: { type: Date, required: false },
});

// Manually create indexes
userSchema.index({ email: 1 }, { unique: true, sparse: true });
userSchema.index({ phone: 1 }, { unique: true });

const User = mongoose.models.user || mongoose.model('user', userSchema);

export default User;
