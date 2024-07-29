import mongoose from "mongoose";
import { Password } from "../services/password";

/**
 * An interface that describes the properties
 * that are required to create a new user.
 */
interface UserAttrs {
  email: string;
  password: string;
}

/**
 * An interface that describes the properties
 * that a User Model has
 */
interface UserModel extends mongoose.Model<UserDocument> {
  build(attrs: UserAttrs): UserDocument;
}

/**
 * an interface that describes the properties
 * that a User Document has
 */
interface UserDocument extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
      },
    },
  }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"));

    this.set("password", hashed);
  }
  next();
});

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDocument, UserModel>("User", userSchema);

const buildUser = (attrs: UserAttrs) => {
  return new User(attrs);
};

export { User };
