/**
 * ============================================================================
 * ADVANCED ALGORITHMS (추가 5개 신박한 AI)
 * ============================================================================
 * 
 * 포함 알고리즘:
 * 6. Genetic Algorithm (진화 기반 최적화)
 * 7. Particle Swarm Optimization (군집 지능)
 * 8. Simulated Annealing (물리 냉각 기반 최적화)
 * 9. Bayesian Optimization (자동 하이퍼파라미터 튜닝)
 * 10. Isolation Forest (이상 탐지)
 * 
 * 특징: 복잡한 최적화 문제 해결, 실시간 적응, 신박한 알고리즘
 * ============================================================================
 */

// ============================================================================
// 6. GENETIC ALGORITHM (유전 알고리즘)
// ============================================================================

class GeneticAlgorithm {
  constructor(config = {}) {
    this.populationSize = config.populationSize || 50;
    this.mutationRate = config.mutationRate || 0.1;
    this.crossoverRate = config.crossoverRate || 0.8;
    this.generations = config.generations || 100;
    this.eliteSize = config.eliteSize || Math.floor(this.populationSize * 0.1);
    
    this.population = [];
    this.fitnessHistory = [];
    this.bestSolution = null;
    this.generationCount = 0;
  }

  /**
   * 개체 생성
   */
  createIndividual(genes = 10) {
    return Array.from({ length: genes }, () => Math.random());
  }

  /**
   * 적합도 평가 (사용자 정의 함수)
   */
  evaluateFitness(individual, fitnessFunc) {
    try {
      return fitnessFunc(individual);
    } catch (e) {
      console.warn('[GA] Fitness evaluation failed:', e.message);
      return 0;
    }
  }

  /**
   * 초기 모집단 생성
   */
  initPopulation(genes = 10) {
    this.population = Array.from(
      { length: this.populationSize },
      () => this.createIndividual(genes)
    );
  }

  /**
   * 단일 포인트 교차
   */
  crossover(parent1, parent2) {
    if (Math.random() > this.crossoverRate) {
      return [...parent1];
    }

    const point = Math.floor(Math.random() * parent1.length);
    return [...parent1.slice(0, point), ...parent2.slice(point)];
  }

  /**
   * 돌연변이
   */
  mutate(individual) {
    return individual.map(gene =>
      Math.random() < this.mutationRate
        ? Math.random()  // 완전히 새로운 유전자
        : gene + (Math.random() - 0.5) * 0.1  // 작은 변화
    ).map(g => Math.max(0, Math.min(1, g)));  // [0, 1] 범위로 클램핑
  }

  /**
   * 한 세대 진화
   */
  evolve(fitnessFunc) {
    try {
      // 1. 적합도 계산
      const fitness = this.population.map(ind => 
        this.evaluateFitness(ind, fitnessFunc)
      );

      // 2. 최고 적합도 추적
      const maxFitness = Math.max(...fitness);
      this.fitnessHistory.push(maxFitness);

      // 3. 최고 해 저장
      const bestIdx = fitness.indexOf(maxFitness);
      this.bestSolution = this.population[bestIdx];

      // 4. 선택 (토너먼트)
      const selected = [];
      for (let i = 0; i < this.populationSize - this.eliteSize; i++) {
        const idx1 = Math.floor(Math.random() * this.populationSize);
        const idx2 = Math.floor(Math.random() * this.populationSize);
        selected.push(
          fitness[idx1] > fitness[idx2]
            ? this.population[idx1]
            : this.population[idx2]
        );
      }

      // 5. 엘리트 보존
      const elite = this.population
        .map((ind, idx) => ({ ind, fitness: fitness[idx] }))
        .sort((a, b) => b.fitness - a.fitness)
        .slice(0, this.eliteSize)
        .map(x => x.ind);

      // 6. 새 모집단 생성 (교차 + 돌연변이)
      this.population = [
        ...elite,
        ...selected.map(parent => {
          const partner = selected[Math.floor(Math.random() * selected.length)];
          const child = this.crossover(parent, partner);
          return this.mutate(child);
        })
      ];

      this.generationCount++;
    } catch (e) {
      console.error('[GA] Evolution failed:', e.message);
    }
  }

