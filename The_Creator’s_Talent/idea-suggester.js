class IdeaSuggester {
  constructor() {
    // AI 알고리즘 특성 데이터베이스
    this.algorithmDatabase = {
      'q-learning': {
        name: 'Q-Learning',
        type: 'reinforcement',
        dataSize: 'small-medium',
        realtime: true,
        constraints: ['batch-friendly'],
        strengths: ['learns from interactions', 'sample efficient'],
        weaknesses: ['slow convergence', 'exploration cost'],
        complexity: 'O(1) per update',
        energy: 'medium'
      },
      'knn': {
        name: 'k-NN',
        type: 'classification',
        dataSize: 'small-medium',
        realtime: false,
        constraints: ['memory-intensive'],
        strengths: ['simple', 'interpretable'],
        weaknesses: ['O(n) inference', 'feature scaling needed'],
        complexity: 'O(n*d)',
        energy: 'high'
      },
      'rls': {
        name: 'Recursive Least Squares',
        type: 'regression',
        dataSize: 'large',
        realtime: true,
        constraints: ['numerical stability'],
        strengths: ['real-time adaptive', 'forgetting factor'],
        weaknesses: ['matrix inversion', 'covariance maintenance'],
        complexity: 'O(d²)',
        energy: 'medium'
      },
      'genetic-algorithm': {
        name: 'Genetic Algorithm',
        type: 'optimization',
        dataSize: 'any',
        realtime: false,
        constraints: ['slow', 'population-based'],
        strengths: ['global optimization', 'flexible fitness'],
        weaknesses: ['slow convergence', 'high population cost'],
        complexity: 'O(p*g*n)',
        energy: 'very-high'
      },
      'pso': {
        name: 'Particle Swarm Optimization',
        type: 'optimization',
        dataSize: 'any',
        realtime: false,
        constraints: ['swarm-based'],
        strengths: ['fast convergence', 'parallelizable'],
        weaknesses: ['parameter tuning', 'local optima'],
        complexity: 'O(p*d)',
        energy: 'high'
      },
      'isolation-forest': {
        name: 'Isolation Forest',
        type: 'anomaly-detection',
        dataSize: 'large',
        realtime: true,
        constraints: ['tree-based'],
        strengths: ['detects outliers', 'handles high dimensions'],
        weaknesses: ['requires good thresholds'],
        complexity: 'O(t*n*log n)',
        energy: 'low'
      },
      'lstm': {
        name: 'LSTM',
        type: 'sequence',
        dataSize: 'large',
        realtime: false,
        constraints: ['gpu-friendly', 'long training'],
        strengths: ['long-term dependencies', 'time-series'],
        weaknesses: ['slow training', 'complex'],
        complexity: 'O(n*h²)',
        energy: 'very-high'
      },
      'bayesian-optimization': {
        name: 'Bayesian Optimization',
        type: 'hyperparameter',
        dataSize: 'any',
        realtime: false,
        constraints: ['expensive evaluations'],
        strengths: ['sample efficient', 'principled approach'],
        weaknesses: ['slower than grid search for small spaces'],
        complexity: 'O(n³)',
        energy: 'high'
      }
    };

    // 신박한 아이디어 템플릿
    this.ideaTemplates = [
      {
        category: 'ensemble',
        template: 'Combine {algo1} and {algo2} with voting/stacking',
        impact: '+15% accuracy'
      },
      {
        category: 'adaptive',
        template: 'Use adaptive algorithm: switch to {algo2} when {condition}',
        impact: '+20% efficiency'
      },
      {
        category: 'optimization',
        template: 'Add {optimizer} for automatic hyperparameter tuning',
        impact: '3x faster convergence'
      },
      {
        category: 'monitoring',
        template: 'Track {metric} in real-time and auto-adjust {parameter}',
        impact: '+10% robustness'
      },
      {
        category: 'energy',
        template: 'Monitor battery/resource level and scale down to {lighter-algo}',
        impact: '+50% battery life'
      },
      {
        category: 'privacy',
        template: 'Add differential privacy to {algo} for safe data handling',
        impact: '100% privacy-preserving'
      },
      {
        category: 'interpretability',
        template: 'Use LIME/SHAP to explain {algo} decisions',
        impact: 'Fully interpretable'
      },
      {
        category: 'robustness',
        template: 'Add adversarial training to {algo}',
        impact: '10x more robust'
      }
    ];
  }

  /**
   * 코드 분석 (어떤 알고리즘 사용 중?)
   */
  analyzeCode(code) {
    try {
      const analysis = {
        detectedAlgorithms: [],
        codeLength: code.length,
        complexity: this.analyzeComplexity(code),
        hasLoops: /for\s*\(|while\s*\(/.test(code),
        hasRecursion: /function\s+\w+[\s\S]*\1\s*\(/.test(code),
        usesStorage: /localStorage|IndexedDB|localStorage/.test(code),
        usesNetwork: /fetch|XMLHttpRequest|WebSocket/.test(code),
        usesGPU: /WebGL|GPU/.test(code),
        parallelizable: false
      };

      // 알고리즘 감지
      if (code.includes('Q-Learning') || code.includes('QLearn')) {
        analysis.detectedAlgorithms.push('q-learning');
      }
      if (code.includes('k-NN') || code.includes('KNN')) {
        analysis.detectedAlgorithms.push('knn');
      }
      if (code.includes('RLS') || code.includes('Recursive')) {
        analysis.detectedAlgorithms.push('rls');
      }
      if (code.includes('Genetic') || code.includes('GA')) {
        analysis.detectedAlgorithms.push('genetic-algorithm');
      }
      if (code.includes('PSO') || code.includes('Swarm')) {
        analysis.detectedAlgorithms.push('pso');
      }
      if (code.includes('Isolation')) {
        analysis.detectedAlgorithms.push('isolation-forest');
      }
      if (code.includes('LSTM')) {
        analysis.detectedAlgorithms.push('lstm');
      }

      // 병렬화 가능성
      analysis.parallelizable = analysis.hasLoops && !analysis.hasRecursion;

      return analysis;
    } catch (e) {
      console.error('[IdeaSuggester] Code analysis failed:', e.message);
      return {
        detectedAlgorithms: [],
        error: e.message
      };
    }
  }

  /**
   * 복잡도 분석
   */
  analyzeComplexity(code) {
    let complexity = 'O(1)';

    if (/for\s*\(.*\.length/.test(code)) {
      if (/for\s*\(.*for\s*\(/.test(code)) {
        complexity = 'O(n²)';
      } else {
        complexity = 'O(n)';
      }
    }

    if (code.includes('recursion') || code.includes('recursive')) {
      complexity += ' [recursive]';
    }

    return complexity;
  }

  /**
   * 문제 특성 파악
   */
  identifyProblemCharacteristics(context) {
    try {
      const characteristics = {
        dataSize: 'unknown',
        realtimeRequired: false,
        constraintType: 'none',
        priority: 'accuracy'  // 'accuracy', 'speed', 'energy', 'memory'
      };

      // 데이터 크기 감지
      if (context.includes('1M') || context.includes('million')) {
        characteristics.dataSize = 'large';
      } else if (context.includes('1K') || context.includes('thousand')) {
        characteristics.dataSize = 'medium';
      } else {
        characteristics.dataSize = 'small';
      }

      // 실시간 요구사항
      if (context.includes('real-time') || context.includes('instant')) {
        characteristics.realtimeRequired = true;
      }

      // 제약조건
      if (context.includes('battery') || context.includes('mobile')) {
        characteristics.constraintType = 'energy';
        characteristics.priority = 'energy';
      }
      if (context.includes('memory') || context.includes('embedded')) {
        characteristics.constraintType = 'memory';
      }
      if (context.includes('accurate') || context.includes('precision')) {
        characteristics.priority = 'accuracy';
      }

      return characteristics;
    } catch (e) {
      return {
        dataSize: 'unknown',
        realtimeRequired: false,
        constraintType: 'none',
        priority: 'accuracy'
      };
    }
  }

  /**
   * 알고리즘 추천
   */
  recommendAlgorithms(characteristics) {
    try {
      const recommendations = [];

      for (const [key, algo] of Object.entries(this.algorithmDatabase)) {
        let score = 0;

        // 실시간 요구사항
        if (characteristics.realtimeRequired && algo.realtime) {
          score += 20;
        }

        // 에너지 제약
        if (characteristics.constraintType === 'energy') {
          if (algo.energy === 'low') score += 30;
          else if (algo.energy === 'medium') score += 10;
          else score -= 20;
        }

        // 데이터 크기
        if (algo.dataSize.includes(characteristics.dataSize)) {
          score += 20;
        }

        // 우선순위
        if (characteristics.priority === 'accuracy' && algo.strengths.length > 0) {
          score += 10;
        }

        if (score > 0) {
          recommendations.push({
            algorithm: algo.name,
            score,
            strengths: algo.strengths,
            weaknesses: algo.weaknesses
          });
        }
      }

      // 점수순 정렬
      recommendations.sort((a, b) => b.score - a.score);

      return recommendations.slice(0, 3);  // 상위 3개
    } catch (e) {
      console.error('[IdeaSuggester] Algorithm recommendation failed:', e.message);
      return [];
    }
  }

  /**
   * 신박한 아이디어 생성
   */
  generateNovelIdeas(currentAlgorithms, characteristics) {
    try {
      const ideas = [];

      // 1. 앙상블 제안
      if (currentAlgorithms.length >= 1) {
        const algo1 = currentAlgorithms[0];
        const algo2 = currentAlgorithms[1] || 'RLS';

        ideas.push({
          category: 'ensemble',
          title: `Ensemble: ${algo1} + ${algo2}`,
          description: `Combine ${algo1} and ${algo2} with voting or stacking`,
          impact: '+15% accuracy',
          implementationTime: '2 hours',
          difficulty: 'medium'
        });
      }

      // 2. 적응형 AI 제안
      if (characteristics.realtimeRequired) {
        ideas.push({
          category: 'adaptive',
          title: 'Adaptive Algorithm Switching',
          description: 'Automatically switch algorithms based on data characteristics',
          impact: '+20% efficiency',
          implementationTime: '4 hours',
          difficulty: 'hard'
        });
      }

      // 3. 에너지 효율 제안
      if (characteristics.constraintType === 'energy') {
        ideas.push({
          category: 'energy',
          title: 'Battery-Aware AI Scaling',
          description: 'Monitor battery level and scale down to lighter algorithms',
          impact: '+50% battery life',
          implementationTime: '3 hours',
          difficulty: 'easy'
        });
      }

      // 4. 자동 하이퍼파라미터 튜닝
      ideas.push({
        category: 'optimization',
        title: 'Bayesian Hyperparameter Optimization',
        description: 'Automatically tune hyperparameters using Bayesian approach',
        impact: '3x faster convergence',
        implementationTime: '5 hours',
        difficulty: 'hard'
      });

      // 5. 실시간 모니터링
      ideas.push({
        category: 'monitoring',
        title: 'Real-Time Performance Monitoring',
        description: 'Track accuracy, latency, memory, energy in real-time',
        impact: '+10% robustness',
        implementationTime: '2 hours',
        difficulty: 'easy'
      });

      // 6. 설명 가능 AI
      if (!characteristics.realtimeRequired) {
        ideas.push({
          category: 'interpretability',
          title: 'Explainable AI (XAI)',
          description: 'Add LIME or SHAP for model interpretability',
          impact: 'Fully interpretable decisions',
          implementationTime: '3 hours',
          difficulty: 'medium'
        });
      }

      return ideas;
    } catch (e) {
      console.error('[IdeaSuggester] Idea generation failed:', e.message);
      return [];
    }
  }

  /**
   * 성능 개선 제안
   */
  suggestPerformanceImprovements(analysis, characteristics) {
    try {
      const suggestions = [];

      // 1. 복잡도 기반
      if (analysis.complexity.includes('O(n²)')) {
        suggestions.push({
          type: 'complexity',
          current: 'O(n²)',
          proposed: 'O(n log n)',
          method: 'Use sorting or tree-based approach',
          speedup: '10-100x'
        });
      }

      // 2. 메모리 기반
      if (analysis.usesStorage) {
        suggestions.push({
          type: 'memory',
          issue: 'Using localStorage (limited capacity)',
          solution: 'Consider IndexedDB or compression',
          improvement: '10-100x more storage'
        });
      }

      // 3. 병렬화
      if (analysis.parallelizable && !analysis.usesGPU) {
        suggestions.push({
          type: 'parallelization',
          current: 'Single-threaded',
          proposed: 'Web Workers / Goroutines / Threads',
          speedup: 'Up to 4-8x on multi-core'
        });
      }

      // 4. 캐싱
      if (analysis.hasLoops) {
        suggestions.push({
          type: 'caching',
          method: 'Memoization or LRU cache',
          improvement: '50-90% faster (if repeated)'
        });
      }

      // 5. 알고리즘 선택
      if (characteristics.dataSize === 'large' && analysis.complexity === 'O(n)') {
        suggestions.push({
          type: 'algorithm-selection',
          issue: 'Current O(n) might be too slow for large data',
          solution: 'Use O(log n) or O(1) algorithm',
          example: 'Binary search, Hash table lookup'
        });
      }

      return suggestions;
    } catch (e) {
      console.error('[IdeaSuggester] Performance suggestion failed:', e.message);
      return [];
    }
  }

  /**
   * 완전한 분석 & 제안
   */
  analyzeAndSuggest(code, context = '') {
    try {
      // 1. 코드 분석
      const analysis = this.analyzeCode(code);

      // 2. 문제 특성 파악
      const characteristics = this.identifyProblemCharacteristics(context);

      // 3. 알고리즘 추천
      const recommendations = this.recommendAlgorithms(characteristics);

      // 4. 신박한 아이디어
      const ideas = this.generateNovelIdeas(
        analysis.detectedAlgorithms.length > 0 ? analysis.detectedAlgorithms : 
        recommendations.map(r => r.algorithm.toLowerCase()),
        characteristics
      );

      // 5. 성능 개선
      const improvements = this.suggestPerformanceImprovements(analysis, characteristics);

      return {
        analysis,
        characteristics,
        recommendations,
        ideas,
        improvements,
        summary: {
          totalSuggestions: ideas.length + improvements.length,
          estimatedSpeedup: '2-5x',
          estimatedAccuracyGain: '10-20%'
        }
      };
    } catch (e) {
      console.error('[IdeaSuggester] Full analysis failed:', e.message);
      return {
        error: e.message,
        analysis: null
      };
    }
  }

  /**
   * 간단한 추천 (대화형)
   */
  quickRecommendation(problem) {
    try {
      if (problem.includes('classify')) {
        return 'k-NN or Decision Tree';
      }
      if (problem.includes('optimize')) {
        return 'Genetic Algorithm or PSO';
      }
      if (problem.includes('predict')) {
        return 'RLS or LSTM';
      }
      if (problem.includes('anomaly')) {
        return 'Isolation Forest';
      }
      if (problem.includes('real-time')) {
        return 'Q-Learning or RLS';
      }

      return 'Context-dependent';
    } catch (e) {
      return 'Error in recommendation';
    }
  }
}

// ============================================================================
// 내보내기
// ============================================================================

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { IdeaSuggester };
}

