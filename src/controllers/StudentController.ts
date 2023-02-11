import { Request, Response } from 'express';
import {
  students,
  addStudent,
  getStudent,
  calculateFinalExamScore,
  getLetterGrade,
  updateStudentGrade,
} from '../models/StudentModel';

function getAllStudents(req: Request, res: Response): void {
  res.json(students);
}

function createNewStudent(req: Request, res: Response): void {
  const studentData = req.body as NewStudentRequest;
  const didAddStudent = addStudent(studentData);

  if (!didAddStudent) {
    res.sendStatus(409);
    return;
  }

  res.sendStatus(201);
}

function getStudentByName(req: Request, res: Response): void {
  const { studentName } = req.params as StudentNameParams;
  const student = getStudent(studentName);

  if (!student) {
    res.sendStatus(404);
    return;
  }

  res.json(student);
}

function getFinalExamScores(req: Request, res: Response): void {
  const { studentName } = req.params as StudentNameParams;
  const student = getStudent(studentName);

  if (!student) {
    res.sendStatus(404);
    return;
  }

  const { currentAverage, weights } = student;
  const { finalExamWeight } = weights;
  const scores: FinalExamScores = {
    neededForA: calculateFinalExamScore(currentAverage, finalExamWeight, 90),
    neededForB: calculateFinalExamScore(currentAverage, finalExamWeight, 80),
    neededForC: calculateFinalExamScore(currentAverage, finalExamWeight, 70),
    neededForD: calculateFinalExamScore(currentAverage, finalExamWeight, 60),
  };

  res.json(scores);
}

function calcFinalScore(req: Request, res: Response): void {
  const { studentName } = req.params as StudentNameParams;
  const student = getStudent(studentName);

  if (!student) {
    res.sendStatus(404);
    return;
  }

  const { currentAverage, weights } = student;
  const { finalExamWeight } = weights;
  const finalExamGrade = req.body as AssignmentGrade;

  const overallScore = currentAverage + (finalExamGrade.grade * finalExamWeight) / 100;
  const letterGrade = getLetterGrade(overallScore);

  const finalScore: FinalGrade = {
    overallScore,
    letterGrade,
  };

  res.json(finalScore);
}

function updateGrade(req: Request, res: Response): void {
  const { studentName, assignmentName } = req.params as GradeUpdateParams;
  const grade = req.body as AssignmentGrade;

  const didUpdate = updateStudentGrade(studentName, assignmentName, grade.grade);

  if (!didUpdate) {
    res.sendStatus(404);
    return;
  }

  res.sendStatus(200);
}

export {
  getAllStudents,
  createNewStudent,
  getStudentByName,
  getFinalExamScores,
  calcFinalScore,
  updateGrade,
};