  /**
   * 최적화 실행
   */
  optimize(fitnessFunc, maxGenerations = null) {
    const gens = maxGenerations || this.generations;

    for (let g = 0; g < gens; g++) {
      this.evolve(fitnessFunc);
    }

    return {
      bestSolution: this.bestSolution,
      bestFitness: this.fitnessHistory[this.fitnessHistory.length - 1],
      generations: this.generationCount,
      history: this.fitnessHistory
    };
  }
}

// ============================================================================
// 7. PARTICLE SWARM OPTIMIZATION (입자군 최적화)
// ============================================================================

class ParticleSwarmOptimization {
  constructor(config = {}) {
    this.particleCount = config.particleCount || 30;
    this.inertia = config.inertia || 0.7;
    this.cognition = config.cognition || 1.5;  // 입자 자신의 최고값
    this.social = config.social || 1.5;         // 군집의 최고값
    
    this.particles = [];
    this.globalBest = null;
    this.globalBestFitness = -Infinity;
    this.iterationCount = 0;
  }

  /**
   * 입자 생성
   */
  createParticle(dimensions = 10) {
    return {
      position: Array.from({ length: dimensions }, () => Math.random()),
      velocity: Array.from({ length: dimensions }, () => (Math.random() - 0.5) * 2),
      bestPosition: null,
      bestFitness: -Infinity
    };
  }

  /**
   * 입자 초기화
   */
  initParticles(dimensions = 10) {
    this.particles = Array.from(
      { length: this.particleCount },
      () => this.createParticle(dimensions)
    );
  }

  /**
   * 한 반복
   */
  iterate(fitnessFunc) {
    try {
      for (let i = 0; i < this.particles.length; i++) {
        const particle = this.particles[i];

        // 1. 적합도 평가
        const fitness = fitnessFunc(particle.position);

        // 2. 개인 최고값 업데이트
        if (fitness > particle.bestFitness) {
          particle.bestFitness = fitness;
          particle.bestPosition = [...particle.position];
        }

        // 3. 전역 최고값 업데이트
        if (fitness > this.globalBestFitness) {
          this.globalBestFitness = fitness;
          this.globalBest = [...particle.position];
        }

        // 4. 속도 업데이트 (PSO 공식)
        for (let j = 0; j < particle.velocity.length; j++) {
          const r1 = Math.random();
          const r2 = Math.random();

          particle.velocity[j] =
            this.inertia * particle.velocity[j] +
            this.cognition * r1 * (particle.bestPosition[j] - particle.position[j]) +
            this.social * r2 * (this.globalBest[j] - particle.position[j]);
        }

        // 5. 위치 업데이트
        for (let j = 0; j < particle.position.length; j++) {
          particle.position[j] += particle.velocity[j];
          // 범위 제한
          particle.position[j] = Math.max(0, Math.min(1, particle.position[j]));
        }
      }

      this.iterationCount++;
    } catch (e) {
      console.error('[PSO] Iteration failed:', e.message);
    }
  }

  /**
   * 최적화 실행
   */
  optimize(fitnessFunc, maxIterations = 100) {
    const dim = 10;  // 기본 차원
    this.initParticles(dim);

    for (let i = 0; i < maxIterations; i++) {
      this.iterate(fitnessFunc);
    }

    return {
      bestSolution: this.globalBest,
      bestFitness: this.globalBestFitness,
      iterations: this.iterationCount
    };
  }
}

// ============================================================================
// 8. SIMULATED ANNEALING (시뮬레이션 담금질)
// ============================================================================

class SimulatedAnnealing {
  constructor(config = {}) {
    this.initialTemp = config.initialTemp || 1000;
    this.coolingRate = config.coolingRate || 0.99;
    this.minTemp = config.minTemp || 0.01;
    
    this.currentSolution = null;
    this.currentFitness = -Infinity;
    this.bestSolution = null;
    this.bestFitness = -Infinity;
  }

  /**
   * 해 생성
   */
  generateSolution(dimensions = 10) {
    return Array.from({ length: dimensions }, () => Math.random());
  }

