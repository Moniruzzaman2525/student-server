import { z } from 'zod';

// Zod schema for UserName
const userNameSchema = z.object({
  firstName: z
    .string()
    .max(20, 'First Name cannot be more than 20 characters')
    .nonempty('First Name is required')
    .refine(
      (value) => /^[A-Z][a-z]*$/.test(value),
      'First Name must be in capitalize format'
    ),
  middleName: z.string().optional(),
  lastName: z
    .string()
    .nonempty('Last Name is required')
    .refine((value) => /^[a-zA-Z]+$/.test(value), 'Last Name is not valid'),
});

// Zod schema for Guardian
const guardianSchema = z.object({
  fatherName: z.string().nonempty('Father name is required'),
  fatherOccupation: z.string().nonempty('Father occupation is required'),
  fatherContactNo: z.string().nonempty('Father contact is required'),
  motherName: z.string().nonempty('Mother name is required'),
  motherOccupation: z.string().nonempty('Mother occupation is required'),
  motherContactNo: z.string().nonempty('Mother contact is required'),
});

// Zod schema for LocalGuardian
const localGuardianSchema = z.object({
  name: z.string().nonempty('Name is required'),
  occupation: z.string().nonempty('Local guardian occupation is required'),
  contactNo: z.string().nonempty('Local guardian contact is required'),
  address: z.string().nonempty('Local guardian address is required'),
});

// Zod schema for Student
const studentZodSchema = z.object({
  id: z.string().nonempty('ID is required'),
  name: userNameSchema,
  gender: z.enum(['male', 'female', 'other'], {
    errorMap: () => ({ message: 'Gender must be male, female, or other' }),
  }),
  dateOfBirth: z.string().optional(),
  email: z
    .string()
    .nonempty('Email is required')
    .email('Email must be a valid email address'),
  contactNo: z.string().nonempty('Student contact is required'),
  emergencyContactNo: z.string().nonempty('Emergency contact is required'),
  presentAddress: z.string().nonempty('Present address is required'),
  permanentAddress: z.string().nonempty('Permanent address is required'),
  bloodGroup: z
    .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
    .optional(),
  guardian: guardianSchema,
  localGuardian: localGuardianSchema,
  profileImg: z.string().optional(),
  isActive: z.enum(['active', 'block']).optional().default('active'),
});


export default studentZodSchema