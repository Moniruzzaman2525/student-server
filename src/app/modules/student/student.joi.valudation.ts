import Joi from "joi";

const userNameSchema = Joi.object({
    firstName: Joi.string()
      .required()
      .max(20)
      .trim()
      .regex(/^[A-Z][a-z]*$/)
      .messages({
        'string.empty': 'First Name is required',
        'string.max': 'First Name can not be more than 20 characters',
        'string.pattern.base': '{#value} is not in capitalize format',
      }),
    middleName: Joi.string().allow('').trim(),
    lastName: Joi.string()
      .required()
      .trim()
      .regex(/^[a-zA-Z]+$/)
      .messages({
        'string.empty': 'Last Name is required',
        'string.pattern.base': '{#value} is not valid',
      }),
  });

  // Guardian Schema
  const guardianSchema = Joi.object({
    fatherName: Joi.string().required().trim().messages({
      'string.empty': 'Father name is required',
    }),
    fatherOccupation: Joi.string().required().messages({
      'string.empty': 'Father occupation is required',
    }),
    fatherContactNo: Joi.string().required().messages({
      'string.empty': 'Father contact is required',
    }),
    motherName: Joi.string().required().trim().messages({
      'string.empty': 'Mother name is required',
    }),
    motherOccupation: Joi.string().required().messages({
      'string.empty': 'Mother occupation is required',
    }),
    motherContactNo: Joi.string().required().messages({
      'string.empty': 'Mother contact is required',
    }),
  });

  // LocalGuardian Schema
  const localGuardianSchema = Joi.object({
    name: Joi.string().required().trim().messages({
      'string.empty': 'Name is required',
    }),
    occupation: Joi.string().required().messages({
      'string.empty': 'Local guardian occupation is required',
    }),
    contactNo: Joi.string().required().messages({
      'string.empty': 'Local guardian contact is required',
    }),
    address: Joi.string().required().messages({
      'string.empty': 'Local guardian address is required',
    }),
  });

  // Student Schema
  const studentValidationSchema = Joi.object({
    id: Joi.string().required().messages({
      'string.empty': 'ID is required',
    }),
    password: Joi.string().required().messages({
      'string.empty': 'ID is required',
    }),
    name: userNameSchema.required().messages({
      'object.base': 'Name is required',
    }),
    gender: Joi.string()
      .valid('male', 'female', 'other')
      .required()
      .messages({
        'any.only': '{#value} is not supported',
        'string.empty': 'Gender is required',
      }),
    dateOfBirth: Joi.string(),
    email: Joi.string().email().required(),
    // email: Joi.string().required().email().messages({
    //   'string.empty': 'Email is required',
    //   'string.email': '{#value} is not a valid email',
    // }),
    contactNo: Joi.string().required().messages({
      'string.empty': 'Student contact is required',
    }),
    emergencyContactNo: Joi.string().required().messages({
      'string.empty': 'Student emergency contact number is required',
    }),
    presentAddress: Joi.string().required().messages({
      'string.empty': 'Student present address is required',
    }),
    permanentAddress: Joi.string().required().messages({
      'string.empty': 'Student permanent address is required',
    }),
    bloodGroup: Joi.string().valid(
      'A+',
      'A-',
      'B+',
      'B-',
      'AB+',
      'AB-',
      'O+',
      'O-',
    ),
    guardian: guardianSchema.required().messages({
      'object.base': 'Guardian is required',
    }),
    localGuardian: localGuardianSchema.required().messages({
      'object.base': 'Local guardian is required',
    }),
    profileImg: Joi.string().uri(),
    isActive: Joi.string().valid('active', 'block').default('active'),
    isDeleted: Joi.boolean() 
  });


  export default studentValidationSchema