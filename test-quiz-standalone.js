const { chromium } = require('@playwright/test');

(async () => {
  console.log('🧪 Starting Playwright test for GenAI course quiz...\n');
  
  const browser = await chromium.launch({ 
    headless: false, 
    slowMo: 50 
  });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // Navigate to course
    console.log('📖 Loading GenAI course...');
    await page.goto('file:///Users/cedwards/Git/playground/GenAI/index.html');
    await page.waitForSelector('.course-container', { timeout: 5000 });
    await page.waitForFunction(() => window.course !== undefined, { timeout: 5000 });
    console.log('✅ Course loaded\n');
    
    // Click on first lesson
    console.log('📚 Navigating to "Introduction to AI" lesson...');
    await page.click('text=Introduction to AI');
    await page.waitForSelector('.lesson-section', { timeout: 5000 });
    console.log('✅ Lesson loaded\n');
    
    // Start quiz
    console.log('🎯 Starting quiz...');
    const startBtn = page.locator('button:has-text("Start Knowledge Check")').or(
      page.locator('button:has-text("Take Quiz")')
    );
    await startBtn.click();
    await page.waitForSelector('.quiz-display', { timeout: 5000 });
    console.log('✅ Quiz started\n');
    
    // Get question info
    const quizInfo = await page.evaluate(() => {
      const quiz = window.quiz;
      return {
        title: quiz.currentQuiz.title,
        questions: quiz.currentQuiz.questions.map(q => ({
          text: q.question,
          options: q.options.map(o => o.text)
        }))
      };
    });
    console.log('📋 Quiz:', quizInfo.title);
    quizInfo.questions.forEach((q, i) => {
      console.log(`  Q${i+1}: ${q.question}`);
      q.options.forEach((o, j) => {
        console.log(`    ${String.fromCharCode(65+j)}: ${o}`);
      });
    });
    console.log();
    
    // Answer Q1: Select option A (index 0)
    console.log('✏️  Answering Question 1: Selecting option A...');
    const options = page.locator('.quiz-option');
    await options.first().click();
    
    await page.waitForFunction(() => {
      const quiz = window.quiz;
      return quiz && quiz.userAnswers[0] === 0;
    }, { timeout: 3000 });
    
    const afterQ1 = await page.evaluate(() => window.quiz.userAnswers);
    console.log(`   ✅ userAnswers: [${afterQ1}]`);
    console.log();
    
    // Navigate to Q2
    console.log('🔢 Navigating to Question 2...');
    await page.click('text=Next →');
    await page.waitForFunction(() => {
      const quiz = window.quiz;
      return quiz && quiz.currentQuestionIndex === 1;
    }, { timeout: 5000 });
    console.log('✅ On Question 2\n');
    
    // Answer Q2: Select option A (index 0)
    console.log('✏️  Answering Question 2: Selecting option A...');
    await options.first().click();
    
    await page.waitForFunction(() => {
      const quiz = window.quiz;
      return quiz && quiz.userAnswers[1] === 0;
    }, { timeout: 3000 });
    
    const afterQ2 = await page.evaluate(() => window.quiz.userAnswers);
    console.log(`   ✅ userAnswers: [${afterQ2}]`);
    console.log();
    
    // Submit quiz
    console.log('📤 Submitting quiz...');
    await page.click('text=Submit Quiz');
    await page.waitForSelector('.quiz-results', { timeout: 5000 });
    console.log('✅ Quiz submitted\n');
    
    // Get results
    const result = await page.evaluate(() => {
      const quiz = window.quiz;
      return {
        finalScore: quiz.score,
        correctCount: quiz.correctCount,
        userAnswers: quiz.userAnswers,
        totalQuestions: quiz.currentQuiz.questions.length,
        passingScore: quiz.currentQuiz.passingScore
      };
    });
    
    console.log('📊 Results:');
    console.log(`   Score: ${result.finalScore}%`);
    console.log(`   Correct: ${result.correctCount}/${result.totalQuestions}`);
    console.log(`   Answers: [${result.userAnswers}]`);
    console.log(`   Passing: ${result.passingScore}%`);
    console.log();
    
    // Check if test passed
    const q1Correct = await page.evaluate(() => {
      const quiz = window.quiz;
      const q1 = quiz.currentQuiz.questions[0];
      return q1.options[0].isCorrect;
    });
    
    const q2Correct = await page.evaluate(() => {
      const quiz = window.quiz;
      const q2 = quiz.currentQuiz.questions[1];
      return q2.options[0].isCorrect;
    });
    
    console.log('🔍 Verification:');
    console.log(`   Q1 Option A is correct: ${q1Correct}`);
    console.log(`   Q2 Option A is correct: ${q2Correct}`);
    console.log();
    
    if (result.correctCount === 2 && result.finalScore === 100) {
      console.log('✅ SUCCESS! Quiz scoring is working correctly.');
      console.log('   Both questions answered correctly with option A.');
      console.log('   Score: 2/2 = 100%');
    } else {
      console.log('❌ FAILURE! Quiz scoring is incorrect.');
      console.log(`   Expected: 2/2 (100%)`);
      console.log(`   Got: ${result.correctCount}/${result.totalQuestions} (${result.finalScore}%)`);
      console.log(`   userAnswers: [${result.userAnswers}]`);
      
      if (result.userAnswers.length < 2) {
        console.log('   ⚠️  userAnswers array is too short!');
      }
      if (result.userAnswers[0] !== 0) {
        console.log('   ⚠️  Q1 answer not stored correctly!');
      }
      if (result.userAnswers[1] !== 0) {
        console.log('   ⚠️  Q2 answer not stored correctly!');
      }
    }
    
  } catch (error) {
    console.error('\n❌ Test failed with error:', error.message);
    console.error(error.stack);
  } finally {
    console.log('\n🧹 Cleaning up...');
    await browser.close();
  }
})();