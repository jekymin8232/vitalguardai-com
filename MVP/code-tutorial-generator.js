class CodeTutorialGenerator {
  constructor() {
    this.tutorials = [];
    this.algorithms = {
      'q-learning': { name: 'Q-Learning', category: 'Reinforcement Learning', complexity: 'Medium' },
      'mab': { name: 'Multi-Armed Bandit', category: 'Decision Making', complexity: 'Easy' },
      'knn': { name: 'k-NN', category: 'Classification', complexity: 'Easy' },
      'rls': { name: 'Recursive Least Squares', category: 'Regression', complexity: 'Hard' },
      'thompson': { name: 'Thompson Sampling', category: 'Probabilistic', complexity: 'Medium' },
      'genetic': { name: 'Genetic Algorithm', category: 'Optimization', complexity: 'Hard' },
      'pso': { name: 'Particle Swarm', category: 'Optimization', complexity: 'Medium' },
      'annealing': { name: 'Simulated Annealing', category: 'Optimization', complexity: 'Medium' },
      'bayesian': { name: 'Bayesian Optimization', category: 'Tuning', complexity: 'Hard' },
      'isolation': { name: 'Isolation Forest', category: 'Anomaly Detection', complexity: 'Hard' }
    };
  }

  /**
   * 코드 분석
   */
  analyzeCode(code) {
    try {
      const analysis = {
        codeLength: code.length,
        lineCount: code.split('\n').length,
        hasClasses: /class\s+\w+/.test(code),
        hasFunctions: /function\s+\w+|const\s+\w+\s*=\s*\(/.test(code),
        hasComments: /\/\*[\s\S]*?\*\/|\/\/.*$/m.test(code),
        detectedAlgorithms: this.detectAlgorithms(code),
        complexity: this.estimateComplexity(code),
        hasErrorHandling: /try|catch|throw|error|Error/.test(code),
        hasEncryption: /encrypt|crypto|cipher|key|password/.test(code),
        hasStorage: /localStorage|IndexedDB|storage|database|db/.test(code)
      };

      return analysis;
    } catch (e) {
      console.error('[Tutorial] Code analysis failed:', e.message);
      return { error: e.message };
    }
  }

  /**
   * 알고리즘 감지
   */
  detectAlgorithms(code) {
    const detected = [];

    for (const [key, algo] of Object.entries(this.algorithms)) {
      if (code.includes(algo.name) || code.includes(key)) {
        detected.push({ key, ...algo });
      }
    }

    // 키워드 기반 감지
    if (/reward|state|action|qvalue|epsilon/.test(code)) detected.push(this.algorithms['q-learning']);
    if (/bandit|arm|reward|exploit/.test(code)) detected.push(this.algorithms['mab']);
    if (/nearest|neighbor|distance|similarity/.test(code)) detected.push(this.algorithms['knn']);
    if (/adaptive|learning|coefficient|error/.test(code)) detected.push(this.algorithms['rls']);

    // 중복 제거
    return [...new Map(detected.map(a => [a.key, a])).values()];
  }

  /**
   * 복잡도 추정
   */
  estimateComplexity(code) {
    let score = 0;

    if (code.length > 1000) score += 2;
    if (/for\s*\(.*for\s*\(/.test(code)) score += 2;  // 중첩 루프
    if (/matrix|Array|vector/.test(code)) score += 1;
    if (/encryption|crypto/.test(code)) score += 1;
    if (/async|await|Promise/.test(code)) score += 1;

    if (score >= 5) return 'Very High';
    if (score >= 3) return 'High';
    if (score >= 2) return 'Medium';
    return 'Low';
  }

  /**
   * 완전한 튜토리얼 생성
   */
  generateTutorial(code, taskType, language = 'javascript', algorithmUsed = null) {
    try {
      const analysis = this.analyzeCode(code);
      const timestamp = new Date().toISOString();

      const tutorial = {
        // 1️⃣ 메타정보
        metadata: {
          title: this.generateTitle(taskType),
          description: this.generateDescription(taskType),
          createdAt: timestamp,
          codeLength: `${code.length} bytes`,
          complexity: analysis.complexity,
          algorithmUsed: algorithmUsed || analysis.detectedAlgorithms[0]?.name || 'Custom'
        },

        // 2️⃣ 사용법 섹션
        howToUse: this.generateHowToUse(code, language, analysis),

        // 3️⃣ 코드 설명 섹션
        whatItDoes: this.generateWhatItDoes(code, taskType, analysis),

        // 4️⃣ AI 알고리즘 섹션
        algorithmExplanation: this.generateAlgorithmExplanation(
          algorithmUsed || analysis.detectedAlgorithms[0]?.key
        ),

        // 5️⃣ 수정 방법 섹션
        howToModify: this.generateHowToModify(code, analysis),

        // 6️⃣ 실제 예시 섹션
        practicalExamples: this.generatePracticalExamples(code, language),

        // 7️⃣ 성능 & 최적화
        performanceNotes: this.generatePerformanceNotes(code, analysis),

        // 8️⃣ 트러블슈팅
        troubleshooting: this.generateTroubleshooting(code, analysis),

        // 원본 코드
        originalCode: code
      };

      this.tutorials.push(tutorial);
      return tutorial;
    } catch (e) {
      console.error('[Tutorial] Generation failed:', e.message);
      return { error: e.message };
    }
  }

  /**
   * 제목 생성
   */
  generateTitle(taskType) {
    const titles = {
      'disguised-calculator': '🔒 Disguised Calculator: Complete Tutorial',
      'voice-recognition': '🎙️ Voice Recognition AI: User Guide',
      'risk-assessment': '⚠️ Risk Detection System: Manual',
      'optimization': '🚀 Optimization Solver: Implementation Guide',
      'anomaly-detection': '🔍 Anomaly Detection: Practical Guide',
      'ensemble': '🤖 Ensemble AI Model: Setup Guide',
      'default': '📖 AI Algorithm: Complete Tutorial'
    };

    return titles[taskType] || titles['default'];
  }

  /**
   * 설명 생성
   */
  generateDescription(taskType) {
    const descriptions = {
      'disguised-calculator': 'Learn how to use a calculator app that secretly records notes and voice. Complete with setup, usage, and modification guide.',
      'voice-recognition': 'Understand how to use voice recognition AI. Includes setup, configuration, and customization.',
      'risk-assessment': 'Learn how to use AI for risk detection. Includes configuration, interpretation, and customization.',
      'optimization': 'Complete guide to using AI optimization. Includes setup, problem definition, and result interpretation.',
      'default': 'Complete guide to using this AI code. Includes setup, usage, and customization.'
    };

    return descriptions[taskType] || descriptions['default'];
  }

  /**
   * 사용법 생성 (How to Use)
   */
  generateHowToUse(code, language, analysis) {
    try {
      const className = (code.match(/class\s+(\w+)/) || [, 'Algorithm'])[1];

      return {
        title: 'How to Use This Code',
        steps: [
          {
            step: 1,
            title: 'Import/Include the Code',
            description: `Import the code into your project`,
            code: language === 'javascript'
              ? `const { ${className} } = require('./code.js');\n// or\nimport { ${className} } from './code.js';`
              : language === 'python'
              ? `from code import ${className}`
              : `#include "code.h"`
          },
          {
            step: 2,
            title: 'Create an Instance',
            description: `Initialize the algorithm with configuration`,
            code: language === 'javascript'
              ? `const instance = new ${className}();\n// or with config\nconst config = { /* options */ };\nconst instance = new ${className}(config);`
              : language === 'python'
              ? `instance = ${className}()\n# or with config\nconfig = {}\ninstance = ${className}(config)`
              : `${className} instance;\n// or with config\n${className} instance(config);`
          },
          {
            step: 3,
            title: 'Use the Main Methods',
            description: `Call the main methods to use the algorithm`,
            code: language === 'javascript'
              ? `// Training\ninstance.train(data);\n\n// Prediction/Execution\nconst result = instance.predict(input);\nconsole.log(result);`
              : language === 'python'
              ? `# Training\ninstance.train(data)\n\n# Prediction\nresult = instance.predict(input)\nprint(result)`
              : `// Training\ninstance.train(data);\n\n// Prediction\nauto result = instance.predict(input);\nstd::cout << result;`
          },
          {
            step: 4,
            title: 'Handle Results',
            description: `Process the output from the algorithm`,
            code: language === 'javascript'
              ? `if (result.success) {\n  console.log('Result:', result.value);\n} else {\n  console.error('Error:', result.error);\n}`
              : language === 'python'
              ? `if result['success']:\n    print(f'Result: {result[\"value\"]}')\nelse:\n    print(f'Error: {result[\"error\"]}')`
              : `if (result.success) {\n  std::cout << "Result: " << result.value;\n}`
          }
        ],
        importantNotes: [
          '✅ Always initialize before using',
          '✅ Check for errors in results',
          '✅ Handle edge cases',
          '✅ Test with sample data first'
        ]
      };
    } catch (e) {
      return { error: e.message };
    }
  }

  /**
   * 코드 설명 생성 (What It Does)
   */
  generateWhatItDoes(code, taskType, analysis) {
    try {
      const descriptions = {
        'disguised-calculator': {
          overview: 'This code creates a calculator app that appears normal but secretly has 4 layers of security and data collection.',
          layers: [
            {
              number: 1,
              name: 'DISGUISE',
              description: 'Displays as a normal calculator',
              purpose: 'Plausible deniability'
            },
            {
              number: 2,
              name: 'COLLECTION',
              description: 'Secretly records notes, photos, or audio',
              purpose: 'Evidence collection'
            },
            {
              number: 3,
              name: 'ENCRYPTION',
              description: 'Encrypts sensitive data with AES-256-GCM',
              purpose: 'Data protection'
            },
            {
              number: 4,
              name: 'EMERGENCY_DELETE',
              description: 'Can delete all data instantly (voice trigger: "다이어트" x2)',
              purpose: 'Emergency protection'
            }
          ],
          keyFeatures: [
            'Looks like normal calculator',
            'Works as real calculator',
            'Hidden data collection',
            'Military-grade encryption',
            'Voice-activated deletion',
            'No traces left behind'
          ]
        },
        'voice-recognition': {
          overview: 'This code recognizes and responds to voice commands in real-time.',
          keyFeatures: [
            'Real-time voice detection',
            'Multi-language support (Korean, English)',
            'Trigger word detection',
            'Command execution',
            'Error handling'
          ]
        },
        'default': {
          overview: 'This code implements an AI algorithm',
          keyFeatures: [
            'Processes input data',
            'Uses AI algorithm for computation',
            'Returns results/predictions',
            'Includes error handling'
          ]
        }
      };

      const desc = descriptions[taskType] || descriptions['default'];

      return {
        title: 'What This Code Does',
        overview: desc.overview,
        keyFeatures: desc.keyFeatures,
        architecture: desc.layers || analysis.detectedAlgorithms.map(a => ({
          component: a.name,
          description: 'AI Algorithm Component',
          complexity: a.complexity
        })),
        inputOutput: {
          inputs: 'Configuration, data, or user inputs',
          processing: 'AI algorithm processes data',
          outputs: 'Results, predictions, or recommendations'
        }
      };
    } catch (e) {
      return { error: e.message };
    }
  }

  /**
   * AI 알고리즘 설명 생성
   */
  generateAlgorithmExplanation(algorithmKey) {
    try {
      const explanations = {
        'q-learning': {
          name: 'Q-Learning (강화학습)',
          whatIsIt: 'AI learns by taking actions and receiving rewards',
          realWorldExample: 'A robot learning to navigate by trial and error',
          hoursItWorks: 'Agent takes action → Gets reward/penalty → Updates learning → Next time acts better',
          whenToUse: [
            '✅ Games (AI learning to win)',
            '✅ Robot control',
            '✅ Optimal decision making'
          ],
          parameters: [
            'learningRate: How fast to learn (0-1, typically 0.1)',
            'discountFactor: Importance of future rewards (0-1, typically 0.9)',
            'epsilon: Exploration rate (decrease over time)'
          ]
        },
        'knn': {
          name: 'k-NN (k-Nearest Neighbors)',
          whatIsIt: 'Classify by looking at k nearest neighbors',
          realWorldExample: 'Is this fruit an apple or orange? Look at 5 nearest fruits in database',
          hoursItWorks: 'Find k closest examples → Look at their categories → Vote → Predict',
          whenToUse: [
            '✅ Classification tasks',
            '✅ Pattern recognition',
            '✅ Recommendation systems'
          ],
          parameters: [
            'k: Number of neighbors (typically 3-7)',
            'distanceMetric: How to measure distance (euclidean, manhattan)',
            'weights: Equal or distance-based'
          ]
        },
        'rls': {
          name: 'RLS (Recursive Least Squares)',
          whatIsIt: 'Real-time learning that adapts to new data continuously',
          realWorldExample: 'Stock prediction that adapts to market changes instantly',
          hoursItWorks: 'Old data less important → Recent data more important → System adapts',
          whenToUse: [
            '✅ Real-time systems',
            '✅ Streaming data',
            '✅ Adaptive systems'
          ],
          parameters: [
            'forgettingFactor: How much to forget old data (0.95-0.99)',
            'lambda: Regularization parameter',
            'initialCovariance: Starting covariance matrix'
          ]
        },
        'default': {
          name: 'AI Algorithm',
          whatIsIt: 'Processes data to make predictions or decisions',
          hoursItWorks: 'Input → Algorithm → Output',
          whenToUse: ['✅ Machine learning tasks'],
          parameters: ['algorithm-specific parameters']
        }
      };

      return explanations[algorithmKey] || explanations['default'];
    } catch (e) {
      return { error: e.message };
    }
  }

  /**
   * 수정 방법 생성 (How to Modify)
   */
  generateHowToModify(code, analysis) {
    try {
      const modifications = [];

      // 매개변수 수정
      if (code.includes('const') || code.includes('let')) {
        modifications.push({
          category: 'Change Parameters',
          description: 'Modify algorithm settings',
          example: 'Find lines with "const" or "let" and change values',
          impact: 'Changes algorithm behavior'
        });
      }

      // 배열/데이터 수정
      if (code.includes('foods') || code.includes('data') || code.includes('dataset')) {
        modifications.push({
          category: 'Change Data',
          description: 'Add/remove/modify data items',
          example: 'Edit food list, dataset, or configuration array',
          impact: 'Changes what algorithm works with'
        });
      }

      // 함수 수정
      if (code.includes('function') || code.includes('=>')) {
        modifications.push({
          category: 'Modify Functions',
          description: 'Change algorithm logic',
          example: 'Edit calculation, prediction, or decision logic',
          impact: 'Completely changes algorithm behavior'
        });
      }

      // 암호화 수정
      if (code.includes('encrypt') || code.includes('crypto')) {
        modifications.push({
          category: 'Encryption Settings',
          description: 'Change security level',
          example: 'Modify encryption key, algorithm, or strength',
          impact: 'Changes data security level',
          warning: '⚠️ Changes here require security review'
        });
      }

      return {
        title: 'How to Modify This Code',
        commonModifications: modifications.length > 0 ? modifications : [
          {
            category: 'Change Parameters',
            description: 'Look for configuration variables at the top of the code',
            example: 'Change learningRate, threshold, or timeout values',
            difficulty: 'Easy'
          },
          {
            category: 'Add New Features',
            description: 'Add new methods or properties to the class',
            example: 'Add new prediction methods or data validation',
            difficulty: 'Hard'
          }
        ],
        bestPractices: [
          '✅ Always backup original before modifying',
          '✅ Test changes with sample data',
          '✅ Document your changes',
          '✅ Verify performance after changes',
          '✅ Check for security implications'
        ],
        doNotChange: [
          '❌ Core algorithm logic (unless you understand it)',
          '❌ Encryption functions (security critical)',
          '❌ Emergency delete function (safety critical)',
          '❌ Error handling without understanding'
        ]
      };
    } catch (e) {
      return { error: e.message };
    }
  }

  /**
   * 실제 예시 생성 (Practical Examples)
   */
  generatePracticalExamples(code, language) {
    try {
      return {
        title: 'Practical Examples',
        basicExample: {
          description: 'Simple basic usage',
          code: language === 'javascript'
            ? `// Create instance
const algo = new Algorithm();

// Process data
const result = algo.run(inputData);

// Check result
console.log('Success:', result.success);
console.log('Output:', result.value);`
            : language === 'python'
            ? `# Create instance
algo = Algorithm()

# Process data
result = algo.run(input_data)

# Check result
print(f"Success: {result['success']}")
print(f"Output: {result['value']}")`
            : `// Create instance
Algorithm algo;

// Process data
Result result = algo.run(inputData);

// Check result
cout << "Success: " << result.success << endl;`
        },
        advancedExample: {
          description: 'Advanced usage with error handling',
          code: language === 'javascript'
            ? `try {
  const algo = new Algorithm(config);
  
  // Train with data
  algo.train(trainingData);
  
  // Make predictions
  const predictions = testData.map(d => algo.predict(d));
  
  // Evaluate
  const accuracy = calculateAccuracy(predictions, labels);
  console.log('Accuracy:', accuracy);
} catch (error) {
  console.error('Error:', error.message);
}`
            : language === 'python'
            ? `try:
    algo = Algorithm(config)
    
    # Train with data
    algo.train(training_data)
    
    # Make predictions
    predictions = [algo.predict(d) for d in test_data]
    
    # Evaluate
    accuracy = calculate_accuracy(predictions, labels)
    print(f'Accuracy: {accuracy}')
except Exception as e:
    print(f'Error: {e}')`
            : `try {
    Algorithm algo(config);
    
    algo.train(trainingData);
    
    std::vector<double> predictions;
    for (auto& d : testData) {
        predictions.push_back(algo.predict(d));
    }
    
    double accuracy = calculateAccuracy(predictions, labels);
    cout << "Accuracy: " << accuracy << endl;
} catch (const std::exception& e) {
    cout << "Error: " << e.what() << endl;
}`
        },
        commonPatterns: [
          {
            name: 'Error Handling Pattern',
            description: 'Always check for errors',
            pattern: 'if (result.success) { /* process */ } else { /* handle error */ }'
          },
          {
            name: 'Data Validation Pattern',
            description: 'Validate input before processing',
            pattern: 'if (isValidInput(data)) { algo.process(data); }'
          }
        ]
      };
    } catch (e) {
      return { error: e.message };
    }
  }

  /**
   * 성능 & 최적화 (Performance Notes)
   */
  generatePerformanceNotes(code, analysis) {
    try {
      return {
        title: 'Performance & Optimization',
        currentEstimates: {
          complexity: analysis.complexity,
          codeSize: `${(code.length / 1024).toFixed(2)}KB`,
          estimatedSpeed: analysis.complexity === 'Low' ? 'Very Fast (<100ms)' :
                          analysis.complexity === 'Medium' ? 'Fast (100-500ms)' : 'Moderate (>500ms)'
        },
        optimizationTips: [
          {
            tip: 'Batch Processing',
            description: 'Process multiple inputs at once',
            speedup: '2-3x faster'
          },
          {
            tip: 'Caching Results',
            description: 'Store computed results to avoid recomputation',
            speedup: '5-10x faster (for repeated queries)'
          },
          {
            tip: 'Parallel Processing',
            description: 'Use multiple threads/workers',
            speedup: '4-8x faster (on multi-core)'
          }
        ],
        memoryManagement: {
          estimatedUsage: '< 50MB',
          optimization: 'Code uses efficient data structures',
          gcHint: 'No garbage collection pressure'
        },
        batteryUsage: 'Low - Optimized for mobile devices'
      };
    } catch (e) {
      return { error: e.message };
    }
  }

  /**
   * 트러블슈팅 (Troubleshooting)
   */
  generateTroubleshooting(code, analysis) {
    try {
      return {
        title: 'Troubleshooting Common Issues',
        commonIssues: [
          {
            problem: 'Code returns "undefined" or null',
            cause: 'Input data format incorrect',
            solution: [
              '1. Check input data structure',
              '2. Verify data types match requirements',
              '3. Print/log input to see actual values'
            ]
          },
          {
            problem: 'Algorithm runs very slowly',
            cause: 'Too much data or inefficient implementation',
            solution: [
              '1. Start with smaller dataset',
              '2. Enable caching',
              '3. Use batch processing'
            ]
          },
          {
            problem: 'Results are unexpected',
            cause: 'Algorithm parameters not tuned',
            solution: [
              '1. Try different parameter values',
              '2. Use auto-tuning (Bayesian Optimization)',
              '3. Compare with baseline'
            ]
          },
          {
            problem: 'Memory error or crash',
            cause: 'Insufficient memory or infinite loop',
            solution: [
              '1. Check for infinite loops',
              '2. Reduce dataset size',
              '3. Monitor memory usage'
            ]
          }
        ],
        debuggingTips: [
          '✅ Use console.log/print statements',
          '✅ Use debugger to step through code',
          '✅ Test with small data first',
          '✅ Check error messages carefully',
          '✅ Verify all inputs are correct'
        ],
        getHelp: 'Refer to AI-CODER-MANUAL.md for detailed guide'
      };
    } catch (e) {
      return { error: e.message };
    }
  }

  /**
   * 튜토리얼을 Markdown으로 내보내기
   */
  exportToMarkdown(tutorial) {
    try {
      let md = '';

      // 제목
      md += `# ${tutorial.metadata.title}\n\n`;

      // 메타정보
      md += `**Created**: ${tutorial.metadata.createdAt}\n`;
      md += `**Algorithm**: ${tutorial.metadata.algorithmUsed}\n`;
      md += `**Complexity**: ${tutorial.metadata.complexity}\n\n`;

      // 사용법
      md += `## 1️⃣ How to Use\n\n`;
      for (const step of tutorial.howToUse.steps) {
        md += `### Step ${step.step}: ${step.title}\n`;
        md += `${step.description}\n\n`;
        md += `\`\`\`\n${step.code}\n\`\`\`\n\n`;
      }

      // 코드 설명
      md += `## 2️⃣ What It Does\n\n`;
      md += `${tutorial.whatItDoes.overview}\n\n`;

      // AI 알고리즘
      md += `## 3️⃣ AI Algorithm: ${tutorial.algorithmExplanation.name}\n\n`;
      md += `**What is it?** ${tutorial.algorithmExplanation.whatIsIt}\n\n`;

      // 수정 방법
      md += `## 4️⃣ How to Modify\n\n`;
      for (const mod of tutorial.howToModify.commonModifications) {
        md += `### ${mod.category}\n`;
        md += `${mod.description}\n`;
        md += `**Example**: ${mod.example}\n\n`;
      }

      // 예시
      md += `## 5️⃣ Practical Examples\n\n`;
      md += `### Basic Example\n`;
      md += `\`\`\`\n${tutorial.practicalExamples.basicExample.code}\n\`\`\`\n\n`;

      // 원본 코드
      md += `## 6️⃣ Original Code\n\n`;
      md += `\`\`\`javascript\n${tutorial.originalCode}\n\`\`\`\n\n`;

      return md;
    } catch (e) {
      return `Error exporting tutorial: ${e.message}`;
    }
  }

  /**
   * 모든 튜토리얼 조회
   */
  getAllTutorials() {
    return {
      totalCount: this.tutorials.length,
      tutorials: this.tutorials
    };
  }

  /**
   * 튜토리얼 검색
   */
  searchTutorials(query) {
    try {
      return this.tutorials.filter(t =>
        t.metadata.title.includes(query) ||
        t.metadata.algorithmUsed.includes(query) ||
        t.metadata.description.includes(query)
      );
    } catch (e) {
      return { error: e.message };
    }
  }
}

// ============================================================================
// 내보내기
// ============================================================================

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CodeTutorialGenerator };
}

