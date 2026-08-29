/**
 * ============================================================================
 * BASE ALGORITHMS (기본 5개 AI 엔진)
 * ============================================================================
 * 
 * 포함 알고리즘:
 * 1. Q-Learning (강화학습)
 * 2. Multi-Armed Bandit (의사결정)
 * 3. k-Nearest Neighbors (분류)
 * 4. Recursive Least Squares (실시간 학습)
 * 5. Thompson Sampling (확률 의사결정)
 * 
 * 특징: 완벽한 에러 처리, 다언어 호환성, 자동 최적화
 * ============================================================================
 */

// ============================================================================
// 1. Q-LEARNING ENGINE (강화학습)
// ============================================================================

class QLearnEngine {
  constructor(config = {}) {
    this.alpha = config.alpha || 0.1;           // 학습률
    this.gamma = config.gamma || 0.9;           // 할인율
    this.epsilon = config.epsilon || 0.2;       // 탐사율
    this.qTable = new Map();
    this.updateCount = 0;
    this.storageKey = 'ql_table_v1';
    this.maxStorageSize = 5 * 1024 * 1024;      // 5MB
    
    // 에러 처리: localStorage 로드
    try {
      this.loadQTable();
    } catch (e) {
      console.warn('[QLearn] Storage load failed:', e.message);
      this.qTable.clear();
    }
  }

  /**
   * 에러 처리: JSON 파싱 + localStorage 용량
   */
  loadQTable() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (!stored) return;

      const data = JSON.parse(stored);
      if (!Array.isArray(data)) throw new Error('Invalid format');

      this.qTable = new Map(data);
    } catch (e) {
      console.warn('[QLearn] Parse failed, resetting:', e.message);
      this.qTable.clear();
    }
  }

  /**
   * 에러 처리: 용량 초과 시 자동 정리
   */
  saveQTable() {
    try {
      const data = Array.from(this.qTable);
      const json = JSON.stringify(data);

      // 용량 체크
      if (json.length > this.maxStorageSize) {
        this.pruneOldStates();
        return this.saveQTable();  // 재귀 호출
      }

      localStorage.setItem(this.storageKey, json);
    } catch (e) {
      if (e.name === 'QuotaExceededError') {
        console.warn('[QLearn] Storage full, pruning oldest states');
        this.pruneOldStates();
        this.saveQTable();
      }
    }
  }

  /**
   * 에러 처리: 오래된 상태 삭제 (메모리 관리)
   */
  pruneOldStates() {
    const toDelete = Math.ceil(this.qTable.size * 0.2);  // 20% 삭제
    let deleted = 0;

    for (const [key, _] of this.qTable) {
      if (deleted >= toDelete) break;
      this.qTable.delete(key);
      deleted++;
    }
  }

  /**
   * 상태 키 생성 (에러 처리: null/undefined 방어)
   */
  getStateKey(state) {
    try {
      if (!state || typeof state !== 'object') {
        return 'default_state';
      }
      return JSON.stringify(state);
    } catch (e) {
      return 'error_state';
    }
  }

  /**
   * 행동 선택 (Epsilon-Greedy)
   */
  selectAction(state, actions = ['jump', 'wait'], training = true) {
    if (!actions || actions.length === 0) {
      return 'wait';  // 기본값
    }

    const key = this.getStateKey(state);

    // 탐사 (exploration)
    if (training && Math.random() < this.epsilon) {
      return actions[Math.floor(Math.random() * actions.length)];
    }

    // 착취 (exploitation)
    let bestAction = actions[0];
    let bestValue = -Infinity;

    for (const action of actions) {
      const qValue = this.qTable.get(`${key}:${action}`) || 0;
      if (qValue > bestValue) {
        bestValue = qValue;
        bestAction = action;
      }
    }

    return bestAction;
  }

  /**
   * Q-값 업데이트
   */
  updateQ(state, action, reward, nextState, actions = ['jump', 'wait']) {
    try {
      const key = this.getStateKey(state);
      const nextKey = this.getStateKey(nextState);

      if (!key || !action) return;

      const currentQ = this.qTable.get(`${key}:${action}`) || 0;

      // 에러 처리: reward 검증
      const safeReward = isFinite(reward) ? reward : 0;

      // 다음 상태의 최대 Q값
      let maxNextQ = -Infinity;
      for (const act of actions) {
        const q = this.qTable.get(`${nextKey}:${act}`) || 0;
        if (q > maxNextQ) maxNextQ = q;
      }

      if (maxNextQ === -Infinity) maxNextQ = 0;

      // Q-learning 공식
      const newQ = currentQ + this.alpha * (safeReward + this.gamma * maxNextQ - currentQ);

      // 에러 처리: NaN/Infinity 체크
      if (!isFinite(newQ)) {
        console.warn('[QLearn] Invalid Q value, skipping update');
        return;
      }

      this.qTable.set(`${key}:${action}`, newQ);
      this.updateCount++;

      // 100번마다 저장 (성능 최적화)
      if (this.updateCount % 100 === 0) {
        this.saveQTable();
      }
    } catch (e) {
      console.error('[QLearn] Update failed:', e.message);
    }
  }

  /**
   * 학습률 감소 (annealing)
   */
  decayEpsilon(rate = 0.995) {
    this.epsilon = Math.max(0.01, this.epsilon * rate);
  }

  /**
   * 통계 정보
   */
  getStats() {
    return {
      tableSize: this.qTable.size,
      updateCount: this.updateCount,
      epsilon: this.epsilon.toFixed(3),
      alpha: this.alpha,
      gamma: this.gamma
    };
  }

  /**
   * 초기화
   */
  reset() {
    this.qTable.clear();
    this.updateCount = 0;
    this.epsilon = 0.2;
    localStorage.removeItem(this.storageKey);
  }
}

