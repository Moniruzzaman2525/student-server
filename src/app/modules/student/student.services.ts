import { Student } from '../student.model';
import { TStudent } from './studentInterface';

const createStudentIntoDB = async (studentData: TStudent) => {
  // const student = new Student(studentData); // create an instance
  // if (await student.isUserExists(studentData.id)) {
  //   throw new Error('User already exists');
  // }
  // const result = await student.save(); // build in instance

  if (await Student.isUserExists(studentData.id)) {
    throw new Error('User already exists');
  }
  const result = await Student.create(studentData); // build in
  return result;
};

const getAllStudentsFromDB = async () => {
  const result = await Student.find();
  return result;
};

const getSingleStudentFromDB = async (id: string) => {
  // const result = await Student.findOne({ id });
  const result = await Student.aggregate([{ $match: { id: id } }]);
  return result;
};
const deleteSingleStudentFromDB = async (id: string) => {
  const result = Student.updateOne({ id }, { isDeleted: true });
  return result;
};

export const StudentServices = {
  createStudentIntoDB,
  getAllStudentsFromDB,
  getSingleStudentFromDB,
  deleteSingleStudentFromDB,
};
