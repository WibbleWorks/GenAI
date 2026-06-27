// Generative AI & Machine Learning Course Data - From 101 to PhD
// ============================================================

const COURSE_DATA = {
    meta: {
        title: "Generative AI & Machine Learning Mastery",
        description: "Complete AI/ML course from fundamentals to PhD-level knowledge",
        version: "1.0.0",
        totalLessons: 0,
        levels: ["beginner", "intermediate", "advanced", "expert", "phd"]
    },
    
    levels: {
        // LEVEL 1: AI & ML 101 (Basics)
        beginner: {
            name: "AI & ML 101",
            description: "Foundational concepts of artificial intelligence and machine learning",
            color: "#10b981",
            icon: "🎓",
            lessons: {
                ai_introduction: {
                    id: "ai_introduction",
                    title: "Introduction to AI",
                    subtitle: "Fundamentals of Artificial Intelligence",
                    level: "beginner",
                    number: 1,
                    estimatedTime: 30,
                    difficulty: 1,
                    prerequisites: [],
                    
                    content: `
                        <div class="lesson-section">
                            <h3>🤖 What is Artificial Intelligence?</h3>
                            <p><strong>Definition:</strong> AI is the simulation of human intelligence processes by machines, especially computer systems.</p>
                            <p><strong>Key Characteristics:</strong> Learning, reasoning, perception, action, adaptation.</p>
                        </div>
                        
                        <div class="lesson-section">
                            <h3>📜 Brief History of AI</h3>
                            <p>1950-1956: Birth (Turing Test, Dartmouth Conference)</p>
                            <p>1987-2010: Machine Learning era (SVM, Neural Networks)</p>
                            <p>2010-2016: Deep Learning breakthrough (AlexNet, GPUs)</p>
                            <p>2016-Present: AI Renaissance (Transformers, LLMs, Generative AI)</p>
                        </div>
                        
                        <div class="lesson-section">
                            <h3>🎯 Types of AI</h3>
                            <p><strong>By Capability:</strong> Narrow AI (current) → General AI (future) → Super AI (theoretical)</p>
                            <p><strong>By Functionality:</strong> Reactive → Limited Memory → Theory of Mind → Self-Aware</p>
                        </div>
                        
                        <div class="lesson-section">
                            <h3>💡 AI vs ML vs Deep Learning</h3>
                            <p><strong>Relationship:</strong> Deep Learning ⊂ Machine Learning ⊂ Artificial Intelligence</p>
                            <ul>
                                <li><strong>AI:</strong> Any system performing intelligent tasks</li>
                                <li><strong>ML:</strong> Systems that learn from data</li>
                                <li><strong>DL:</strong> Neural networks with many layers</li>
                            </ul>
                        </div>
                        
                        <div class="lesson-section">
                            <h3>🚀 Why AI Matters Now</h3>
                            <p><strong>Convergence:</strong> Data explosion + GPU/TPU acceleration + Algorithm breakthroughs</p>
                            <p><strong>Impact Areas:</strong> Productivity, Healthcare, Finance, Education, Entertainment, Science</p>
                        </div>
                    `,
                    
                    concepts: ["AI Definition", "AI History", "Types of AI", "ML vs DL"],
                    
                    quiz: {
                        id: "ai_intro_quiz",
                        title: "AI Introduction Quiz",
                        passingScore: 80,
                        timeLimit: 300,
                        questions: [
                            {
                                id: "q1", type: "multiple-choice",
                                question: "What is the key characteristic of AI?",
                                options: [
                                    { text: "Learn from data and improve over time", isCorrect: true },
                                    { text: "Only uses Python", isCorrect: false },
                                    { text: "Always more accurate than humans", isCorrect: false },
                                    { text: "Requires special hardware", isCorrect: false }
                                ],
                                explanation: "AI systems can learn from data and improve their performance over time without explicit programming.",
                                difficulty: 1, concept: "AI Definition"
                            },
                            {
                                id: "q2", type: "multiple-choice",
                                question: "What relationship exists between AI, ML, and DL?",
                                options: [
                                    { text: "DL ⊂ ML ⊂ AI", isCorrect: true },
                                    { text: "They are separate fields", isCorrect: false },
                                    { text: "AI ⊂ ML ⊂ DL", isCorrect: false },
                                    { text: "ML and DL are the same", isCorrect: false }
                                ],
                                explanation: "Deep Learning is a subset of Machine Learning, which is a subset of Artificial Intelligence.",
                                difficulty: 2, concept: "ML vs DL"
                            }
                        ]
                    },
                    animation: {
                        type: "ai-timeline",
                        title: "AI History Timeline",
                        description: "Explore AI evolution from 1950 to present",
                        controls: ["play", "pause", "jumpToEra"]
                    }
                },
                
                ml_introduction: {
                    id: "ml_introduction",
                    title: "Introduction to ML",
                    subtitle: "How Machines Learn from Data",
                    level: "beginner",
                    number: 2,
                    estimatedTime: 35,
                    difficulty: 2,
                    prerequisites: ["ai_introduction"],
                    
                    content: `
                        <div class="lesson-section">
                            <h3>🎯 What is Machine Learning?</h3>
                            <p><strong>Definition:</strong> ML gives systems the ability to automatically learn and improve from experience without being explicitly programmed.</p>
                            <p><strong>Tom Mitchell:</strong> "A program learns from experience E with respect to tasks T and performance P, if its performance at T improves with E."</p>
                        </div>
                        
                        <div class="lesson-section">
                            <h3>🔄 ML Workflow</h3>
                            <ol>
                                <li>Problem Definition</li>
                                <li>Data Collection</li>
                                <li>Data Preprocessing</li>
                                <li>Model Selection</li>
                                <li>Training</li>
                                <li>Evaluation</li>
                                <li>Deployment</li>
                                <li>Monitoring</li>
                            </ol>
                        </div>
                        
                        <div class="lesson-section">
                            <h3>📊 Types of ML</h3>
                            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem;">
                                <div style="padding: 1rem; background: var(--surface-light); border-radius: 8px;">
                                    <h4>🎯 Supervised</h4>
                                    <p>Labeled data (X, y)</p>
                                    <p>Classification, Regression</p>
                                </div>
                                <div style="padding: 1rem; background: var(--surface-light); border-radius: 8px;">
                                    <h4>🔍 Unsupervised</h4>
                                    <p>Unlabeled data (X)</p>
                                    <p>Clustering, Dimensionality Reduction</p>
                                </div>
                                <div style="padding: 1rem; background: var(--surface-light); border-radius: 8px;">
                                    <h4>🤖 Reinforcement</h4>
                                    <p>Learn from rewards</p>
                                    <p>Q-Learning, DQN</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="lesson-section">
                            <h3>📈 Train/Validation/Test Split</h3>
                            <p><strong>Typical Split:</strong> 60-80% train, 10-20% validation, 10-20% test</p>
                            <p><strong>Never:</strong> Evaluate on training data!</p>
                        </div>
                        
                        <div class="lesson-section">
                            <h3>⚠️ Common Pitfalls</h3>
                            <ul>
                                <li><strong>Overfitting:</strong> High train accuracy, low test accuracy</li>
                                <li><strong>Underfitting:</strong> Low accuracy on both</li>
                                <li><strong>Data Leakage:</strong> Test info leaks into training</li>
                            </ul>
                        </div>
                    `,
                    
                    concepts: ["ML Definition", "ML Workflow", "Supervised Learning", "Unsupervised Learning", "Reinforcement Learning", "Train/Test Split"],
                    
                    quiz: {
                        id: "ml_intro_quiz",
                        title: "ML Introduction Quiz",
                        passingScore: 80,
                        timeLimit: 360,
                        questions: [
                            {
                                id: "q1", type: "multiple-choice",
                                question: "What are the three main ML types?",
                                options: [
                                    { text: "Supervised, Unsupervised, Reinforcement", isCorrect: true },
                                    { text: "Classification, Regression, Clustering", isCorrect: false },
                                    { text: "Neural, Statistical, Genetic", isCorrect: false },
                                    { text: "Linear, Non-linear, Deep", isCorrect: false }
                                ],
                                explanation: "The three main types are Supervised, Unsupervised, and Reinforcement Learning.",
                                difficulty: 1, concept: "Types of ML"
                            },
                            {
                                id: "q2", type: "multiple-choice",
                                question: "Which split is used for final evaluation?",
                                options: [
                                    { text: "Training set", isCorrect: false },
                                    { text: "Validation set", isCorrect: false },
                                    { text: "Test set", isCorrect: true },
                                    { text: "All of the above", isCorrect: false }
                                ],
                                explanation: "The test set is used for final evaluation and should never be used in training or hyperparameter tuning.",
                                difficulty: 2, concept: "Train/Test Split"
                            }
                        ]
                    },
                    animation: {
                        type: "ml-workflow",
                        title: "ML Workflow Simulator",
                        description: "Visualize the complete ML workflow",
                        controls: ["nextStep", "previousStep"]
                    }
                },
                
                neural_networks_intro: {
                    id: "neural_networks_intro",
                    title: "Neural Networks Intro",
                    subtitle: "Building Blocks of Deep Learning",
                    level: "beginner",
                    number: 3,
                    estimatedTime: 40,
                    difficulty: 2,
                    prerequisites: ["ml_introduction"],
                    
                    content: `
                        <div class="lesson-section">
                            <h3>🧠 Biological Inspiration</h3>
                            <p><strong>Note:</strong> ANNs are inspired by but not identical to biological neurons.</p>
                            <p><strong>Differences:</strong> ANNs: 100-1000 neurons, Brain: 86 billion neurons</p>
                        </div>
                        
                        <div class="lesson-section">
                            <h3>🔧 Perceptrons</h3>
                            <p><strong>Formula:</strong> Output = f(Σ(wᵢ·xᵢ) + b)</p>
                            <p><strong>Components:</strong> Inputs, Weights, Weighted Sum, Activation Function, Output</p>
                        </div>
                        
                        <div class="lesson-section">
                            <h3>📈 Activation Functions</h3>
                            <table>
                                <thead><tr><th>Function</th><th>Formula</th><th>Use</th></tr></thead>
                                <tbody>
                                    <tr><td>ReLU</td><td>max(0, x)</td><td>Hidden layers</td></tr>
                                    <tr><td>Sigmoid</td><td>1/(1+e^-x)</td><td>Binary output</td></tr>
                                    <tr><td>Softmax</td><td>e^xᵢ/Σe^xʲ</td><td>Multi-class output</td></tr>
                                    <tr><td>Linear</td><td>x</td><td>Regression output</td></tr>
                                </tbody>
                            </table>
                            <p><strong>Why Non-Linearity?</strong> Without it, deep networks = single-layer networks!</p>
                        </div>
                        
                        <div class="lesson-section">
                            <h3>🏗️ Network Architecture</h3>
                            <p><strong>Input Layer:</strong> Receives data</p>
                            <p><strong>Hidden Layers:</strong> Learn feature representations</p>
                            <p><strong>Output Layer:</strong> Produces predictions</p>
                            <p><strong>Standard Flow:</strong> Input → Hidden → Hidden → ... → Output</p>
                        </div>
                        
                        <div class="lesson-section">
                            <h3>🔄 Forward & Backward Propagation</h3>
                            <p><strong>Forward:</strong> Calculate output from input</p>
                            <p><strong>Backward (Backprop):</strong> Update weights based on error</p>
                            <p><strong>Learning Rate:</strong> Controls weight update size</p>
                        </div>
                        
                        <div class="lesson-section">
                            <h3>💪 Why Deep Learning?</h3>
                            <ul>
                                <li><strong>Automatic Feature Learning:</strong> No manual feature engineering</li>
                                <li><strong>Hierarchical Representations:</strong> Low-level → high-level features</li>
                                <li><strong>Scalability:</strong> Improves with more data and compute</li>
                                <li><strong>Versatility:</strong> Works for images, text, audio, etc.</li>
                            </ul>
                        </div>
                    `,
                    
                    concepts: ["Perceptrons", "Activation Functions", "Network Architecture", "Forward Propagation", "Backpropagation"],
                    
                    quiz: {
                        id: "nn_intro_quiz",
                        title: "Neural Networks Quiz",
                        passingScore: 80,
                        timeLimit: 420,
                        questions: [
                            {
                                id: "q1", type: "multiple-choice",
                                question: "What is the primary purpose of an activation function?",
                                options: [
                                    { text: "Introduce non-linearity", isCorrect: true },
                                    { text: "Make the network faster", isCorrect: false },
                                    { text: "Store the weights", isCorrect: false },
                                    { text: "Connect neurons", isCorrect: false }
                                ],
                                explanation: "Activation functions introduce non-linearity, allowing deep networks to learn complex patterns.",
                                difficulty: 2, concept: "Activation Functions"
                            },
                            {
                                id: "q2", type: "multiple-choice",
                                question: "Which activation function is most commonly used in hidden layers?",
                                options: [
                                    { text: "ReLU", isCorrect: true },
                                    { text: "Sigmoid", isCorrect: false },
                                    { text: "Tanh", isCorrect: false },
                                    { text: "Linear", isCorrect: false }
                                ],
                                explanation: "ReLU is the most commonly used activation function in modern deep networks.",
                                difficulty: 1, concept: "Activation Functions"
                            }
                        ]
                    },
                    animation: {
                        type: "nn-visualizer",
                        title: "Neural Network Visualizer",
                        description: "Build and visualize neural networks",
                        controls: ["addLayer", "changeActivation", "train"]
                    }
                }
            }
        },
        
        // LEVEL 2: CORE ML
        intermediate: {
            name: "Core Machine Learning",
            description: "Supervised and unsupervised learning algorithms",
            color: "#3b82f6",
            icon: "🔧",
            lessons: {}
        },
        
        // LEVEL 3: DEEP LEARNING
        advanced: {
            name: "Deep Learning & Neural Networks",
            description: "Deep neural networks and advanced architectures",
            color: "#8b5cf6",
            icon: "🔬",
            lessons: {}
        },
        
        // LEVEL 4: GENERATIVE AI
        expert: {
            name: "Generative AI & LLMs",
            description: "Transformers, language models, and generative AI",
            color: "#f97316",
            icon: "🚀",
            lessons: {}
        },
        
        // LEVEL 5: AI FRONTIERS
        phd: {
            name: "AI Research Frontiers",
            description: "Agents, multi-agent systems, and research topics",
            color: "#ef4444",
            icon: "🎓",
            lessons: {}
        }
    }
};

// Calculate total lessons
COURSE_DATA.meta.totalLessons = 0;
for (const levelKey in COURSE_DATA.levels) {
    const level = COURSE_DATA.levels[levelKey];
    if (level.lessons) {
        COURSE_DATA.meta.totalLessons += Object.keys(level.lessons).length;
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = COURSE_DATA;
}
