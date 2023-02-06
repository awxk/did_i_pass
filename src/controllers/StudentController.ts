import { Request, Response } from 'express';
import StudentModel from '../models/StudentModel';

function createNewStudent(req: Request, res: Response): void {
  const student = req.body;
  StudentModel.addStudent(student);
  res.status(201).send();
}

function getStudentByName(req: Request, res: Response): void {
  const { studentName } = req.params;
  const student = StudentModel.getStudent(studentName);
  if (student) {
    res.status(200).json(student);
  } else {
    res.status(404).send();
  }
}

function getAllStudents(req: Request, res: Response): void {
  const students = StudentModel.getAllStudents();
  res.status(200).json(students);
}

function updateStudent(req: Request, res: Response): void {
  const { studentName } = req.params;
  const { finalExamScore } = req.body;
  const student = StudentModel.getStudent(studentName);
  if (student) {
    const finalGrade = StudentModel.updateStudent(student, finalExamScore);
    res.status(200).json(finalGrade);
  } else {
    res.status(404).send();
  }
}

export default { createNewStudent, getStudentByName, getAllStudents, updateStudent };