// ============================================================================
// 2. MULTI-ARMED BANDIT ENGINE (의사결정)
// ============================================================================

class MABEngine {
  constructor(arms = [], config = {}) {
    this.arms = this.validateArms(arms);
    this.epsilon = config.epsilon || 0.2;
    this.decayRate = config.decayRate || 0.98;
    this.totalTrials = 0;
  }

  /**
   * 에러 처리: 팔(arm) 검증
   */
  validateArms(arms) {
    if (!Array.isArray(arms)) {
      console.warn('[MAB] Arms must be array, using defaults');
      return [{ id: 'arm1' }, { id: 'arm2' }];
    }

    return arms.map((arm, idx) => ({
      id: arm.id || `arm_${idx}`,
      successes: 1,  // Beta(1,1) 초기화
      failures: 1,
      type: arm.type || 'default'
    }));
  }

  /**
   * 팔 선택 (Epsilon-Greedy)
   */
  selectArm() {
    if (this.arms.length === 0) return null;

    // 초기 탐사
    if (this.totalTrials < 10) {
      return Math.floor(Math.random() * this.arms.length);
    }

    // Epsilon-Greedy
    if (Math.random() < this.epsilon) {
      return Math.floor(Math.random() * this.arms.length);
    }

    // 탐욕 선택 (best arm)
    let bestIdx = 0;
    let bestValue = -Infinity;

    for (let i = 0; i < this.arms.length; i++) {
      const arm = this.arms[i];
      const value = arm.successes / (arm.successes + arm.failures);

      if (value > bestValue) {
        bestValue = value;
        bestIdx = i;
      }
    }

    return bestIdx;
  }

  /**
   * 팔 업데이트
   */
  updateArm(armIndex, success) {
    try {
      if (armIndex < 0 || armIndex >= this.arms.length) {
        console.warn(`[MAB] Invalid arm index: ${armIndex}`);
        return;
      }

      const arm = this.arms[armIndex];

      if (success) {
        arm.successes++;
      } else {
        arm.failures++;
      }

      this.totalTrials++;

      // Epsilon 감소
      this.epsilon *= this.decayRate;
      this.epsilon = Math.max(0.01, this.epsilon);
    } catch (e) {
      console.error('[MAB] Update failed:', e.message);
    }
  }

