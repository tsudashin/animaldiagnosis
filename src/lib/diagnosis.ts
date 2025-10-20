import { DiagnosisResult } from '../types';
import { archetypes } from '../data/archetypes';
import { calculateAxisScores, cosineSimilarity } from './scoring';

/**
 * ユーザーの回答から診断結果を計算
 * 
 * システムA: 6軸ベクトル化 → 正規化 → コサイン類似度 → 最適タイプ選定
 * 
 * @param answers - ユーザーの回答オブジェクト
 * @returns 診断結果（トップマッチ、上位候補、ユーザーベクトル）
 */
export function diagnoseFromAnswers(
  answers: Record<string, number>
): DiagnosisResult {
  // ステップ1: ユーザーの6軸スコアを計算・正規化
  const userVector = calculateAxisScores(answers);

  // ステップ2: 全60アーキタイプとのコサイン類似度を計算
  const similarities = archetypes.map((archetype) => ({
    archetype,
    similarity: cosineSimilarity(userVector, archetype.centroid)
  }));

  // ステップ3: 類似度の高い順にソート
  similarities.sort((a, b) => b.similarity - a.similarity);

  // ステップ4: 上位3候補を取得
  const topCandidates = similarities.slice(0, 3);
  const topMatch = topCandidates[0].archetype;

  return {
    topMatch,
    topCandidates,
    userVector
  };
}
