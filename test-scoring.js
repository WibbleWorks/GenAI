// Direct test of quiz scoring logic
console.log('🧪 Testing quiz scoring logic directly...\n');

// Load the quiz system
require('./quiz-system.js');

// Create a mock quiz
const mockQuiz = {
  title: 'Test Quiz',
  passingScore: 80,
  timeLimit: 600,
  questions: [
    {
      question: 'What is the key characteristic of AI?',
      options: [
        { text: 'Learn from data and improve over time', isCorrect: true },
        { text: 'Only uses Python', isCorrect: false },
        { text: 'Always more accurate than humans', isCorrect: false },
        { text: 'Requires special hardware', isCorrect: false }
      ],
      concept: 'AI Definition'
    },
    {
      question: 'What relationship exists between AI, ML, and DL?',
      options: [
        { text: 'DL ⊂ ML ⊂ AI', isCorrect: true },
        { text: 'They are separate fields', isCorrect: false },
        { text: 'AI ⊂ ML ⊂ DL', isCorrect: false },
        { text: 'ML and DL are the same', isCorrect: false }
      ],
      concept: 'ML vs DL'
    }
  ]
};

// Create a quiz instance
const quiz = new QuizSystem();
quiz.currentQuiz = mockQuiz;
quiz.userAnswers = [0, 0]; // Both answered with option A (index 0)
quiz.weakConcepts = [];

console.log('Quiz data:');
console.log('  Questions:', mockQuiz.questions.length);
console.log('  User answers:', quiz.userAnswers);
console.log();

console.log('Question 1:');
console.log('  User selected: index', quiz.userAnswers[0]);
console.log('  Option A isCorrect:', mockQuiz.questions[0].options[0].isCorrect);
console.log();

console.log('Question 2:');
console.log('  User selected: index', quiz.userAnswers[1]);
console.log('  Option A isCorrect:', mockQuiz.questions[1].options[0].isCorrect);
console.log();

// Manually test the scoring logic from endQuiz
console.log('Testing scoring logic...');
let correctCount = 0;
let weakConcepts = [...new Set(quiz.weakConcepts)];

quiz.userAnswers.forEach((answerIndex, questionIndex) => {
  console.log(`  Checking Q${questionIndex+1}: answerIndex=${answerIndex}`);
  if (answerIndex !== null) {
    const question = quiz.currentQuiz.questions[questionIndex];
    const option = question.options[answerIndex];
    console.log(`    Option text: "${option.text}"`);
    console.log(`    isCorrect: ${option.isCorrect}`);
    if (option && option.isCorrect) {
      correctCount++;
      console.log(`    ✅ CORRECT`);
    } else {
      console.log(`    ❌ INCORRECT`);
    }
  }
});

const finalScore = Math.round((correctCount / quiz.currentQuiz.questions.length) * 100);

console.log();
console.log('📊 Results:');
console.log(`  correctCount: ${correctCount}`);
console.log(`  finalScore: ${finalScore}%`);
console.log();

if (correctCount === 2 && finalScore === 100) {
  console.log('✅ Scoring logic is CORRECT!');
  console.log('   Both answers should be counted as correct.');
} else {
  console.log('❌ Scoring logic has a BUG!');
  console.log(`   Expected: 2 correct, 100%`);
  console.log(`   Got: ${correctCount} correct, ${finalScore}%`);
}
