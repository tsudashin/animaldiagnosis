// 6軸の型定義
export type AxisKey = 'EX' | 'TF' | 'LD' | 'IN' | 'MP' | 'SP';

// アーキタイプの型定義
export type Archetype = {
  id: string;
  centroid: Record<AxisKey, number>;
};

// 質問の型定義
export type Question = {
  text: string;
  axis: AxisKey;
  direction: 1 | -1;
};

// カテゴリの型定義
export type Category = {
  title: string;
  key: string;
  icon: string;
  questions: Question[];
};

// 診断結果の型定義
export type DiagnosisResult = {
  topMatch: Archetype;
  topCandidates: Array<{ archetype: Archetype; similarity: number }>;
  userVector: Record<AxisKey, number>;
};
