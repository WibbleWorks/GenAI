// Simple test of the scoring logic
console.log('🧪 Testing quiz scoring logic...\n');

// Mock data matching the actual quiz
const mockQuiz = {
  title: 'AI Introduction Quiz',
  passingScore: 80,
  timeLimit: 300,
  questions: [
    {
      id: 'q1',
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
      id: 'q2',
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

// Simulate user answers: both selected option A (index 0)
const userAnswers = [0, 0];

console.log('Test Setup:');
console.log('  Quiz:', mockQuiz.title);
console.log('  Questions:', mockQuiz.questions.length);
console.log('  User answers:', userAnswers);
console.log();

// Test the scoring logic (copied from endQuiz method)
console.log('Running scoring logic...');
let correctCount = 0;
let weakConcepts = [];

userAnswers.forEach((answerIndex, questionIndex) => {
  console.log(`  Q${questionIndex+1}: answerIndex=${answerIndex}`);
  if (answerIndex !== null) {
    const question = mockQuiz.questions[questionIndex];
    const option = question.options[answerIndex];
    console.log(`    Question: "${question.question}"`);
    console.log(`    Selected: "${option.text}"`);
    console.log(`    isCorrect: ${option.isCorrect}`);
    
    if (option && option.isCorrect) {
      correctCount++;
      console.log(`    ✅ CORRECT`);
    } else {
      console.log(`    ❌ INCORRECT`);
      if (question.concept && !weakConcepts.includes(question.concept)) {
        weakConcepts.push(question.concept);
      }
    }
  }
});

const finalScore = Math.round((correctCount / mockQuiz.questions.length) * 100);

console.log();
console.log('📊 Final Results:');
console.log(`  correctCount: ${correctCount}`);
console.log(`  finalScore: ${finalScore}%`);
console.log(`  weakConcepts: [${weakConcepts}]`);
console.log();

if (correctCount === 2 && finalScore === 100) {
  console.log('✅ SCORING LOGIC IS CORRECT!');
  console.log('   The logic should give 2/2 (100%) for both A answers.');
  console.log('   The bug must be elsewhere (data, UI, event handling).');
} else {
  console.log('❌ SCORING LOGIC HAS A BUG!');
  console.log(`   Expected: 2 correct, 100%`);
  console.log(`   Got: ${correctCount} correct, ${finalScore}%`);
}
