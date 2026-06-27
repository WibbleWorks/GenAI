// Simple test to check quiz functionality
const { chromium } = require('playwright');

(async () => {
  console.log('🚀 Starting simple quiz test...\n');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    console.log('1. Loading course page...');
    await page.goto('file:///Users/cedwards/Git/playground/GenAI/index.html');
    await page.waitForLoadState('domcontentloaded');
    
    // Wait for scripts to load
    await page.waitForFunction(() => window.quiz !== undefined, { timeout: 10000 });
    console.log('   ✅ Page loaded\n');
    
    console.log('2. Navigating to first lesson...');
    await page.click('text=Introduction to AI');
    await page.waitForSelector('.lesson-section', { timeout: 5000 });
    console.log('   ✅ Lesson loaded\n');
    
    console.log('3. Starting quiz...');
    await page.evaluate(() => {
      const lessonId = 'ai_introduction';
      window.course.startQuiz(lessonId);
    });
    await page.waitForSelector('.quiz-display', { timeout: 5000 });
    console.log('   ✅ Quiz started\n');
    
    console.log('4. Checking quiz questions...');
    const questions = await page.evaluate(() => {
      const quiz = window.quiz.currentQuiz;
      return quiz.questions.map(q => q.question);
    });
    console.log('   Questions found:', questions.length);
    questions.forEach((q, i) => console.log(`     ${i+1}. ${q}`));
    console.log();
    
    console.log('5. Selecting answer A for Q1...');
    await page.evaluate(() => {
      // Directly set the answer for Q1
      window.quiz.userAnswers[0] = 0;
      window.quiz.addOptionHandlers(); // Update UI
    });
    
    await page.waitForTimeout(1000);
    const afterQ1 = await page.evaluate(() => window.quiz.userAnswers);
    console.log(`   ✅ userAnswers: [${afterQ1}]\n`);
    
    console.log('6. Navigating to Q2...');
    await page.evaluate(() => {
      window.quiz.currentQuestionIndex = 1;
      window.quiz.displayQuestion();
    });
    await page.waitForTimeout(1000);
    console.log('   ✅ On Q2\n');
    
    console.log('7. Selecting answer A for Q2...');
    await page.evaluate(() => {
      // Directly set the answer for Q2
      window.quiz.userAnswers[1] = 0;
      window.quiz.addOptionHandlers(); // Update UI
    });
    
    await page.waitForTimeout(1000);
    const afterQ2 = await page.evaluate(() => window.quiz.userAnswers);
    console.log(`   ✅ userAnswers: [${afterQ2}]\n`);
    
    // Navigate back to Q1 so Submit button appears (it only appears on last question)
    console.log('8. Navigating to last question for Submit button...');
    await page.evaluate(() => {
      window.quiz.currentQuestionIndex = 1; // Last question
      window.quiz.displayQuestion();
    });
    await page.waitForTimeout(1000);
    
    console.log('10. Checking what is correct...');
    const correctOptions = await page.evaluate(() => {
      const quiz = window.quiz.currentQuiz;
      return quiz.questions.map(q => {
        return q.options.map(o => o.isCorrect);
      });
    });
    console.log('   Correct options:', JSON.stringify(correctOptions));
    console.log();
    
    console.log('11. Submitting quiz...');
    // Click the Submit button instead of calling endQuiz directly
    await page.click('#quizSubmit');
    await page.waitForSelector('.quiz-results', { timeout: 5000 });
    
    console.log('12. Checking results...');
    const result = await page.evaluate(() => {
      const quiz = window.quiz;
      return {
        finalScore: quiz.score,
        correctCount: quiz.correctCount,
        userAnswers: quiz.userAnswers,
        totalQuestions: quiz.currentQuiz.questions.length
      };
    });
    
    console.log('\n📊 FINAL RESULTS:');
    console.log(`   Score: ${result.finalScore}%`);
    console.log(`   Correct: ${result.correctCount}/${result.totalQuestions}`);
    console.log(`   Answers: [${result.userAnswers}]`);
    console.log();
    
    if (result.correctCount === 2 && result.finalScore === 100) {
      console.log('✅ SUCCESS! Quiz is working correctly!');
    } else {
      console.log('❌ FAILURE! Quiz has a bug.');
      console.log(`   Expected: 2/2 (100%)`);
      console.log(`   Got: ${result.correctCount}/${result.totalQuestions} (${result.finalScore}%)`);
    }
    
    // Keep browser open for inspection
    console.log('\n💡 Browser kept open for manual inspection. Close it when done.');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error.stack);
    await browser.close();
  }
})();