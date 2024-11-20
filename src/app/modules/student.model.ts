import validator from 'validator';
import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import {
  // StudentMethods,
  StudentModel,
  TGuardian,
  TLocalGuardian,
  TStudent,
  TUserName,
} from './student/studentInterface';
import config from '../config';

const userNameSchema = new Schema<TUserName>({
  firstName: {
    type: String,
    required: [true, 'First Name is required'],
    maxlength: [
      20,
      'First Name can not be more than allowed length is 20 character',
    ],
    trim: true,
    validate: {
      validator: function (value: string) {
        const firstNameStr =
          value.charAt(0).toLocaleUpperCase() + value.slice(1);
        return firstNameStr === value;
      },
      message: '{VALUE} is not in capitalize format',
    },
  },
  middleName: {
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, 'Last Name is required'],
    trim: true,
    validate: {
      validator: (value) => validator.isAlpha(value),
      message: '{VALUE} is not valid',
    },
  },
});

const guardianSchema = new Schema<TGuardian>({
  fatherName: {
    type: String,
    required: [true, 'Father name is required'],
    trim: true,
  },
  fatherOccupation: {
    type: String,
    required: [true, 'First occupation is required'],
  },
  fatherContactNo: {
    type: String,
    required: [true, 'First contact is required'],
  },
  motherName: {
    type: String,
    required: [true, 'Mother name is required'],
    trim: true,
  },
  motherOccupation: {
    type: String,
    required: [true, 'Mother occupation is required'],
  },
  motherContactNo: {
    type: String,
    required: [true, 'Mother contact is required'],
  },
});

const localGuardianSchema = new Schema<TLocalGuardian>({
  name: { type: String, required: [true, 'Name is required'], trim: true },
  occupation: {
    type: String,
    required: [true, 'Local guardian occupation is required'],
  },
  contactNo: {
    type: String,
    required: [true, 'Local guardian contact is required'],
  },
  address: {
    type: String,
    required: [true, 'Local guardian contact is required'],
  },
});

const studentSchema = new Schema<TStudent, StudentModel>({
  id: { type: String, required: true, unique: true },
  password: {
    type: String,
    required: true,
    max: [20, 'Pass word maximum 20 character'],
  },
  name: {
    type: userNameSchema,
    required: [true, 'Name is required'],
  },
  gender: {
    type: String,
    enum: {
      values: ['male', 'female', 'other'],
      message: '{VALUE} is not supported',
    },
    required: true,
  },
  dateOfBirth: { type: String },
  email: { type: String, required: [true, 'Email is required'], unique: true },
  contactNo: { type: String, required: [true, 'Student contact is required'] },
  emergencyContactNo: {
    type: String,
    required: [true, 'Student emergency contact number is required'],
  },

  presentAddress: {
    type: String,
    required: [true, 'Student present address is required'],
  },
  permanentAddress: {
    type: String,
    required: [true, 'Student permanent address is required'],
  },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
  },
  guardian: {
    type: guardianSchema,
    required: [true, 'Guardian is required'],
  },
  localGuardian: {
    type: localGuardianSchema,
    required: [true, 'Local guardian is required'],
  },
  profileImg: { type: String },
  isActive: {
    type: String,
    enum: ['active', 'block'],
    default: 'active',
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
},{
  toJSON: {
    virtuals: true 
  }
});

// pre save middleware/hook : will work on create or save

studentSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this; // document

  // console.log(this, 'pre hook: we will save the data');
  // hashing password and save into db

  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_round),
  );

  next();
});

studentSchema.post('save', function (doc, next) {
  // console.log(this, 'post hook: we save our data');

  doc.password = '';

  next();
});
// query middle ware

studentSchema.pre('find', function (next) {
  // console.log(this);

  this.find({ isDeleted: { $ne: true } });
  next();
});
studentSchema.pre('findOne', function (next) {
  // console.log(this);

  this.find({ isDeleted: { $ne: true } });
  next();
});
studentSchema.pre('aggregate', function (next) {
  // console.log(this);
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  // this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });

  next();
});

// create a custom static method

studentSchema.statics.isUserExists = async function (id: string) {
  const existingUser = await Student.findOne({ id });
  return existingUser;
};

/// create a custom instance method
// studentSchema.methods.isUserExists = async function (id: string) {
//   const existingUser = await Student.findOne({ id });
//   return existingUser;
// };

//virtual

studentSchema.virtual('fullName').get(function () {
  return (`${this.name.firstName} ${this.name.middleName} ${this.name.lastName}`)
});

export const Student = model<TStudent, StudentModel>('Student', studentSchema);