  /**
   * 이웃 해 생성 (작은 변화)
   */
  generateNeighbor(solution) {
    return solution.map(x => {
      const change = (Math.random() - 0.5) * 0.2;
      return Math.max(0, Math.min(1, x + change));
    });
  }

  /**
   * 최적화 실행
   */
  optimize(fitnessFunc, dimensions = 10) {
    try {
      let temp = this.initialTemp;
      this.currentSolution = this.generateSolution(dimensions);
      this.currentFitness = fitnessFunc(this.currentSolution);
      this.bestSolution = [...this.currentSolution];
      this.bestFitness = this.currentFitness;

      let iterations = 0;

      while (temp > this.minTemp) {
        // 1. 이웃 해 생성
        const neighbor = this.generateNeighbor(this.currentSolution);
        const neighborFitness = fitnessFunc(neighbor);

        // 2. 수용 결정
        const delta = neighborFitness - this.currentFitness;
        const acceptanceProbability = delta > 0
          ? 1
          : Math.exp(delta / temp);

        if (Math.random() < acceptanceProbability) {
          this.currentSolution = neighbor;
          this.currentFitness = neighborFitness;

          // 3. 최고값 업데이트
          if (neighborFitness > this.bestFitness) {
            this.bestFitness = neighborFitness;
            this.bestSolution = [...neighbor];
          }
        }

        // 4. 온도 감소
        temp *= this.coolingRate;
        iterations++;

        // 무한 루프 방지
        if (iterations > 10000) break;
      }

      return {
        bestSolution: this.bestSolution,
        bestFitness: this.bestFitness,
        iterations
      };
    } catch (e) {
      console.error('[SA] Optimization failed:', e.message);
      return {
        bestSolution: this.currentSolution,
        bestFitness: this.currentFitness,
        iterations: 0
      };
    }
  }
}

// ============================================================================
// 9. BAYESIAN OPTIMIZATION (베이지안 최적화)
// ============================================================================

class BayesianOptimization {
  constructor(config = {}) {
    this.observations = [];
    this.explorationWeight = config.explorationWeight || 1.96;  // UCB 상수
  }

  /**
   * 관찰 추가
   */
  addObservation(x, y) {
    try {
      if (Array.isArray(x) && typeof y === 'number') {
        this.observations.push({ x, y });
      }
    } catch (e) {
      console.warn('[BO] Observation add failed:', e.message);
    }
  }

  /**
   * 예측 (간단한 가우시안 프로세스 근사)
   */
  predict(x) {
    if (this.observations.length === 0) {
      return { mean: 0.5, std: 1.0 };
    }

    // 가장 가까운 관찰 찾기
    const distances = this.observations.map(obs => {
      let dist = 0;
      for (let i = 0; i < x.length; i++) {
        dist += (x[i] - obs.x[i]) ** 2;
      }
      return Math.sqrt(dist);
    });

    const minDist = Math.min(...distances);
    const avgY = this.observations.reduce((s, o) => s + o.y, 0) / this.observations.length;

    // 거리에 따른 예측
    const mean = avgY + (1 - minDist) * 0.3;
    const std = Math.sqrt(minDist + 0.1);

    return { mean, std };
  }

  /**
   * 다음 평가점 선택 (UCB 기반)
   */
  selectNextPoint(paramRanges) {
    let bestPoint = null;
    let bestUCB = -Infinity;

    // 그리드 검색 (간단함)
    const gridSize = 20;
    const candidates = Array.from({ length: gridSize }, (_, i) => {
      const point = paramRanges.map((range, idx) => {
        const step = (i ^ (idx * 7)) % gridSize;
        return range[0] + (range[1] - range[0]) * (step / gridSize);
      });
      return point;
    });

    for (const point of candidates) {
      const { mean, std } = this.predict(point);
      const ucb = mean + this.explorationWeight * std;

      if (ucb > bestUCB) {
        bestUCB = ucb;
        bestPoint = point;
      }
    }

    return bestPoint || paramRanges.map(r => (r[0] + r[1]) / 2);
  }

