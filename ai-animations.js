// Generative AI & Machine Learning Animations
// ==============================================

class AIAnimations {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.animationContainer = null;
        this.animationControls = null;
        this.currentAnimation = null;
        this.animationData = null;
        this.isAnimating = false;
        this.animationId = null;
        // Some animations are static (draw once); others (timeline play,
        // llm-inference token generation, agent-simulator) opt into a loop.
        this.continuous = false;

        // Animation-specific state
        this.mlWorkflowStep = 0;
        this.mlWorkflowSteps = [
            { name: 'Problem Definition', icon: '🎯' },
            { name: 'Data Collection', icon: '📊' },
            { name: 'Data Preprocessing', icon: '🧹' },
            { name: 'Model Selection', icon: '🤖' },
            { name: 'Training', icon: '🏋️' },
            { name: 'Evaluation', icon: '📈' },
            { name: 'Deployment', icon: '🚀' },
            { name: 'Monitoring', icon: '👁️' }
        ];
        this.nnLayers = [3, 4, 2];
        this.nnActivations = ['relu', 'relu', 'softmax'];
        this.nnWeights = [];

        // Timeline state
        this.timelinePlaying = false;
        this.timelineIndex = 0;

        // Transformer state
        this.transformerLayers = 6;
        this.transformerHeads = 8;
        this.attentionVisible = false;

        // LLM inference state
        this.llmPrompt = "The future of AI is";
        this.llmTokens = [];
        this.llmGenerating = false;

        // Agent state
        this.agentType = 'simple';
        this.agentRunning = false;
        this.agentStep = 0;

        // Classification state
        this.classifierType = 'linear';
        this.classPoints = this.generateClassPoints();

        // Clustering state
        this.clusteringType = 'kmeans';
        this.clusterPoints = this.generateClusterPoints();
        this.clusterAssignments = [];

        // NN trainer state
        this.nnTrainerLayers = [3, 5, 4, 2];
        this.nnTrainerActivation = 'relu';
        this.nnTrainerLearningRate = 0.01;
        this.nnTrainerEpoch = 0;
        this.nnTrainerLoss = 1.0;

