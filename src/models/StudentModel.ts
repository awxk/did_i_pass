const studentsManager: StudentManager = {};

function getStudents(): StudentManager {
  return studentsManager;
}

function calculateAssignmentAverage(assignmentWeights: CourseGrade[]): number {
  const totalWeight = assignmentWeights.reduce((acc, curr) => acc + curr.weight, 0);
  const totalGrade = assignmentWeights.reduce((acc, curr) => acc + curr.grade, 0);
  const assignmentAverage = totalGrade / totalWeight;
  return assignmentAverage;
}

function calculateFinalExamAverage(finalExamWeight: number): number {
  const finalExamAverage = finalExamWeight / 100;
  return finalExamAverage;
}

function calculateOverallAverage(assignmentAverage: number, finalExamAverage: number): number {
  const currentAverage = assignmentAverage + finalExamAverage;
  return currentAverage;
}

function calculateCurrentAverage(
  weights: CourseGrades = { assignmentWeights: [], finalExamWeight: 0 }
): number {
  const { assignmentWeights, finalExamWeight } = weights;
  const assignmentAverage = calculateAssignmentAverage(assignmentWeights);
  const finalExamAverage = calculateFinalExamAverage(finalExamWeight);
  const currentAverage = calculateOverallAverage(assignmentAverage, finalExamAverage);
  return currentAverage;
}

function getStudent(studentName: string): Student | undefined {
  return studentsManager[studentName];
}

function addStudent(student: NewStudentRequest): void {
  if (getStudent(student.name)) {
    throw new Error('Student already exists');
  }
  const { name, weights } = student;
  const currentAverage = calculateCurrentAverage(weights);
  const newStudent = { name, weights, currentAverage };
  studentsManager[name] = newStudent;
}

function getAllStudents(): Student[] {
  const students = Object.values(studentsManager);
  return students;
}

function getLetterGrade(overallScore: number): string {
  if (overallScore >= 90) {
    return 'A';
  }
  if (overallScore >= 80) {
    return 'B';
  }
  if (overallScore >= 70) {
    return 'C';
  }
  if (overallScore >= 60) {
    return 'D';
  }
  return 'F';
}

function calculateFinalGrade(finalExamScore: number, finalExamWeight: number): FinalGrade {
  const overallScore = (finalExamScore * finalExamWeight) / 100;
  const letterGrade = getLetterGrade(overallScore);
  const finalGrade = { overallScore, letterGrade };
  return finalGrade;
}

function updateStudent(student: Student, finalExamScore: number): FinalGrade {
  const { weights } = student;
  const { finalExamWeight } = weights;
  const finalGrade = calculateFinalGrade(finalExamScore, finalExamWeight);
  const studentToUpdate = student;
  studentToUpdate.currentAverage = finalGrade.overallScore;
  return finalGrade;
}

export default { getStudents, addStudent, getStudent, getAllStudents, updateStudent };
