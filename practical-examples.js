// Generative AI & Machine Learning Course - Practical Examples & Interactive Sessions
// ================================================================================
// Hands-on AI/ML library/framework exploration with local and cloud environments

// Check if COURSE_DATA exists
if (typeof COURSE_DATA === 'undefined') {
    console.error('ERROR: COURSE_DATA not loaded. Please load course-data.js first.');
} else {
    
    // =========================================================================
    // UTILITY: Create code block with syntax highlighting
    // =========================================================================
    function createCodeBlock(code, language = 'python', caption = '') {
        return `
            <div class="code-example" style="margin: 1rem 0; border-left: 4px solid var(--ai-purple);">
                ${caption ? `<div class="code-caption" style="background: var(--surface-light); padding: 0.5rem; border-radius: 4px 4px 0 0; font-size: 0.875rem; color: var(--text-muted);">${caption}</div>` : ''}
                <pre style="margin: 0; padding: 1rem; background: var(--code-bg); border-radius: 0 4px 4px 0; overflow-x: auto; font-size: 0.875rem;"><code class="language-${language}">${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>
            </div>
        `;
    }
    
    // =========================================================================
    // AI/ML LIBRARY SETUP GUIDES
    // =========================================================================
    const LIBRARY_GUIDES = {
        scikit_learn: {
            name: 'scikit-learn',
            description: 'Classic ML library for Python',
            installation: 'pip install scikit-learn',
            helloWorld: createCodeBlock(`
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

# Load dataset
iris = load_iris()
X, y = iris.data, iris.target

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# Train model
model = RandomForestClassifier()
model.fit(X_train, y_train)

# Predict
predictions = model.predict(X_test)
print(f"Accuracy: {accuracy_score(y_test, predictions):.2f}")
            `, 'python', 'scikit-learn: Iris Classification')
        },
        tensorflow: {
            name: 'TensorFlow',
            description: 'Deep learning framework by Google',
            installation: 'pip install tensorflow',
            helloWorld: createCodeBlock(`
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense

# Create a simple neural network
model = Sequential([
    Dense(128, activation='relu', input_shape=(10,)),
    Dense(64, activation='relu'),
    Dense(1, activation='sigmoid')
])

# Compile
model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])

# Train (with dummy data)
import numpy as np
X_train = np.random.random((100, 10))
y_train = np.random.randint(0, 2, 100)

model.fit(X_train, y_train, epochs=5, batch_size=16)

# Evaluate
loss, accuracy = model.evaluate(X_train, y_train)
print(f"Test accuracy: {accuracy:.2f}")
            `, 'python', 'TensorFlow: Simple Neural Network')
        },
        pytorch: {
            name: 'PyTorch',
            description: 'Deep learning framework by Meta',
            installation: 'pip install torch torchvision',
            helloWorld: createCodeBlock(`
import torch
import torch.nn as nn
import torch.optim as optim

# Define a neural network
class SimpleNN(nn.Module):
    def __init__(self):
        super().__init__()
        self.fc1 = nn.Linear(10, 128)
        self.fc2 = nn.Linear(128, 64)
        self.fc3 = nn.Linear(64, 1)
        
    def forward(self, x):
        x = torch.relu(self.fc1(x))
        x = torch.relu(self.fc2(x))
        return torch.sigmoid(self.fc3(x))

# Create model
model = SimpleNN()

# Define loss and optimizer
criterion = nn.BCELoss()
optimizer = optim.Adam(model.parameters(), lr=0.001)

# Train (with dummy data)
X = torch.randn(100, 10)
y = torch.randint(0, 2, (100,)).float().view(-1, 1)

for epoch in range(5):
    optimizer.zero_grad()
    outputs = model(X)
    loss = criterion(outputs, y)
    loss.backward()
    optimizer.step()
    print(f"Epoch {epoch+1}, Loss: {loss.item():.4f}")
            `, 'python', 'PyTorch: Simple Neural Network')
        },
        transformers: {
            name: 'HuggingFace Transformers',
            description: 'State-of-the-art NLP models',
            installation: 'pip install transformers',
            helloWorld: createCodeBlock(`
from transformers import pipeline

# Text classification
classifier = pipeline("text-classification", model="distilbert-base-uncased-finetuned-sst-2-english")
result = classifier("I love this course!")
print(f"Sentiment: {result[0]['label']}, Confidence: {result[0]['score']:.2f}")

# Text generation
generator = pipeline("text-generation", model="gpt2")
result = generator("The future of AI is", max_length=50)
print(f"Generated: {result[0]['generated_text']}")

# Question answering
qa = pipeline("question-answering", model="distilbert-base-cased-distilled-squad")
result = qa(
    question="What is AI?",
    context="Artificial Intelligence is the simulation of human intelligence by machines."
)
print(f"Answer: {result['answer']}")
            `, 'python', 'HuggingFace: NLP Pipelines')
        },
        langchain: {
            name: 'LangChain',
            description: 'LLM application development framework',
            installation: 'pip install langchain',
            helloWorld: createCodeBlock(`
from langchain.llms import OpenAI
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate

# Set up OpenAI (requires OPENAI_API_KEY environment variable)
llm = OpenAI(temperature=0.9)

# Create a simple chain
prompt = PromptTemplate(
    input_variables=["product"],
    template="What is a good name for a company that makes {product}?"
)
chain = LLMChain(llm=llm, prompt=prompt)

# Run
result = chain.run(product="AI-powered learning platforms")
print(f"Company name suggestion: {result}")
            `, 'python', 'LangChain: Simple Chain')
        }
    };
    
    // =========================================================================
    // CLOUD ENVIRONMENT SETUP GUIDES
    // =========================================================================
    const CLOUD_GUIDES = {
        colab: {
            name: 'Google Colab',
            description: 'Free cloud-based Jupyter notebooks',
            setup: `
                <h4>Google Colab Setup</h4>
                <p><strong>Access:</strong> <a href="https://colab.research.google.com" target="_blank" style="color: var(--ai-blue);">colab.research.google.com</a></p>
                <p><strong>Features:</strong></p>
                <ul>
                    <li>Free GPU/TPU access</li>
                    <li>Pre-installed ML libraries</li>
                    <li>Easy file sharing</li>
                    <li>Cloud storage integration</li>
                </ul>
                <p><strong>Hardware:</strong> Free T4 GPU, paid A100/TPU</p>
            `,
            example: createCodeBlock(`
# Run this in Google Colab
!pip install transformers torch

from transformers import pipeline

# Load model
classifier = pipeline("text-classification")

# Use model
result = classifier("I love using Colab!")
print(result)
            `, 'python', 'Colab Example')
        },
        sagemaker: {
            name: 'Amazon SageMaker',
            description: 'AWS machine learning platform',
            setup: `
                <h4>Amazon SageMaker Setup</h4>
                <p><strong>Installation:</strong></p>
                <pre>pip install sagemaker</pre>
                <p><strong>Configuration:</strong></p>
                <pre>import sagemaker
sagemaker.Session()</pre>
                <p><strong>Features:</strong></p>
                <ul>
                    <li>Managed Jupyter notebooks</li>
                    <li>Built-in ML algorithms</li>
                    <li>Automated model training</li>
                    <li>Scalable deployment</li>
                </ul>
            `,
            example: createCodeBlock(`
import sagemaker
from sagemaker import get_execution_role

# Initialize
sagemaker_session = sagemaker.Session()
role = get_execution_role()

# Create estimator
from sagemaker.sklearn.estimator import SKLearn
estimator = SKLearn(
    entry_script='train.py',
    role=role,
    instance_count=1,
    instance_type='ml.m5.large'
)

# Train
estimator.fit({'train': 's3://bucket/train', 'test': 's3://bucket/test'})
            `, 'python', 'SageMaker Training')
        },
        vertex: {
            name: 'Google Vertex AI',
            description: 'Google Cloud ML platform',
            setup: `
                <h4>Vertex AI Setup</h4>
                <p><strong>Installation:</strong></p>
                <pre>pip install google-cloud-aiplatform</pre>
                <p><strong>Authentication:</strong></p>
                <pre>gcloud auth application-default login</pre>
                <p><strong>Features:</strong></p>
                <ul>
                    <li>AutoML for custom training</li>
                    <li>Pre-trained API models</li>
                    <li>Vertex AI Workbench</li>
                    <li>Model deployment and prediction</li>
                </ul>
            `,
            example: createCodeBlock(`
from google.cloud import aiplatform

# Initialize
aiplatform.init(project="your-project-id", location="us-central1")

# Create training job
training_input = {"scale_tier": "CUSTOM", "master_machine_type": "n1-standard-4"}
job = aiplatform.CustomTrainingJob(
    display_name="my-training-job",
    script_path="train.py",
    container_uri="gcr.io/cloud-aiplatform/training/pytorch-gpu.1-9"
)

job.run(training_input)
            `, 'python', 'Vertex AI Training')
        },
        azure_ml: {
            name: 'Azure Machine Learning',
            description: 'Microsoft cloud ML platform',
            setup: `
                <h4>Azure ML Setup</h4>
                <p><strong>Installation:</strong></p>
                <pre>pip install azureml-core</pre>
                <p><strong>Configuration:</strong></p>
                <pre>from azureml.core import Workspace
ws = Workspace.from_config()</pre>
                <p><strong>Features:</strong></p>
                <ul>
                    <li>Managed compute resources</li>
                    <li>Automated ML</li>
                    <li>Azure ML Designer (drag-and-drop)</li>
                    <li>MLOps pipelines</li>
                </ul>
            `,
            example: createCodeBlock(`
from azureml.core import Workspace, Experiment, ScriptRunConfig

# Get workspace
ws = Workspace.from_config()

# Create experiment
experiment = Experiment(workspace=ws, name='my-experiment')

# Create run config
config = ScriptRunConfig(
    source_directory='./src',
    script='train.py',
    compute_target='cpu-cluster'
)

# Submit run
experiment.submit(config)
            `, 'python', 'Azure ML Training')
        }
    };
    
    // =========================================================================
    // QUANTUM-AI LIBRARY SETUP GUIDES
    // =========================================================================
    const QUANTUM_LIBRARY_GUIDES = {
        qiskit: {
            name: 'Qiskit',
            description: 'IBM open-source quantum framework for AI/ML integration',
            installation: 'pip install qiskit qiskit-aer qiskit-machine-learning',
            helloWorld: createCodeBlock(`
from qiskit import QuantumCircuit, Aer, execute
from qiskit.circuit.library import ZZFeatureMap, RealAmplitudes
from qiskit_machine_learning.algorithms import QSVC
from qiskit_machine_learning.kernels import QuantumKernel

# Quantum Machine Learning with Qiskit
# Create feature map and variational form
feature_map = ZZFeatureMap(feature_dimension=2, reps=2)
var_form = RealAmplitudes(2, reps=1)

# Create quantum kernel
backend = Aer.get_backend('statevector_simulator')
kernel = QuantumKernel(feature_map=feature_map, quantum_instance=backend)

# Train QSVM classifier
qsvc = QSVC(quantum_kernel=kernel)
print("✓ Qiskit Machine Learning ready!")
            `, 'python', 'Qiskit: Quantum Machine Learning'),
            aiIntegration: `Qiskit Machine Learning provides quantum kernels for SVM classification, quantum neural networks, and quantum feature maps for enhancing classical AI models.`
        },
        pennylane: {
            name: 'PennyLane',
            description: 'Xanadu quantum machine learning framework',
            installation: 'pip install pennylane pennylane-lightning torch',
            helloWorld: createCodeBlock(`
import pennylane as qml
import torch
import torch.nn as nn

# Hybrid Quantum-Classical Neural Network
dev = qml.device("lightning.qubit", wires=4)

@qml.qnode(dev, interface="torch")
def quantum_circuit(inputs, weights):
    # Encode classical data into quantum state
    for i in range(4):
        qml.RY(inputs[i] * torch.pi, wires=i)
    
    # Variational layers
    for i in range(4):
        qml.RY(weights[i], wires=i)
    
    for i in range(3):
        qml.CNOT(wires=[i, i+1])
    
    return [qml.expval(qml.PauliZ(i)) for i in range(4)]

# Create hybrid model
class HybridModel(nn.Module):
    def __init__(self):
        super().__init__()
        self.qlayer = qml.qnn.TorchLayer(quantum_circuit, weight_shapes={"weights": 4})
        self.classical = nn.Linear(4, 2)
    
    def forward(self, x):
        return self.classical(self.qlayer(x))

model = HybridModel()
print("✓ PennyLane Hybrid Quantum Neural Network ready!")
            `, 'python', 'PennyLane: Hybrid Quantum Neural Network'),
            aiIntegration: `PennyLane enables seamless integration of quantum circuits as layers in classical deep learning models, supporting PyTorch, TensorFlow, and JAX.`
        },
        tensorflow_quantum: {
            name: 'TensorFlow Quantum',
            description: 'Google quantum machine learning library',
            installation: 'pip install tensorflow-quantum cirq',
            helloWorld: createCodeBlock(`
import tensorflow as tf
import tensorflow_quantum as tfq
import cirq

# Quantum Neural Network with TensorFlow Quantum
# Define quantum circuit
qubits = cirq.GridQubit.rect(1, 4)
circuit = cirq.Circuit(
    cirq.X.on_each(*qubits),
    cirq.H.on_each(*qubits),
    cirq.CNOT(qubits[0], qubits[1]),
    cirq.CNOT(qubits[2], qubits[3]),
    cirq.measure(*qubits, key='result')
)

# Create quantum layer
quantum_layer = tfq.layers.PQC(
    circuit,
    readout_operators=[cirq.Z(qubits[0]) * cirq.X(qubits[1])]
)

# Build hybrid model
model = tf.keras.Sequential([
    tf.keras.layers.Input(shape=(), dtype=tf.string),
    tfq.layers.ControlledPQC(circuit, cirq.Z(qubits[0])),
    tf.keras.layers.Dense(2, activation='softmax')
])

print("✓ TensorFlow Quantum Hybrid Model ready!")
            `, 'python', 'TensorFlow Quantum: Hybrid QNN'),
            aiIntegration: `TensorFlow Quantum integrates with TensorFlow to create hybrid quantum-classical models for machine learning tasks.`
        },
        cirq: {
            name: 'Cirq',
            description: 'Google quantum framework for NISQ devices with AI applications',
            installation: 'pip install cirq',
            helloWorld: createCodeBlock(`
import cirq
import numpy as np

# Quantum circuit for AI data processing
q0, q1, q2 = cirq.LineQubit.range(3)

# Quantum feature embedding circuit
circuit = cirq.Circuit(
    # Encode classical data
    cirq.rx(np.pi * 0.5).on(q0),
    cirq.ry(np.pi * 0.3).on(q1),
    cirq.rz(np.pi * 0.7).on(q2),
    
    # Entangle qubits for feature correlation
    cirq.CNOT(q0, q1),
    cirq.CNOT(q1, q2),
    
    # Measure
    cirq.measure(q0, q1, q2, key='features')
)

# Simulate
simulator = cirq.Simulator()
result = simulator.run(circuit, repetitions=100)
print("Quantum feature embedding:", result.histogram(key='features'))
            `, 'python', 'Cirq: Quantum Feature Embedding'),
            aiIntegration: `Cirq can be used for quantum feature engineering, quantum data encoding, and as a backend for TensorFlow Quantum.`
        }
    };
    
    // =========================================================================
    // QUANTUM CLOUD PLATFORMS
    // =========================================================================
    const QUANTUM_CLOUD_GUIDES = {
        ibm_quantum: {
            name: 'IBM Quantum',
            description: 'IBM cloud-based quantum computing platform',
            setup: `
                <h4>IBM Quantum Setup</h4>
                <p><strong>Access:</strong> <a href="https://quantum-computing.ibm.com" target="_blank" style="color: var(--ai-blue);">quantum-computing.ibm.com</a></p>
                <p><strong>Installation:</strong></p>
                <pre>pip install qiskit qiskit-ibmq-provider</pre>
                <p><strong>Authentication:</strong></p>
                <pre>from qiskit_ibm_provider import IBMProvider
provider = IBMProvider()
backend = provider.get_backend('ibmq_quito')</pre>
                <p><strong>Features:</strong></p>
                <ul>
                    <li>Free access to real quantum computers</li>
                    <li>Qiskit Runtime for optimized execution</li>
                    <li>Quantum Machine Learning services</li>
                    <li>Hybrid quantum-classical workflows</li>
                </ul>
            `,
            example: createCodeBlock(`
from qiskit import QuantumCircuit, transpile
from qiskit_ibm_provider import IBMProvider

# Connect to IBM Quantum
provider = IBMProvider()
backend = provider.get_backend('ibmq_quito')

# Create and run circuit
qc = QuantumCircuit(2, 2)
qc.h(0)
qc.cx(0, 1)
qc.measure([0, 1], [0, 1])

# Transpile for real hardware
transpiled = transpile(qc, backend=backend)
job = backend.run(transpiled, shots=1024)
result = job.result()
print("IBM Quantum results:", result.get_counts())
            `, 'python', 'IBM Quantum: Real Hardware Execution')
        },
        amazon_braket: {
            name: 'Amazon Braket',
            description: 'AWS quantum computing service',
            setup: `
                <h4>Amazon Braket Setup</h4>
                <p><strong>Access:</strong> <a href="https://aws.amazon.com/braket" target="_blank" style="color: var(--ai-blue);">aws.amazon.com/braket</a></p>
                <p><strong>Installation:</strong></p>
                <pre>pip install amazon-braket-sdk</pre>
                <p><strong>Features:</strong></p>
                <ul>
                    <li>Multiple quantum hardware providers</li>
                    <li>Hybrid quantum-classical algorithms</li>
                    <li>AWS integration with S3, Lambda, etc.</li>
                    <li>Quantum machine learning tools</li>
                </ul>
            `,
            example: createCodeBlock(`
from braket.circuits import Circuit
from braket.devices import LocalSimulator

# Create quantum circuit
device = LocalSimulator()
circuit = Circuit().h(0).cnot(0, 1).measure([0, 1])

# Run simulation
task = device.run(circuit, shots=1024)
result = task.result()
print("Braket results:", result.measurement_counts)
            `, 'python', 'Amazon Braket: Hybrid Algorithm')
        },
        google_quantum: {
            name: 'Google Quantum AI',
            description: 'Google cloud quantum computing platform',
            setup: `
                <h4>Google Quantum AI Setup</h4>
                <p><strong>Access:</strong> <a href="https://quantumai.google" target="_blank" style="color: var(--ai-blue);">quantumai.google</a></p>
                <p><strong>Installation:</strong></p>
                <pre>pip install cirq google-cloud-cirq</pre>
                <p><strong>Features:</strong></p>
                <ul>
                    <li>Sycamore processor access</li>
                    <li>Cirq framework for NISQ devices</li>
                    <li>TensorFlow Quantum integration</li>
                    <li>Quantum machine learning research</li>
                </ul>
            `,
            example: createCodeBlock(`
import cirq
from cirq.google import Engine, QuantumEngineProcessor

# Connect to Google Quantum AI
engine = Engine(project_id='your-project-id')
processor = QuantumEngineProcessor(processor_id='rainbow')

# Create circuit
qubits = cirq.LineQubit.range(2)
circuit = cirq.Circuit(cirq.H(qubits[0]), cirq.CNOT(qubits[0], qubits[1]), cirq.measure(*qubits))

# Run on quantum engine
result = engine.run(circuit=circuit, processor=processor, repetitions=1024)
print("Google Quantum results:", result.histogram(key='result'))
            `, 'python', 'Google Quantum AI: Sycamore Processor')
        },
        azure_quantum: {
            name: 'Azure Quantum',
            description: 'Microsoft cloud quantum computing platform',
            setup: `
                <h4>Azure Quantum Setup</h4>
                <p><strong>Access:</strong> <a href="https://azure.microsoft.com/en-us/products/quantum" target="_blank" style="color: var(--ai-blue);">azure.microsoft.com/products/quantum</a></p>
                <p><strong>Installation:</strong></p>
                <pre>pip install azure-quantum qiskit</pre>
                <p><strong>Features:</strong></p>
                <ul>
                    <li>Multiple quantum hardware partners</li>
                    <li>Q# language support</li>
                    <li>Integration with Azure ML</li>
                    <li>Hybrid quantum-classical workflows</li>
                </ul>
            `,
            example: createCodeBlock(`
from azure.quantum import Workspace
from qiskit import QuantumCircuit

# Connect to Azure Quantum
workspace = Workspace(resource_uri="your-resource-uri", location="eastus")

# Create circuit
qc = QuantumCircuit(2, 2)
qc.h(0)
qc.cx(0, 1)
qc.measure([0, 1], [0, 1])

# Submit to Azure Quantum
job = workspace.run(qc, "ibm-simulator", shots=1024)
result = job.result()
print("Azure Quantum results:", result.get_counts())
            `, 'python', 'Azure Quantum: Multi-Provider Access')
        }
    };
    
    // =========================================================================
    // INTERACTIVE LAB SYSTEM
    // =========================================================================
    class AILab {
        constructor() {
            this.currentEnvironment = 'local';
        }
        
        async runCode(code, language = 'python') {
            // Simulate execution delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Return mock results based on code type
            if (code.includes('sklearn')) {
                return {
                    success: true,
                    output: "✓ scikit-learn Model Trained!\n\nAccuracy: 0.97\nPrecision: 0.98\nRecall: 0.96\nF1 Score: 0.97\n\nModel: RandomForestClassifier(n_estimators=100)"
                };
            } else if (code.includes('tensorflow') || code.includes('keras')) {
                return {
                    success: true,
                    output: "✓ TensorFlow Model Trained!\n\nEpoch 1/5: Loss: 0.45, Accuracy: 0.82\nEpoch 2/5: Loss: 0.21, Accuracy: 0.91\nEpoch 3/5: Loss: 0.12, Accuracy: 0.96\nEpoch 4/5: Loss: 0.08, Accuracy: 0.98\nEpoch 5/5: Loss: 0.05, Accuracy: 0.99\n\nFinal Test Accuracy: 0.97"
                };
            } else if (code.includes('transformers') || code.includes('pipeline')) {
                return {
                    success: true,
                    output: "✓ Transformers Pipeline Executed!\n\nTask: Text Classification\nInput: 'I love this course!'\nOutput: [{'label': 'POSITIVE', 'score': 0.9987}]\n\nModel: distilbert-base-uncased-finetuned-sst-2-english"
                };
            } else if (code.includes('qiskit')) {
                return {
                    success: true,
                    output: "✓ Qiskit Quantum Circuit Executed!\n\nCircuit: Bell State (2 qubits)\nBackend: Aer Simulator\nShots: 1024\nResults: {'00': 512, '11': 512}\n\n✓ Quantum entanglement verified!"
                };
            } else if (code.includes('pennylane') || code.includes('qml')) {
                return {
                    success: true,
                    output: "✓ PennyLane Quantum Circuit Executed!\n\nDevice: Lightning Simulator\nWires: 4\nParameters: 4\nExpectation values: [0.87, -0.23, 0.65, -0.12]\n\n✓ Hybrid quantum-classical computation complete!"
                };
            } else if (code.includes('tensorflow_quantum') || code.includes('tfq')) {
                return {
                    success: true,
                    output: "✓ TensorFlow Quantum Model Trained!\n\nCircuit: PQC with 4 qubits\nBackend: Cirq Simulator\nBatch Size: 32\nEpoch 1/3: Quantum Loss: 0.45\nEpoch 2/3: Quantum Loss: 0.21\nEpoch 3/3: Quantum Loss: 0.12\n\n✓ Hybrid quantum-classical model converged!"
                };
            } else if (code.includes('cirq')) {
                return {
                    success: true,
                    output: "✓ Cirq Circuit Executed!\n\nCircuit: 3 qubits with entanglement\nDevice: Simulator\nRepetitions: 100\nResults: {'000': 12, '001': 15, '010': 18, '011': 14, '100': 11, '101': 13, '110': 10, '111': 17}\n\n✓ Quantum feature embedding successful!"
                };
            } else if (code.includes('braket')) {
                return {
                    success: true,
                    output: "✓ Amazon Braket Circuit Executed!\n\nDevice: Local Simulator\nCircuit: Bell State\nShots: 1024\nResults: {'00': 508, '11': 516}\n\n✓ Quantum computation on AWS complete!"
                };
            } else {
                return { success: true, output: "✓ Code executed successfully!" };
            }
        }
        
        createInteractiveLab() {
            return `
                <div class="ai-lab" style="margin: 2rem 0; padding: 1.5rem; background: var(--surface-light); border-radius: 8px; border: 1px solid var(--border-color);">
                    <h3 style="color: var(--ai-blue); margin-bottom: 1rem;">💻 Interactive AI Lab</h3>
                    <div class="lab-environment" style="display: flex; gap: 1rem; margin-bottom: 1rem; flex-wrap: wrap;">
                        <select id="labEnvironment" style="padding: 0.5rem; border-radius: 4px; border: 1px solid var(--border-color); background: var(--surface-color); color: var(--text-primary);">
                            <option value="local">💾 Local</option>
                            <option value="colab">☁️ Google Colab</option>
                            <option value="sagemaker">☁️ SageMaker</option>
                            <option value="vertex">☁️ Vertex AI</option>
                            <option value="ibm_quantum">⚛️ IBM Quantum</option>
                            <option value="braket">⚛️ Amazon Braket</option>
                            <option value="google_quantum">⚛️ Google Quantum</option>
                            <option value="azure_quantum">⚛️ Azure Quantum</option>
                        </select>
                        <select id="labLibrary" style="padding: 0.5rem; border-radius: 4px; border: 1px solid var(--border-color); background: var(--surface-color); color: var(--text-primary);">
                            <option value="scikit_learn">🧮 scikit-learn</option>
                            <option value="tensorflow">🤖 TensorFlow</option>
                            <option value="pytorch">⚡ PyTorch</option>
                            <option value="transformers">🨄 Transformers</option>
                            <option value="langchain">🔗 LangChain</option>
                            <option value="qiskit">⚛️ Qiskit</option>
                            <option value="pennylane">⚛️ PennyLane</option>
                            <option value="tensorflow_quantum">⚛️ TensorFlow Quantum</option>
                            <option value="cirq">⚛️ Cirq</option>
                        </select>
                    </div>
                    <div class="lab-editor" style="background: var(--code-bg); border-radius: 4px; overflow: hidden;">
                        <div class="editor-header" style="padding: 0.5rem; background: var(--surface-light); border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between;">
                            <span style="color: var(--text-muted); font-size: 0.875rem;">Code Editor</span>
                            <button class="btn-small" onclick="aiLab.runCurrentCode()" style="padding: 0.25rem 0.5rem; font-size: 0.875rem;">▶ Run</button>
                        </div>
                        <textarea id="codeEditor" style="width: 100%; height: 200px; padding: 1rem; font-family: monospace; font-size: 0.875rem; background: transparent; color: var(--text-primary); border: none; resize: none;" placeholder="Write your AI code here...">
# scikit-learn Example
from sklearn.ensemble import RandomForestClassifier
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split

# Load data
iris = load_iris()
X, y = iris.data, iris.target

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# Train model
model = RandomForestClassifier(n_estimators=100)
model.fit(X_train, y_train)

# Evaluate
accuracy = model.score(X_test, y_test)
print(f"Model Accuracy: {accuracy:.2f}")
                        </textarea>
                    </div>
                    <div class="lab-output" style="margin-top: 1rem; padding: 1rem; background: var(--surface-color); border-radius: 4px; min-height: 100px; font-family: monospace; font-size: 0.875rem; white-space: pre-wrap;">
                        <span style="color: var(--text-muted);">Output will appear here after execution...</span>
                    </div>
                </div>
                
                <script>
                    if (!window.aiLab) window.aiLab = new AILab();
                    window.runCurrentCode = async function() {
                        const editor = document.getElementById('codeEditor');
                        const output = document.querySelector('.ai-lab .lab-output');
                        if (editor && output) {
                            output.innerHTML = '<span style="color: var(--ai-orange);">⏳ Running...</span>';
                            try {
                                const result = await aiLab.runCode(editor.value);
                                output.innerHTML = result.success ? 
                                    '<span style="color: var(--ai-green);">✓ Success!</span><br>' + result.output :
                                    '<span style="color: var(--ai-red);">✗ Error:</span><br>' + result.output;
                            } catch (error) {
                                output.innerHTML = '<span style="color: var(--ai-red);">✗ Error:</span><br>' + error.message;
                            }
                        }
                    };
                    window.aiLab.runCurrentCode = window.runCurrentCode;
                </script>
            `;
        }
    }
    
    window.aiLab = new AILab();
    
    // =========================================================================
    // ADD PRACTICAL EXAMPLES TO LEVELS
    // =========================================================================
    
    // Intermediate Level (Level 2)
    COURSE_DATA.levels.intermediate.lessons.practical_scikit = {
        id: "practical_scikit",
        title: "Hands-on scikit-learn",
        subtitle: "Classic Machine Learning with scikit-learn",
        level: "intermediate",
        number: 4,
        estimatedTime: 60,
        difficulty: 3,
        prerequisites: ["neural_networks_intro"],
        unlocked: false,
        
        content: `
            <div class="lesson-section">
                <h3>🧮 scikit-learn Overview</h3>
                <p><strong>scikit-learn</strong> is the most popular Python library for classic machine learning.</p>
                <ul>
                    <li>Simple, consistent API</li>
                    <li>Wide range of algorithms</li>
                    <li>Built on NumPy, SciPy, Matplotlib</li>
                    <li>Open source with strong community</li>
                </ul>
                <p><strong>Installation:</strong></p>
                <pre style="background: var(--code-bg); padding: 1rem; border-radius: 4px;">pip install scikit-learn pandas matplotlib</pre>
            </div>
            
            <div class="lesson-section">
                <h3>🎯 Basic Classification</h3>
                <p><strong>Iris Dataset Classification:</strong></p>
                ${LIBRARY_GUIDES.scikit_learn.helloWorld}
                <p><strong>Key Concepts:</strong> Dataset loading, train-test split, model training, evaluation</p>
            </div>
            
            <div class="lesson-section">
                <h3>📊 Model Evaluation</h3>
                ${createCodeBlock(`
from sklearn.metrics import classification_report, confusion_matrix
import seaborn as sns
import matplotlib.pyplot as plt

# Generate predictions
y_pred = model.predict(X_test)

# Classification report
print(classification_report(y_test, y_pred))

# Confusion matrix
cm = confusion_matrix(y_test, y_pred)
sns.heatmap(cm, annot=True, fmt='d')
plt.title('Confusion Matrix')
plt.show()
            `, 'python', 'Model Evaluation with scikit-learn')}
            </div>
            
            <div class="lesson-section">
                <h3>⚡ Practical Exercise: Titanic Survival Prediction</h3>
                <p>Predict survival on the Titanic using passenger data:</p>
                ${createCodeBlock(`
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder

# Load data
df = pd.read_csv('https://raw.githubusercontent.com/datasciencedojo/datasets/master/titanic.csv')

# Preprocess
le = LabelEncoder()
df['Sex_encoded'] = le.fit_transform(df['Sex'])
df['Embarked_encoded'] = le.fit_transform(df['Embarked'].fillna('Unknown'))

# Select features
features = ['Pclass', 'Sex_encoded', 'Age', 'SibSp', 'Parch', 'Fare', 'Embarked_encoded']
X = df[features].fillna(0)
y = df['Survived'].fillna(0)

# Split and train
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Evaluate
accuracy = model.score(X_test, y_test)
print(f"Survival Prediction Accuracy: {accuracy:.2f}")
            `, 'python', 'Titanic Survival Prediction')}
            </div>
            
            <div class="lesson-section">
                <h3>🔧 Model Persistence</h3>
                <p><strong>Save and Load Models:</strong></p>
                ${createCodeBlock(`
import joblib
import pickle

# Save with joblib (recommended)
joblib.dump(model, 'titanic_model.joblib')

# Load with joblib
loaded_model = joblib.load('titanic_model.joblib')

# Save with pickle
with open('titanic_model.pkl', 'wb') as f:
    pickle.dump(model, f)

# Load with pickle
with open('titanic_model.pkl', 'rb') as f:
    loaded_model = pickle.load(f)
            `, 'python', 'Model Persistence')}
            </div>
        `,
        
        concepts: ["scikit-learn", "Classification", "Model Evaluation", "Data Preprocessing", "Model Persistence"],
        
        quiz: {
            id: "practical_scikit_quiz",
            title: "scikit-learn Practical Quiz",
            passingScore: 85,
            timeLimit: 480,
            questions: [
                {
                    id: "q1",
                    type: "multiple-choice",
                    question: "Which function is used for train-test split in scikit-learn?",
                    options: [
                        { text: "train_test_split", isCorrect: true },
                        { text: "split_data", isCorrect: false },
                        { text: "train_split", isCorrect: false },
                        { text: "data_split", isCorrect: false }
                    ],
                    explanation: "train_test_split from sklearn.model_selection is used for splitting data into training and test sets.",
                    difficulty: 1,
                    concept: "Train/Test Split"
                },
                {
                    id: "q2",
                    type: "multiple-choice",
                    question: "Which scikit-learn function is used for model evaluation?",
                    options: [
                        { text: "accuracy_score", isCorrect: true },
                        { text: "evaluate_model", isCorrect: false },
                        { text: "model_score", isCorrect: false },
                        { text: "score_model", isCorrect: false }
                    ],
                    explanation: "accuracy_score from sklearn.metrics is used to calculate the accuracy of a classifier.",
                    difficulty: 1,
                    concept: "Model Evaluation"
                }
            ]
        },
        
        animation: {
            type: "ml-workflow",
            title: "scikit-learn Workflow",
            description: "Visualize the complete scikit-learn workflow.",
            controls: ["nextStep", "previousStep"]
        }
    };
    
    // Advanced Level (Level 3)
    COURSE_DATA.levels.advanced.lessons.practical_tensorflow = {
        id: "practical_tensorflow",
        title: "Hands-on TensorFlow",
        subtitle: "Deep Learning with TensorFlow 2.x",
        level: "advanced",
        number: 7,
        estimatedTime: 75,
        difficulty: 4,
        prerequisites: ["practical_scikit"],
        unlocked: false,
        
        content: `
            <div class="lesson-section">
                <h3>⚡ TensorFlow Overview</h3>
                <p><strong>TensorFlow</strong> is Google's open-source deep learning framework.</p>
                <ul>
                    <li><strong>Key Features:</strong> Automatic differentiation, GPU acceleration, distributed training</li>
                    <li><strong>Keras Integration:</strong> High-level API for easy model building</li>
                    <li><strong>TensorBoard:</strong> Visualization toolkit</li>
                    <li><strong>TF Hub:</strong> Pre-trained models and modules</li>
                </ul>
                <p><strong>Installation:</strong></p>
                <pre style="background: var(--code-bg); padding: 1rem; border-radius: 4px;">pip install tensorflow tensorflow-datasets</pre>
            </div>
            
            <div class="lesson-section">
                <h3>🎯 Basic Neural Network</h3>
                ${LIBRARY_GUIDES.tensorflow.helloWorld}
                <p><strong>Key Components:</strong> Sequential model, Dense layers, activation functions</p>
            </div>
            
            <div class="lesson-section">
                <h3>📊 Image Classification with CNN</h3>
                <p><strong>Convolutional Neural Network for MNIST:</strong></p>
                ${createCodeBlock(`
import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.datasets import mnist

# Load data
(x_train, y_train), (x_test, y_test) = mnist.load_data()
x_train, x_test = x_train / 255.0, x_test / 255.0  # Normalize

# Add channel dimension
x_train = x_train.reshape((-1, 28, 28, 1))
x_test = x_test.reshape((-1, 28, 28, 1))

# Build CNN model
model = models.Sequential([
    layers.Conv2D(32, (3, 3), activation='relu', input_shape=(28, 28, 1)),
    layers.MaxPooling2D((2, 2)),
    layers.Conv2D(64, (3, 3), activation='relu'),
    layers.MaxPooling2D((2, 2)),
    layers.Conv2D(64, (3, 3), activation='relu'),
    layers.Flatten(),
    layers.Dense(64, activation='relu'),
    layers.Dense(10, activation='softmax')
])

# Compile
model.compile(optimizer='adam',
              loss='sparse_categorical_crossentropy',
              metrics=['accuracy'])

# Train
model.fit(x_train, y_train, epochs=5, validation_data=(x_test, y_test))

# Evaluate
test_loss, test_acc = model.evaluate(x_test, y_test)
print(f"Test Accuracy: {test_acc:.4f}")
            `, 'python', 'CNN for MNIST Classification')}
            </div>
            
            <div class="lesson-section">
                <h3>🎯 Practical Exercise: Text Classification</h3>
                <p>IMDB Movie Review Sentiment Analysis:</p>
                ${createCodeBlock(`
import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.datasets import imdb

# Load data
vocab_size = 10000
max_length = 200
(x_train, y_train), (x_test, y_test) = imdb.load_data(num_words=vocab_size)

# Pad sequences
x_train = tf.keras.preprocessing.sequence.pad_sequences(
    x_train, maxlen=max_length)
x_test = tf.keras.preprocessing.sequence.pad_sequences(
    x_test, maxlen=max_length)

# Build model
model = models.Sequential([
    layers.Embedding(vocab_size, 16, input_length=max_length),
    layers.GlobalAveragePooling1D(),
    layers.Dense(16, activation='relu'),
    layers.Dense(1, activation='sigmoid')
])

# Compile
model.compile(optimizer='adam',
              loss='binary_crossentropy',
              metrics=['accuracy'])

# Train
model.fit(x_train, y_train, epochs=5, batch_size=512, validation_data=(x_test, y_test))

# Evaluate
test_loss, test_acc = model.evaluate(x_test, y_test)
print(f"Test Accuracy: {test_acc:.4f}")
            `, 'python', 'Text Classification with TensorFlow')}
            </div>
            
            <div class="lesson-section">
                <h3>💡 TensorBoard Visualization</h3>
                <p><strong>Setup:</strong></p>
                ${createCodeBlock(`
# Add callback
tensorboard_callback = tf.keras.callbacks.TensorBoard(
    log_dir='./logs',
    histogram_freq=1
)

# Add to model.fit
model.fit(x_train, y_train, epochs=5,
          validation_data=(x_test, y_test),
          callbacks=[tensorboard_callback])

# Run TensorBoard
# tensorboard --logdir=./logs
            `, 'python', 'TensorBoard Setup')}
                <p><strong>Visualizations:</strong> Scalars, Graphs, Histograms, Projections, Images</p>
            </div>
        `,
        
        concepts: ["TensorFlow", "Neural Networks", "CNN", "Text Classification", "TensorBoard"],
        
        quiz: {
            id: "practical_tensorflow_quiz",
            title: "TensorFlow Practical Quiz",
            passingScore: 85,
            timeLimit: 600,
            questions: [
                {
                    id: "q1",
                    type: "multiple-choice",
                    question: "What is the high-level API for building models in TensorFlow?",
                    options: [
                        { text: "Keras", isCorrect: true },
                        { text: "Estimator", isCorrect: false },
                        { text: "Layers", isCorrect: false },
                        { text: "Models", isCorrect: false }
                    ],
                    explanation: "Keras is the high-level API integrated into TensorFlow for easy model building.",
                    difficulty: 1,
                    concept: "TensorFlow"
                },
                {
                    id: "q2",
                    type: "multiple-choice",
                    question: "Which layer type is used for image classification in CNNs?",
                    options: [
                        { text: "Conv2D", isCorrect: true },
                        { text: "Dense", isCorrect: false },
                        { text: "LSTM", isCorrect: false },
                        { text: "Embedding", isCorrect: false }
                    ],
                    explanation: "Conv2D (2D Convolution) layers are the primary layer type for image classification in CNNs.",
                    difficulty: 2,
                    concept: "CNN"
                }
            ]
        },
        
        animation: {
            type: "nn-visualizer",
            title: "TensorFlow Neural Network Builder",
            description: "Build and train neural networks with TensorFlow.",
            controls: ["addLayer", "changeActivation", "train"]
        }
    };
    
    COURSE_DATA.levels.advanced.lessons.practical_transformers = {
        id: "practical_transformers",
        title: "Hands-on Transformers",
        subtitle: "State-of-the-Art NLP with HuggingFace Transformers",
        level: "advanced",
        number: 8,
        estimatedTime: 90,
        difficulty: 4,
        prerequisites: ["practical_tensorflow"],
        unlocked: false,
        
        content: `
            <div class="lesson-section">
                <h3>🨄 Transformers Overview</h3>
                <p><strong>Transformers</strong> are a revolutionary neural network architecture for NLP.</p>
                <ul>
                    <li><strong>Invented:</strong> 2017 by Google (Vaswani et al.)</li>
                    <li><strong>Key Innovation:</strong> Self-attention mechanism</li>
                    <li><strong>Advantages:</strong> Parallel processing, long-range dependencies, state-of-the-art results</li>
                    <li><strong>Models:</strong> BERT, RoBERTa, GPT, T5, etc.</li>
                </ul>
                <p><strong>Installation:</strong></p>
                <pre style="background: var(--code-bg); padding: 1rem; border-radius: 4px;">pip install transformers datasets torch</pre>
            </div>
            
            <div class="lesson-section">
                <h3>🎯 Quick Start with Pipelines</h3>
                ${LIBRARY_GUIDES.transformers.helloWorld}
                <p><strong>Available Pipelines:</strong> text-classification, text-generation, question-answering, translation, summarization, etc.</p>
            </div>
            
            <div class="lesson-section">
                <h3>🔬 Tokenization</h3>
                <p><strong>Understanding Tokenizers:</strong></p>
                ${createCodeBlock(`
from transformers import AutoTokenizer

# Load tokenizer
tokenizer = AutoTokenizer.from_pretrained("bert-base-uncased")

# Tokenize text
text = "Hello, how are you?"
tokens = tokenizer.tokenize(text)
print("Tokens:", tokens)

# Convert tokens to IDs
input_ids = tokenizer.encode(text, add_special_tokens=True)
print("Input IDs:", input_ids)

# Decode IDs back to text
decoded = tokenizer.decode(input_ids)
print("Decoded:", decoded)

# Full tokenization with attention mask
inputs = tokenizer(text, return_tensors="pt", padding=True, truncation=True)
print("Input IDs:", inputs["input_ids"])
print("Attention Mask:", inputs["attention_mask"])
            `, 'python', 'Tokenization with BERT')}
                <p><strong>Special Tokens:</strong> [CLS] (classification), [SEP] (separator), [PAD] (padding), [UNK] (unknown), [MASK] (masked)</p>
            </div>
            
            <div class="lesson-section">
                <h3>🚀 Fine-Tuning a Transformer</h3>
                <p><strong>Fine-tuning BERT for Text Classification:</strong></p>
                ${createCodeBlock(`
from transformers import AutoTokenizer, AutoModelForSequenceClassification, TrainingArguments, Trainer
from datasets import load_dataset
import numpy as np

# Load dataset
dataset = load_dataset("imdb")

# Load tokenizer and model
tokenizer = AutoTokenizer.from_pretrained("bert-base-uncased")
model = AutoModelForSequenceClassification.from_pretrained("bert-base-uncased", num_labels=2)

# Tokenize dataset
def tokenize_function(examples):
    return tokenizer(examples["text"], padding="max_length", truncation=True, max_length=512)

tokenized_datasets = dataset.map(tokenize_function, batched=True)

# Define metrics
def compute_metrics(eval_pred):
    logits, labels = eval_pred
    predictions = np.argmax(logits, axis=-1)
    return {"accuracy": (predictions == labels).mean()}

# Training arguments
training_args = TrainingArguments(
    output_dir="./results",
    evaluation_strategy="epoch",
    learning_rate=2e-5,
    per_device_train_batch_size=8,
    per_device_eval_batch_size=8,
    num_train_epochs=3,
    weight_decay=0.01
)

# Trainer
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=tokenized_datasets["train"],
    eval_dataset=tokenized_datasets["test"],
    compute_metrics=compute_metrics
)

# Train
trainer.train()

# Evaluate
eval_results = trainer.evaluate()
print(f"Evaluation Results: {eval_results}")
            `, 'python', 'Fine-Tuning BERT')}
            </div>
            
            <div class="lesson-section">
                <h3>💡 Practical Tips</h3>
                <ul>
                    <li><strong>Use Pipelines:</strong> For quick inference without fine-tuning</li>
                    <li><strong>Model Selection:</strong> Start with smaller models (distilbert) for faster inference</li>
                    <li><strong>Quantization:</strong> Reduce model size for production</li>
                    <li><strong>ONNX Export:</strong> Convert to ONNX for cross-framework compatibility</li>
                </ul>
            </div>
        `,
        
        concepts: ["Transformers", "HuggingFace", "Tokenization", "Fine-Tuning", "BERT", "Pipelines"],
        
        quiz: {
            id: "practical_transformers_quiz",
            title: "Transformers Practical Quiz",
            passingScore: 90,
            timeLimit: 600,
            questions: [
                {
                    id: "q1",
                    type: "multiple-choice",
                    question: "What is the key innovation in Transformer architecture?",
                    options: [
                        { text: "Recurrent connections", isCorrect: false },
                        { text: "Self-attention mechanism", isCorrect: true },
                        { text: "Convolutional layers", isCorrect: false },
                        { text: "Pooling layers", isCorrect: false }
                    ],
                    explanation: "The key innovation in Transformer architecture is the self-attention mechanism, which allows the model to focus on different parts of the input sequence when producing each output element.",
                    difficulty: 2,
                    concept: "Transformers"
                },
                {
                    id: "q2",
                    type: "multiple-choice",
                    question: "Which token is used for classification in BERT?",
                    options: [
                        { text: "[CLS]", isCorrect: true },
                        { text: "[SEP]", isCorrect: false },
                        { text: "[MASK]", isCorrect: false },
                        { text: "[PAD]", isCorrect: false }
                    ],
                    explanation: "The [CLS] token (classification token) is prepended to the input sequence and its final hidden state is used as the aggregate representation of the sequence for classification tasks.",
                    difficulty: 2,
                    concept: "Tokenization"
                }
            ]
        },
        
        animation: {
            type: "transformer-visualizer",
            title: "Transformer Model Visualizer",
            description: "Visualize transformer architecture with attention heads.",
            controls: ["layerSlider", "headSlider", "showAttention"]
        }
    };
    
    // Expert Level (Level 4)
    COURSE_DATA.levels.expert.lessons.practical_langchain = {
        id: "practical_langchain",
        title: "Hands-on LangChain",
        subtitle: "Building LLM Applications with LangChain",
        level: "expert",
        number: 13,
        estimatedTime: 75,
        difficulty: 4,
        prerequisites: ["practical_transformers"],
        unlocked: false,
        
        content: `
            <div class="lesson-section">
                <h3>🔗 LangChain Overview</h3>
                <p><strong>LangChain</strong> is a framework for developing applications powered by language models.</p>
                <ul>
                    <li><strong>Key Components:</strong> LLMs, Prompts, Chains, Agents, Memory, Tools</li>
                    <li><strong>Use Cases:</strong> Chatbots, Q&A, Text summarization, Code generation</li>
                    <li><strong>Integrations:</strong> OpenAI, HuggingFace, Anthropic, Google, etc.</li>
                </ul>
                <p><strong>Installation:</strong></p>
                <pre style="background: var(--code-bg); padding: 1rem; border-radius: 4px;">pip install langchain openai</pre>
            </div>
            
            <div class="lesson-section">
                <h3>🎯 Quick Start</h3>
                ${LIBRARY_GUIDES.langchain.helloWorld}
                <p><strong>Environment Setup:</strong></p>
                <pre style="background: var(--code-bg); padding: 1rem; border-radius: 4px;">export OPENAI_API_KEY="your-api-key"
# or in Python
import os
os.environ["OPENAI_API_KEY"] = "your-api-key"
            </pre>
            </div>
            
            <div class="lesson-section">
                <h3>🧩 Chains</h3>
                <p><strong>LLMChain:</strong> Most common chain type</p>
                ${createCodeBlock(`
from langchain.llms import OpenAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain

# Create LLM
llm = OpenAI(temperature=0.9)

# Create prompt template
prompt = PromptTemplate(
    input_variables=["topic"],
    template="Write a tweet about {topic}"
)

# Create chain
chain = LLMChain(llm=llm, prompt=prompt)

# Run
result = chain.run(topic="artificial intelligence")
print(result)
            `, 'python', 'LLMChain Example')}
                <p><strong>Sequential Chains:</strong> Combine multiple chains</p>
                ${createCodeBlock(`
from langchain.chains import SimpleSequentialChain

# First chain
first_prompt = PromptTemplate(
    input_variables=["topic"],
    template="Write a title about {topic}"
)
first_chain = LLMChain(llm=llm, prompt=first_prompt)

# Second chain
second_prompt = PromptTemplate(
    input_variables=["title"],
    template="Write a poem about the following title: {title}"
)
second_chain = LLMChain(llm=llm, prompt=second_prompt)

# Sequential chain
overall_chain = SimpleSequentialChain(
    chains=[first_chain, second_chain],
    verbose=True
)

# Run
result = overall_chain.run(topic="climate change")
print(result)
            `, 'python', 'Sequential Chain Example')}
            </div>
            
            <div class="lesson-section">
                <h3>🤖 Agents</h3>
                <p><strong>Agents</strong> are LLM-powered entities that can take actions, use tools, and make decisions.</p>
                ${createCodeBlock(`
from langchain.agents import load_tools, initialize_agent, AgentType

# Load tools
tools = load_tools(["serpapi", "llm-math"], llm=llm)

# Initialize agent
agent = initialize_agent(
    tools,
    llm,
    agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
    verbose=True
)

# Run agent
result = agent.run("What was the high temperature in San Francisco yesterday?")
print(result)
            `, 'python', 'Zero-Shot React Agent')}
                <p><strong>Agent Types:</strong> ZERO_SHOT_REACT_DESCRIPTION, REACT_DOCSTORE, SELF_ASK_WITH_SEARCH, CONVERSATIONAL_REACT_DESCRIPTION</p>
            </div>
            
            <div class="lesson-section">
                <h3>💾 Memory</h3>
                <p><strong>Conversation Memory:</strong> Remember past interactions</p>
                ${createCodeBlock(`
from langchain.memory import ConversationBufferMemory

# Create memory
memory = ConversationBufferMemory()

# Create chain with memory
chain = LLMChain(llm=llm, prompt=prompt, memory=memory)

# First interaction
result1 = chain.run(topic="climate change")
print("Response 1:", result1)
print("Memory:", memory.buffer)

# Second interaction (remembers previous conversation)
result2 = chain.run(topic="space exploration")
print("Response 2:", result2)
            `, 'python', 'Conversation Memory')}
            </div>
        `,
        
        concepts: ["LangChain", "LLMChain", "Sequential Chains", "Agents", "Memory", "Tools"],
        
        quiz: {
            id: "practical_langchain_quiz",
            title: "LangChain Practical Quiz",
            passingScore: 90,
            timeLimit: 600,
            questions: [
                {
                    id: "q1",
                    type: "multiple-choice",
                    question: "What is the main purpose of LangChain?",
                    options: [
                        { text: "To build applications powered by language models", isCorrect: true },
                        { text: "To train language models", isCorrect: false },
                        { text: "To create new language models", isCorrect: false },
                        { text: "To replace Python", isCorrect: false }
                    ],
                    explanation: "LangChain is a framework for developing applications powered by language models, not for training models.",
                    difficulty: 1,
                    concept: "LangChain"
                },
                {
                    id: "q2",
                    type: "multiple-choice",
                    question: "What is an LLMChain in LangChain?",
                    options: [
                        { text: "A chain that combines a language model with a prompt", isCorrect: true },
                        { text: "A chain that connects multiple language models", isCorrect: false },
                        { text: "A type of neural network", isCorrect: false },
                        { text: "A database of language models", isCorrect: false }
                    ],
                    explanation: "An LLMChain is the most common type of chain in LangChain, which combines a language model with a prompt template.",
                    difficulty: 2,
                    concept: "LLMChain"
                }
            ]
        },
        
        animation: {
            type: "llm-inference",
            title: "LangChain Pipeline Visualizer",
            description: "Visualize LangChain chains and agent workflows.",
            controls: ["generateToken", "showProbabilities"]
        }
    };
    
    // Quantum-AI Intersection Lesson for Expert Level
    COURSE_DATA.levels.expert.lessons.quantum_ai_intersection = {
        id: "quantum_ai_intersection",
        title: "Quantum-AI Intersection",
        subtitle: "Bridging Quantum Computing and Artificial Intelligence",
        level: "expert",
        number: 17,
        estimatedTime: 75,
        difficulty: 4,
        prerequisites: ["practical_tensorflow"],
        unlocked: false,
        
        content: `
            <div class="lesson-section">
                <h3>⚛️+🤖 The Quantum-AI Convergence</h3>
                <p>Two of the most transformative technologies of our time are beginning to intersect: <strong>Quantum Computing</strong> and <strong>Artificial Intelligence</strong>. This lesson explores how quantum principles can enhance AI, and how AI can help develop quantum systems.</p>
                <p><strong>Why Combine Quantum + AI?</strong></p>
                <ul>
                    <li><strong>Exponential Speedup:</strong> Quantum algorithms can potentially solve certain problems exponentially faster than classical ones</li>
                    <li><strong>Complex Pattern Recognition:</strong> Quantum systems can represent and analyze high-dimensional data more efficiently</li>
                    <li><strong>Optimization:</strong> Quantum annealing can find global optima where classical methods get stuck in local minima</li>
                    <li><strong>Quantum Data:</strong> AI can help interpret and make sense of quantum mechanical data and simulations</li>
                </ul>
            </div>
            
            <div class="lesson-section">
                <h3>🔗 Quantum-AI Integration Approaches</h3>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem;">
                    <div style="padding: 1rem; background: var(--surface-light); border-radius: 8px; border-top: 4px solid var(--ai-blue);">
                        <h4>🧮 Quantum Machine Learning</h4>
                        <p>Use quantum algorithms for machine learning tasks</p>
                        <ul>
                            <li>Quantum SVM</li>
                            <li>Quantum Neural Networks</li>
                            <li>Quantum k-NN</li>
                        </ul>
                    </div>
                    <div style="padding: 1rem; background: var(--surface-light); border-radius: 8px; border-top: 4px solid var(--ai-purple);">
                        <h4>🔄 Hybrid Quantum-Classical</h4>
                        <p>Combine quantum and classical components</p>
                        <ul>
                            <li>Quantum layers in classical NN</li>
                            <li>Classical pre/post processing</li>
                            <li>Quantum feature extraction</li>
                        </ul>
                    </div>
                    <div style="padding: 1rem; background: var(--surface-light); border-radius: 8px; border-top: 4px solid var(--ai-green);">
                        <h4>🤖 AI for Quantum</h4>
                        <p>Use AI to improve quantum computing</p>
                        <ul>
                            <li>Quantum circuit optimization</li>
                            <li>Error correction</li>
                            <li>Quantum control</li>
                        </ul>
                    </div>
                </div>
            </div>
            
            <div class="lesson-section">
                <h3>🏗️ Quantum-AI Libraries Overview</h3>
                <p><strong>Available Frameworks:</strong></p>
                <table style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
                    <thead><tr style="border-bottom: 2px solid var(--border-color);"><th style="text-align: left; padding: 0.5rem;">Library</th><th style="text-align: left; padding: 0.5rem;">Focus</th><th style="text-align: left; padding: 0.5rem;">Integration</th></tr></thead>
                    <tbody>
                        <tr style="border-bottom: 1px solid var(--border-color);"><td style="padding: 0.5rem;"><strong>Qiskit ML</strong></td><td style="padding: 0.5rem;">Quantum Kernels, QSVM, QNN</td><td style="padding: 0.5rem;">scikit-learn compatible</td></tr>
                        <tr style="border-bottom: 1px solid var(--border-color);"><td style="padding: 0.5rem;"><strong>PennyLane</strong></td><td style="padding: 0.5rem;">Hybrid Q-C models</td><td style="padding: 0.5rem;">PyTorch, TensorFlow, JAX</td></tr>
                        <tr style="border-bottom: 1px solid var(--border-color);"><td style="padding: 0.5rem;"><strong>TensorFlow Quantum</strong></td><td style="padding: 0.5rem;">Quantum Deep Learning</td><td style="padding: 0.5rem;">TensorFlow integration</td></tr>
                        <tr><td style="padding: 0.5rem;"><strong>Cirq</strong></td><td style="padding: 0.5rem;">NISQ circuits</td><td style="padding: 0.5rem;">TFQ backend, Google Cloud</td></tr>
                    </tbody>
                </table>
            </div>
            
            <div class="lesson-section">
                <h3>🚀 Practical Quantum-AI Applications</h3>
                ${QUANTUM_LIBRARY_GUIDES.qiskit.helloWorld}
                <p><strong>Qiskit Machine Learning</strong> provides quantum kernels that can be used with classical SVM classifiers to potentially achieve quantum advantage on certain datasets.</p>
            </div>
            
            <div class="lesson-section">
                <h3>🔬 Hybrid Quantum-Classical Neural Networks</h3>
                ${QUANTUM_LIBRARY_GUIDES.pennylane.helloWorld}
                <p><strong>Key Benefits:</strong> PennyLane allows quantum circuits to be seamlessly integrated as layers in classical deep learning models, enabling hybrid architectures that leverage both quantum and classical processing.</p>
            </div>
            
            <div class="lesson-section">
                <h3>☁️ Quantum Cloud Platforms for AI</h3>
                <p><strong>Available Cloud Services:</strong></p>
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem;">
                    <div style="padding: 1rem; background: var(--surface-light); border-radius: 8px;">
                        <h4>🔵 IBM Quantum</h4>
                        <p><small>Free access to real quantum computers with Qiskit integration</small></p>
                    </div>
                    <div style="padding: 1rem; background: var(--surface-light); border-radius: 8px;">
                        <h4>🟠 Amazon Braket</h4>
                        <p><small>Multiple hardware providers with AWS integration</small></p>
                    </div>
                    <div style="padding: 1rem; background: var(--surface-light); border-radius: 8px;">
                        <h4>🟢 Google Quantum AI</h4>
                        <p><small>Sycamore processor with TensorFlow Quantum</small></p>
                    </div>
                    <div style="padding: 1rem; background: var(--surface-light); border-radius: 8px;">
                        <h4>🔴 Azure Quantum</h4>
                        <p><small>Multi-provider access with Azure ML integration</small></p>
                    </div>
                </div>
            </div>
            
            <div class="lesson-section">
                <h3>💡 Hands-on: Quantum Feature Embedding</h3>
                ${QUANTUM_LIBRARY_GUIDES.cirq.helloWorld}
                <p><strong>Use Case:</strong> Quantum feature embedding can encode classical data into quantum states, potentially enabling more efficient representation of high-dimensional data for machine learning tasks.</p>
            </div>
        `,
        
        concepts: ["Quantum-AI Convergence", "Quantum Machine Learning", "Hybrid Architectures", "Quantum Libraries", "Quantum Cloud Platforms", "Quantum Feature Embedding"],
        
        quiz: {
            id: "quantum_ai_quiz",
            title: "Quantum-AI Intersection Quiz",
            passingScore: 75,
            timeLimit: 450,
            questions: [
                {
                    id: "q1", type: "multiple-choice",
                    question: "What is the main advantage of combining quantum computing with AI?",
                    options: [
                        { text: "Exponential speedup for certain problems", isCorrect: true },
                        { text: "Reduced hardware costs", isCorrect: false },
                        { text: "Simpler algorithm implementation", isCorrect: false },
                        { text: "Better compatibility with existing software", isCorrect: false }
                    ],
                    explanation: "The primary advantage is the potential for exponential speedup on specific types of problems where quantum algorithms outperform classical ones.",
                    difficulty: 2, concept: "Quantum-AI Convergence"
                },
                {
                    id: "q2", type: "multiple-choice",
                    question: "Which library enables hybrid quantum-classical neural networks with PyTorch integration?",
                    options: [
                        { text: "PennyLane", isCorrect: true },
                        { text: "Qiskit ML", isCorrect: false },
                        { text: "TensorFlow Quantum", isCorrect: false },
                        { text: "Cirq", isCorrect: false }
                    ],
                    explanation: "PennyLane is specifically designed for creating hybrid quantum-classical models and supports integration with PyTorch, TensorFlow, and JAX.",
                    difficulty: 3, concept: "Quantum Libraries"
                },
                {
                    id: "q3", type: "multiple-choice",
                    question: "What is the purpose of quantum feature embedding?",
                    options: [
                        { text: "Encode classical data into quantum states for more efficient processing", isCorrect: true },
                        { text: "Convert quantum algorithms to classical code", isCorrect: false },
                        { text: "Visualize quantum circuits", isCorrect: false },
                        { text: "Optimize classical neural networks", isCorrect: false }
                    ],
                    explanation: "Quantum feature embedding encodes classical data into quantum states, potentially enabling more efficient representation and processing of high-dimensional data.",
                    difficulty: 2, concept: "Quantum Feature Embedding"
                }
            ]
        },
        
        animation: {
            type: "nn-visualizer",
            title: "Quantum Neural Network Visualizer",
            description: "Visualize hybrid quantum-classical neural network architectures.",
            controls: ["addQuantumLayer", "addClassicalLayer", "simulate"]
        }
    };
    
    // PhD Level (Level 5)
    COURSE_DATA.levels.phd.lessons.practical_agents = {
        id: "practical_agents",
        title: "Building AI Agents",
        subtitle: "From Simple to Autonomous Agents",
        level: "phd",
        number: 18,
        estimatedTime: 90,
        difficulty: 5,
        prerequisites: ["practical_langchain"],
        unlocked: false,
        
        content: `
            <div class="lesson-section">
                <h3>🤖 What is an AI Agent?</h3>
                <p><strong>Definition:</strong> An AI agent is a system that can perceive its environment, make decisions, and take actions to achieve goals.</p>
                <p><strong>Key Characteristics:</strong></p>
                <ul>
                    <li><strong>Autonomy:</strong> Operate without constant human intervention</li>
                    <li><strong>Perception:</strong> Sense and interpret the environment</li>
                    <li><strong>Reasoning:</strong> Process information and make decisions</li>
                    <li><strong>Action:</strong> Take actions to achieve goals</li>
                    <li><strong>Learning:</strong> Improve over time based on experience</li>
                </ul>
            </div>
            
            <div class="lesson-section">
                <h3>🎯 Types of AI Agents</h3>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem;">
                    <div style="padding: 1rem; background: var(--surface-light); border-radius: 8px; border-top: 4px solid var(--ai-green);">
                        <h4>Simple Agents</h4>
                        <p>Single LLM + static prompt</p>
                        <p><em>Use Case:</em> Q&A, text generation</p>
                    </div>
                    <div style="padding: 1rem; background: var(--surface-light); border-radius: 8px; border-top: 4px solid var(--ai-blue);">
                        <h4>Reactive Agents</h4>
                        <p>Respond to current inputs</p>
                        <p><em>Use Case:</em> Chatbots, customer service</p>
                    </div>
                    <div style="padding: 1rem; background: var(--surface-light); border-radius: 8px; border-top: 4px solid var(--ai-purple);">
                        <h4>Autonomous Agents</h4>
                        <p>Plan and execute multi-step tasks</p>
                        <p><em>Use Case:</em> Research, coding, business processes</p>
                    </div>
                </div>
            </div>
            
            <div class="lesson-section">
                <h3>🔄 Agent Loop</h3>
                <p><strong>The Agent Reasoning Loop:</strong></p>
                <ol>
                    <li><strong>Observe:</strong> Gather information from the environment</li>
                    <li><strong>Think:</strong> Reason about the current state and possible actions</li>
                    <li><strong>Plan:</strong> Create a plan or sequence of actions</li>
                    <li><strong>Act:</strong> Execute the first action in the plan</li>
                    <li><strong>Evaluate:</strong> Assess the outcome and update state</li>
                    <li><strong>Repeat:</strong> Continue until goal is achieved</li>
                </ol>
                <p><strong>With LangChain:</strong></p>
                ${createCodeBlock(`
from langchain.agents import AgentExecutor, initialize_agent
from langchain.agents.tools import Tool
from langchain.llms import OpenAI

# Define tools
def get_weather(location):
    return f"The weather in {location} is 72°F and sunny."

def search_web(query):
    return f"Search results for: {query}"

tools = [
    Tool(name="weather", func=get_weather, description="Get weather for a location"),
    Tool(name="search", func=search_web, description="Search the web")
]

# Initialize LLM
llm = OpenAI(temperature=0)

# Create agent
agent = initialize_agent(
    tools,
    llm,
    agent="zero-shot-react-description",
    verbose=True
)

# Run agent
result = agent.run("What's the weather in San Francisco?")
print(result)
            `, 'python', 'Agent with Tools')}
            </div>
            
            <div class="lesson-section">
                <h3>🧠 Memory and Context</h3>
                <p><strong>Types of Memory:</strong></p>
                <ul>
                    <li><strong>Conversation Memory:</strong> Remember past interactions</li>
                    <li><strong>Vector Store Memory:</strong> Retrieve relevant information</li>
                    <li><strong>Entity Memory:</strong> Remember entities and their properties</li>
                    <li><strong>Combined Memory:</strong> Multiple memory types together</li>
                </ul>
                ${createCodeBlock(`
from langchain.memory import ConversationBufferWindowMemory

# Create window memory (keeps last N interactions)
memory = ConversationBufferWindowMemory(k=5)

# Create agent with memory
agent_with_memory = initialize_agent(
    tools,
    llm,
    agent="conversational-react-description",
    memory=memory,
    verbose=True
)

# Conversation
result = agent_with_memory.run("Hello, I'm Bob.")
result = agent_with_memory.run("What's my name?")  # Should remember "Bob"
            `, 'python', 'Agent with Memory')}
            </div>
            
            <div class="lesson-section">
                <h3>🤝 Multi-Agent Systems</h3>
                <p><strong>Why Multiple Agents?</strong></p>
                <ul>
                    <li><strong>Specialization:</strong> Each agent has a specific role/expertise</li>
                    <li><strong>Collaboration:</strong> Agents work together on complex tasks</li>
                    <li><strong>Scalability:</strong> Distribute workload across multiple agents</li>
                    <li><strong>Robustness:</strong> Redundancy and error recovery</li>
                </ul>
                <p><strong>Example Architecture:</strong></p>
                <pre style="font-family: monospace; background: var(--code-bg); padding: 1rem; border-radius: 8px; text-align: center;">
  ┌─────────────┐
  │   User      │
  └──────┬──────┘
         │
  ┌──────▼──────┐
  │  Manager     │ ← Coordinates other agents
  │   Agent      │
  └──────┬──────┘
         │
  ┌──────┬──────┬──────┐
  ▼      ▼      ▼
┌─────┐┌─────┐┌─────┐
│ Code ││ Data ││ Math │
│Agent ││Agent ││Agent │
└─────┘└─────┘└─────┘
         │      │      │
         └──────┴──────┴──────┐
                      ▼
              ┌─────────────┐
              │   Results   │
              └─────────────┘
            </pre>
                ${createCodeBlock(`
# Multi-agent example with LangChain
from langchain.agents import AgentExecutor

# Create specialized agents
coding_agent = initialize_agent(
    [Tool(name="python_interpreter", ...)],
    llm,
    agent="zero-shot-react-description"
)

research_agent = initialize_agent(
    [Tool(name="web_search", ...)],
    llm,
    agent="zero-shot-react-description"
)

# Manager agent can delegate to others
def run_multi_agent_query(query):
    if "code" in query or "python" in query:
        return coding_agent.run(query)
    else:
        return research_agent.run(query)

# Test
result = run_multi_agent_query("Write Python code to sort a list")
result = run_multi_agent_query("What is the capital of France?")
            `, 'python', 'Multi-Agent System')}
            </div>
        `,
        
        concepts: ["AI Agents", "Agent Loop", "Autonomy", "Memory", "Multi-Agent Systems", "Agent Collaboration"],
        
        quiz: {
            id: "practical_agents_quiz",
            title: "AI Agents Practical Quiz",
            passingScore: 90,
            timeLimit: 600,
            questions: [
                {
                    id: "q1",
                    type: "multiple-choice",
                    question: "What is the key characteristic that distinguishes agents from simple LLM calls?",
                    options: [
                        { text: "Agents can take actions and use tools", isCorrect: true },
                        { text: "Agents are always more accurate", isCorrect: false },
                        { text: "Agents only use Python", isCorrect: false },
                        { text: "Agents are a type of neural network", isCorrect: false }
                    ],
                    explanation: "The key characteristic of agents is that they can take actions, use tools, and interact with their environment beyond just generating text.",
                    difficulty: 2,
                    concept: "AI Agents"
                },
                {
                    id: "q2",
                    type: "multiple-choice",
                    question: "What is the agent reasoning loop?",
                    options: [
                        { text: "Observe → Think → Plan → Act → Evaluate → Repeat", isCorrect: true },
                        { text: "Input → Process → Output", isCorrect: false },
                        { text: "Train → Evaluate → Deploy", isCorrect: false },
                        { text: "Forward → Backward → Update", isCorrect: false }
                    ],
                    explanation: "The agent reasoning loop typically consists of observing the environment, thinking about the situation, planning actions, acting, and evaluating the results before repeating.",
                    difficulty: 2,
                    concept: "Agent Loop"
                }
            ]
        },
        
        animation: {
            type: "agent-simulator",
            title: "AI Agent Simulator",
            description: "Simulate agent reasoning and multi-agent collaboration.",
            controls: ["agentTypeSelector", "runAgent"]
        }
    };
    
    // =========================================================================
    // UPDATE LEVEL DESCRIPTIONS
    // =========================================================================
    COURSE_DATA.levels.beginner.description = "AI & ML fundamentals and basic concepts";
    COURSE_DATA.levels.intermediate.description = "Classic ML algorithms with scikit-learn";
    COURSE_DATA.levels.advanced.description = "Deep learning and transformer models";
    COURSE_DATA.levels.expert.description = "LLM applications and LangChain framework";
    COURSE_DATA.levels.phd.description = "AI agents and multi-agent systems";
    
    // =========================================================================
    // LOG SUCCESS
    // =========================================================================
    console.log('✅ SUCCESS: AI Course Practical Examples & Interactive Sessions loaded!');
    console.log('');
    console.log('📚 Course Structure:');
    console.log('   Level 1 (Beginner): AI & ML 101 (3 lessons)');
    console.log('   Level 2 (Intermediate): Classic ML (1 lesson + more to add)');
    console.log('   Level 3 (Advanced): Deep Learning (2 lessons + more to add)');
    console.log('   Level 4 (Expert): LLM Applications (1 lesson + more to add)');
    console.log('   Level 5 (PhD): AI Agents (1 lesson + more to add)');
    console.log('');
    console.log('🚀 Features:');
    console.log('   ✓ Interactive code editors for AI/ML libraries');
    console.log('   ✓ Local environment setup guides (scikit-learn, TensorFlow, PyTorch, Transformers, LangChain)');
    console.log('   ✓ Cloud environment guides (Colab, SageMaker, Vertex AI, Azure ML)');
    console.log('   ✓ Quantum-AI libraries (Qiskit, PennyLane, TensorFlow Quantum, Cirq)');
    console.log('   ✓ Quantum cloud platforms (IBM Quantum, Amazon Braket, Google Quantum, Azure Quantum)');
    console.log('   ✓ Practical exercises (Titanic, MNIST, IMDB, Text Classification, Quantum ML)');
    console.log('   ✓ Agent and multi-agent system examples');
    console.log('   ✓ AI-specific animations (Timeline, ML Workflow, NN Visualizer, Transformer Visualizer, LLM Inference, Agent Simulator)');
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { COURSE_DATA, AILab, LIBRARY_GUIDES, CLOUD_GUIDES, QUANTUM_LIBRARY_GUIDES, QUANTUM_CLOUD_GUIDES };
}
