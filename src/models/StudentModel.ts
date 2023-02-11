const students: StudentManager = {};

function calculateAverage(weights: CourseGrades): number {
  let total = 0;

  for (const grade of weights.assignmentWeights) {
    total += (grade.grade * grade.weight) / (100 - weights.finalExamWeight);
  }

  return total;
}

function addStudent(newStudentData: NewStudentRequest): boolean {
  const { name, weights } = newStudentData;
  if (name in students) {
    return false;
  }

  const currentAverage = calculateAverage(weights);

  const student: Student = { name, weights, currentAverage };

  students[name] = student;
  return true;
}

function getStudent(studentName: string): Student | undefined {
  if (!(studentName in students)) {
    return undefined;
  }

  return students[studentName];
}

function calculateFinalExamScore(
  currentAverage: number,
  finalExamWeight: number,
  targetScore: number
): number {
  console.log(currentAverage, finalExamWeight, targetScore);
  return (
    Math.round(
      ((targetScore - (currentAverage * (100 - finalExamWeight)) / 100) / (finalExamWeight / 100)) *
        100
    ) / 100
  );
}

function getLetterGrade(score: number): string {
  if (score >= 90) {
    return 'A';
  }
  if (score >= 80) {
    return 'B';
  }
  if (score >= 70) {
    return 'C';
  }
  if (score >= 60) {
    return 'D';
  }
  return 'F';
}

function updateStudentGrade(
  studentName: string,
  assignmentName: string,
  newGrade: number
): boolean {
  const student = getStudent(studentName);

  if (!student) {
    return false;
  }

  const foundAssignment = student.weights.assignmentWeights.find(
    (assignment) => assignment.name === assignmentName
  );

  if (!foundAssignment) {
    return false;
  }

  foundAssignment.grade = newGrade;
  student.currentAverage = calculateAverage(student.weights);
  return true;
}

export {
  students,
  addStudent,
  getStudent,
  calculateFinalExamScore,
  getLetterGrade,
  updateStudentGrade,
};
