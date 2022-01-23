import * as mongoose from 'mongoose';
import { genSalt, hash } from 'bcrypt';

const SALT_WORK_FACTOR = 10;

export interface User extends mongoose.Document {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isActive: boolean;
  hashedRt?: string;
}

const UserSchema = new mongoose.Schema<User>({
  email: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  isActive: { type: Boolean, required: true },
  hashedRt: { type: String, required: false },
});

UserSchema.pre('save', async function save(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await genSalt(SALT_WORK_FACTOR);
    this.password = await hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

// UserSchema.methods.comparePassword = function (candidatePassword, cb) {
//   compare(candidatePassword, this.password, function (err, isMatch) {
//     if (err) return cb(err);
//     cb(null, isMatch);
//   });
// };

export { UserSchema };
