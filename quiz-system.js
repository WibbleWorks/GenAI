// Generative AI & Machine Learning Course - Quiz System
// ====================================================

class QuizSystem {
    constructor() {
        this.currentQuiz = null;
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.score = 0;
        this.quizContainer = null;
        this.quizDisplay = null;
        this.weakConcepts = [];
        this.correctCount = 0;
        this.timeLeft = 0;
        this.timer = null;
        this.startTime = null;
        this.timeLimit = 0;
        
        this.init();
    }
    
    init() {
        this.quizContainer = document.getElementById('quizContainer');
        this.setupQuizModal();
    }
    
    setupQuizModal() {
        // Quiz modal already exists in index.html
        // We'll use the quizContainer div
    }
    
    startQuiz(quiz) {
        this.currentQuiz = quiz;
        this.currentQuestionIndex = 0;
        this.userAnswers = new Array(quiz.questions.length).fill(null);
        this.score = 0;
        this.weakConcepts = [];
        this.correctCount = 0;
        this.timeLeft = quiz.timeLimit;
        this.timeLimit = quiz.timeLimit;
        
        // Clear previous timer
        if (this.timer) {
            clearInterval(this.timer);
        }
        
        // Start timer
        this.startTime = Date.now();
        this.updateTimer();
        this.timer = setInterval(() => this.updateTimer(), 1000);
        
        // Display first question
        this.displayQuestion();
        
        // Show quiz in panel
        if (this.quizContainer) {
            this.quizContainer.innerHTML = this.getQuizHTML();
            this.quizContainer.classList.add('show');
        }
        
        console.log(`Started quiz: ${quiz.title}`);
    }
    
