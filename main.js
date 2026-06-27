// Generative AI & Machine Learning Course - Main System
// ======================================================

class AICourse {
    constructor() {
        // Course state
        this.currentLessonId = null;
        this.currentLevel = 'beginner';
        this.completedLessons = new Set();
        this.scores = {};
        this.weakAreas = [];
        this.strengths = [];
        this.timeSpent = 0;
        this.confidenceLevels = {};
        this.startTime = Date.now();
        
        // DOM elements
        this.lessonContainer = null;
        this.courseNav = null;
        this.progressFill = null;
        this.progressText = null;
        this.currentScoreEl = null;
        this.completedLessonsEl = null;
        this.masteredTopicsEl = null;
        this.avgScoreEl = null;
        this.confidenceLevelEl = null;
        
        // Systems
        this.animations = null;
        this.quiz = null;
        this.courseData = null;
        
        // Timeline
        this.activityLog = [];
        
        this.init();
    }
    
    init() {
        console.log('Initializing Generative AI & ML Course...');
        
        // Get DOM elements
        this.lessonContainer = document.getElementById('lessonContainer');
        this.courseNav = document.getElementById('courseNav');
        this.progressFill = document.getElementById('progressFill');
        this.progressText = document.getElementById('progressText');
        this.currentScoreEl = document.getElementById('currentScore');
        this.completedLessonsEl = document.getElementById('completedLessons');
        this.masteredTopicsEl = document.getElementById('masteredTopics');
        this.avgScoreEl = document.getElementById('avgScore');
        this.confidenceLevelEl = document.getElementById('confidenceLevel');
        
        // Load course data
        this.loadCourseData();
        
        // Initialize systems
        this.animations = window.animations || null;
        this.quiz = window.quiz || null;
        
        // Load saved progress
        this.loadProgress();
        
        // Build navigation
        this.buildNavigation();
        
        // Start with first lesson
        const firstLesson = this.getFirstLesson();
        if (firstLesson) {
            this.showLesson(firstLesson.id);
        }
        
        // Hide loading screen
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
        }
        
        // Set up interval to track time
        setInterval(() => this.updateTime(), 1000);
        
