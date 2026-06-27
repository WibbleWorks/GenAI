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
            this.canvas.width = parent ? parent.clientWidth : 400;
            this.canvas.height = 300;
            if (this.isAnimating && this.currentAnimation) {
                this.drawFrame();
            }
        }
    }
    
    startAnimation(type, data = {}) {
        this.currentAnimation = type;
        this.animationData = data;
        this.isAnimating = true;
        
        // Clear previous animation
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        // Update controls
        this.updateControls(type);
        
        // Start new animation
        this.animate();
        
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
            <button class="btn-small" onclick="animations.stopAnimation()">⏹ Stop</button>
            <button class="btn-small" onclick="animations.resetAnimation()">🔄 Reset</button>
        `;
        
        switch(type) {
            case 'ai-timeline':
                return baseControls + `
                    <button class="btn-small" onclick="animations.playTimeline()">▶ Play</button>
                    <button class="btn-small" onclick="animations.pauseTimeline()">⏸ Pause</button>
                    <select id="eraSelector" onchange="animations.jumpToEra(this.value)">
                        <option value="1950">1950s</option>
                        <option value="1980">1980s</option>
                        <option value="2010">2010s</option>
                        <option value="2020">2020s</option>
                    </select>
                `;
            
            case 'ml-workflow':
                return baseControls + `
                    <button class="btn-small" onclick="animations.prevStep()">← Prev</button>
                    <button class="btn-small" onclick="animations.nextStep()">Next →</button>
                    <span id="stepCounter">Step 1</span>
                `;
            
            case 'nn-visualizer':
                return baseControls + `
                    <button class="btn-small" onclick="animations.addLayer()">+ Layer</button>
                    <select id="activationSelector" onchange="animations.changeActivation(this.value)">
                        <option value="relu">ReLU</option>
                        <option value="sigmoid">Sigmoid</option>
                        <option value="tanh">Tanh</option>
                    </select>
                    <button class="btn-small" onclick="animations.trainNetwork()">🚀 Train</button>
                `;
            
            case 'classification-boundary':
                return baseControls + `
                    <select id="classifierSelector" onchange="animations.changeClassifier(this.value)">
                        <option value="linear">Linear</option>
                        <option value="knn">K-NN</option>
                        <option value="svm">SVM</option>
                    </select>
                    <button class="btn-small" onclick="animations.addPoint()">+ Point</button>
                    <button class="btn-small" onclick="animations.showBoundary()">Show Boundary</button>
                `;
            
            case 'clustering-visualizer':
                return baseControls + `
                    <select id="clusteringSelector" onchange="animations.changeClustering(this.value)">
                        <option value="kmeans">K-Means</option>
                        <option value="dbscan">DBSCAN</option>
                    </select>
                    <button class="btn-small" onclick="animations.addClusterPoint()">+ Point</button>
                    <button class="btn-small" onclick="animations.runClustering()">Run Clustering</button>
                `;
            
            case 'nn-trainer':
                return baseControls + `
                    <button class="btn-small" onclick="animations.addNeuronLayer()">+ Layer</button>
                    <select id="nnActivationSelector" onchange="animations.changeNNActivation(this.value)">
                        <option value="relu">ReLU</option>
                        <option value="sigmoid">Sigmoid</option>
                    </select>
                    <input type="range" id="learningRateSlider" min="0.001" max="0.1" step="0.001" value="0.01" onchange="animations.updateLearningRate(this.value)">
                    <button class="btn-small" onclick="animations.trainNN()">Train</button>
                `;
            
            case 'transformer-visualizer':
                return baseControls + `
                    <input type="range" id="layerSlider" min="1" max="12" value="6" onchange="animations.updateTransformerLayers(this.value)">
                    <input type="range" id="headSlider" min="1" max="16" value="8" onchange="animations.updateAttentionHeads(this.value)">
                    <button class="btn-small" onclick="animations.showAttention()">Show Attention</button>
                `;
            
            case 'llm-inference':
                return baseControls + `
                    <button class="btn-small" onclick="animations.generateToken()">Generate Token</button>
                    <input type="text" id="promptInput" placeholder="Enter prompt..." onchange="animations.updatePrompt(this.value)">
                    <button class="btn-small" onclick="animations.showProbabilities()">Show Probs</button>
                `;
            
            case 'agent-simulator':
                return baseControls + `
                    <select id="agentTypeSelector" onchange="animations.changeAgentType(this.value)">
                        <option value="simple">Simple Agent</option>
                        <option value="memory">Memory Agent</option>
                        <option value="planning">Planning Agent</option>
                    </select>
                    <button class="btn-small" onclick="animations.runAgent()">Run Agent</button>
                `;
            
            default:
                return baseControls;
        }
    }
    
    addControlListeners() {
        // Common listeners will be handled by onclick in the HTML
    }
    
    animate() {
        if (!this.isAnimating) return;
        
        this.drawFrame();
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
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
    
    // AI Timeline Animation
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
            { name: 'Birth of AI', year: '1950-1956', color: '#10b981', events: ['Turing Test', 'Dartmouth Conference'] },
            { name: 'Golden Years', year: '1956-1974', color: '#3b82f6', events: ['LISP', 'ELIZA', 'Perceptron'] },
            { name: 'AI Winter', year: '1974-1980', color: '#ef4444', events: ['Funding cuts'] },
            { name: 'Expert Systems', year: '1980-1987', color: '#f97316', events: ['Rule-based systems'] },
            { name: 'ML Era', year: '1987-2010', color: '#8b5cf6', events: ['SVM', 'Neural Nets'] },
            { name: 'Deep Learning', year: '2010-2016', color: '#06b6d4', events: ['AlexNet', 'GPUs', 'Big Data'] },
            { name: 'AI Renaissance', year: '2016-Present', color: '#ec4899', events: ['AlphaGo', 'Transformers', 'LLMs', 'GenAI'] }
        ];
        
        const eraWidth = (width - 2 * padding) / eras.length;
        
        eras.forEach((era, index) => {
            const x = padding + index * eraWidth;
            const y = height / 2;
            
            // Draw era marker
            this.ctx.fillStyle = era.color;
            this.ctx.beginPath();
            this.ctx.arc(x, y, 8, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Draw era label
            this.ctx.fillStyle = '#f8fafc';
            this.ctx.font = '12px sans-serif';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(era.year, x, y - 20);
            
            this.ctx.font = '10px sans-serif';
            this.ctx.fillText(era.name, x, y + 15);
        });
    }
    
    // ML Workflow Animation
    mlWorkflowStep = 0;
    mlWorkflowSteps = [
        { name: 'Problem Definition', icon: '🎯' },
        { name: 'Data Collection', icon: '📊' },
        { name: 'Data Preprocessing', icon: '🧹' },
        { name: 'Model Selection', icon: '🤖' },
        { name: 'Training', icon: '🏋️' },
        { name: 'Evaluation', icon: '📈' },
        { name: 'Deployment', icon: '🚀' },
        { name: 'Monitoring', icon: '👁️' }
    ];
    
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
        }
    }
    
    prevStep() {
        if (this.currentAnimation === 'ml-workflow') {
            this.mlWorkflowStep = (this.mlWorkflowStep - 1 + this.mlWorkflowSteps.length) % this.mlWorkflowSteps.length;
            const stepCounter = document.getElementById('stepCounter');
            if (stepCounter) {
                stepCounter.textContent = `Step ${this.mlWorkflowStep + 1}`;
            }
        }
    }
    
    // Neural Network Visualizer
    nnLayers = [3, 4, 2]; // Input, Hidden, Output
    nnActivations = ['relu', 'relu', 'softmax'];
    nnWeights = [];
    
    drawNNVisualizer() {
        if (!this.ctx) return;
        
        const width = this.canvas.width;
        const height = this.canvas.height;
        const layerSpacing = width / (this.nnLayers.length + 1);
        const neuronSpacing = height / Math.max(...this.nnLayers);
        
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
            this.ctx.fillText(layerNames[l] || `Layer ${l}`, x, height - 20);
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
        if (this.currentAnimation === 'nn-visualizer') {
            this.nnLayers.splice(this.nnLayers.length - 1, 0, 4);
            this.nnActivations.splice(this.nnActivations.length - 1, 0, 'relu');
        }
    }
    
    changeActivation(activation) {
        if (this.currentAnimation === 'nn-visualizer' && this.nnLayers.length > 0) {
            const layerIndex = this.nnLayers.length - 2;
            if (layerIndex >= 0) {
                this.nnActivations[layerIndex] = activation;
            }
        }
    }
    
    trainNetwork() {
        if (this.currentAnimation === 'nn-visualizer') {
            // Simulate training animation
            console.log('Training network...');
        }
    }
    
    // Stop and reset
    stopAnimation() {
        this.isAnimating = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        console.log('Animation stopped');
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