  /**
   * 최적화 실행
   */
  optimize(objectiveFunc, paramRanges, maxIterations = 20) {
    try {
      for (let i = 0; i < maxIterations; i++) {
        const point = this.selectNextPoint(paramRanges);
        const value = objectiveFunc(point);
        this.addObservation(point, value);
      }

      // 최고값 찾기
      const bestIdx = this.observations.reduce((best, obs, idx) =>
        obs.y > this.observations[best].y ? idx : best
      , 0);

      return {
        bestParams: this.observations[bestIdx].x,
        bestValue: this.observations[bestIdx].y,
        iterations: this.observations.length
      };
    } catch (e) {
      console.error('[BO] Optimization failed:', e.message);
      return { bestParams: null, bestValue: 0, iterations: 0 };
    }
  }
}

// ============================================================================
// 10. ISOLATION FOREST (이상 탐지)
// ============================================================================

class IsolationForest {
  constructor(config = {}) {
    this.treeCount = config.treeCount || 100;
    this.sampleSize = config.sampleSize || 256;
    this.trees = [];
  }

  /**
   * 트리 노드 생성
   */
  buildTree(data, depth = 0, maxDepth = null) {
    try {
      if (!maxDepth) {
        maxDepth = Math.ceil(Math.log2(data.length));
      }

      if (data.length <= 1 || depth >= maxDepth) {
        return { isLeaf: true, size: data.length };
      }

      // 특성 선택
      const featureIdx = Math.floor(Math.random() * data[0].length);

      // 분할값 선택
      const values = data.map(d => d[featureIdx]);
      const minVal = Math.min(...values);
      const maxVal = Math.max(...values);
      const splitValue = minVal + Math.random() * (maxVal - minVal);

      // 데이터 분할
      const left = data.filter(d => d[featureIdx] < splitValue);
      const right = data.filter(d => d[featureIdx] >= splitValue);

      return {
        isLeaf: false,
        featureIdx,
        splitValue,
        left: this.buildTree(left, depth + 1, maxDepth),
        right: this.buildTree(right, depth + 1, maxDepth)
      };
    } catch (e) {
      console.warn('[IF] Tree building failed:', e.message);
      return { isLeaf: true, size: data.length };
    }
  }

  /**
   * 이상 점수 계산
   */
  getAnomalyScore(point, tree, depth = 0) {
    try {
      if (tree.isLeaf) {
        return depth;  // 깊이가 깊을수록 정상
      }

      const value = point[tree.featureIdx];
      const nextTree = value < tree.splitValue ? tree.left : tree.right;
      return this.getAnomalyScore(point, nextTree, depth + 1);
    } catch (e) {
      return depth;
    }
  }

  /**
   * 포레스트 학습
   */
  fit(data) {
    try {
      this.trees = [];
      const n = Math.min(this.sampleSize, data.length);

      for (let t = 0; t < this.treeCount; t++) {
        // 샘플 선택
        const sample = [];
        for (let i = 0; i < n; i++) {
          const idx = Math.floor(Math.random() * data.length);
          sample.push(data[idx]);
        }

        // 트리 구축
        const tree = this.buildTree(sample);
        this.trees.push(tree);
      }
    } catch (e) {
      console.error('[IF] Fit failed:', e.message);
    }
  }

  /**
   * 이상 탐지
   */
  predict(data, threshold = 0.5) {
    try {
      return data.map(point => {
        const scores = this.trees.map(tree =>
          this.getAnomalyScore(point, tree)
        );

        const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
        const maxScore = Math.max(...scores);
        const anomalyScore = 1 - (avgScore / maxScore);

        return {
          point,
          anomalyScore: Math.min(1, anomalyScore),
          isAnomaly: anomalyScore > threshold
        };
      });
    } catch (e) {
      console.error('[IF] Prediction failed:', e.message);
      return [];
    }
  }
}

// ============================================================================
// 내보내기
// ============================================================================

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    GeneticAlgorithm,
    ParticleSwarmOptimization,
    SimulatedAnnealing,
    BayesianOptimization,
    IsolationForest
  };
}

