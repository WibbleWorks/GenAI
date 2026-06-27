const { test, expect } = require('@playwright/test');

// Test the quiz functionality in the GenAI course

test.describe('GenAI Course Quiz System', () => {
  let page;
  let browser;

  test.beforeAll(async ({ browser }) => {
    // Open the course page
    page = await browser.newPage();
    await page.goto('file:///Users/cedwards/Git/playground/GenAI/index.html', {
      waitUntil: 'domcontentloaded'
    });
    
    // Wait for the course to load
    await page.waitForSelector('.course-container', { timeout: 5000 });
    await page.waitForFunction(() => window.course !== undefined, { timeout: 5000 });
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('Can navigate to first lesson', async () => {
    // Wait for course data to load
    await page.waitForFunction(() => {
      return window.course && window.course.courseData;
    }, { timeout: 5000 });

    // Check that the first lesson exists
    const lessonExists = await page.evaluate(() => {
      const course = window.course;
      const firstLesson = course.courseData.levels.beginner.lessons.ai_introduction;
      return !!firstLesson;
    });
    
    expect(lessonExists).toBe(true);
  });

  test('Can start AI Introduction quiz', async () => {
    // Navigate to the first lesson by clicking on it
    await page.click('text=Introduction to AI');
    
    // Wait for lesson to load
    await page.waitForSelector('.lesson-section', { timeout: 5000 });
    
    // Scroll to the quiz button and click it
    const startQuizBtn = page.locator('button:has-text("Start Knowledge Check")');
    if (await startQuizBtn.count() > 0) {
      await startQuizBtn.click();
    } else {
      // Alternative: find the quiz start button
      await page.click('button:has-text("Take Quiz")');
    }
    
    // Wait for quiz to appear
    await page.waitForSelector('.quiz-display', { timeout: 5000 });
    
    // Verify quiz is visible
    const quizVisible = await page.isVisible('.quiz-display');
    expect(quizVisible).toBe(true);
  });

  test('Can select answer for question 1', async () => {
    // Make sure we're at question 1
    await page.waitForSelector('.quiz-question', { timeout: 5000 });
    
    // Get the question text
    const questionText = await page.textContent('.quiz-question');
    console.log('Question 1:', questionText);
    
    // Click on the first option (should be "Learn from data and improve over time")
    const options = page.locator('.quiz-option');
    const optionCount = await options.count();
    expect(optionCount).toBeGreaterThan(0);
    
    // Click the first option
    await options.first().click();
    
    // Check if the option got selected class
    const isSelected = await options.first().evaluate(el => {
      return el.classList.contains('selected');
    });
    
    expect(isSelected).toBe(true);
    
    // Verify that userAnswers was updated
    const userAnswers = await page.evaluate(() => {
      return window.quiz.userAnswers;
    });
    
    console.log('userAnswers after Q1:', userAnswers);
    expect(userAnswers[0]).toBe(0); // First option should be index 0
  });

  test('Can navigate to question 2 and select answer', async () => {
    // Click Next button to go to question 2
    await page.click('text=Next →');
    
    // Wait for question 2 to load
    await page.waitForFunction(() => {
      const quiz = window.quiz;
      return quiz && quiz.currentQuestionIndex === 1;
    }, { timeout: 5000 });
    
    // Get the question text
    const questionText = await page.textContent('.quiz-question');
    console.log('Question 2:', questionText);
    
    // Click on the first option for Q2 (should be "DL ⊂ ML ⊂ AI")
    const options = page.locator('.quiz-option');
    await options.first().click();
    
    // Check if the option got selected
    const isSelected = await options.first().evaluate(el => {
      return el.classList.contains('selected');
    });
    
    expect(isSelected).toBe(true);
    
    // Verify that userAnswers was updated for question 2
    const userAnswers = await page.evaluate(() => {
      return window.quiz.userAnswers;
    });
    
    console.log('userAnswers after Q2:', userAnswers);
    expect(userAnswers[0]).toBe(0); // Q1 answer should still be 0
    expect(userAnswers[1]).toBe(0); // Q2 answer should be 0
  });

  test('Quiz scoring is correct', async () => {
    // Submit the quiz
    await page.click('text=Submit Quiz');
    
    // Wait for results
    await page.waitForSelector('.quiz-results', { timeout: 5000 });
    
    // Get the final score
    const score = await page.evaluate(() => {
      const quiz = window.quiz;
      return {
        finalScore: quiz.score,
        correctCount: quiz.correctCount,
        userAnswers: quiz.userAnswers,
        totalQuestions: quiz.currentQuiz.questions.length
      };
    });
    
    console.log('Final score:', score);
    
    // For AI Introduction Quiz:
    // Q1: Option A (index 0) is correct - "Learn from data and improve over time"
    // Q2: Option A (index 0) is correct - "DL ⊂ ML ⊂ AI"
    // So both answers should be correct, score should be 100%
    
    expect(score.correctCount).toBe(2);
    expect(score.finalScore).toBe(100);
    expect(score.userAnswers).toEqual([0, 0]);
  });
});

// Run the tests
(async () => {
  const { chromium } = require('@playwright/test');
  
  console.log('Starting Playwright test for GenAI course quiz...\n');
  
  const browser = await chromium.launch({ headless: false, slowMo: 50 });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // Test 1: Navigate to first lesson
    console.log('Test 1: Navigating to first lesson...');
    await page.goto('file:///Users/cedwards/Git/playground/GenAI/index.html');
    await page.waitForSelector('.course-container', { timeout: 5000 });
    await page.waitForFunction(() => window.course !== undefined, { timeout: 5000 });
    
    // Click on first lesson
    await page.click('text=Introduction to AI');
    await page.waitForSelector('.lesson-section', { timeout: 5000 });
    console.log('✓ Successfully navigated to first lesson\n');
    
    // Test 2: Start quiz
    console.log('Test 2: Starting quiz...');
    const startBtn = page.locator('button:has-text("Start Knowledge Check")').or(page.locator('button:has-text("Take Quiz")'));
    await startBtn.click();
    await page.waitForSelector('.quiz-display', { timeout: 5000 });
    console.log('✓ Quiz started successfully\n');
    
    // Test 3: Select answer for Q1
    console.log('Test 3: Selecting answer for question 1...');
    const options = page.locator('.quiz-option');
    await options.first().click();
    
    await page.waitForFunction(() => {
      const quiz = window.quiz;
      return quiz && quiz.userAnswers[0] === 0;
    }, { timeout: 3000 });
    
    const answersAfterQ1 = await page.evaluate(() => window.quiz.userAnswers);
    console.log('✓ Q1 answer selected:', answersAfterQ1);
    console.log();
    
    // Test 4: Navigate to Q2 and select answer
    console.log('Test 4: Navigating to question 2 and selecting answer...');
    await page.click('text=Next →');
    await page.waitForFunction(() => {
      const quiz = window.quiz;
      return quiz && quiz.currentQuestionIndex === 1;
    }, { timeout: 5000 });
    
    await options.first().click();
    
    await page.waitForFunction(() => {
      const quiz = window.quiz;
      return quiz && quiz.userAnswers[1] === 0;
    }, { timeout: 3000 });
    
    const answersAfterQ2 = await page.evaluate(() => window.quiz.userAnswers);
    console.log('✓ Q2 answer selected:', answersAfterQ2);
    console.log();
    
    // Test 5: Submit and check score
    console.log('Test 5: Submitting quiz and checking score...');
    await page.click('text=Submit Quiz');
    await page.waitForSelector('.quiz-results', { timeout: 5000 });
    
    const result = await page.evaluate(() => {
      const quiz = window.quiz;
      return {
        finalScore: quiz.score,
        correctCount: quiz.correctCount,
        userAnswers: quiz.userAnswers,
        totalQuestions: quiz.currentQuiz.questions.length
      };
    });
    
    console.log('Final results:', result);
    
    if (result.correctCount === 2 && result.finalScore === 100) {
      console.log('\n✅ ALL TESTS PASSED! Quiz scoring is working correctly.');
      console.log('   - Both answers were selected');
      console.log('   - Score: 2/2 (100%)');
    } else {
      console.log('\n❌ TESTS FAILED!');
      console.log(`   - Expected: 2 correct, 100% score`);
      console.log(`   - Got: ${result.correctCount} correct, ${result.finalScore}% score`);
      console.log(`   - userAnswers: [${result.userAnswers}]`);
    }
    
  } catch (error) {
    console.error('\n❌ Test failed with error:', error.message);
    console.error(error.stack);
  } finally {
    await browser.close();
  }
})();