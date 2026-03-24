import { SystemMetrics } from './simulation';

interface PredictionResult {
  peakHourPredicted: boolean;
  confidence: number;
  recommendedAlgorithm: string;
}

interface DecisionNode {
  feature: string;
  threshold: number;
  left?: DecisionNode;
  right?: DecisionNode;
  prediction?: boolean;
}

export class MLPredictor {
  private static ensemble: DecisionNode[] = [];

  constructor() {
    MLPredictor.initializeEnsemble();
  }

  static initializeEnsemble() {
    MLPredictor.ensemble = [
      MLPredictor.createTree1(),
      MLPredictor.createTree2(),
      MLPredictor.createTree3()
    ];
  }

  private static createTree1(): DecisionNode {
    return {
      feature: 'avgThroughput',
      threshold: 750,
      left: {
        feature: 'avgLatency',
        threshold: 25,
        left: { prediction: false },
        right: { prediction: true },
      },
      right: {
        feature: 'volatility',
        threshold: 0.5,
        left: { prediction: false },
        right: { prediction: true },
      },
    };
  }

  private static createTree2(): DecisionNode {
    return {
      feature: 'avgLatency',
      threshold: 30,
      left: {
        feature: 'throughputTrend',
        threshold: 0.1,
        left: { prediction: false },
        right: { prediction: false },
      },
      right: {
        feature: 'latencySpike',
        threshold: 50,
        left: { prediction: true },
        right: { prediction: true },
      },
    };
  }

  private static createTree3(): DecisionNode {
    return {
      feature: 'throughputVolatility',
      threshold: 0.3,
      left: { prediction: false },
      right: {
        feature: 'avgLoad',
        threshold: 70,
        left: { prediction: false },
        right: { prediction: true },
      },
    };
  }

  private static extractFeatures(metrics: SystemMetrics) {
    const throughputs = metrics.throughput.map(d => d.value);
    const latencies = metrics.latency.map(d => d.value);
    const avgThroughput = throughputs.length > 0 ? throughputs.reduce((a, b) => a + b) / throughputs.length : 0;
    const avgLatency = latencies.length > 0 ? latencies.reduce((a, b) => a + b) / latencies.length : 0;
    const volatility = throughputs.length > 1 ? Math.sqrt(throughputs.reduce((sum, val) => sum + Math.pow(val - avgThroughput, 2), 0) / throughputs.length) : 0;

    return {
      avgThroughput,
      avgLatency,
      volatility,
      throughputTrend: throughputs.length > 1 ? throughputs[throughputs.length - 1] - throughputs[0] : 0,
      latencySpike: Math.max(...latencies) - Math.min(...latencies),
      throughputVolatility: volatility / Math.max(1, avgThroughput),
      avgLoad: 50,
    };
  }

  private static traverseTree(node: DecisionNode | undefined, features: any): boolean {
    if (!node) return false;
    if (node.prediction !== undefined) return node.prediction;

    const featureValue = features[node.feature] || 0;
    if (featureValue < node.threshold) {
      return MLPredictor.traverseTree(node.left, features);
    } else {
      return MLPredictor.traverseTree(node.right, features);
    }
  }

  static predict(metrics: SystemMetrics): PredictionResult {
    const features = MLPredictor.extractFeatures(metrics);
    const predictions = MLPredictor.ensemble.map(tree => MLPredictor.traverseTree(tree, features));
    const peakVotes = predictions.filter(p => p).length;
    const confidence = peakVotes / MLPredictor.ensemble.length;

    return {
      peakHourPredicted: peakVotes > MLPredictor.ensemble.length / 2,
      confidence,
      recommendedAlgorithm: peakVotes > MLPredictor.ensemble.length / 2 ? 'Predictive' : 'Round Robin',
    };
  }
}