  /**
   * 팔 통계
   */
  getArmStats(armIndex) {
    if (armIndex < 0 || armIndex >= this.arms.length) {
      return null;
    }

    const arm = this.arms[armIndex];
    const total = arm.successes + arm.failures;
    const rate = arm.successes / total;

    return {
      index: armIndex,
      id: arm.id,
      successRate: rate.toFixed(3),
      successes: arm.successes,
      failures: arm.failures,
      confidence: Math.sqrt(arm.successes) / total.toFixed(2)
    };
  }

  /**
   * 모든 팔 순위
   */
  rankArms() {
    return this.arms
      .map((_, idx) => this.getArmStats(idx))
      .sort((a, b) => parseFloat(b.successRate) - parseFloat(a.successRate));
  }
}

// ============================================================================
// 3. K-NEAREST NEIGHBORS ENGINE (분류)
// ============================================================================

class KNNEngine {
  constructor(trainingData = [], k = 5) {
    this.trainingData = trainingData;
    this.k = Math.max(1, Math.min(k, Math.floor(trainingData.length)));
    this.vectorCache = new Map();
    this.cacheLimit = 1000;
  }

  /**
   * 벡터화 (에러 처리: 데이터 검증)
   */
  vectorize(item) {
    try {
      const cacheKey = JSON.stringify(item);

      if (this.vectorCache.has(cacheKey)) {
        return this.vectorCache.get(cacheKey);
      }

      const features = this.extractFeatures(item);
      const normalized = this.normalize(features);

      // 캐시 크기 관리
      if (this.vectorCache.size > this.cacheLimit) {
        this.vectorCache.clear();
      }

      this.vectorCache.set(cacheKey, normalized);
      return normalized;
    } catch (e) {
      console.warn('[KNN] Vectorization failed:', e.message);
      return new Array(10).fill(0.5);  // 기본값
    }
  }

  /**
   * 특성 추출
   */
  extractFeatures(item) {
    if (!item || typeof item !== 'object') {
      return new Array(10).fill(0);
    }

    const features = [];
    for (const key in item) {
      if (typeof item[key] === 'number') {
        features.push(item[key]);
      } else if (typeof item[key] === 'string') {
        features.push(item[key].length * 0.1);
      }
    }

    return features.length > 0 ? features : new Array(10).fill(0);
  }

  /**
   * 벡터 정규화
   */
  normalize(v) {
    const norm = Math.sqrt(v.reduce((s, x) => s + x * x, 0)) || 1;
    return v.map(x => x / norm);
  }

  /**
   * 에러 처리: 코사인 유사도
   */
  cosineSimilarity(v1, v2) {
    if (!v1 || !v2 || v1.length !== v2.length) {
      return 0;
    }

    let dot = 0, norm1 = 0, norm2 = 0;

    for (let i = 0; i < v1.length; i++) {
      dot += v1[i] * v2[i];
      norm1 += v1[i] * v1[i];
      norm2 += v2[i] * v2[i];
    }

    const denom = Math.sqrt(norm1) * Math.sqrt(norm2);
    return denom > 0 ? dot / denom : 0;
  }

  /**
   * 예측
   */
  predict(item, labelKey = 'label') {
    try {
      const queryVector = this.vectorize(item);

      const similarities = this.trainingData
        .filter(train => train[labelKey] !== item[labelKey])
        .map(train => ({
          similarity: this.cosineSimilarity(queryVector, this.vectorize(train)),
          label: train[labelKey]
        }))
        .filter(s => isFinite(s.similarity))
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, this.k);

      if (similarities.length === 0) {
        return { label: 'unknown', confidence: 0, neighbors: 0 };
      }

      // 가중 투표
      const labelVotes = {};
      let totalWeight = 0;

      for (const { similarity, label } of similarities) {
        const weight = Math.max(0, similarity);
        labelVotes[label] = (labelVotes[label] || 0) + weight;
        totalWeight += weight;
      }

      const bestLabel = Object.entries(labelVotes)
        .sort(([, a], [, b]) => b - a)[0][0];

      const confidence = totalWeight > 0 ? labelVotes[bestLabel] / totalWeight : 0;

      return {
        label: bestLabel,
        confidence: Math.min(0.99, confidence).toFixed(2),
        neighbors: similarities.length
      };
    } catch (e) {
      console.error('[KNN] Prediction failed:', e.message);
      return { label: 'error', confidence: 0, neighbors: 0 };
    }
  }

  /**
   * 캐시 정리
   */
  clearCache() {
    this.vectorCache.clear();
  }
}

