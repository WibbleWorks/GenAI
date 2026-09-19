// Generative AI & Machine Learning Course Data - From 101 to PhD
// ============================================================

const COURSE_DATA = {
    meta: {
        title: "Generative AI & Machine Learning Course",
        description: "AI/ML course from foundations to applied LLM systems and research topics",
        version: "2.3.0",
        totalLessons: 0,
        levels: ["beginner", "intermediate", "advanced", "expert", "research"]
    },
    
    levels: {
        // LEVEL 1: AI & ML Foundations (Beginner)
        beginner: {
            name: "AI & ML Foundations",
            description: "Foundational concepts of artificial intelligence and machine learning, including responsible AI",
            color: "#10b981",
            icon: "🎓",
            lessons: {
                ai_introduction: {
                    id: "ai_introduction",
                    title: "Introduction to AI",
                    subtitle: "Fundamentals of Artificial Intelligence",
                    level: "beginner",
                    number: 1,
                    tracks: { builder: "required", researcher: "required", leader: "required" },
                    estimatedTime: 45,
                    difficulty: 1,
                    prerequisites: [],
                    
                    content: "" /* P5 pilot: body served from lessons/beginner/ai_introduction.json via loader.js (JSON wins). Inline fallback removed; browser smoke asserts non-empty. */,
                    
                    concepts: ["AI Definition", "AI History", "Types of AI", "AI vs ML", "ML vs DL"],

                    quiz: {
                        id: "ai_intro_quiz",
                        title: "AI Introduction Quiz",
                        passingScore: 60,
                        timeLimit: 360,
                        questions: [
                            {
                                id: "q1", type: "multiple-choice",
                                question: "Which statement best describes Artificial Intelligence?",
                                options: [
                                    { text: "Systems that perform tasks normally requiring human intelligence", isCorrect: true },
                                    { text: "Systems that always learn from data", isCorrect: false },
                                    { text: "Any program written in Python", isCorrect: false },
                                    { text: "Systems that are always more accurate than humans", isCorrect: false }
                                ],
                                explanation: "AI is the broad field of building systems that perform tasks requiring human intelligence. Learning from data is specific to ML (a subset of AI) - symbolic AI and expert systems are AI but do not learn from data.",
                                difficulty: 1, concept: "AI Definition"
                            },
                            {
                                id: "q2", type: "multiple-choice",
                                question: "A rule-based expert system for medical diagnosis is an example of:",
                                options: [
                                    { text: "AI but not ML", isCorrect: true },
                                    { text: "ML but not AI", isCorrect: false },
                                    { text: "Both AI and ML", isCorrect: false },
                                    { text: "Neither AI nor ML", isCorrect: false }
                                ],
                                explanation: "Expert systems use hand-written rules and logic - they are AI but do not learn from data, so they are not Machine Learning. ML is a subset of AI that learns from data.",
                                difficulty: 2, concept: "AI vs ML"
                            },
                            {
                                id: "q3", type: "multiple-choice",
                                question: "What is the relationship between AI, ML, and DL?",
                                options: [
                                    { text: "DL ⊂ ML ⊂ AI", isCorrect: true },
                                    { text: "They are separate fields", isCorrect: false },
                                    { text: "AI ⊂ ML ⊂ DL", isCorrect: false },
                                    { text: "ML and DL are the same", isCorrect: false }
                                ],
                                explanation: "Deep Learning is a subset of Machine Learning, which is a subset of Artificial Intelligence.",
                                difficulty: 2, concept: "ML vs DL"
                            },
                            {
                                id: "q4", type: "multiple-choice",
                                question: "Which historical period is known as the 'AI Winter'?",
                                options: [
                                    { text: "1974-1980 (and again 1987-1993) - funding cuts as early methods hit limits", isCorrect: true },
                                    { text: "1950-1956 - the Dartmouth Conference", isCorrect: false },
                                    { text: "2010-2016 - the deep-learning breakthrough", isCorrect: false },
                                    { text: "2023-present - the agentic-AI era", isCorrect: false }
                                ],
                                explanation: "AI Winters (1974-80, 1987-93) followed periods of overhyped expectations; funding collapsed. They're a reminder to be skeptical of hype cycles.",
                                difficulty: 1, concept: "AI History"
                            },
                            {
                                id: "q5", type: "multiple-choice",
                                question: "Every AI system that exists today falls into which capability category?",
                                options: [
                                    { text: "Narrow AI - specialized for a task or family of tasks; AGI remains a research goal", isCorrect: true },
                                    { text: "General AI - today's models can do any task a human can", isCorrect: false },
                                    { text: "Super AI - today's models exceed humans on every task", isCorrect: false },
                                    { text: "Reactive AI only - no learning whatsoever", isCorrect: false }
                                ],
                                explanation: "All current AI is Narrow AI (ANI). AGI (general intelligence across domains) and ASI (superintelligence) are hypothetical; no current system qualifies.",
                                difficulty: 1, concept: "Types of AI"
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
                    tracks: { builder: "required", researcher: "required", leader: "required" },
                    estimatedTime: 45,
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
                        passingScore: 60,
                        timeLimit: 420,
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
                            },
                            {
                                id: "q3", type: "multiple-choice",
                                question: "Your model is 99% accurate on training data and 60% on test data. What is this called?",
                                options: [
                                    { text: "Overfitting - the model memorized the training data and doesn't generalize", isCorrect: true },
                                    { text: "Underfitting - the model is too simple", isCorrect: false },
                                    { text: "Data leakage - test info leaked into training", isCorrect: false },
                                    { text: "Nothing - 99% training accuracy is fine", isCorrect: false }
                                ],
                                explanation: "A large gap between training and test accuracy is overfitting. The model fits training-specific noise rather than general patterns.",
                                difficulty: 2, concept: "Overfitting"
                            },
                            {
                                id: "q4", type: "multiple-choice",
                                question: "Your test configuration accidentally preprocessed the test set using statistics computed on it. Why is this bad?",
                                options: [
                                    { text: "It's data leakage - test info leaks into training; the model may overestimate its real performance", isCorrect: true },
                                    { text: "It speeds up training", isCorrect: false },
                                    { text: "It's fine because the test set is large enough", isCorrect: false },
                                    { text: "It only matters for unsupervised learning", isCorrect: false }
                                ],
                                explanation: "Data leakage lets test-set information influence training decisions, inflating reported accuracy and giving false confidence.",
                                difficulty: 2, concept: "Data Leakage"
                            },
                            {
                                id: "q5", type: "multiple-choice",
                                question: "Which is the most common first step when a trained model performs poorly on the test set?",
                                options: [
                                    { text: "Diagnose over vs underfitting first; the fix depends on which one it is", isCorrect: true },
                                    { text: "Always collect more data", isCorrect: false },
                                    { text: "Always add more layers", isCorrect: false },
                                    { text: "Always lower the learning rate", isCorrect: false }
                                ],
                                explanation: "Diagnosis first: overfit -> regularize / early stop / more data; underfit -> bigger model / fewer regularizers / more features. Different problems, different fixes.",
                                difficulty: 3, concept: "ML Workflow"
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
                    tracks: { builder: "required", researcher: "required", leader: "optional" },
                    estimatedTime: 75,
                    difficulty: 2,
                    prerequisites: ["ml_introduction"],
                    
                    content: `
                        <div class="lesson-section">
                            <h3>🧠 Biological Inspiration</h3>
                            <p><strong>Note:</strong> ANNs are <em>loosely inspired by</em> but not modeled on biological neurons. The brain has ~86 billion neurons with complex chemistry; ANNs use much simpler mathematical units and are a useful computational tool, not a brain model.</p>
                            <p><strong>Scale varies widely:</strong> Small demos have a few hundred parameters; modern LLMs have billions. Parameter count is not directly comparable to neuron count.</p>
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
                            <h3>⚙️ Optimizers: from SGD to AdamW</h3>
                            <p>Backprop computes the gradient. The <strong>optimizer</strong> decides how the weights actually move.</p>
                            <ul>
                                <li><strong>SGD:</strong> <code>w -= lr * grad</code>. The simplest. Slow to navigate ravines and saddle points; oscillates in narrow directions.</li>
                                <li><strong>Momentum:</strong> keep a running average of past gradients and use it as a "velocity". Smooths out oscillations and speeds up consistent directions. <code>v = beta * v + grad; w -= lr * v</code>.</li>
                                <li><strong>AdaGrad / RMSProp:</strong> scale the per-parameter learning rate by a running estimate of the gradient's magnitude. Big steps on rarely-updating params, small steps on fast-changing ones.</li>
                                <li><strong>Adam:</strong> momentum + per-parameter adaptive scaling. The default first-choice optimizer for most modern deep learning. <code>beta1=0.9, beta2=0.999, lr=1e-3</code> is a good starting point.</li>
                                <li><strong>AdamW:</strong> Adam with <em>decoupled weight decay</em> (not the same as L2 reg via Adam!). Default for transformer fine-tuning; better generalization than Adam in practice.</li>
                            </ul>
                            <p><strong>Rule of thumb:</strong> Adam (or AdamW) at lr=1e-3 first. If training is unstable or noisy, dial lr down to 3e-4 or 5e-4. For LLM fine-tuning use 1e-5 to 2e-4 (much lower, see Lesson 14 Fine-tuning &amp; PEFT).</p>
                        </div>

                        <div class="lesson-section">
                            <h3>🛡️ Regularization: Fighting Overfitting</h3>
                            <p>Without regularization, a deep network can memorize the training set. Five common defenses:</p>
                            <ul>
                                <li><strong>Dropout:</strong> randomly zero a fraction of activations during training (typical 0.1-0.5). Forces redundancy; the network can't rely on any single neuron. Disabled at inference.</li>
                                <li><strong>L1 / L2 weight decay:</strong> add a penalty on the size of the weights to the loss. <strong>L1</strong> pushes small weights to zero (sparsity, feature selection). <strong>L2</strong> (weight decay) shrinks all weights gently. AdamW implements L2-style decay correctly.</li>
                                <li><strong>Batch normalization:</strong> normalize each layer's activations to mean 0 / var 1, then learn scale and shift. Stabilizes and speeds training; reduces sensitivity to LR.</li>
                                <li><strong>LayerNorm:</strong> the transformer-friendly variant - normalize per sample across features (not across the batch). Used everywhere inside modern transformers.</li>
                                <li><strong>Early stopping:</strong> monitor a validation metric; stop (and revert to best) when it stops improving for N epochs. The cheapest, most universal regularizer.</li>
                            </ul>
                            <p><strong>Diagnostic:</strong> if train loss keeps dropping but val loss turns upward, you're overfitting - add dropout, weight decay, or early stopping. If both losses plateau high, you're underfitting - reduce regularization, train longer, or use a bigger model.</p>
                        </div>

                        <div class="lesson-section">
                            <h3>🧪 Spot-the-Overfit Checklist</h3>
                            <ul>
                                <li>Train acc much higher than val acc (gap > 10 points)</li>
                                <li>Train loss still decreasing but val loss starts increasing</li>
                                <li>Model performs very differently on different random seeds - high variance</li>
                                <li>Performance drops sharply when you remove a few training examples - the model memorized them</li>
                            </ul>
                            <p>One or more of these? Reaction: dropout, weight decay, early stopping, more data (or augmentation).</p>
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

                    concepts: ["Perceptrons", "Activation Functions", "Network Architecture", "Forward Propagation", "Backpropagation", "Optimizers (SGD/Momentum/Adam/AdamW)", "Regularization (dropout/L1/L2/batch norm/early stopping)", "Overfitting diagnosis"],
                    
                    quiz: {
                        id: "nn_intro_quiz",
                        title: "Neural Networks Quiz",
                        passingScore: 60,
                        timeLimit: 480,
                        questions: [
                            {
                                id: "q1", type: "multiple-choice",
                                question: "What is the primary purpose of an activation function?",
                                options: [
                                    { text: "Introduce non-linearity (without it, deep networks collapse to a single linear layer)", isCorrect: true },
                                    { text: "Make the network faster", isCorrect: false },
                                    { text: "Store the weights", isCorrect: false },
                                    { text: "Connect neurons", isCorrect: false }
                                ],
                                explanation: "Activation functions introduce non-linearity. Without them, stacking layers is mathematically equivalent to a single linear layer, so depth adds nothing.",
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
                                explanation: "ReLU is the default for hidden layers - cheap to compute, doesn't saturate for positive inputs, and trains well.",
                                difficulty: 1, concept: "Activation Functions"
                            },
                            {
                                id: "q3", type: "multiple-choice",
                                question: "What does the backpropagation algorithm do?",
                                options: [
                                    { text: "Computes gradients of the loss w.r.t. every weight using the chain rule", isCorrect: true },
                                    { text: "Reshuffles the training data", isCorrect: false },
                                    { text: "Initializes the weights randomly", isCorrect: false },
                                    { text: "Decides the activation functions", isCorrect: false }
                                ],
                                explanation: "Backprop applies the chain rule layer-by-layer from the loss backward, giving gradients used by the optimizer to update weights.",
                                difficulty: 2, concept: "Backpropagation"
                            },
                            {
                                id: "q4", type: "multiple-choice",
                                question: "If you remove all non-linearities from a 100-layer network, what is it equivalent to?",
                                options: [
                                    { text: "A single linear layer (composition of linear maps is linear)", isCorrect: true },
                                    { text: "A 100-layer non-linear network", isCorrect: false },
                                    { text: "A random function", isCorrect: false },
                                    { text: "Nothing changes - depth still matters", isCorrect: false }
                                ],
                                explanation: "Without nonlinear activations, the composition of matrices is just another matrix, so depth provides no extra expressiveness. This is why non-linearity is essential.",
                                difficulty: 3, concept: "Activation Functions"
                            },
                            {
                                id: "q5", type: "multiple-choice",
                                question: "Softmax converts logits z into probabilities. What range are its outputs in and what do they sum to?",
                                options: [
                                    { text: "Each output in (0,1); they sum to 1", isCorrect: true },
                                    { text: "Each output in [-1, 1]; they sum to 0", isCorrect: false },
                                    { text: "Each output in [0, infinity); they sum to 1", isCorrect: false },
                                    { text: "Each output is unbounded; they sum to whatever", isCorrect: false }
                                ],
                                explanation: "Softmax exponentiates and normalizes; outputs are valid probabilities in (0,1) summing to 1. This makes it the standard output for classification.",
                                difficulty: 2, concept: "Activation Functions"
                            }
                        ]
                    },
                    animation: {
                        type: "gradient-descent",
                        title: "Gradient Descent Playground",
                        description: "Drive gradient descent on a loss landscape; adjust LR / momentum / optimizer.",
                        controls: ["gdLrSlider", "gdMomentumSlider", "gdOptimizerSelector", "stepGd", "autoGd", "resetGd"]
                    }
                },

                ai_ethics: {
                    id: "ai_ethics",
                    title: "Responsible AI & Ethics",
                    subtitle: "Bias, Fairness, Safety, and Accountability",
                    level: "beginner",
                    number: 4,
                    tracks: { builder: "required", researcher: "required", leader: "required" },
                    estimatedTime: 60,
                    difficulty: 2,
                    prerequisites: ["ai_introduction", "ml_introduction"],

                    content: `
                        <div class="lesson-section">
                            <h3>⚖️ Why Responsible AI Matters</h3>
                            <p>AI systems are deployed in high-stakes domains - hiring, lending, healthcare, criminal justice, education. Errors and biases at scale cause real harm. Building capable AI without building responsible AI is a reputational, legal, and ethical liability.</p>
                            <p><strong>This is not optional.</strong> Regulations like the EU AI Act, NIST AI Risk Management Framework, and sector-specific laws increasingly require documented, auditable AI practices.</p>
                        </div>

                        <div class="lesson-section">
                            <h3>🎯 Bias and Fairness</h3>
                            <p><strong>Where bias enters:</strong> Training data (historical bias, sampling bias), label bias, model bias, deployment bias.</p>
                            <p><strong>Fairness definitions</strong> (no single "fair" - they conflict):</p>
                            <ul>
                                <li><strong>Demographic parity:</strong> Outcomes independent of protected attribute</li>
                                <li><strong>Equal opportunity:</strong> Equal true-positive rates across groups</li>
                                <li><strong>Equalized odds:</strong> Equal true-positive and false-positive rates</li>
                            </ul>
                            <p><strong>Mitigation:</strong> Audit datasets for representation; reweight samples; use fairness constraints; test on slices, not just averages.</p>
                        </div>

                        <div class="lesson-section">
                            <h3>🛡️ Safety and Alignment</h3>
                            <p><strong>Alignment</strong> = ensuring model behavior matches human intent and values.</p>
                            <ul>
                                <li><strong>Hallucinations:</strong> LLMs confidently produce false statements. Verify outputs; never trust without checking.</li>
                                <li><strong>Prompt injection:</strong> Untrusted text can override instructions. Treat all external input as untrusted.</li>
                                <li><strong>Jailbreaks:</strong> Attempts to bypass safety training. Layered defenses, never a single control.</li>
                                <li><strong>Goal misgeneralization:</strong> Models pursue proxy goals that look right in training but wrong in deployment.</li>
                            </ul>
                        </div>

                        <div class="lesson-section">
                            <h3>📊 Evaluation Beyond Accuracy</h3>
                            <p>Accuracy alone is misleading. Evaluate on:</p>
                            <ul>
                                <li><strong>Slice performance:</strong> Per-group metrics, not just averages</li>
                                <li><strong>Robustness:</strong> Distribution shift, adversarial inputs</li>
                                <li><strong>Calibration:</strong> Are confidence scores trustworthy?</li>
                                <li><strong>Human eval:</strong> For LLMs, use human raters and rubrics</li>
                                <li><strong>Toxicity / harm:</strong> Automated + manual review</li>
                            </ul>
                        </div>

                        <div class="lesson-section">
                            <h3>🔐 Privacy and Data</h3>
                            <ul>
                                <li><strong>PII:</strong> Don't train on personal data without a lawful basis.</li>
                                <li><strong>Memorization:</strong> LLMs can regurgitate training data. Use differential privacy or scrub-and-audit.</li>
                                <li><strong>Data provenance:</strong> Document where data came from and what consent was given.</li>
                            </ul>
                        </div>

                        <div class="lesson-section">
                            <h3>📋 Accountability and Transparency</h3>
                            <ul>
                                <li><strong>Model cards:</strong> Document intended use, performance, limitations.</li>
                                <li><strong>Datasheets:</strong> Document dataset collection, composition, uses.</li>
                                <li><strong>Human-in-the-loop:</strong> For high-stakes decisions, keep a human accountable.</li>
                                <li><strong>Right to explanation:</strong> Provide reasons for automated decisions where required.</li>
                            </ul>
                        </div>

                        <div class="lesson-section">
                            <h3>✅ Practical Checklist</h3>
                            <ul>
                                <li>Define intended use and out-of-scope uses explicitly</li>
                                <li>Audit training data for representation and consent</li>
                                <li>Measure performance on slices, not just the aggregate</li>
                                <li>Test for hallucination, prompt injection, and jailbreaks before launch</li>
                                <li>Publish a model card; maintain an incident response plan</li>
                                <li>Monitor in production; have a kill switch</li>
                            </ul>
                        </div>
                    `,

                    concepts: ["AI Ethics", "Bias", "Fairness", "Safety", "Alignment", "Hallucinations", "Privacy", "Accountability"],

                    quiz: {
                        id: "ai_ethics_quiz",
                        title: "Responsible AI Quiz",
                        passingScore: 60,
                        timeLimit: 540,
                        questions: [
                            {
                                id: "q1", type: "multiple-choice",
                                question: "A model has 95% overall accuracy but 60% accuracy for one demographic group. What is the right conclusion?",
                                options: [
                                    { text: "The model is biased and needs investigation - aggregate accuracy hides slice-level failures", isCorrect: true },
                                    { text: "95% is high enough to deploy", isCorrect: false },
                                    { text: "Bias only matters if the model is intentional", isCorrect: false },
                                    { text: "Add more data of any kind and the problem will resolve", isCorrect: false }
                                ],
                                explanation: "Aggregate metrics can mask serious per-group failures. Always evaluate on slices; high overall accuracy is not a substitute for fairness analysis.",
                                difficulty: 2, concept: "Bias"
                            },
                            {
                                id: "q2", type: "multiple-choice",
                                question: "An LLM confidently states a fake citation. What is this called and what should you do?",
                                options: [
                                    { text: "Hallucination - verify outputs before relying on them", isCorrect: true },
                                    { text: "A bug - report it and the model will be retrained", isCorrect: false },
                                    { text: "Prompt injection - ignore it", isCorrect: false },
                                    { text: "Overfitting - reduce the learning rate", isCorrect: false }
                                ],
                                explanation: "LLMs can hallucinate plausible but false content. Always verify factual claims, especially citations and numbers, before using them.",
                                difficulty: 1, concept: "Hallucinations"
                            },
                            {
                                id: "q3", type: "multiple-choice",
                                question: "A retrieved document tries to override your system instructions, instructing the model to ignore prior rules. What is this and how do you defend?",
                                options: [
                                    { text: "Prompt injection; treat retrieved content as untrusted input, keep system instructions privileged, and validate outputs against a schema", isCorrect: true },
                                    { text: "A hallucination; lower the temperature", isCorrect: false },
                                    { text: "Overfitting; train more", isCorrect: false },
                                    { text: "A normal feature; nothing needs to be done", isCorrect: false }
                                ],
                                explanation: "Prompt injection is untrusted text trying to override instructions. Defense: treat retrieved/document content as data, mark it as untrusted, reinforce privileged instructions, and validate outputs.",
                                difficulty: 2, concept: "Safety"
                            },
                            {
                                id: "q4", type: "multiple-choice",
                                question: "Two fairness criteria conflict - you can't satisfy demographic parity and equal opportunity at the same time. What's the right move?",
                                options: [
                                    { text: "Document the trade-off explicitly and pick the criterion appropriate for the use case; fairness is plural, not single-criterion", isCorrect: true },
                                    { text: "Always pick demographic parity; it's the only definition that matters", isCorrect: false },
                                    { text: "Always pick equal opportunity; it's the only definition that matters", isCorrect: false },
                                    { text: "Ignore fairness criteria entirely", isCorrect: false }
                                ],
                                explanation: "Multiple fairness criteria are known to be mutually unsatisfiable in many settings. Choosing one is a values decision the team must make explicitly and document.",
                                difficulty: 3, concept: "Fairness"
                            },
                            {
                                id: "q5", type: "multiple-choice",
                                question: "Which is the best doc + accountability practice when shipping an ML model?",
                                options: [
                                    { text: "Publish a model card (intended use, performance, limitations) and a human-in-the-loop plan for high-stakes decisions", isCorrect: true },
                                    { text: "Ship it; docs are optional", isCorrect: false },
                                    { text: "Only ship after accuracy reaches exactly 100% (unrealistic)", isCorrect: false },
                                    { text: "Skip docs and rely on internal notes", isCorrect: false }
                                ],
                                explanation: "Model cards and human-in-the-loop plans make intended use, limitations, and accountability explicit - increasingly required by regulation and good AI hygiene generally.",
                                difficulty: 2, concept: "Accountability"
                            }
                        ]
                    },

                    animation: {
                        type: "bias-dashboard",
                        title: "Bias Dashboard",
                        description: "Visualize per-slice metrics. Slices with low accuracy light up red.",
                        controls: ["generateBiasData", "adjustBiasThresholds"]
                    }
                },

        math_refresher: {
                    id: "math_refresher",
                    title: "Math Refresher",
                    subtitle: "Linear Algebra, Calculus & Probability for ML (Optional)",
                    level: "beginner",
                    number: 5,
                    tracks: { builder: "optional", researcher: "required", leader: "optional" },
                    estimatedTime: 60,
                    difficulty: 1,
                    prerequisites: [],

                    content: `
                        <div class="lesson-section">
                            <h3>🎯 What You'll Be Able to Do</h3>
                            <ul>
                                <li>Read the math in deep-learning and quantum-ML lessons without panic</li>
                                <li>Understand vectors, matrices, dot products, and why they matter for ML</li>
                                <li>Understand derivatives as "how much the output moves when an input moves"</li>
                                <li>Understand probability distributions, expectation, and variance</li>
                            </ul>
                            <p><strong>Before you start:</strong> High-school algebra. This lesson is <em>optional</em> - skip it if you already know what a derivative and a covariance matrix are.</p>
                            <div style="background: rgba(16, 185, 129, 0.1); border-left: 4px solid var(--ai-green); padding: 0.75rem 1rem; border-radius: 4px; margin: 1rem 0;">
                                <strong>How to use this lesson:</strong> skim each section, and only stop where a concept is unfamiliar. You don't need to memorize formulas - you need to recognize what they represent.
                            </div>
                        </div>

                        <div class="lesson-section">
                            <h3>📐 Linear Algebra — Vectors and Matrices</h3>
                            <p><strong>Vector</strong> — an ordered list of numbers, e.g. <code>x = [1.2, -0.4, 3.0]</code> in <strong>R^3</strong>. Geometrically: a point or a direction in space.</p>
                            <p><strong>Matrix</strong> — a 2D grid of numbers. A matrix <strong>A</strong> (m x n) maps an n-vector to an m-vector via <strong>Ax</strong>.</p>
                            <p><strong>Dot product</strong>: <code>a . b = sum(a_i * b_i)</code>. It's the building block of neural layers (<code>w . x + b</code>) and similarity (cosine similarity).</p>
                            <p><strong>Matrix multiplication</strong>: composition. If <strong>B</strong> maps <em>n</em>-vectors to <em>m</em>-vectors and <strong>A</strong> maps <em>m</em>-vectors to <em>k</em>-vectors, then <strong>A(Bx)</strong> = <strong>(AB)x</strong> is a k-vector.</p>
                            <p><strong>Eigenvalues / eigenvectors</strong>: the directions <em>v</em> that don't rotate under <strong>A</strong>, only scale: <strong>Av = lambda * v</strong>. Intuition: special directions where the matrix acts like a single number.</p>
                            <p><strong>Why this matters for ML:</strong> a neural network layer <code>y = Wx + b</code> is a matrix-vector product plus a bias. Backpropagation is purely matrix calculus.</p>
                            <pre style="background: var(--code-bg); padding: 1rem; border-radius: 4px; overflow-x: auto;">
# NumPy: the lingua franca of ML math
import numpy as np
v = np.array([1.2, -0.4, 3.0])  # a vector in R^3
M = np.array([[1, 2, 0], [0, 1, 4]])  # 2x3 matrix
y = M @ v  # y in R^2
print(y, y.shape)  # [1.2, 11.6] (2,)
print(v @ v)  # dot product
                            </pre>
                        </div>

                        <div class="lesson-section">
                            <h3>📉 Calculus — Derivatives and Gradients</h3>
                            <p><strong>Derivative</strong> — <code>df/dx</code> is "how much the output moves when <code>x</code> moves". <code>f(x) = x^2</code> -> <code>df/dx = 2x</code> (at x=3, slope is 6).</p>
                            <p><strong>Partial derivative</strong> — derivative of <code>f(x_1, ..., x_n)</code> w.r.t. one variable, holding others fixed. Written <code>partial f / partial x_i</code>.</p>
                            <p><strong>Gradient</strong> — vector of all partials. <code>grad f = [df/dx_1, ..., df/dx_n]</code>. It points in the direction of steepest ascent.</p>
                            <p><strong>Training loop in one line</strong>: <code>w = w - lr * grad L</code> — go downhill, where <code>lr</code> (learning rate) is the step size. That's gradient descent.</p>
                            <p><strong>Chain rule</strong>: <code>d f(g(x)) / dx = (df/dg) * (dg/dx)</code>. Backprop is just the chain rule applied layer-by-layer.</p>
                            <p><strong>Why this matters for ML:</strong> training = minimizing a loss function. We use gradients to know which direction is downhill.</p>
                        </div>

                        <div class="lesson-section">
                            <h3>🎲 Probability — Distributions, Expectation, Variance</h3>
                            <p><strong>Random variable (RV)</strong> — a variable whose value is uncertain. Can be discrete (coin toss) or continuous (height).</p>
                            <p><strong>Probability distribution</strong>: how likely each value is.
                                <ul>
                                    <li><strong>Discrete:</strong> probability mass function <code>p(x)</code> = P(X=x).</li>
                                    <li><strong>Continuous:</strong> probability density function <code>p(x)</code>; the area under <code>p</code> is 1.</li>
                                </ul>
                            </p>
                            <p><strong>Expectation</strong> <code>E[X] = sum x * p(x)</code> (or integral for continuous). The long-run average.</p>
                            <p><strong>Variance</strong> <code>Var(X) = E[(X - E[X])^2]</code> — how spread out the values are.</p>
                            <p><strong>Conditional probability</strong> <code>P(A | B)</code> = P(A and B) / P(B). Bayes' rule flips conditions: <code>P(A|B) = P(B|A) P(A) / P(B)</code>.</p>
                            <p><strong>Why this matters for ML:</strong> classification is "estimate P(class | input)". Generative models (LLMs) model P(token | previous tokens). Across the whole course you'll see <code>softmax(x)_i = exp(x_i) / sum_j exp(x_j)</code> — a probability distribution over classes/tokens.</p>
                        </div>

                        <div class="lesson-section">
                            <h3>🧠 Tying it Together — softmax in One Line</h3>
                            <p>One formula that uses everything above:</p>
                            <pre style="background: var(--code-bg); padding: 1rem; border-radius: 4px;">
softmax(z)_i = exp(z_i) / sum_j exp(z_j)
                            </pre>
                            <ul>
                                <li>Takes a vector <code>z</code> (linear algebra)</li>
                                <li>Its derivative is clean (calculus: <code>d softmax/dz = softmax - softmax * softmax</code>)</li>
                                <li>Outputs a probability distribution that sums to 1 (probability)</li>
                            </ul>
                            <p>Softmax is the output layer for classification; cross-entropy loss is the matching training objective. Together they make neural-network classifier training work.</p>
                        </div>
                    `,

                    concepts: ["Vectors", "Matrices", "Dot product", "Matrix multiplication", "Eigenvalues", "Derivatives", "Gradients", "Gradient descent", "Probability distributions", "Expectation", "Variance", "Conditional probability", "softmax"],

                    quiz: {
                        id: "math_refresher_quiz",
                        title: "Math Refresher Quiz",
                        passingScore: 60,
                        timeLimit: 420,
                        questions: [
                            {
                                id: "q1", type: "multiple-choice",
                                question: "A neural network layer computes y = Wx + b. In shape terms, if x is in R^n and y is in R^m, what is W?",
                                options: [
                                    { text: "An m x n matrix (it maps an n-vector to an m-vector)", isCorrect: true },
                                    { text: "An n x m matrix", isCorrect: false },
                                    { text: "A scalar", isCorrect: false },
                                    { text: "A vector of length m+n", isCorrect: false }
                                ],
                                explanation: "Ax maps n-vectors to m-vectors only when A has m rows and n columns. The bias b is added elementwise after, so it's also in R^m.",
                                difficulty: 1, concept: "Linear algebra"
                            },
                            {
                                id: "q2", type: "multiple-choice",
                                question: "The gradient grad L points in the direction of steepest ascent of L. Why do we train with w = w - lr * grad L?",
                                options: [
                                    { text: "The minus sign flips the direction, so we move downhill (steapest descent), minimizing L", isCorrect: true },
                                    { text: "We want to maximize L, and the minus sign is a bug", isCorrect: false },
                                    { text: "lr is the gradient itself", isCorrect: false },
                                    { text: "It doesn't - we use plus, not minus", isCorrect: false }
                                ],
                                explanation: "Gradient descent moves opposite the gradient (downhill) by step size lr. Gradient ascent uses plus.",
                                difficulty: 2, concept: "Calculus"
                            },
                            {
                                id: "q3", type: "multiple-choice",
                                question: "EF[X] = sum x*p(x). What does expectation represent intuitively?",
                                options: [
                                    { text: "The long-run average value of X", isCorrect: true },
                                    { text: "The most likely value of X", isCorrect: false },
                                    { text: "The maximum value of X", isCorrect: false },
                                    { text: "The variance of X", isCorrect: false }
                                ],
                                explanation: "Expectation is the long-run average. The most likely value (mode) and the maximum are different things and may not equal E[X].",
                                difficulty: 1, concept: "Probability"
                            },
                            {
                                id: "q4", type: "multiple-choice",
                                question: "Backpropagation is essentially which math tool applied repeatedly?",
                                options: [
                                    { text: "The chain rule of calculus", isCorrect: true },
                                    { text: "Euler's formula", isCorrect: false },
                                    { text: "Taylor series", isCorrect: false },
                                    { text: "Kronecker products", isCorrect: false }
                                ],
                                explanation: "Backprop is the chain rule applied layer-by-layer to compute gradients of the loss w.r.t. every weight.",
                                difficulty: 2, concept: "Calculus"
                            },
                            {
                                id: "q5", type: "multiple-choice",
                                question: "softmax(z)_i = exp(z_i) / sum_j exp(z_j). Why does the denominator sum over all j?",
                                options: [
                                    { text: "So the output is a probability distribution that sums to 1", isCorrect: true },
                                    { text: "To make softmax faster", isCorrect: false },
                                    { text: "To avoid a division-by-zero error on diagonal elements", isCorrect: false },
                                    { text: "To preserve the input scale", isCorrect: false }
                                ],
                                explanation: "The denominator normalizes the exponentiated scores so the output sums to 1, making it valid as a categorical probability.",
                                difficulty: 2, concept: "Probability"
                            }
                        ]
                    },

                    animation: {
                        type: "loss-landscape",
                        title: "Loss-Landscape Contour",
                        description: "Walk gradient descent on a 2D bivariate-quadratic loss surface with contour lines.",
                        controls: ["llLrSlider", "llOptimizerSelector", "stepLl", "autoLl", "resetLl"]
                    }
                }
            }
        },

        // LEVEL 2: APPLIED ML
        intermediate: {
            name: "Applied Machine Learning",
            description: "Classic ML algorithms with scikit-learn",
            color: "#3b82f6",
            icon: "🔧",
            lessons: {}
        },

        // LEVEL 3: DEEP LEARNING
        advanced: {
            name: "Deep Learning & Transformers",
            description: "Deep neural networks and transformer models",
            color: "#8b5cf6",
            icon: "🔬",
            lessons: {}
        },

        // LEVEL 4: LLM SYSTEMS
        expert: {
            name: "LLM Systems & Applications",
            description: "LangChain, LLM applications, and the quantum-AI frontier",
            color: "#f97316",
            icon: "🚀",
            lessons: {}
        },

        // LEVEL 5: RESEARCH TOPICS
        research: {
            name: "Research Topics",
            description: "AI agents, multi-agent systems, and open research questions",
            color: "#ef4444",
            icon: "🔬",
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
