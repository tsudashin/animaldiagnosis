import { AxisKey } from '../types';
import { categories } from '../data/questions';

/**
 * 回答から6軸のスコアを計算（-1..+1に正規化）
 * 
 * @param answers - ユーザーの回答オブジェクト（キー: "カテゴリindex-質問index", 値: -3..+3）
 * @returns 正規化された6軸スコア
 */
export function calculateAxisScores(
  answers: Record<string, number>
): Record<AxisKey, number> {
  // 各軸の合計スコア
  const axisScores: Record<AxisKey, number> = {
    EX: 0,
    TF: 0,
    LD: 0,
    IN: 0,
    MP: 0,
    SP: 0
  };
  
  // 各軸の質問数
  const axisCounts: Record<AxisKey, number> = {
    EX: 0,
    TF: 0,
    LD: 0,
    IN: 0,
    MP: 0,
    SP: 0
  };

  // 各質問の回答を集計
  categories.forEach((category, catIndex) => {
    category.questions.forEach((question, qIndex) => {
      const key = `${catIndex}-${qIndex}`;
      const answerValue = answers[key];
      
      if (answerValue !== undefined) {
        // 回答値（-3..+3）× 方向性（1 or -1）
        const contribution = answerValue * question.direction;
        axisScores[question.axis] += contribution;
        axisCounts[question.axis] += 1;
      }
    });
  });

  // 各軸を正規化（-1..+1の範囲に）
  const normalizedScores: Record<AxisKey, number> = {
    EX: 0,
    TF: 0,
    LD: 0,
    IN: 0,
    MP: 0,
    SP: 0
  };

  Object.keys(axisScores).forEach((axis) => {
    const axisKey = axis as AxisKey;
    const count = axisCounts[axisKey];
    if (count > 0) {
      // 平均を取り、最大値3で割って-1..+1に正規化
      normalizedScores[axisKey] = axisScores[axisKey] / count / 3;
    }
  });

  return normalizedScores;
}

/**
 * コサイン類似度を計算
 * 
 * @param vec1 - ベクトル1（ユーザーの6軸スコア）
 * @param vec2 - ベクトル2（アーキタイプの座標）
 * @returns コサイン類似度（-1..+1、高いほど似ている）
 */
export function cosineSimilarity(
  vec1: Record<AxisKey, number>,
  vec2: Record<AxisKey, number>
): number {
  const axes: AxisKey[] = ['EX', 'TF', 'LD', 'IN', 'MP', 'SP'];
  
  let dotProduct = 0;
  let magnitude1Squared = 0;
  let magnitude2Squared = 0;

  // 内積とベクトルの大きさの2乗を計算
  axes.forEach((axis) => {
    const v1 = vec1[axis] || 0;
    const v2 = vec2[axis] || 0;
    dotProduct += v1 * v2;
    magnitude1Squared += v1 * v1;
    magnitude2Squared += v2 * v2;
  });

  const magnitude1 = Math.sqrt(magnitude1Squared);
  const magnitude2 = Math.sqrt(magnitude2Squared);

  // ゼロベクトルの場合は0を返す
  if (magnitude1 === 0 || magnitude2 === 0) {
    return 0;
  }

  // コサイン類似度 = 内積 / (ベクトルの大きさの積)
  return dotProduct / (magnitude1 * magnitude2);
}