// ============================================================================
// 4. RECURSIVE LEAST SQUARES ENGINE (RLS - 실시간 학습)
// ============================================================================

class RLSEngine {
  constructor(featureDim, config = {}) {
    this.featureDim = featureDim;
    this.theta = new Array(featureDim).fill(0);     // 가중치
    this.P = this.eye(featureDim, 100);             // 공분산 행렬
    this.forgettingFactor = config.forgettingFactor || 0.98;
    this.epsilon = 1e-6;  // 수치 안정성
    this.updateCount = 0;
  }

  /**
   * 단위 행렬 생성
   */
  eye(n, scale = 1) {
    const m = new Array(n * n).fill(0);
    for (let i = 0; i < n; i++) {
      m[i * n + i] = scale;
    }
    return m;
  }

  /**
   * 행렬-벡터 곱셈
   */
  mulMatVec(M, x) {
    const n = x.length;
    const y = new Array(n).fill(0);

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        y[i] += M[i * n + j] * x[j];
      }
    }

    return y;
  }

  /**
   * 벡터 내적
   */
  dot(a, b) {
    let s = 0;
    for (let i = 0; i < a.length; i++) {
      s += a[i] * b[i];
    }
    return s;
  }

  /**
   * 에러 처리: RLS 업데이트 (수치 안정성)
   */
  update(x, y) {
    try {
      // 입력 검증
      if (!x || x.length !== this.featureDim) {
        console.warn('[RLS] Invalid feature vector');
        return;
      }

      if (typeof y !== 'number' || !isFinite(y)) {
        console.warn('[RLS] Invalid target value');
        return;
      }

      // 1. P * x 계산
      const Px = this.mulMatVec(this.P, x);

      // 2. 분모 계산 (최소값 보장)
      const dotPx = this.dot(x, Px);
      const denom = this.forgettingFactor + dotPx;

      if (Math.abs(denom) < this.epsilon) {
        // 수치 불안정: P 재초기화
        this.P = this.eye(this.featureDim, 1);
        return;
      }

      // 3. Kalman 이득 계산
      const K = Px.map(px => px / denom);

      // 4. 예측 오차
      const yhat = this.dot(this.theta, x);
      const err = y - yhat;

      // 5. 가중치 업데이트
      for (let i = 0; i < this.featureDim; i++) {
        this.theta[i] += K[i] * err;
      }

      // 6. 공분산 업데이트 (수치 안정성)
      for (let i = 0; i < this.featureDim; i++) {
        for (let j = 0; j < this.featureDim; j++) {
          const val = this.P[i * this.featureDim + j] - K[i] * Px[j];
          this.P[i * this.featureDim + j] = isFinite(val) ? val : 0;
        }
      }

      // 7. Forgetting factor 적용
      for (let i = 0; i < this.P.length; i++) {
        this.P[i] /= this.forgettingFactor;
      }

      this.updateCount++;
    } catch (e) {
      console.error('[RLS] Update failed:', e.message);
      // 폴백: 간단한 업데이트
      for (let i = 0; i < this.featureDim; i++) {
        this.theta[i] += 0.01 * x[i] * (y - this.dot(this.theta, x));
      }
    }
  }

  /**
   * 예측
   */
  predict(x) {
    if (!x || x.length !== this.featureDim) {
      return { prediction: 0, confidence: 0 };
    }

    const prediction = this.dot(this.theta, x);
    const confidence = Math.min(0.99, this.updateCount / 100);

    return {
      prediction: isFinite(prediction) ? prediction : 0,
      confidence: confidence.toFixed(2)
    };
  }
}