    updateTimer() {
        if (!this.currentQuiz) return;
        
        const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
        this.timeLeft = Math.max(0, this.timeLimit - elapsed);
        
        const timerDisplay = document.getElementById('quizTimer');
        if (timerDisplay) {
            const minutes = Math.floor(this.timeLeft / 60);
            const seconds = this.timeLeft % 60;
            timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
        
        if (this.timeLeft <= 0) {
            this.endQuiz();
        }
    }
    
    displayQuestion() {
        if (!this.currentQuiz) return;
        
        const question = this.currentQuiz.questions[this.currentQuestionIndex];
        const questionElement = document.getElementById('quizQuestion');
        const optionsElement = document.getElementById('quizOptions');
        const progressElement = document.getElementById('quizProgress');
        const timerElement = document.getElementById('quizTimer');
        
        if (questionElement && optionsElement) {
            // Update question
            questionElement.innerHTML = `
                <h3>${question.question}</h3>
                ${question.type === 'multiple-choice' ? '' : ''}
            `;
            
            // Update options
            let optionsHTML = '';
            question.options.forEach((option, index) => {
                const letter = String.fromCharCode(65 + index);
                const isSelected = this.userAnswers[this.currentQuestionIndex] === index;
                const isCorrect = this.userAnswers[this.currentQuestionIndex] !== null && 
                                 question.options[option.isCorrect ? index : this.userAnswers[this.currentQuestionIndex]].isCorrect;
                const isIncorrect = this.userAnswers[this.currentQuestionIndex] !== null && 
                                   !option.isCorrect && this.userAnswers[this.currentQuestionIndex] === index;
                
                let classes = 'quiz-option';
                if (this.userAnswers[this.currentQuestionIndex] !== null) {
                    if (option.isCorrect) classes += ' correct';
                    else if (this.userAnswers[this.currentQuestionIndex] === index) classes += ' incorrect';
                } else if (isSelected) {
                    classes += ' selected';
                }
                
                optionsHTML += `
                    <label class="${classes}" data-index="${index}">
                        <input type="radio" name="quizOption" value="${index}" 
                               ${this.userAnswers[this.currentQuestionIndex] === index ? 'checked' : ''}>
                        <span class="option-letter">${letter}</span>
                        <span class="quiz-option-label">${option.text}</span>
                    </label>
                `;
            });
            
            optionsElement.innerHTML = optionsHTML;
            
            // Update progress
            if (progressElement) {
                progressElement.textContent = `Question ${this.currentQuestionIndex + 1} of ${this.currentQuiz.questions.length}`;
            }
            
            // Update timer
            if (timerElement) {
                const minutes = Math.floor(this.timeLeft / 60);
                const seconds = this.timeLeft % 60;
                timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            }
            
            // Update navigation buttons
            this.updateNavigation();
            
            // Add click handlers
            this.addOptionHandlers();
        }
    }
    
    addOptionHandlers() {
        const options = document.querySelectorAll('.quiz-option');
        options.forEach(option => {
            option.addEventListener('click', (e) => {
                if (this.userAnswers[this.currentQuestionIndex] !== null) return;
                
                const index = parseInt(option.dataset.index);
                this.userAnswers[this.currentQuestionIndex] = index;
                
                // Update UI
                options.forEach(o => o.classList.remove('selected'));
                option.classList.add('selected');
                
                // Mark answer
                const question = this.currentQuiz.questions[this.currentQuestionIndex];
                if (question.options[index].isCorrect) {
                    this.correctCount++;
                    this.score += 100 / this.currentQuiz.questions.length;
                } else {
                    // Track weak concept
                    if (question.concept && !this.weakConcepts.includes(question.concept)) {
                        this.weakConcepts.push(question.concept);
                    }
                }
            });
        });
    }
    
    updateNavigation() {
        const prevBtn = document.getElementById('quizPrev');
        const nextBtn = document.getElementById('quizNext');
        const submitBtn = document.getElementById('quizSubmit');
        
        if (prevBtn) {
            prevBtn.style.display = this.currentQuestionIndex > 0 ? 'inline-flex' : 'none';
        }
        
        if (nextBtn && submitBtn) {
            if (this.currentQuestionIndex < this.currentQuiz.questions.length - 1) {
                nextBtn.style.display = 'inline-flex';
                submitBtn.style.display = 'none';
            } else {
                nextBtn.style.display = 'none';
                submitBtn.style.display = 'inline-flex';
            }
        }
    }
    
    nextQuestion() {
        if (this.currentQuestionIndex < this.currentQuiz.questions.length - 1) {
            this.currentQuestionIndex++;
            this.displayQuestion();
        }
    }
    
    prevQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.displayQuestion();
        }
    }
    
    endQuiz() {
        // Clear timer
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        
        // Calculate final score
        const finalScore = Math.round(this.score);
        
        // Prepare results
        const totalQuestions = this.currentQuiz.questions.length;
        const correct = this.correctCount;
        const incorrect = totalQuestions - correct;
        
        // Show results
        if (this.quizContainer) {
            this.quizContainer.innerHTML = this.getResultsHTML(finalScore, correct, incorrect);
        }
        
        // Notify course system
        if (window.course) {
            const currentLessonId = window.course.currentLessonId;
            if (currentLessonId) {
                window.course.markLessonComplete(currentLessonId, finalScore, this.weakConcepts);
                window.course.adaptiveLearning(this.weakConcepts);
            }
        }
        
        // Reset state
        this.currentQuiz = null;
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        
        console.log(`Quiz completed. Score: ${finalScore}%, Weak concepts: ${this.weakConcepts.join(', ')}`);
    }
    
    getQuizHTML() {
        if (!this.currentQuiz) return '';
        
        const question = this.currentQuiz.questions[this.currentQuestionIndex];
        
        return `
            <div class="quiz-display">
                <div class="quiz-header">
                    <div>
                        <div class="quiz-title">${this.currentQuiz.title}</div>
                        <div class="quiz-info">
                            <span id="quizProgress">Question 1 of ${this.currentQuiz.questions.length}</span>
                            <span>Passing: ${this.currentQuiz.passingScore}%</span>
                            <span>Time: <span id="quizTimer">${Math.floor(this.timeLeft/60)}:${(this.timeLeft%60).toString().padStart(2,'0')}</span></span>
                        </div>
                    </div>
                </div>
                
                <div class="quiz-question" id="quizQuestion">
                    <h3>${question.question}</h3>
                </div>
                
                <div class="quiz-options" id="quizOptions">
                    ${this.currentQuiz.questions[this.currentQuestionIndex].options.map((option, index) => {
                        const letter = String.fromCharCode(65 + index);
                        return `
                            <label class="quiz-option" data-index="${index}">
                                <input type="radio" name="quizOption" value="${index}">
                                <span class="option-letter">${letter}</span>
                                <span class="quiz-option-label">${option.text}</span>
                            </label>
                        `;
                    }).join('')}
                </div>
                
                <div class="quiz-navigation">
                    <button class="btn-secondary" id="quizPrev" onclick="quiz.prevQuestion()">← Previous</button>
                    <div style="flex: 1;"></div>
                    <button class="btn-secondary" id="quizNext" onclick="quiz.nextQuestion()">Next →</button>
                    <button class="btn-primary" id="quizSubmit" onclick="quiz.endQuiz()" style="display: none;">Submit Quiz</button>
                </div>
            </div>
        `;
    }
    
    getResultsHTML(score, correct, incorrect) {
        if (!this.currentQuiz) return '';
        
        const passed = score >= this.currentQuiz.passingScore;
        const total = this.currentQuiz.questions.length;
        
        let feedback = '';
        if (score >= 90) {
            feedback = `🌟 Excellent work! You've mastered this topic.`;
        } else if (score >= 75) {
            feedback = `👍 Good job! You have a solid understanding.`;
        } else if (score >= this.currentQuiz.passingScore) {
            feedback = `✅ You passed! Consider reviewing the weak areas below.`;
        } else {
            feedback = `🔄 Keep practicing! Review the concepts and try again.`;
        }
        
        const weakList = this.weakConcepts.length > 0 ? 
            `<div class="weak-areas">
                <h4>📋 Areas to Review:</h4>
                <ul>${this.weakConcepts.map(c => `<li>${c}</li>`).join('')}</ul>
             </div>` : '';
        
        return `
            <div class="quiz-results">
                <div class="quiz-score" style="color: ${passed ? 'var(--ai-green)' : 'var(--ai-red)'};">${score}%</div>
                <div class="quiz-feedback">
                    <strong>${feedback}</strong><br>
                    ${correct} of ${total} correct
                </div>
                ${weakList}
                <button class="btn-primary" onclick="quiz.restartQuiz()" style="margin-top: 1rem; width: 100%;">
                    ${passed ? 'Continue' : 'Try Again'}
                </button>
            </div>
        `;
    }
    
    restartQuiz() {
        if (this.currentQuiz) {
            this.startQuiz(this.currentQuiz);
        }
        
        // Hide results and show quiz again
        if (this.quizContainer) {
            this.quizContainer.innerHTML = this.getQuizHTML();
            this.addOptionHandlers();
        }
    }
}

// Initialize quiz system
window.quiz = new QuizSystem();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = QuizSystem;
}