        // Add event listeners
        this.setupEventListeners();
    }
    
    getFirstLesson() {
        if (!this.courseData) return null;
        
        const levelOrder = ['beginner', 'intermediate', 'advanced', 'expert', 'phd'];
        
        for (const levelKey of levelOrder) {
            const level = this.courseData.levels[levelKey];
            if (level && level.lessons) {
                const firstLessonId = Object.keys(level.lessons)[0];
                if (firstLessonId) {
                    return level.lessons[firstLessonId];
                }
            }
        }
        
        return null;
    }
    
    loadCourseData() {
        if (typeof COURSE_DATA !== 'undefined') {
            this.courseData = COURSE_DATA;
            console.log('Course data loaded successfully');
        } else {
            console.error('Course data not found');
            this.courseData = { levels: {} };
        }
    }
    
    loadProgress() {
        try {
            const saved = localStorage.getItem('aiCourseProgress');
            if (saved) {
                const progress = JSON.parse(saved);
                this.completedLessons = new Set(progress.completedLessons || []);
                this.scores = progress.scores || {};
                this.weakAreas = progress.weakAreas || [];
                this.timeSpent = progress.timeSpent || 0;
                this.confidenceLevels = progress.confidenceLevels || {};
                console.log('Progress loaded:', progress);
            }
        } catch (e) {
            console.log('No saved progress found');
        }
    }
    
    saveProgress() {
        try {
            const progress = {
                completedLessons: Array.from(this.completedLessons),
                scores: this.scores,
                weakAreas: this.weakAreas,
                timeSpent: this.timeSpent,
                confidenceLevels: this.confidenceLevels
            };
            localStorage.setItem('aiCourseProgress', JSON.stringify(progress));
            console.log('Progress saved');
        } catch (e) {
            console.error('Failed to save progress:', e);
        }
    }
    
    setupEventListeners() {
        // Panel toggle
        const togglePanel = document.getElementById('togglePanel');
        const interactivePanel = document.getElementById('interactivePanel');
        
        if (togglePanel && interactivePanel) {
            togglePanel.addEventListener('click', () => {
                const isHidden = interactivePanel.style.display === 'none';
                interactivePanel.style.display = isHidden ? 'flex' : 'none';
                togglePanel.textContent = isHidden ? '▶' : '◀';
            });
        }
        
        // Modal closes
        const closeModal = document.querySelector('.close-modal');
        const animationModal = document.getElementById('animationModal');
        
        if (closeModal && animationModal) {
            closeModal.addEventListener('click', () => {
                animationModal.classList.remove('show');
            });
        }
        
        // Window close modals
        window.addEventListener('click', (e) => {
            if (e.target === animationModal) {
                animationModal.classList.remove('show');
            }
        });
        
        // Completion modal
        const completionModal = document.getElementById('completionModal');
        const closeCompletion = completionModal?.querySelector('.close-modal');
        const restartCourse = document.getElementById('restartCourse');
        const continueLearning = document.getElementById('continueLearning');
        
        if (closeCompletion) {
            closeCompletion.addEventListener('click', () => {
                completionModal.classList.remove('show');
            });
        }
        
        if (restartCourse) {
            restartCourse.addEventListener('click', () => {
                completionModal.classList.remove('show');
                this.restartCourse();
            });
        }
        
        if (continueLearning) {
            continueLearning.addEventListener('click', () => {
                completionModal.classList.remove('show');
            });
        }
    }
    
    buildNavigation() {
        if (!this.courseNav || !this.courseData) return;
        
        let html = '';
        const levelOrder = ['beginner', 'intermediate', 'advanced', 'expert', 'phd'];
        
        levelOrder.forEach(levelKey => {
            const level = this.courseData.levels[levelKey];
            if (!level) return;
            
            // Add level header
            html += `
                <li class="nav-section-header">
                    <span style="color: ${level.color}; font-weight: 600;">${level.icon} ${level.name}</span>
                </li>
            `;
            
            // Add lessons
            if (level.lessons) {
                Object.values(level.lessons).forEach(lesson => {
                    const isCompleted = this.completedLessons.has(lesson.id);
                    const isCurrent = this.currentLessonId === lesson.id;
                    const isUnlocked = lesson.unlocked !== false && 
                        (lesson.prerequisites.length === 0 || 
                         lesson.prerequisites.every(prereq => this.completedLessons.has(prereq)));
                    
                    let classes = 'nav-item';
                    if (isCompleted) classes += ' completed';
                    if (isCurrent) classes += ' active';
                    if (!isUnlocked) classes += ' locked';
                    
                    html += `
                        <li class="${classes}" data-lesson="${lesson.id}">
                            <span class="nav-indicator"></span>
                            <span class="lesson-title">${lesson.number}. ${lesson.title}</span>
                            ${lesson.level ? `<span class="level-badge ${lesson.level}">${lesson.level.toUpperCase()}</span>` : ''}
                        </li>
                    `;
                });
            }
        });
        
        this.courseNav.innerHTML = html;
        
        // Add event listeners
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const lessonId = item.dataset.lesson;
                if (lessonId && !item.classList.contains('locked')) {
                    this.showLesson(lessonId);
                }
            });
        });
    }
    
    showLesson(lessonId) {
        if (!this.courseData || !this.lessonContainer) return;
        
        this.currentLessonId = lessonId;
        
        // Find the lesson
        let lesson = null;
        let levelKey = null;
        
        for (const [level, data] of Object.entries(this.courseData.levels)) {
            if (data.lessons && data.lessons[lessonId]) {
                lesson = data.lessons[lessonId];
                levelKey = level;
                break;
            }
        }
        
        if (!lesson) {
            console.error('Lesson not found:', lessonId);
            return;
        }
        
        this.currentLevel = levelKey;
        
        // Update lesson content
        const content = `
            <div class="lesson-header">
                <div class="lesson-number">${lesson.number}</div>
                <div>
                    <h2 class="lesson-title">${lesson.title}</h2>
                    <p class="lesson-subtitle">${lesson.subtitle}</p>
                </div>
                <div class="level-badge ${levelKey}">${levelKey.toUpperCase()}</div>
            </div>
            
            <div class="lesson-content">
                ${lesson.content}
            </div>
            
            <div style="display: flex; gap: 1rem; margin-top: 2rem; justify-content: center;">
                <button class="btn-primary" onclick="course.startQuiz('${lessonId}')">
                    📝 Start Knowledge Check
                </button>
                ${lesson.animation ? 
                    `<button class="btn-secondary" onclick="course.startAnimation('${lessonId}')">
                        🎮 Interactive Lab
                    </button>` : ''}
            </div>
        `;
        
        this.lessonContainer.innerHTML = content;
        
        // Start animation if specified
        if (lesson.animation) {
            this.startAnimation(lessonId);
        }
        
        // Update navigation
        this.updateNavigation();
        
        // Update progress
        this.updateProgress();
        
        // Mark as current
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.lesson === lessonId) {
                item.classList.add('active');
            }
        });
        
        // Scroll to top
        this.lessonContainer.scrollTop = 0;
        
        // Log activity
        this.logActivity(`Started lesson: ${lesson.title}`);
    }
    
    startQuiz(lessonId) {
        if (!this.courseData || !this.quiz) return;
        
        let lesson = null;
        for (const level of Object.values(this.courseData.levels)) {
            if (level.lessons && level.lessons[lessonId]) {
                lesson = level.lessons[lessonId];
                break;
            }
        }
        
        if (!lesson || !lesson.quiz) {
            console.error('Lesson or quiz not found:', lessonId);
            return;
        }
        
        this.quiz.startQuiz(lesson.quiz);
        this.logActivity(`Started quiz: ${lesson.quiz.title}`);
    }
    
    startAnimation(lessonId) {
        if (!this.courseData || !this.animations) return;
        
        let lesson = null;
        for (const level of Object.values(this.courseData.levels)) {
            if (level.lessons && level.lessons[lessonId]) {
                lesson = level.lessons[lessonId];
                break;
            }
        }
        
        if (!lesson || !lesson.animation) {
            console.error('Lesson or animation not found:', lessonId);
            return;
        }
        
        this.animations.startAnimation(lesson.animation.type, lesson.animation);
        this.logActivity(`Started animation: ${lesson.animation.title}`);
    }
    
    updateNavigation() {
        if (!this.courseNav) return;
        
        const levelOrder = ['beginner', 'intermediate', 'advanced', 'expert', 'phd'];
        
        for (const levelKey of levelOrder) {
            const level = this.courseData.levels[levelKey];
            if (!level || !level.lessons) continue;
            
            for (const [lessonId, lesson] of Object.entries(level.lessons)) {
                const navItem = document.querySelector(`[data-lesson="${lessonId}"]`);
                if (!navItem) continue;
                
                const isUnlocked = lesson.prerequisites.length === 0 || 
                    lesson.prerequisites.every(prereq => this.completedLessons.has(prereq));
                
                if (isUnlocked) {
                    navItem.classList.remove('locked');
                    navItem.style.cursor = 'pointer';
                } else {
                    navItem.classList.add('locked');
                    navItem.style.cursor = 'not-allowed';
                }
            }
        }
        
        this.saveProgress();
    }
    
    updateProgress() {
        if (!this.progressFill || !this.progressText) return;
        
        let totalLessons = 0;
        let completedLessons = 0;
        
        const levelOrder = ['beginner', 'intermediate', 'advanced', 'expert', 'phd'];
        
        for (const levelKey of levelOrder) {
            const level = this.courseData.levels[levelKey];
            if (!level || !level.lessons) continue;
            
            for (const [lessonId, lesson] of Object.entries(level.lessons)) {
                const isUnlocked = lesson.prerequisites.length === 0 || 
                    lesson.prerequisites.every(prereq => this.completedLessons.has(prereq));
                
                if (isUnlocked) {
                    totalLessons++;
                }
                
                if (this.completedLessons.has(lessonId)) {
                    completedLessons++;
                }
            }
        }
        
        const progress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
        this.progressFill.style.width = `${progress}%`;
        
        const currentLevel = this.courseData.levels[this.currentLevel];
        this.progressText.textContent = currentLevel ? 
            `${currentLevel.icon} ${currentLevel.name}` : 'AI Course';
        
        // Update stats
        if (this.completedLessonsEl) {
            this.completedLessonsEl.textContent = completedLessons;
        }
        
        if (this.avgScoreEl) {
            const totalScore = Object.values(this.scores).reduce((sum, score) => sum + score, 0);
            const avgScore = Object.keys(this.scores).length > 0 ? 
                Math.round(totalScore / Object.keys(this.scores).length) : 0;
            this.avgScoreEl.textContent = avgScore;
        }
    }
    
    markLessonComplete(lessonId, score, weakConcepts = []) {
        if (!this.courseData) return;
        
        this.completedLessons.add(lessonId);
        this.scores[lessonId] = score;
        
        // Track weak areas
        weakConcepts.forEach(concept => {
            if (!this.weakAreas.includes(concept)) {
                this.weakAreas.push(concept);
            }
        });
        
        // Calculate confidence
        const confidence = this.calculateConfidence(score, weakConcepts.length);
        this.confidenceLevels[lessonId] = confidence;
        
        // Update UI
        this.updateNavigation();
        this.updateProgress();
        
        // Save progress
        this.saveProgress();
        
        // Log activity
        this.logActivity(`Completed lesson: ${lessonId} with score ${score}%`);
    }
    
    calculateConfidence(score, weakCount) {
        let confidence = score;
        if (weakCount > 2) {
            confidence -= weakCount * 5;
        }
        return Math.max(0, Math.min(100, confidence));
    }
    
    adaptiveLearning(weakConcepts) {
        if (weakConcepts.length === 0) {
            console.log('All concepts mastered!');
            return;
        }
        
        const reinforcementLessons = [];
        const levelOrder = ['beginner', 'intermediate', 'advanced', 'expert', 'phd'];
        
        for (const levelKey of levelOrder) {
            const level = this.courseData.levels[levelKey];
            if (!level || !level.lessons) continue;
            
            for (const [lessonId, lesson] of Object.entries(level.lessons)) {
                if (lesson.concepts) {
                    const matchingConcepts = lesson.concepts.filter(c => weakConcepts.includes(c));
                    if (matchingConcepts.length > 0) {
                        reinforcementLessons.push({
                            lessonId,
                            lesson,
                            matchingConcepts,
                            level: levelKey
                        });
                    }
                }
            }
        }
        
        reinforcementLessons.sort((a, b) => b.matchingConcepts.length - a.matchingConcepts.length);
        
        if (reinforcementLessons.length > 0) {
            this.showReinforcementRecommendation(reinforcementLessons[0], weakConcepts);
        }
    }
    
    showReinforcementRecommendation(lessonData, weakConcepts) {
        const container = document.createElement('div');
        container.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: var(--surface-color);
            padding: 1.5rem;
            border-radius: 8px;
            box-shadow: var(--shadow-lg);
            max-width: 400px;
            z-index: 10000;
            animation: slideUp 0.3s ease;
        `;
        
        container.innerHTML = `
            <h4 style="color: var(--ai-orange); margin-bottom: 1rem;">🎯 Reinforcement Recommended</h4>
            <p style="color: var(--text-secondary); font-size: 0.875rem; line-height: 1.5; margin-bottom: 1rem;">
                Based on your quiz results, we recommend reviewing:
            </p>
            <div style="background: var(--surface-light); padding: 0.75rem; border-radius: 6px; margin-bottom: 1rem;">
                <strong style="color: var(--ai-blue);">${lessonData.lesson.title}</strong>
                <p style="color: var(--text-muted); font-size: 0.75rem; margin: 0.25rem 0 0 0;">
                    Covers: ${lessonData.matchingConcepts.join(', ')}
                </p>
            </div>
            <button class="btn-primary" onclick="course.startReinforcementLesson('${lessonData.lessonId}')" 
                    style="width: 100%; font-size: 0.875rem; padding: 0.5rem;">
                Review Now
            </button>
            <button class="btn-secondary" onclick="this.remove()" 
                    style="width: 100%; font-size: 0.875rem; padding: 0.5rem; margin-top: 0.5rem;">
                Dismiss
            </button>
        `;
        
        document.body.appendChild(container);
        
        setTimeout(() => {
            if (container.parentNode) {
                container.remove();
            }
        }, 10000);
    }
    
    startReinforcementLesson(lessonId) {
        this.showLesson(lessonId);
        document.querySelectorAll('div[style*="position: fixed"]').forEach(el => {
            if (el.textContent.includes('Reinforcement Recommended')) {
                el.remove();
            }
        });
    }
    
    updateTime() {
        this.timeSpent += 1;
        
        if (this.confidenceLevelEl) {
            const totalConfidence = Object.values(this.confidenceLevels).reduce((sum, conf) => sum + conf, 0);
            const avgConfidence = Object.keys(this.confidenceLevels).length > 0 ? 
                Math.round(totalConfidence / Object.keys(this.confidenceLevels).length) : 0;
            this.confidenceLevelEl.textContent = avgConfidence;
        }
    }
    
    logActivity(action) {
        const timestamp = new Date().toISOString();
        this.activityLog.push({ timestamp, action });
        
        if (this.activityLog.length > 100) {
            this.activityLog.shift();
        }
        
        console.log(`[${timestamp}] ${action}`);
    }
    
    restartCourse() {
        this.completedLessons.clear();
        this.scores = {};
        this.weakAreas = [];
        this.timeSpent = 0;
        this.confidenceLevels = {};
        
        this.saveProgress();
        location.reload();
    }
    
    completeCourse() {
        const totalLessons = Object.values(this.courseData.levels)
            .reduce((count, level) => count + Object.keys(level.lessons || {}).length, 0);
        
        const completedLessons = this.completedLessons.size;
        const progress = Math.round((completedLessons / totalLessons) * 100);
        
        const totalScore = Object.values(this.scores).reduce((sum, score) => sum + score, 0);
        const avgScore = Object.keys(this.scores).length > 0 ? 
            Math.round(totalScore / Object.keys(this.scores).length) : 0;
        
        const hoursSpent = Math.floor(this.timeSpent / 3600);
        const minutesSpent = Math.floor((this.timeSpent % 3600) / 60);
        const totalTime = hoursSpent > 0 ? `${hoursSpent}h ${minutesSpent}m` : `${minutesSpent}m`;
        
        // Show completion modal
        const modal = document.getElementById('completionModal');
        const message = document.getElementById('completionMessage');
        const finalScore = document.getElementById('finalScore');
        const timeSpentEl = document.getElementById('timeSpent');
        const topicsMastered = document.getElementById('topicsMastered');
        const weakAreasList = document.getElementById('weakAreas');
        
        if (modal && message && finalScore && timeSpentEl && topicsMastered && weakAreasList) {
            if (progress >= 100) {
                message.innerHTML = `<p style="text-align: center; color: var(--text-secondary);">
                    Congratulations! You've completed the entire AI & ML course from 101 to PhD level!<br>
                    You now have a comprehensive understanding of AI, ML, and Generative AI principles and applications.
                </p>`;
            } else if (progress >= 50) {
                message.innerHTML = `<p style="text-align: center; color: var(--text-secondary);">
                    Great progress! You've completed ${progress}% of the course.<br>
                    Keep going to achieve full mastery of AI and ML!
                </p>`;
            } else {
                message.innerHTML = `<p style="text-align: center; color: var(--text-secondary);">
                    You've started your AI and ML journey!<br>
                    With ${progress}% completion, you're building a solid foundation.
                </p>`;
            }
            
            finalScore.textContent = avgScore;
            timeSpentEl.textContent = totalTime;
            topicsMastered.textContent = Object.keys(this.confidenceLevels).length;
            
            weakAreasList.innerHTML = '';
            if (this.weakAreas.length > 0) {
                this.weakAreas.forEach(weak => {
                    const li = document.createElement('li');
                    li.textContent = weak;
                    weakAreasList.appendChild(li);
                });
            } else {
                weakAreasList.innerHTML = '<li style="color: var(--ai-green);">None! All concepts mastered!</li>';
            }
            
            modal.classList.add('show');
        }
    }
}

// Initialize course
window.course = new AICourse();

// Make available globally
if (typeof module !== 'undefined' && module.exports) {
    module.exports = window.course;
}

// Fix for canvas rounded rect
if (CanvasRenderingContext2D.prototype.roundRect === undefined) {
    CanvasRenderingContext2D.prototype.roundRect = function(x, y, width, height, radius) {
        this.beginPath();
        this.moveTo(x + radius, y);
        this.lineTo(x + width - radius, y);
        this.quadraticCurveTo(x + width, y, x + width, y + radius);
        this.lineTo(x + width, y + height - radius);
        this.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        this.lineTo(x + radius, y + height);
        this.quadraticCurveTo(x, y + height, x, y + height - radius);
        this.lineTo(x, y + radius);
        this.quadraticCurveTo(x, y, x + radius, y);
        this.closePath();
    };
}