// ============================================================================
// 5. THOMPSON SAMPLING ENGINE (확률 의사결정)
// ============================================================================

class ThompsonSamplingEngine {
  constructor(config = {}) {
    this.options = new Map();
    this.timeDecay = config.timeDecay || 0.99;
    this.lastUpdateTime = Date.now();
    this.threshold = config.threshold || 0.5;
  }

  /**
   * 베타 분포 샘플링 (Marsaglia & Tsang)
   */
  sampleBeta(alpha, beta) {
    if (alpha < 1 || beta < 1) {
      return alpha / (alpha + beta);
    }

    let d = alpha + beta - 2 / 3;
    let L = alpha - 1 / 3;
    let G;

    try {
      do {
        const em = -Math.log(Math.random());
        const diff = Math.log(Math.random());
        G = L + d * (diff + 1.1239 + em);
      } while (G < 0 || Math.log(Math.random()) > 0.9277 - 1.3471 * L + 1.6143 * G);

      return L / G;
    } catch (e) {
      return alpha / (alpha + beta);  // 폴백
    }
  }

  /**
   * 관찰 기록
   */
  recordObservation(optionName, success) {
    if (!optionName || typeof optionName !== 'string') {
      console.warn('[Thompson] Invalid option name');
      return;
    }

    if (!this.options.has(optionName)) {
      this.options.set(optionName, { successes: 1, failures: 1 });
    }

    const opt = this.options.get(optionName);
    if (success) {
      opt.successes++;
    } else {
      opt.failures++;
    }

    this.applyTimeDecay();
  }

  /**
   * 시간 감소 (오래된 데이터 영향 감소)
   */
  applyTimeDecay() {
    const now = Date.now();
    const timeElapsed = (now - this.lastUpdateTime) / (1000 * 3600);

    if (timeElapsed > 0) {
      for (const opt of this.options.values()) {
        const decay = Math.pow(this.timeDecay, timeElapsed);
        opt.successes *= decay;
        opt.failures *= decay;
      }
      this.lastUpdateTime = now;
    }
  }

  /**
   * Thompson Sampling으로 최적 옵션 선택
   */
  selectOption() {
    if (this.options.size === 0) return null;

    let bestOption = null;
    let bestSample = -Infinity;

    for (const [name, opt] of this.options) {
      const sample = this.sampleBeta(opt.successes, opt.failures);

      if (sample > bestSample) {
        bestSample = sample;
        bestOption = name;
      }
    }

    return bestOption;
  }

  /**
   * 위험 확률 계산
   */
  getRiskProbability(optionName) {
    if (!this.options.has(optionName)) {
      return 0.5;
    }

    const opt = this.options.get(optionName);
    const total = opt.successes + opt.failures;

    if (total === 0) return 0.5;

    const probability = opt.successes / total;
    const confidence = total / (total + 10);

    return 0.5 + (probability - 0.5) * confidence;
  }

  /**
   * 통계 정보
   */
  getStats(optionName) {
    if (!this.options.has(optionName)) {
      return {
        option: optionName,
        probability: 0.5,
        successes: 0,
        failures: 0,
        confidence: 0
      };
    }

    const opt = this.options.get(optionName);
    const total = opt.successes + opt.failures;
    const probability = this.getRiskProbability(optionName);
    const confidence = total / (total + 10);

    return {
      option: optionName,
      probability: probability.toFixed(2),
      successes: Math.round(opt.successes),
      failures: Math.round(opt.failures),
      confidence: confidence.toFixed(2)
    };
  }
}

// ============================================================================
// 내보내기
// ============================================================================

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    QLearnEngine,
    MABEngine,
    KNNEngine,
    RLSEngine,
    ThompsonSamplingEngine
  };
}