        this.init();
    }

    init() {
        this.canvas = document.getElementById('aiCanvas');
        this.animationContainer = document.getElementById('animationContainer');
        this.animationControls = document.getElementById('animationControls');

        if (this.canvas) {
            this.ctx = this.canvas.getContext('2d');
            this.resizeCanvas();
            window.addEventListener('resize', () => this.resizeCanvas());
        }
    }

    resizeCanvas() {
        if (this.canvas) {
            const parent = this.canvas.parentElement;
            this.canvas.width = parent ? Math.max(200, parent.clientWidth) : 400;
            this.canvas.height = 300;
            if (this.currentAnimation) {
                this.drawFrame();
            }
        }
    }

    startAnimation(type, data = {}) {
        this.currentAnimation = type;
        this.animationData = data;
        this.isAnimating = true;
        this.continuous = false;

        // Clear previous animation
        this.stopAnimation();

        // Update controls
        this.updateControls(type);

        // Reset per-animation state defaults
        this.timelinePlaying = false;
        this.attentionVisible = false;
        this.llmGenerating = false;
        this.llmTokens = [];
        this.agentRunning = false;
        this.agentStep = 0;

        // Decide whether this animation needs a continuous loop
        if (type === 'ai-timeline' || type === 'llm-inference' || type === 'agent-simulator') {
            // These can be advanced by user controls; we don't need a 60fps loop
            // but we do want to redraw on demand. Keep continuous=false by default.
            this.continuous = false;
        }

        // Draw the first frame immediately
        this.drawFrame();

        console.log(`Started animation: ${type}`);
    }

    updateControls(type) {
        if (!this.animationControls) return;

        const controls = this.getControlsForAnimation(type);
        this.animationControls.innerHTML = controls;

        // Add event listeners
        this.addControlListeners();
    }

    getControlsForAnimation(type) {
        const baseControls = `
            <button class="btn-small" onclick="animations.stopAnimation()" aria-label="Stop animation">⏹ Stop</button>
            <button class="btn-small" onclick="animations.resetAnimation()" aria-label="Reset animation">🔄 Reset</button>
        `;

        switch(type) {
            case 'ai-timeline':
                return baseControls + `
                    <button class="btn-small" onclick="animations.playTimeline()" aria-label="Play timeline">▶ Play</button>
                    <button class="btn-small" onclick="animations.pauseTimeline()" aria-label="Pause timeline">⏸ Pause</button>
                    <select id="eraSelector" onchange="animations.jumpToEra(this.value)" aria-label="Jump to era">
                        <option value="0">1950s</option>
                        <option value="1">1960s</option>
                        <option value="2">1970s</option>
                        <option value="3">1980s</option>
                        <option value="4">1990s</option>
                        <option value="5">2000s</option>
                        <option value="6">2010s</option>
                        <option value="7">2020s</option>
                    </select>
                `;

            case 'ml-workflow':
                return baseControls + `
                    <button class="btn-small" onclick="animations.prevStep()" aria-label="Previous step">← Prev</button>
                    <button class="btn-small" onclick="animations.nextStep()" aria-label="Next step">Next →</button>
                    <span id="stepCounter">Step 1</span>
                `;

            case 'nn-visualizer':
            case 'nn-trainer':
                return baseControls + `
                    <button class="btn-small" onclick="animations.addLayer()" aria-label="Add layer">+ Layer</button>
                    <select id="activationSelector" onchange="animations.changeActivation(this.value)" aria-label="Change activation">
                        <option value="relu">ReLU</option>
                        <option value="sigmoid">Sigmoid</option>
                        <option value="tanh">Tanh</option>
                    </select>
                    <button class="btn-small" onclick="animations.trainNetwork()" aria-label="Train network">🚀 Train</button>
                `;

            case 'classification-boundary':
                return baseControls + `
                    <select id="classifierSelector" onchange="animations.changeClassifier(this.value)" aria-label="Change classifier">
                        <option value="linear">Linear</option>
                        <option value="knn">K-NN</option>
                        <option value="svm">SVM</option>
                    </select>
                    <button class="btn-small" onclick="animations.addPoint()" aria-label="Add point">+ Point</button>
                    <button class="btn-small" onclick="animations.showBoundary()" aria-label="Show decision boundary">Show Boundary</button>
                `;

            case 'clustering-visualizer':
                return baseControls + `
                    <select id="clusteringSelector" onchange="animations.changeClustering(this.value)" aria-label="Change clustering algorithm">
                        <option value="kmeans">K-Means</option>
                        <option value="dbscan">DBSCAN</option>
                    </select>
                    <button class="btn-small" onclick="animations.addClusterPoint()" aria-label="Add point">+ Point</button>
                    <button class="btn-small" onclick="animations.runClustering()" aria-label="Run clustering">Run Clustering</button>
                `;

            case 'transformer-visualizer':
                return baseControls + `
                    <label for="layerSlider" style="font-size:0.75rem;">Layers: <span id="layerVal">6</span></label>
                    <input type="range" id="layerSlider" min="1" max="12" value="6" oninput="animations.updateTransformerLayers(this.value)" aria-label="Number of layers">
                    <label for="headSlider" style="font-size:0.75rem;">Heads: <span id="headVal">8</span></label>
                    <input type="range" id="headSlider" min="1" max="16" value="8" oninput="animations.updateAttentionHeads(this.value)" aria-label="Number of attention heads">
                    <button class="btn-small" onclick="animations.toggleAttention()" aria-label="Toggle attention visualization">Show Attention</button>
                `;

            case 'llm-inference':
                return baseControls + `
                    <input type="text" id="promptInput" placeholder="Enter prompt..." value="The future of AI is" oninput="animations.updatePrompt(this.value)" aria-label="LLM prompt">
                    <button class="btn-small" onclick="animations.generateToken()" aria-label="Generate next token">Generate Token</button>
                    <button class="btn-small" onclick="animations.showProbabilities()" aria-label="Show token probabilities">Show Probs</button>
                `;

            case 'agent-simulator':
                return baseControls + `
                    <select id="agentTypeSelector" onchange="animations.changeAgentType(this.value)" aria-label="Agent type">
                        <option value="simple">Simple Agent</option>
                        <option value="memory">Memory Agent</option>
                        <option value="planning">Planning Agent</option>
                    </select>
                    <button class="btn-small" onclick="animations.runAgent()" aria-label="Run agent step">Run Agent</button>
                `;

            // T3.2 - Gradient descent playground: LR / momentum / optimizer
            // sliders driving a 1-D loss-landscape ball-step animation.
            case 'gradient-descent':
                return baseControls + `
                    <label for="gdLrSlider" style="font-size:0.75rem;">LR: <span id="gdLrVal">0.1</span></label>
                    <input type="range" id="gdLrSlider" min="0.001" max="1.0" step="0.001" value="0.1" oninput="animations.updateGdLearningRate(this.value)" aria-label="Learning rate">
                    <label for="gdMomentumSlider" style="font-size:0.75rem;">Momentum: <span id="gdMomentumVal">0.9</span></label>
                    <input type="range" id="gdMomentumSlider" min="0" max="0.99" step="0.01" value="0.9" oninput="animations.updateGdMomentum(this.value)" aria-label="Momentum">
                    <select id="gdOptimizerSelector" onchange="animations.changeGdOptimizer(this.value)" aria-label="Optimizer">
                        <option value="sgd">SGD</option>
                        <option value="momentum" selected>Momentum</option>
                        <option value="adam">Adam</option>
                    </select>
                    <button class="btn-small" onclick="animations.stepGd()" aria-label="Take one gradient step">▶ Step</button>
                    <button class="btn-small" onclick="animations.toggleAutoGd()" aria-label="Auto-run gradient descent" id="gdAutoBtn">⏩ Auto</button>
                    <button class="btn-small" onclick="animations.resetGd()" aria-label="Reset position">↺ Reset</button>
                `;

            // T3.3 - Build-a-transformer: step display of the transformer pipeline.
            case 'build-transformer':
                return baseControls + `
                    <button class="btn-small" onclick="animations.nextTransformerStep()" aria-label="Next pipeline phase">Phase →</button>
                    <button class="btn-small" onclick="animations.prevTransformerStep()" aria-label="Previous phase">← Phase</button>
                    <span id="buildTransformerPhase">Phase 1 of 5: Token Embedding</span>
                `;

            // T3.4 - Bias dashboard: per-slice metric visualization.
            case 'bias-dashboard':
                return baseControls + `
                    <button class="btn-small" onclick="animations.generateBiasData()" aria-label="Generate fresh synthetic data">🎲 Generate</button>
                    <button class="btn-small" onclick="animations.adjustBiasThresholds()" aria-label="Adjust alert thresholds">⚙ Thresholds</button>
                `;

            // T3.6 - 2D loss-landscape contour visualizer. Renders a 2D
            // (w1, w2) loss surface as contour lines and visualizes the
            // gradient-descent path on top.
            case 'loss-landscape':
                return baseControls + `
                    <label for="llLrSlider" style="font-size:0.75rem;">LR: <span id="llLrVal">0.05</span></label>
                    <input type="range" id="llLrSlider" min="0.005" max="0.3" step="0.005" value="0.05" oninput="animations.updateLlLearningRate(this.value)" aria-label="Learning rate">
                    <select id="llOptimizerSelector" onchange="animations.changeLlOptimizer(this.value)" aria-label="Optimizer">
                        <option value="sgd">SGD</option>
                        <option value="momentum" selected>Momentum</option>
                        <option value="adam">Adam</option>
                    </select>
                    <button class="btn-small" onclick="animations.stepLl()" aria-label="Take one step">▶ Step</button>
                    <button class="btn-small" onclick="animations.toggleAutoLl()">⏩ Auto</button>
                    <button class="btn-small" onclick="animations.resetLl()">↺ Reset</button>
                `;

            default:
                return baseControls;
        }
    }

    addControlListeners() {
        // Common listeners handled by onclick in the HTML
    }

    // Only run the rAF loop when an animation explicitly requests it
    animate() {
        if (!this.isAnimating || !this.continuous) return;
        this.drawFrame();
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    // Redraw a single frame on demand
    drawFrame() {
        if (!this.ctx || !this.canvas) return;

        // Clear canvas
        this.ctx.fillStyle = '#1e293b';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw based on current animation
        switch(this.currentAnimation) {
            case 'ai-timeline':
                this.drawAITimeline();
                break;
            case 'ml-workflow':
                this.drawMLWorkflow();
                break;
            case 'nn-visualizer':
                this.drawNNVisualizer();
                break;
            case 'classification-boundary':
                this.drawClassificationBoundary();
                break;
            case 'clustering-visualizer':
                this.drawClusteringVisualizer();
                break;
            case 'nn-trainer':
                this.drawNNTrainer();
                break;
            case 'transformer-visualizer':
                this.drawTransformerVisualizer();
                break;
            case 'llm-inference':
                this.drawLLMInference();
                break;
            case 'agent-simulator':
                this.drawAgentSimulator();
                break;
            case 'gradient-descent':
                this.drawGradientDescent();
                break;
            case 'build-transformer':
                this.drawBuildTransformer();
                break;
            case 'bias-dashboard':
                this.drawBiasDashboard();
                break;
            case 'loss-landscape':
                this.drawLossLandscape();
                break;
            default:
                this.drawDefault();
        }
    }

    drawDefault() {
        if (!this.ctx) return;
        this.ctx.fillStyle = '#3b82f6';
        this.ctx.font = '20px sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('🤖 AI Animation', this.canvas.width / 2, this.canvas.height / 2);
    }

    // ===========================================================
    // AI Timeline Animation
    // ===========================================================
    drawAITimeline() {
        if (!this.ctx) return;

        const width = this.canvas.width;
        const height = this.canvas.height;
        const padding = 40;

        // Draw timeline
        this.ctx.strokeStyle = '#475569';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(padding, height / 2);
        this.ctx.lineTo(width - padding, height / 2);
        this.ctx.stroke();

        // Draw eras
        const eras = [
            { name: 'Birth of AI', year: '1950-56', color: '#10b981', events: ['Turing Test', 'Dartmouth'] },
            { name: 'Golden Years', year: '1956-74', color: '#3b82f6', events: ['LISP', 'ELIZA', 'Perceptron'] },
            { name: 'AI Winter', year: '1974-80', color: '#ef4444', events: ['Funding cuts'] },
            { name: 'Expert Systems', year: '1980-87', color: '#f97316', events: ['Rule-based'] },
            { name: 'ML Era', year: '1987-2010', color: '#8b5cf6', events: ['SVM', 'Neural Nets'] },
            { name: 'Deep Learning', year: '2010-16', color: '#06b6d4', events: ['AlexNet', 'GPUs'] },
            { name: 'AI Renaissance', year: '2016-23', color: '#ec4899', events: ['AlphaGo', 'Transformers', 'LLMs'] },
            { name: 'Agentic AI', year: '2023+', color: '#22c55e', events: ['Agents', 'Multimodal', 'Reasoning'] }
        ];

        const eraWidth = (width - 2 * padding) / eras.length;

        eras.forEach((era, index) => {
            const x = padding + index * eraWidth;
            const y = height / 2;
            const isActive = index === this.timelineIndex;

            // Draw era marker
            this.ctx.fillStyle = era.color;
            this.ctx.beginPath();
            this.ctx.arc(x, y, isActive ? 12 : 8, 0, Math.PI * 2);
            this.ctx.fill();

            if (isActive) {
                // Highlight ring
                this.ctx.strokeStyle = era.color;
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                this.ctx.arc(x, y, 16, 0, Math.PI * 2);
                this.ctx.stroke();
            }

            // Draw era label
            this.ctx.fillStyle = isActive ? '#f8fafc' : '#cbd5e1';
            this.ctx.font = isActive ? 'bold 12px sans-serif' : '11px sans-serif';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(era.year, x, y - 25);

            this.ctx.font = '10px sans-serif';
            this.ctx.fillStyle = '#94a3b8';
            this.ctx.fillText(era.name, x, y + 22);
        });

        // Show active era events
        if (this.timelineIndex >= 0 && this.timelineIndex < eras.length) {
            const era = eras[this.timelineIndex];
            this.ctx.fillStyle = era.color;
            this.ctx.font = 'bold 13px sans-serif';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(`${era.name}: ${era.events.join(', ')}`, width / 2, 20);
        }
    }

    playTimeline() {
        if (this.currentAnimation !== 'ai-timeline') return;
        this.timelinePlaying = true;
        // Advance through eras on an interval rather than spinning rAF
        if (this._timelineInterval) clearInterval(this._timelineInterval);
        this._timelineInterval = setInterval(() => {
            if (!this.timelinePlaying) return;
            this.timelineIndex = (this.timelineIndex + 1) % 8;
            this.drawFrame();
            const sel = document.getElementById('eraSelector');
            if (sel) sel.value = String(this.timelineIndex);
        }, 1200);
    }

    pauseTimeline() {
        this.timelinePlaying = false;
        if (this._timelineInterval) {
            clearInterval(this._timelineInterval);
            this._timelineInterval = null;
        }
    }

    jumpToEra(idx) {
        this.timelineIndex = parseInt(idx, 10) || 0;
        this.drawFrame();
    }

    // ===========================================================
    // ML Workflow Animation
    // ===========================================================
    drawMLWorkflow() {
        if (!this.ctx) return;

        const width = this.canvas.width;
        const height = this.canvas.height;
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) * 0.3;

        // Draw circle
        this.ctx.strokeStyle = '#475569';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        this.ctx.stroke();

        // Draw steps
        const stepAngle = (Math.PI * 2) / this.mlWorkflowSteps.length;

        this.mlWorkflowSteps.forEach((step, index) => {
            const angle = index * stepAngle - Math.PI / 2;
            const x = centerX + Math.cos(angle) * radius * 0.8;
            const y = centerY + Math.sin(angle) * radius * 0.8;

            // Draw step marker
            const isActive = index === this.mlWorkflowStep;
            this.ctx.fillStyle = isActive ? '#3b82f6' : '#64748b';
            this.ctx.beginPath();
            this.ctx.arc(x, y, 20, 0, Math.PI * 2);
            this.ctx.fill();

            // Draw step label
            this.ctx.fillStyle = '#f8fafc';
            this.ctx.font = isActive ? 'bold 14px sans-serif' : '12px sans-serif';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(step.icon, x, y + 5);

            // Draw step name
            const textAngle = angle > Math.PI / 2 && angle < Math.PI * 3 / 2 ? angle + Math.PI : angle;
            const textX = centerX + Math.cos(textAngle) * radius * 1.2;
            const textY = centerY + Math.sin(textAngle) * radius * 1.2;
            this.ctx.font = '10px sans-serif';
            this.ctx.fillText(step.name, textX, textY);
        });

        // Draw active step indicator
        if (this.mlWorkflowStep < this.mlWorkflowSteps.length) {
            const step = this.mlWorkflowSteps[this.mlWorkflowStep];
            this.ctx.fillStyle = '#3b82f6';
            this.ctx.font = '16px sans-serif';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(step.name + ' ' + step.icon, centerX, centerY + radius + 30);
        }
    }

    nextStep() {
        if (this.currentAnimation === 'ml-workflow') {
            this.mlWorkflowStep = (this.mlWorkflowStep + 1) % this.mlWorkflowSteps.length;
            const stepCounter = document.getElementById('stepCounter');
            if (stepCounter) {
                stepCounter.textContent = `Step ${this.mlWorkflowStep + 1}`;
            }
            this.drawFrame();
        }
    }

    prevStep() {
        if (this.currentAnimation === 'ml-workflow') {
            this.mlWorkflowStep = (this.mlWorkflowStep - 1 + this.mlWorkflowSteps.length) % this.mlWorkflowSteps.length;
            const stepCounter = document.getElementById('stepCounter');
            if (stepCounter) {
                stepCounter.textContent = `Step ${this.mlWorkflowStep + 1}`;
            }
            this.drawFrame();
        }
    }

    // ===========================================================
    // Neural Network Visualizer
    // ===========================================================
    drawNNVisualizer() {
        if (!this.ctx) return;

        const width = this.canvas.width;
        const height = this.canvas.height;
        const layerSpacing = width / (this.nnLayers.length + 1);
        const neuronSpacing = height / Math.max(...this.nnLayers, 1);

        // Draw connections
        for (let l = 0; l < this.nnLayers.length - 1; l++) {
            const fromLayer = this.nnLayers[l];
            const toLayer = this.nnLayers[l + 1];
            const fromX = (l + 1) * layerSpacing;
            const toX = (l + 2) * layerSpacing;

            for (let i = 0; i < fromLayer; i++) {
                const fromY = (i + 0.5) * neuronSpacing;
                for (let j = 0; j < toLayer; j++) {
                    const toY = (j + 0.5) * neuronSpacing;

                    // Draw connection
                    this.ctx.strokeStyle = '#475569';
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(fromX, fromY);
                    this.ctx.lineTo(toX, toY);
                    this.ctx.stroke();
                }
            }
        }

        // Draw neurons
        for (let l = 0; l < this.nnLayers.length; l++) {
            const neurons = this.nnLayers[l];
            const x = (l + 1) * layerSpacing;
            const activation = this.nnActivations[l];

            for (let i = 0; i < neurons; i++) {
                const y = (i + 0.5) * neuronSpacing;

                // Draw neuron
                this.ctx.fillStyle = this.getActivationColor(activation);
                this.ctx.beginPath();
                this.ctx.arc(x, y, 15, 0, Math.PI * 2);
                this.ctx.fill();

                this.ctx.strokeStyle = '#f8fafc';
                this.ctx.lineWidth = 1;
                this.ctx.beginPath();
                this.ctx.arc(x, y, 15, 0, Math.PI * 2);
                this.ctx.stroke();
            }

            // Draw layer label
            const layerNames = ['Input', 'Hidden', 'Output'];
            this.ctx.fillStyle = '#f8fafc';
            this.ctx.font = 'bold 12px sans-serif';
            this.ctx.textAlign = 'center';
            const label = l === 0 ? 'Input' : (l === this.nnLayers.length - 1 ? 'Output' : `Hidden ${l}`);
            this.ctx.fillText(label, x, height - 10);
        }
    }

    getActivationColor(activation) {
        const colors = {
            relu: '#3b82f6',
            sigmoid: '#10b981',
            tanh: '#f97316',
            softmax: '#8b5cf6',
            linear: '#ef4444'
        };
        return colors[activation] || '#64748b';
    }

    addLayer() {
        if (this.currentAnimation === 'nn-visualizer' || this.currentAnimation === 'nn-trainer') {
            this.nnLayers.splice(this.nnLayers.length - 1, 0, 4);
            this.nnActivations.splice(this.nnActivations.length - 1, 0, 'relu');
            this.drawFrame();
        }
    }

    changeActivation(activation) {
        if ((this.currentAnimation === 'nn-visualizer' || this.currentAnimation === 'nn-trainer') && this.nnLayers.length > 0) {
            const layerIndex = this.nnLayers.length - 2;
            if (layerIndex >= 0) {
                this.nnActivations[layerIndex] = activation;
            }
            this.drawFrame();
        }
    }

    trainNetwork() {
        if (this.currentAnimation === 'nn-visualizer' || this.currentAnimation === 'nn-trainer') {
            // Simulate a brief training animation: flash neurons
            let flash = 0;
            const flashInterval = setInterval(() => {
                flash++;
                this.drawFrame();
                // Overlay a flash
                this.ctx.fillStyle = `rgba(59, 130, 246, ${0.3 * Math.sin(flash * 0.5)})`;
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                if (flash > 10) {
                    clearInterval(flashInterval);
                    this.drawFrame();
                    this.ctx.fillStyle = '#10b981';
                    this.ctx.font = 'bold 14px sans-serif';
                    this.ctx.textAlign = 'center';
                    this.ctx.fillText('✓ Training complete', this.canvas.width / 2, 20);
                }
            }, 100);
        }
    }

    // ===========================================================
    // Classification Boundary Animation
    // ===========================================================
    generateClassPoints() {
        const points = [];
        // Class A (blue) cluster
        for (let i = 0; i < 12; i++) {
            points.push({
                x: 80 + Math.random() * 80,
                y: 60 + Math.random() * 80,
                label: 0
            });
        }
        // Class B (orange) cluster
        for (let i = 0; i < 12; i++) {
            points.push({
                x: 200 + Math.random() * 80,
                y: 160 + Math.random() * 80,
                label: 1
            });
        }
        return points;
    }

    drawClassificationBoundary() {
        if (!this.ctx) return;
        const w = this.canvas.width;
        const h = this.canvas.height;

        // Draw axes
        this.ctx.strokeStyle = '#475569';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(20, 20, w - 40, h - 40);

        // Draw decision boundary based on classifier
        if (this.classifierType === 'linear') {
            this.ctx.strokeStyle = '#3b82f6';
            this.ctx.lineWidth = 2;
            this.ctx.setLineDash([6, 4]);
            this.ctx.beginPath();
            this.ctx.moveTo(w / 2, 20);
            this.ctx.lineTo(w / 2, h - 20);
            this.ctx.stroke();
            this.ctx.setLineDash([]);
        } else if (this.classifierType === 'svm') {
            // Draw a margin
            this.ctx.strokeStyle = '#8b5cf6';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(w / 2 - 20, 20);
            this.ctx.lineTo(w / 2 - 20, h - 20);
            this.ctx.moveTo(w / 2 + 20, 20);
            this.ctx.lineTo(w / 2 + 20, h - 20);
            this.ctx.stroke();
        } else if (this.classifierType === 'knn') {
            // Draw a wiggly boundary
            this.ctx.strokeStyle = '#10b981';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            for (let y = 20; y < h - 20; y += 5) {
                const x = w / 2 + Math.sin(y * 0.05) * 20;
                if (y === 20) this.ctx.moveTo(x, y);
                else this.ctx.lineTo(x, y);
            }
            this.ctx.stroke();
        }

        // Draw points
        this.classPoints.forEach(p => {
            this.ctx.fillStyle = p.label === 0 ? '#3b82f6' : '#f97316';
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
            this.ctx.fill();
        });

        // Label
        this.ctx.fillStyle = '#cbd5e1';
        this.ctx.font = '12px sans-serif';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`${this.classifierType.toUpperCase()} boundary`, 30, 40);
    }

    changeClassifier(type) {
        this.classifierType = type;
        this.drawFrame();
    }

    addPoint() {
        const w = this.canvas.width;
        const h = this.canvas.height;
        this.classPoints.push({
            x: 40 + Math.random() * (w - 80),
            y: 40 + Math.random() * (h - 80),
            label: Math.random() > 0.5 ? 0 : 1
        });
        this.drawFrame();
    }

    showBoundary() {
        this.drawFrame();
        this.ctx.fillStyle = '#10b981';
        this.ctx.font = 'bold 12px sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Boundary shown above', this.canvas.width / 2, this.canvas.height - 5);
    }

    // ===========================================================
    // Clustering Visualizer Animation
    // ===========================================================
    generateClusterPoints() {
        const points = [];
        for (let cluster = 0; cluster < 3; cluster++) {
            const cx = 80 + cluster * 120;
            const cy = 100 + (cluster % 2) * 80;
            for (let i = 0; i < 10; i++) {
                points.push({
                    x: cx + (Math.random() - 0.5) * 60,
                    y: cy + (Math.random() - 0.5) * 60
                });
            }
        }
        return points;
    }

    drawClusteringVisualizer() {
        if (!this.ctx) return;
        const w = this.canvas.width;
        const h = this.canvas.height;

        // Draw axes
        this.ctx.strokeStyle = '#475569';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(20, 20, w - 40, h - 40);

        const colors = ['#3b82f6', '#f97316', '#10b981', '#8b5cf6', '#ec4899'];

        this.clusterPoints.forEach((p, i) => {
            const cluster = this.clusterAssignments[i];
            this.ctx.fillStyle = cluster != null ? colors[cluster % colors.length] : '#94a3b8';
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
            this.ctx.fill();
        });

        // Draw centroids if k-means
        if (this.clusteringType === 'kmeans' && this.clusterAssignments.length > 0) {
            const centroids = this.computeCentroids(3);
            centroids.forEach((c, i) => {
                if (!c) return;
                this.ctx.strokeStyle = colors[i % colors.length];
                this.ctx.lineWidth = 3;
                this.ctx.beginPath();
                this.ctx.arc(c.x, c.y, 12, 0, Math.PI * 2);
                this.ctx.stroke();
            });
        }

        this.ctx.fillStyle = '#cbd5e1';
        this.ctx.font = '12px sans-serif';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`${this.clusteringType.toUpperCase()} clustering`, 30, 40);
    }

    computeCentroids(k) {
        const centroids = [];
        for (let c = 0; c < k; c++) {
            const pts = this.clusterPoints.filter((_, i) => this.clusterAssignments[i] === c);
            if (pts.length === 0) {
                centroids.push(null);
                continue;
            }
            const cx = pts.reduce((s, p) => s + p.x, 0) / pts.length;
            const cy = pts.reduce((s, p) => s + p.y, 0) / pts.length;
            centroids.push({ x: cx, y: cy });
        }
        return centroids;
    }

    changeClustering(type) {
        this.clusteringType = type;
        this.clusterAssignments = [];
        this.drawFrame();
    }

    addClusterPoint() {
        const w = this.canvas.width;
        const h = this.canvas.height;
        this.clusterPoints.push({
            x: 40 + Math.random() * (w - 80),
            y: 40 + Math.random() * (h - 80)
        });
        this.drawFrame();
    }

    runClustering() {
        if (this.clusteringType === 'kmeans') {
            // Simple k-means (k=3) with a few iterations
            const k = 3;
            this.clusterAssignments = this.clusterPoints.map(() => Math.floor(Math.random() * k));
            for (let iter = 0; iter < 10; iter++) {
                const centroids = this.computeCentroids(k);
                this.clusterPoints.forEach((p, i) => {
                    let best = 0;
                    let bestDist = Infinity;
                    centroids.forEach((c, ci) => {
                        if (!c) return;
                        const d = (p.x - c.x) ** 2 + (p.y - c.y) ** 2;
                        if (d < bestDist) { bestDist = d; best = ci; }
                    });
                    this.clusterAssignments[i] = best;
                });
            }
        } else if (this.clusteringType === 'dbscan') {
            // Simplified DBSCAN: group by proximity
            const eps = 40;
            const minPts = 2;
            const labels = new Array(this.clusterPoints.length).fill(-1);
            let clusterId = 0;
            this.clusterPoints.forEach((p, i) => {
                if (labels[i] !== -1) return;
                const neighbors = this.clusterPoints
                    .map((q, j) => ({ j, d: (p.x - q.x) ** 2 + (p.y - q.y) ** 2 }))
                    .filter(n => n.d < eps * eps && n.j !== i)
                    .map(n => n.j);
                if (neighbors.length < minPts) {
                    labels[i] = -2; // noise
                    return;
                }
                labels[i] = clusterId;
                neighbors.forEach(j => { labels[j] = clusterId; });
                clusterId++;
            });
            this.clusterAssignments = labels.map(l => l < 0 ? null : l);
        }
        this.drawFrame();
    }

    // ===========================================================
    // NN Trainer Animation
    // ===========================================================
    drawNNTrainer() {
        if (!this.ctx) return;
        const width = this.canvas.width;
        const height = this.canvas.height;
        const layers = this.nnTrainerLayers;
        const layerSpacing = width / (layers.length + 1);
        const neuronSpacing = height / Math.max(...layers, 1);

        // Connections
        for (let l = 0; l < layers.length - 1; l++) {
            const fromX = (l + 1) * layerSpacing;
            const toX = (l + 2) * layerSpacing;
            for (let i = 0; i < layers[l]; i++) {
                const fromY = (i + 0.5) * neuronSpacing;
                for (let j = 0; j < layers[l + 1]; j++) {
                    const toY = (j + 0.5) * neuronSpacing;
                    this.ctx.strokeStyle = '#475569';
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(fromX, fromY);
                    this.ctx.lineTo(toX, toY);
                    this.ctx.stroke();
                }
            }
        }

        // Neurons
        for (let l = 0; l < layers.length; l++) {
            const x = (l + 1) * layerSpacing;
            for (let i = 0; i < layers[l]; i++) {
                const y = (i + 0.5) * neuronSpacing;
                this.ctx.fillStyle = this.getActivationColor(this.nnTrainerActivation);
                this.ctx.beginPath();
                this.ctx.arc(x, y, 12, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.strokeStyle = '#f8fafc';
                this.ctx.lineWidth = 1;
                this.ctx.stroke();
            }
        }

        // Training stats
        this.ctx.fillStyle = '#cbd5e1';
        this.ctx.font = '12px sans-serif';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`Epoch: ${this.nnTrainerEpoch}  Loss: ${this.nnTrainerLoss.toFixed(3)}  LR: ${this.nnTrainerLearningRate}`, 10, 20);
    }

    addNeuronLayer() {
        this.nnTrainerLayers.splice(this.nnTrainerLayers.length - 1, 0, 4);
        this.drawFrame();
    }

    changeNNActivation(activation) {
        this.nnTrainerActivation = activation;
        this.drawFrame();
    }

    updateLearningRate(val) {
        this.nnTrainerLearningRate = parseFloat(val);
        this.drawFrame();
    }

    trainNN() {
        // Simulate training: decrease loss over a few epochs
        let step = 0;
        const trainInterval = setInterval(() => {
            step++;
            this.nnTrainerEpoch++;
            this.nnTrainerLoss = Math.max(0.05, this.nnTrainerLoss * (0.7 + Math.random() * 0.2));
            this.drawFrame();
            if (step >= 8) {
                clearInterval(trainInterval);
                this.ctx.fillStyle = '#10b981';
                this.ctx.font = 'bold 12px sans-serif';
                this.ctx.textAlign = 'center';
                this.ctx.fillText('✓ Training converged', this.canvas.width / 2, this.canvas.height - 5);
            }
        }, 200);
    }

    // ===========================================================
    // Transformer Visualizer Animation
    // ===========================================================
    drawTransformerVisualizer() {
        if (!this.ctx) return;
        const w = this.canvas.width;
        const h = this.canvas.height;
        const layers = this.transformerLayers;
        const heads = this.transformerHeads;

        const layerHeight = (h - 40) / Math.max(layers, 1);
        const layerWidth = 200;

        for (let l = 0; l < layers; l++) {
            const y = 20 + l * layerHeight;
            const x = (w - layerWidth) / 2;

            // Layer block
            this.ctx.fillStyle = '#3b82f6';
            this.ctx.fillRect(x, y, layerWidth, Math.max(8, layerHeight - 8));

            // Heads
            const headWidth = layerWidth / Math.max(heads, 1);
            for (let hd = 0; hd < heads; hd++) {
                const colors = ['#60a5fa', '#818cf8', '#a78bfa', '#c084fc', '#f472b6'];
                this.ctx.fillStyle = colors[hd % colors.length];
                if (this.attentionVisible) {
                    this.ctx.fillRect(x + hd * headWidth, y, headWidth - 2, Math.max(4, layerHeight - 12));
                }
            }

            // Layer label
            this.ctx.fillStyle = '#f8fafc';
            this.ctx.font = '10px sans-serif';
            this.ctx.textAlign = 'left';
            this.ctx.fillText(`Layer ${l + 1}`, x + 4, y + 10);
        }

        // Input/output labels
        this.ctx.fillStyle = '#cbd5e1';
        this.ctx.font = 'bold 11px sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Input', w / 2, 14);
        this.ctx.fillText('Output', w / 2, h - 5);

        this.ctx.fillStyle = '#94a3b8';
        this.ctx.font = '10px sans-serif';
        this.ctx.textAlign = 'right';
        this.ctx.fillText(`Layers: ${layers}  Heads: ${heads}  Attention: ${this.attentionVisible ? 'ON' : 'OFF'}`, w - 10, 14);
    }

    updateTransformerLayers(val) {
        this.transformerLayers = parseInt(val, 10);
        const el = document.getElementById('layerVal');
        if (el) el.textContent = val;
        this.drawFrame();
    }

    updateAttentionHeads(val) {
        this.transformerHeads = parseInt(val, 10);
        const el = document.getElementById('headVal');
        if (el) el.textContent = val;
        this.drawFrame();
    }

    toggleAttention() {
        this.attentionVisible = !this.attentionVisible;
        this.drawFrame();
    }

    // Alias for the existing button label in lesson content
    showAttention() {
        this.toggleAttention();
    }

    // ===========================================================
    // LLM Inference Animation
    // ===========================================================
    drawLLMInference() {
        if (!this.ctx) return;
        const w = this.canvas.width;
        const h = this.canvas.height;

        // Draw prompt + generated tokens
        this.ctx.fillStyle = '#cbd5e1';
        this.ctx.font = '12px monospace';
        this.ctx.textAlign = 'left';

        const allTokens = [this.llmPrompt, ...this.llmTokens];
        const text = allTokens.join(' ');

        // Wrap text manually
        const maxWidth = w - 40;
        const words = text.split(' ');
        let line = '';
        let y = 30;
        for (const word of words) {
            const testLine = line ? line + ' ' + word : word;
            const metrics = this.ctx.measureText(testLine);
            if (metrics.width > maxWidth && line) {
                this.ctx.fillText(line, 20, y);
                line = word;
                y += 18;
            } else {
                line = testLine;
            }
        }
        if (line) this.ctx.fillText(line, 20, y);

        // Show probabilities panel if requested
        if (this._showProbs && this._lastProbs) {
            this.ctx.fillStyle = '#1e293b';
            this.ctx.fillRect(10, h - 90, w - 20, 80);
            this.ctx.strokeStyle = '#475569';
            this.ctx.strokeRect(10, h - 90, w - 20, 80);
            this.ctx.fillStyle = '#f8fafc';
            this.ctx.font = 'bold 11px sans-serif';
            this.ctx.fillText('Next-token probabilities:', 20, h - 72);
            this.ctx.font = '11px monospace';
            this._lastProbs.forEach((p, i) => {
                const barWidth = (w - 40) * p.prob;
                this.ctx.fillStyle = '#3b82f6';
                this.ctx.fillRect(20, h - 55 + i * 14, barWidth, 10);
                this.ctx.fillStyle = '#f8fafc';
                this.ctx.fillText(`${p.token}: ${Math.round(p.prob * 100)}%`, 24, h - 47 + i * 14);
            });
        }

        // Footer
        this.ctx.fillStyle = '#94a3b8';
        this.ctx.font = '10px sans-serif';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`Tokens generated: ${this.llmTokens.length}`, 10, h - 5);
    }

    updatePrompt(val) {
        this.llmPrompt = val;
        this.llmTokens = [];
        this.drawFrame();
    }

    generateToken() {
        // Simulate token generation with plausible continuations
        const continuations = [
            'bright', 'and', 'full', 'of', 'possibility', 'with', 'advances',
            'in', 'reasoning', 'multimodal', 'and', 'agentic', 'systems', 'that',
            'can', 'plan', 'and', 'act', 'autonomously', 'while', 'remaining', 'safe', 'and', 'aligned'
        ];
        const next = continuations[this.llmTokens.length % continuations.length];
        this.llmTokens.push(next);
        this._lastProbs = [
            { token: next, prob: 0.42 },
            { token: continuations[(this.llmTokens.length + 1) % continuations.length], prob: 0.21 },
            { token: continuations[(this.llmTokens.length + 2) % continuations.length], prob: 0.15 },
            { token: continuations[(this.llmTokens.length + 3) % continuations.length], prob: 0.09 }
        ];
        this._showProbs = false;
        this.drawFrame();
    }

    showProbabilities() {
        if (!this._lastProbs) {
            // Generate a sample distribution if no token has been generated yet
            this._lastProbs = [
                { token: 'bright', prob: 0.38 },
                { token: 'transformative', prob: 0.24 },
                { token: 'uncertain', prob: 0.18 },
                { token: 'collaborative', prob: 0.11 }
            ];
        }
        this._showProbs = !this._showProbs;
        this.drawFrame();
    }

    // ===========================================================
    // Agent Simulator Animation
    // ===========================================================
    drawAgentSimulator() {
        if (!this.ctx) return;
        const w = this.canvas.width;
        const h = this.canvas.height;

        const steps = this.getAgentSteps();

        // Draw the agent reasoning loop
        this.ctx.fillStyle = '#cbd5e1';
        this.ctx.font = 'bold 12px sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`Agent: ${this.agentType}`, w / 2, 20);

        // Draw current step
        if (this.agentStep > 0 && this.agentStep <= steps.length) {
            const step = steps[this.agentStep - 1];
            this.ctx.fillStyle = '#3b82f6';
            this.ctx.fillRect(20, 40, w - 40, 60);
            this.ctx.fillStyle = '#f8fafc';
            this.ctx.font = 'bold 13px sans-serif';
            this.ctx.fillText(step.title, w / 2, 60);
            this.ctx.font = '11px sans-serif';
            // Wrap step description
            const words = step.description.split(' ');
            let line = '';
            let y = 80;
            for (const word of words) {
                const testLine = line ? line + ' ' + word : word;
                if (this.ctx.measureText(testLine).width > w - 60) {
                    this.ctx.fillText(line, w / 2, y);
                    line = word;
                    y += 14;
                } else {
                    line = testLine;
                }
            }
            if (line) this.ctx.fillText(line, w / 2, y);
        }

        // Draw progress
        this.ctx.fillStyle = '#475569';
        this.ctx.fillRect(20, h - 30, w - 40, 8);
        const progress = Math.min(1, this.agentStep / steps.length);
        this.ctx.fillStyle = '#10b981';
        this.ctx.fillRect(20, h - 30, (w - 40) * progress, 8);

        this.ctx.fillStyle = '#94a3b8';
        this.ctx.font = '10px sans-serif';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`Step ${this.agentStep} / ${steps.length}`, 20, h - 8);
    }

    getAgentSteps() {
        if (this.agentType === 'simple') {
            return [
                { title: 'Observe', description: 'User asked: "What is the weather?"' },
                { title: 'Think', description: 'This is a simple factual query.' },
                { title: 'Act', description: 'Call the weather tool.' },
                { title: 'Respond', description: 'Return: "72°F and sunny."' }
            ];
        } else if (this.agentType === 'memory') {
            return [
                { title: 'Observe', description: 'User said: "Hi, I\'m Bob."' },
                { title: 'Store', description: 'Memory: user_name = "Bob"' },
                { title: 'Observe', description: 'User asked: "What\'s my name?"' },
                { title: 'Recall', description: 'Retrieve from memory: "Bob"' },
                { title: 'Respond', description: 'Return: "Your name is Bob."' }
            ];
        } else {
            return [
                { title: 'Observe', description: 'Goal: write a blog post about AI.' },
                { title: 'Plan', description: '1. Research 2. Outline 3. Draft 4. Review' },
                { title: 'Act: Research', description: 'Gather sources on AI trends.' },
                { title: 'Act: Outline', description: 'Create section structure.' },
                { title: 'Act: Draft', description: 'Write the post.' },
                { title: 'Evaluate', description: 'Check quality and revise.' },
                { title: 'Done', description: 'Publish the blog post.' }
            ];
        }
    }

    changeAgentType(type) {
        this.agentType = type;
        this.agentStep = 0;
        this.drawFrame();
    }

    runAgent() {
        const steps = this.getAgentSteps();
        if (this.agentStep >= steps.length) {
            this.agentStep = 0;
        }
        this.agentStep++;
        this.drawFrame();
    }

    // ===========================================================
    // T3.2 - Gradient Descent Playground
    // ===========================================================
    // Visualizes a 1-D bowl-shaped loss landscape L(w) = 0.5 * (w - 1)^2 with
    // optional added curvature scaling, plus a small saddle "bump" near the
    // center to show why momentum helps. The user adjusts LR / momentum /
    // optimizer via the animation controls.
    gdState = {
        w: -2.5,           // current position on the weight axis
        v: 0,              // velocity (for momentum)
        adamM: 0,          // Adam first moment
        adamV: 0,          // Adam second moment
        epoch: 0,
        lossHistory: [],
        lr: 0.1,
        momentum: 0.9,
        optimizer: 'momentum',
        auto: false,
        autoInterval: null,
        beta1: 0.9, beta2: 0.999, eps: 1e-8
    };

    // Loss landscape: a quadratic bowl with a gentle saddle near w=0.
    _gdLoss(w) { return 0.5 * (w - 1) * (w - 1) + 0.05 * Math.cos(w * 3); }
    _gdGrad(w) { return (w - 1) - 0.15 * Math.sin(w * 3); }

    drawGradientDescent() {
        if (!this.ctx) return;
        const w = this.canvas.width;
        const h = this.canvas.height;
        const st = this.gdState;

        // Axes: weight axis mapped from [-3, 3] to canvas X.
        const wMin = -3, wMax = 3;
        const padX = 40, padY = 30;
        const xToPx = (wv) => padX + ((wv - wMin) / (wMax - wMin)) * (w - 2 * padX);
        // Loss axis mapped from [0, ~3] to canvas Y.
        const lossMax = 4;
        const yToPx = (lv) => (h - padY) - (lv / lossMax) * (h - 2 * padY);

        // Draw loss curve
        this.ctx.strokeStyle = '#475569';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        for (let x = 0; x <= w - 2 * padX; x++) {
            const wv = wMin + (x / (w - 2 * padX)) * (wMax - wMin);
            const lv = this._gdLoss(wv);
            const px = padX + x;
            const py = yToPx(Math.min(lv, lossMax));
            if (x === 0) this.ctx.moveTo(px, py);
            else this.ctx.lineTo(px, py);
        }
        this.ctx.stroke();

        // Axes labels
        this.ctx.fillStyle = '#94a3b8';
        this.ctx.font = '10px sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('weight (w)', w / 2, h - 8);
        this.ctx.save();
        this.ctx.translate(14, h / 2);
        this.ctx.rotate(-Math.PI / 2);
        this.ctx.fillText('loss L(w)', 0, 0);
        this.ctx.restore();

        // The optimum marker
        this.ctx.fillStyle = '#10b981';
        this.ctx.beginPath();
        this.ctx.arc(xToPx(1), yToPx(this._gdLoss(1)), 5, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.font = '10px sans-serif';
        this.ctx.fillText('optimum', xToPx(1), yToPx(this._gdLoss(1)) - 10);

        // The ball at current position
        this.ctx.fillStyle = '#3b82f6';
        this.ctx.beginPath();
        this.ctx.arc(xToPx(st.w), yToPx(Math.min(this._gdLoss(st.w), lossMax)), 10, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.strokeStyle = '#f8fafc';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(xToPx(st.w), yToPx(Math.min(this._gdLoss(st.w), lossMax)), 10, 0, Math.PI * 2);
        this.ctx.stroke();

        // Stats panel
        this.ctx.fillStyle = '#1e293b';
        this.ctx.fillRect(padX, padY, 180, 64);
        this.ctx.strokeStyle = '#475569';
        this.ctx.strokeRect(padX, padY, 180, 64);
        this.ctx.fillStyle = '#f8fafc';
        this.ctx.font = '11px monospace';
        this.ctx.textAlign = 'left';
        const loss = this._gdLoss(st.w).toFixed(4);
        this.ctx.fillText(`optimizer: ${st.optimizer}`, padX + 8, padY + 16);
        this.ctx.fillText(`lr: ${st.lr.toFixed(3)}  mom: ${st.momentum.toFixed(2)}`, padX + 8, padY + 30);
        this.ctx.fillText(`epoch: ${st.epoch}`, padX + 8, padY + 44);
        this.ctx.fillText(`w: ${st.w.toFixed(3)}, L: ${loss}`, padX + 8, padY + 58);

        // Loss history sparkline at the bottom right
        if (st.lossHistory.length > 1) {
            const sparkX = w - 200, sparkY = padY, sparkW = 160, sparkH = 30;
            this.ctx.strokeStyle = '#ec4899';
            this.ctx.lineWidth = 1.5;
            this.ctx.beginPath();
            const maxLoss = Math.max(...st.lossHistory, 0.001);
            st.lossHistory.forEach((lv, i) => {
                const px = sparkX + (i / (st.lossHistory.length - 1)) * sparkW;
                const py = sparkY + sparkH - (lv / maxLoss) * sparkH;
                if (i === 0) this.ctx.moveTo(px, py);
                else this.ctx.lineTo(px, py);
            });
            this.ctx.stroke();
            this.ctx.fillStyle = '#94a3b8';
            this.ctx.font = '9px sans-serif';
            this.ctx.textAlign = 'left';
            this.ctx.fillText('loss history', sparkX, sparkY - 4);
        }
    }

    // Take one gradient-descent step using the configured optimizer.
    stepGd() {
        const st = this.gdState;
        const g = this._gdGrad(st.w);

        if (st.optimizer === 'sgd') {
            st.w = st.w - st.lr * g;
        } else if (st.optimizer === 'momentum') {
            st.v = st.momentum * st.v - st.lr * g;
            st.w = st.w + st.v;
        } else if (st.optimizer === 'adam') {
            st.adamM = st.beta1 * st.adamM + (1 - st.beta1) * g;
            st.adamV = st.beta2 * st.adamV + (1 - st.beta2) * g * g;
            const mHat = st.adamM / (1 - Math.pow(st.beta1, st.epoch + 1));
            const vHat = st.adamV / (1 - Math.pow(st.beta2, st.epoch + 1));
            st.w = st.w - st.lr * mHat / (Math.sqrt(vHat) + st.eps);
        }
        // Clip to range so the ball doesn't run off-canvas
        st.w = Math.max(-2.99, Math.min(2.99, st.w));
        st.epoch++;
        st.lossHistory.push(this._gdLoss(st.w));
        if (st.lossHistory.length > 80) st.lossHistory.shift();
        this.drawFrame();
    }

    // Auto-run: step on a 300ms interval until close to optimum.
    toggleAutoGd() {
        const st = this.gdState;
        st.auto = !st.auto;
        if (st.auto) {
            const btn = document.getElementById('gdAutoBtn');
            if (btn) btn.textContent = '⏸ Stop';
            if (st.autoInterval) clearInterval(st.autoInterval);
            st.autoInterval = setInterval(() => {
                // Stop auto when convergence reached
                if (Math.abs(st.w - 1) < 0.01 || !st.auto) {
                    st.auto = false;
                    if (st.autoInterval) clearInterval(st.autoInterval);
                    if (btn) btn.textContent = '⏩ Auto';
                    return;
                }
                this.stepGd();
            }, 300);
        } else {
            if (st.autoInterval) clearInterval(st.autoInterval);
            const btn = document.getElementById('gdAutoBtn');
            if (btn) btn.textContent = '⏩ Auto';
        }
    }

    updateGdLearningRate(v) {
        this.gdState.lr = parseFloat(v);
        const el = document.getElementById('gdLrVal');
        if (el) el.textContent = parseFloat(v).toFixed(3);
        this.drawFrame();
    }

    updateGdMomentum(v) {
        this.gdState.momentum = parseFloat(v);
        const el = document.getElementById('gdMomentumVal');
        if (el) el.textContent = parseFloat(v).toFixed(2);
        this.drawFrame();
    }

    changeGdOptimizer(opt) {
        this.gdState.optimizer = opt;
        // Reset velocity / Adam moments when swapping optimizers
        this.gdState.v = 0;
        this.gdState.adamM = 0;
        this.gdState.adamV = 0;
        this.drawFrame();
    }

    resetGd() {
        this.gdState.w = -2.5;
        this.gdState.v = 0;
        this.gdState.adamM = 0;
        this.gdState.adamV = 0;
        this.gdState.epoch = 0;
        this.gdState.lossHistory = [];
        this.gdState.auto = false;
        if (this.gdState.autoInterval) clearInterval(this.gdState.autoInterval);
        const btn = document.getElementById('gdAutoBtn');
        if (btn) btn.textContent = '⏩ Auto';
        this.drawFrame();
    }

    // ===========================================================
    // T3.3 - Build a Transformer step-through
    // ===========================================================
    buildTransformerPhase = 0;
    buildTransformerPhases = [
        { name: 'Token Embedding', detail: 'Tokens -> d-dim vectors via lookup table', color: '#3b82f6' },
        { name: 'Positional Encoding', detail: 'Add sin/cos position signals so order matters', color: '#8b5cf6' },
        { name: 'Self-Attention', detail: 'Q,K,V projections -> softmax(QK^T/sqrt(d))V', color: '#10b981' },
        { name: 'Feed-Forward Network', detail: 'Two linear layers with ReLU in between', color: '#f97316' },
        { name: 'Stack N Layers', detail: 'Repeat attention + FFN N times; residual + LayerNorm', color: '#ec4899' }
    ];

    nextTransformerStep() {
        this.buildTransformerPhase = Math.min(this.buildTransformerPhases.length - 1, this.buildTransformerPhase + 1);
        this.drawFrame();
        this._updateBuildTransformerPhaseLabel();
    }

    prevTransformerStep() {
        this.buildTransformerPhase = Math.max(0, this.buildTransformerPhase - 1);
        this.drawFrame();
        this._updateBuildTransformerPhaseLabel();
    }

    _updateBuildTransformerPhaseLabel() {
        const el = document.getElementById('buildTransformerPhase');
        if (el) {
            const p = this.buildTransformerPhases[this.buildTransformerPhase];
            el.textContent = `Phase ${this.buildTransformerPhase + 1} of ${this.buildTransformerPhases.length}: ${p.name}`;
        }
    }

    drawBuildTransformer() {
        if (!this.ctx) return;
        const w = this.canvas.width;
        const h = this.canvas.height;
        const phases = this.buildTransformerPhases;
        const cur = this.buildTransformerPhase;

        // Title
        this.ctx.fillStyle = '#f8fafc';
        this.ctx.font = 'bold 14px sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Build a Transformer', w / 2, 22);

        // Stack of phase boxes from top to bottom, with the active one highlighted
        const boxW = 280;
        const boxH = 38;
        const startY = 50;
        const startYStep = boxH + 12;

        phases.forEach((p, i) => {
            const y = startY + i * startYStep;
            const x = (w - boxW) / 2;
            const isActive = i === cur;
            const isPast = i < cur;

            this.ctx.fillStyle = isActive ? p.color : (isPast ? '#1e293b' : '#334155');
            this.ctx.fillRect(x, y, boxW, boxH);
            this.ctx.strokeStyle = isActive ? '#f8fafc' : p.color;
            this.ctx.lineWidth = isActive ? 2 : 1;
            this.ctx.strokeRect(x, y, boxW, boxH);

            // Number circle
            this.ctx.fillStyle = isActive ? '#f8fafc' : p.color;
            this.ctx.beginPath();
            this.ctx.arc(x + 18, y + boxH / 2, 11, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.fillStyle = isActive ? p.color : '#0f172a';
            this.ctx.font = 'bold 11px sans-serif';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(String(i + 1), x + 18, y + boxH / 2 + 4);

            // Label
            this.ctx.fillStyle = isActive ? '#f8fafc' : (isPast ? '#cbd5e1' : '#94a3b8');
            this.ctx.font = isActive ? 'bold 12px sans-serif' : '11px sans-serif';
            this.ctx.textAlign = 'left';
            this.ctx.fillText(p.name, x + 36, y + 16);
            this.ctx.font = '9px sans-serif';
            this.ctx.fillStyle = isActive ? '#e2e8f0' : '#64748b';
            this.ctx.fillText(p.detail, x + 36, y + 28);

            // Arrow between boxes
            if (i < phases.length - 1) {
                this.ctx.strokeStyle = '#475569';
                this.ctx.lineWidth = 1;
                this.ctx.beginPath();
                this.ctx.moveTo(x + boxW / 2, y + boxH);
                this.ctx.lineTo(x + boxW / 2, y + boxH + 12);
                this.ctx.stroke();
            }
        });

        // Footer note once you reach the final phase
        if (cur === phases.length - 1) {
            this.ctx.fillStyle = '#10b981';
            this.ctx.font = '11px sans-serif';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('✓ A single transformer layer. Stack them and add residual + LayerNorm.', w / 2, h - 12);
        }
    }

    // ===========================================================
    // T3.4 - Bias Dashboard
    // ===========================================================
    // Generates synthetic per-slice accuracy data for a binary classifier
    // and visualizes slices with traffic-light alert styling.
    biasState = {
        slices: [],   // [{ name, size, accuracy, color }]
        thresholdGood: 0.90,
        thresholdWarn: 0.75
    };

    generateBiasData() {
        const names = ['Group A', 'Group B', 'Group C', 'Group D', 'Group E'];
        this.biasState.slices = names.map(name => ({
            name,
            size: 200 + Math.floor(Math.random() * 1800),
            accuracy: 0.55 + Math.random() * 0.45  // 0.55 - 1.00
        }));
        this.drawFrame();
    }

    adjustBiasThresholds() {
        // Cycle through preset threshold combos so the user can see what
        // "good" / "warn" levels do
        const presets = [
            { good: 0.90, warn: 0.75 },
            { good: 0.95, warn: 0.85 },
            { good: 0.80, warn: 0.60 },
            { good: 0.99, warn: 0.80 }
        ];
        this.biasState._presetIdx = ((this.biasState._presetIdx || 0) + 1) % presets.length;
        const p = presets[this.biasState._presetIdx];
        this.biasState.thresholdGood = p.good;
        this.biasState.thresholdWarn = p.warn;
        this.drawFrame();
    }

    _biasColor(accuracy) {
        if (accuracy >= this.biasState.thresholdGood) return '#10b981';
        if (accuracy >= this.biasState.thresholdWarn) return '#f97316';
        return '#ef4444';
    }

    drawBiasDashboard() {
        if (!this.ctx) return;
        const w = this.canvas.width;
        const h = this.canvas.height;

        if (this.biasState.slices.length === 0) {
            // Auto-generate on first draw so the panel isn't empty
            this.generateBiasData();
            return;
        }

        // Title
        this.ctx.fillStyle = '#f8fafc';
        this.ctx.font = 'bold 13px sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`Per-slice accuracy (good ≥ ${this.biasState.thresholdGood.toFixed(2)}, warn ≥ ${this.biasState.thresholdWarn.toFixed(2)})`, w / 2, 20);

        // Draw each slice as a horizontal bar
        const slices = this.biasState.slices;
        const barH = 28;
        const gap = 8;
        const startY = 40;
        const labelW = 80;
        const barX = labelW + 10;
        const barMaxW = w - barX - 140;

        slices.forEach((s, i) => {
            const y = startY + i * (barH + gap);
            const color = this._biasColor(s.accuracy);

            // Slice name
            this.ctx.fillStyle = '#cbd5e1';
            this.ctx.font = '11px sans-serif';
            this.ctx.textAlign = 'left';
            this.ctx.fillText(s.name, 8, y + barH / 2 + 4);

            // Bar background
            this.ctx.fillStyle = '#334155';
            this.ctx.fillRect(barX, y, barMaxW, barH);

            // Accuracy bar
            const barW = barMaxW * s.accuracy;
            this.ctx.fillStyle = color;
            this.ctx.fillRect(barX, y, barW, barH);
            this.ctx.strokeStyle = '#0f172a';
            this.ctx.lineWidth = 1;
            this.ctx.strokeRect(barX, y, barW, barH);

            // Threshold tick marks
            ['thresholdWarn', 'thresholdGood'].forEach((key, ti) => {
                const val = this.biasState[key];
                const x = barX + barMaxW * val;
                this.ctx.strokeStyle = ti === 0 ? '#f97316' : '#10b981';
                this.ctx.setLineDash([3, 3]);
                this.ctx.beginPath();
                this.ctx.moveTo(x, y);
                this.ctx.lineTo(x, y + barH);
                this.ctx.stroke();
                this.ctx.setLineDash([]);
            });

            // Accuracy label and size
            this.ctx.fillStyle = '#f8fafc';
            this.ctx.font = 'bold 11px monospace';
            this.ctx.textAlign = 'left';
            this.ctx.fillText(`${(s.accuracy * 100).toFixed(1)}%`, barX + barW + 6, y + barH / 2 + 4);
            this.ctx.fillStyle = '#94a3b8';
            this.ctx.font = '9px sans-serif';
            this.ctx.fillText(`(n=${s.size})`, w - 40, y + barH / 2 + 4);
        });

        // Footer: overall accuracy and worst-slice accuracy
        const overall = slices.reduce((s, x) => s + x.size * x.accuracy, 0) / slices.reduce((s, x) => s + x.size, 0);
        const worst = Math.min(...slices.map(s => s.accuracy));
        const gapOverallWorst = overall - worst;
        this.ctx.fillStyle = overall >= this.biasState.thresholdGood ? '#10b981' : (overall >= this.biasState.thresholdWarn ? '#f97316' : '#ef4444');
        this.ctx.font = '11px monospace';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`Overall: ${(overall * 100).toFixed(1)}%   Worst slice: ${(worst * 100).toFixed(1)}%   Gap: ${(gapOverallWorst * 100).toFixed(1)} pts`, 8, h - 12);
    }

    // ===========================================================
    // T3.6 - 2D Loss Landscape Contour
    // ===========================================================
    // L(w1, w2) = (w1 - 1)^2 + (w2 + 1.5)^2 - bivariate quadratic bowl
    _llLoss(w1, w2) { return Math.pow(w1 - 1, 2) + Math.pow(w2 + 1.5, 2); }
    _llGrad(w1, w2) { return [2 * (w1 - 1), 2 * (w2 + 1.5)]; }

    llState = {
        w: [-2.5, 2.0], // current position on the (w1, w2) loss surface
        v: [0, 0],
        adamM: [0, 0], adamV: [0, 0],
        epoch: 0,
        lr: 0.05,
        momentum: 0.9,
        optimizer: 'momentum',
        auto: false,
        autoInterval: null,
        beta1: 0.9, beta2: 0.999, eps: 1e-8,
        path: []  // trail of [w1, w2] positions
    };

    drawLossLandscape() {
        if (!this.ctx) return;
        const w = this.canvas.width;
        const h = this.canvas.height;
        const st = this.llState;
        const padX = 30, labelArea = 70, plotH = h - padX;

        // World → canvas map: w1 in [-3, 3] -> X; w2 in [-3, 3] -> Y (reversed so up is +w2)
        const wRange = [-3, 3];
        const toX = (v) => padX + ((v - wRange[0]) / (wRange[1] - wRange[0])) * (w - 2 * padX);
        const toY = (v) => plotH - ((v - wRange[0]) / (wRange[1] - wRange[0])) * (plotH - padX);

        // Draw contour lines
        const losses = [0.2, 0.5, 1, 2, 4, 8];
        const green = [16, 185, 129];
        const orange = [249, 115, 22];
        losses.forEach((L, idx) => {
            let t = idx / (losses.length - 1);
            const r = Math.round(green[0] + (orange[0] - green[0]) * t);
            const g = Math.round(green[1] + (orange[1] - green[1]) * t);
            const b = Math.round(green[2] + (orange[2] - green[2]) * t);
            this.ctx.strokeStyle = `rgba(${r},${g},${b},0.6)`;
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            // Fixed-L contour: (w1-1)^2 + (w2+1.5)^2 = L => circle radius sqrt(L)*scale; we draw it directly
            // Actually it's a circle centered at (1, -1.5) with radius sqrt(L)
            const cx = toX(1), cy = toY(-1.5);
            const rCanvas = Math.min(Math.sqrt(L) * (w - 4 * padX) / (wRange[1] - wRange[0]) / 2, 200);
            for (let a = 0; a <= 2 * Math.PI; a += 0.05) {
                const px = cx + Math.cos(a) * rCanvas;
                const py = cy + Math.sin(a) * rCanvas;
                if (a === 0) this.ctx.moveTo(px, py);
                else this.ctx.lineTo(px, py);
            }
            this.ctx.closePath();
            this.ctx.stroke();
            // Label
            this.ctx.fillStyle = `rgba(${r},${g},${b},0.9)`;
            this.ctx.font = '9px sans-serif';
            this.ctx.textAlign = 'left';
            this.ctx.fillText(`L=${L}`, cx + rCanvas * 0.71, cy - rCanvas * 0.71);
        });

        // Draw the path trail
        if (st.path.length > 1) {
            this.ctx.strokeStyle = 'rgba(244,114,182,0.7)';
            this.ctx.lineWidth = 1.5;
            this.ctx.beginPath();
            st.path.forEach((p, i) => {
                const px = toX(p[0]), py = toY(p[1]);
                if (i === 0) this.ctx.moveTo(px, py);
                else this.ctx.lineTo(px, py);
            });
            this.ctx.stroke();
        }

        // Draw the optimum
        this.ctx.fillStyle = '#10b981';
        this.ctx.beginPath();
        this.ctx.arc(toX(1), toY(-1.5), 5, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.fillStyle = '#cbd5e1';
        this.ctx.font = '9px sans-serif';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('optimum (1, -1.5)', toX(1) + 8, toY(-1.5));

        // Draw current position
        const curX = toX(st.w[0]), curY = toY(st.w[1]);
        this.ctx.fillStyle = '#3b82f6';
        this.ctx.beginPath();
        this.ctx.arc(curX, curY, 10, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.strokeStyle = '#f8fafc';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(curX, curY, 10, 0, Math.PI * 2);
        this.ctx.stroke();

        // Stats panel
        this.ctx.fillStyle = '#1e293b';
        this.ctx.fillRect(padX, padX, 200, 60);
        this.ctx.strokeStyle = '#475569';
        this.ctx.strokeRect(padX, padX, 200, 60);
        this.ctx.fillStyle = '#f8fafc';
        this.ctx.font = '11px monospace';
        this.ctx.textAlign = 'left';
        const loss = this._llLoss(st.w[0], st.w[1]).toFixed(4);
        this.ctx.fillText(`opt: ${st.optimizer}  lr: ${st.lr.toFixed(3)}`, padX + 8, padX + 16);
        this.ctx.fillText(`epoch: ${st.epoch}`, padX + 8, padX + 30);
        this.ctx.fillText(`w=(${st.w[0].toFixed(2)}, ${st.w[1].toFixed(2)})`, padX + 8, padX + 44);
        this.ctx.fillText(`L=${loss}`, padX + 8, padX + 58);

        // Axis labels
        this.ctx.fillStyle = '#94a3b8';
        this.ctx.font = '10px sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('w1', w / 2, h - 6);
        this.ctx.save();
        this.ctx.translate(12, plotH / 2);
        this.ctx.rotate(-Math.PI / 2);
        this.ctx.fillText('w2', 0, 0);
        this.ctx.restore();
    }

    stepLl() {
        const st = this.llState;
        const [g0, g1] = this._llGrad(st.w[0], st.w[1]);

        if (st.optimizer === 'sgd') {
            st.w[0] -= st.lr * g0;
            st.w[1] -= st.lr * g1;
        } else if (st.optimizer === 'momentum') {
            st.v[0] = st.momentum * st.v[0] - st.lr * g0;
            st.v[1] = st.momentum * st.v[1] - st.lr * g1;
            st.w[0] += st.v[0];
            st.w[1] += st.v[1];
        } else if (st.optimizer === 'adam') {
            st.adamM[0] = st.beta1 * st.adamM[0] + (1 - st.beta1) * g0;
            st.adamM[1] = st.beta1 * st.adamM[1] + (1 - st.beta1) * g1;
            st.adamV[0] = st.beta2 * st.adamV[0] + (1 - st.beta2) * g0 * g0;
            st.adamV[1] = st.beta2 * st.adamV[1] + (1 - st.beta2) * g1 * g1;
            const mHat0 = st.adamM[0] / (1 - Math.pow(st.beta1, st.epoch + 1));
            const mHat1 = st.adamM[1] / (1 - Math.pow(st.beta1, st.epoch + 1));
            const vHat0 = st.adamV[0] / (1 - Math.pow(st.beta2, st.epoch + 1));
            const vHat1 = st.adamV[1] / (1 - Math.pow(st.beta2, st.epoch + 1));
            st.w[0] -= st.lr * mHat0 / (Math.sqrt(vHat0) + st.eps);
            st.w[1] -= st.lr * mHat1 / (Math.sqrt(vHat1) + st.eps);
        }

        // Clip
        st.w[0] = Math.max(-2.99, Math.min(2.99, st.w[0]));
        st.w[1] = Math.max(-2.99, Math.min(2.99, st.w[1]));
        st.epoch++;
        st.path.push([st.w[0], st.w[1]]);
        if (st.path.length > 200) st.path.shift();
        this.drawFrame();
    }

    toggleAutoLl() {
        const st = this.llState;
        st.auto = !st.auto;
        const btn = event?.target;
        if (st.auto) {
            if (btn) btn.textContent = '⏸ Stop';
            if (st.autoInterval) clearInterval(st.autoInterval);
            st.autoInterval = setInterval(() => {
                const loss = this._llLoss(st.w[0], st.w[1]);
                if (loss < 0.005 || !st.auto) {
                    st.auto = false;
                    if (st.autoInterval) clearInterval(st.autoInterval);
                    if (btn) btn.textContent = '⏩ Auto';
                    return;
                }
                this.stepLl();
            }, 200);
        } else {
            if (st.autoInterval) clearInterval(st.autoInterval);
            if (btn) btn.textContent = '⏩ Auto';
        }
    }

    updateLlLearningRate(v) {
        this.llState.lr = parseFloat(v);
        const el = document.getElementById('llLrVal');
        if (el) el.textContent = parseFloat(v).toFixed(3);
        this.drawFrame();
    }

    changeLlOptimizer(opt) {
        this.llState.optimizer = opt;
        this.llState.v = [0, 0];
        this.llState.adamM = [0, 0];
        this.llState.adamV = [0, 0];
        this.drawFrame();
    }

    resetLl() {
        this.llState.w = [-2.5, 2.0];
        this.llState.v = [0, 0];
        this.llState.adamM = [0, 0];
        this.llState.adamV = [0, 0];
        this.llState.epoch = 0;
        this.llState.path = [];
        this.llState.auto = false;
        if (this.llState.autoInterval) clearInterval(this.llState.autoInterval);
        this.drawFrame();
    }

    // ===========================================================
    // Stop and reset
    // ===========================================================
    stopAnimation() {
        this.isAnimating = false;
        this.continuous = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        if (this._timelineInterval) {
            clearInterval(this._timelineInterval);
            this._timelineInterval = null;
        }
        // T3.2 - also stop the gradient-descent auto interval
        if (this.gdState && this.gdState.autoInterval) {
            clearInterval(this.gdState.autoInterval);
            this.gdState.autoInterval = null;
            this.gdState.auto = false;
        }
        // T3.6 - also stop the 2D loss-landscape auto interval
        if (this.llState && this.llState.autoInterval) {
            clearInterval(this.llState.autoInterval);
            this.llState.autoInterval = null;
            this.llState.auto = false;
        }
        this.timelinePlaying = false;
    }

    resetAnimation() {
        this.stopAnimation();

        // Reset animation-specific state
        switch(this.currentAnimation) {
            case 'ml-workflow':
                this.mlWorkflowStep = 0;
                break;
            case 'nn-visualizer':
                this.nnLayers = [3, 4, 2];
                this.nnActivations = ['relu', 'relu', 'softmax'];
                break;
            case 'classification-boundary':
                this.classPoints = this.generateClassPoints();
                break;
            case 'clustering-visualizer':
                this.clusterPoints = this.generateClusterPoints();
                this.clusterAssignments = [];
                break;
            case 'nn-trainer':
                this.nnTrainerLayers = [3, 5, 4, 2];
                this.nnTrainerEpoch = 0;
                this.nnTrainerLoss = 1.0;
                break;
            case 'ai-timeline':
                this.timelineIndex = 0;
                break;
            case 'llm-inference':
                this.llmTokens = [];
                this._showProbs = false;
                break;
            case 'agent-simulator':
                this.agentStep = 0;
                break;
            case 'gradient-descent':
                this.resetGd();
                // resetGd calls drawFrame(); we don't re-startAnimation to avoid a loop
                return;
            case 'loss-landscape':
                this.resetLl();
                return;
            case 'build-transformer':
                this.buildTransformerPhase = 0;
                this._updateBuildTransformerPhaseLabel();
                break;
            case 'bias-dashboard':
                this.biasState.slices = [];
                break;
        }

        this.startAnimation(this.currentAnimation, this.animationData);
        console.log('Animation reset');
    }
}

// Initialize animations
window.animations = new AIAnimations();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIAnimations;
}
