import React, { useState } from 'react';
import { RotateCcw, Sparkles, Info } from 'lucide-react';
import { DiagnosisResult } from '../types';
import { categories } from '../data/questions';
import { diagnoseFromAnswers } from '../lib/diagnosis';

const PersonalityDiagnosis: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResult, setShowResult] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisResult | null>(null);
  const [showDebug, setShowDebug] = useState(false);

  const handleAnswer = (categoryIndex: number, questionIndex: number, value: number) => {
    const key = `${categoryIndex}-${questionIndex}`;
    const newAnswers = { ...answers, [key]: value };
    setAnswers(newAnswers);

    const currentCategory = categories[currentPage];
    const allAnswered = currentCategory.questions.every((_, idx) => {
      const answerKey = `${currentPage}-${idx}`;
      return newAnswers[answerKey] !== undefined;
    });

    if (allAnswered) {
      setTimeout(() => {
        if (currentPage < categories.length - 1) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          setCurrentPage(currentPage + 1);
        } else {
          const result = diagnoseFromAnswers(newAnswers);
          setDiagnosisResult(result);
          window.scrollTo({ top: 0, behavior: 'smooth' });
          setShowResult(true);
        }
      }, 400);
    } else {
      const nextQuestionIndex = questionIndex + 1;
      if (nextQuestionIndex < currentCategory.questions.length) {
        setTimeout(() => {
          const element = document.getElementById(`question-${nextQuestionIndex}`);
          if (element) {
            const yOffset = -120;
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
          }
        }, 200);
      }
    }
  };

  const resetDiagnosis = () => {
    setCurrentPage(0);
    setAnswers({});
    setShowResult(false);
    setDiagnosisResult(null);
    setShowDebug(false);
  };

  const progress = ((currentPage + 1) / categories.length) * 100;

  // =========================
  // 結果画面
  // =========================
  if (showResult && diagnosisResult) {
    const { topMatch, topCandidates, userVector } = diagnosisResult;

    // タイプ名から動物名を抽出
    const animalMatch = topMatch.id.match(/・(.+)$/);
    const animalName = animalMatch ? animalMatch[1] : '不明';

    return (
      <div className="result-container">
        <div className="result-card">
          <div className="mb-6">
            <Sparkles className="w-16 h-16 mx-auto mb-4 text-emerald-400" />
            <h1 className="result-title">診断結果</h1>
            <p className="text-gray-500">あなたの恋愛タイプが判明しました</p>
          </div>

          {/* メイン結果 */}
          <div className="result-section result-section-purple mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="text-5xl">{animalName}</div>
              <div>
                <div className="result-section-title result-section-title-purple">あなたのタイプ</div>
                <p className="text-sm text-purple-700">
                  類似度: {(topCandidates[0].similarity * 100).toFixed(1)}%
                </p>
              </div>
            </div>
            <p className="text-xl font-bold text-purple-800">{topMatch.id}</p>
          </div>

          {/* 上位候補 */}
          <div className="result-section result-section-blue mb-6">
            <div className="result-section-title result-section-title-blue">上位候補</div>
            <div className="space-y-3">
              {topCandidates.slice(1, 3).map((candidate, idx) => {
                const candidateAnimalMatch = candidate.archetype.id.match(/・(.+)$/);
                const candidateAnimal = candidateAnimalMatch ? candidateAnimalMatch[1] : '不明';
                return (
                  <div key={idx} className="flex items-center gap-3 bg-white p-4 rounded-xl">
                    <span className="text-3xl">{candidateAnimal}</span>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{candidate.archetype.id}</p>
                      <p className="text-sm text-gray-500">
                        類似度: {(candidate.similarity * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* デバッグ情報トグル */}
          <button
            onClick={() => setShowDebug(!showDebug)}
            className="restart-button"
            style={{ marginTop: 0 }}
          >
            <span className="inline-flex items-center gap-2">
              <Info className="w-4 h-4" />
              {showDebug ? 'デバッグ情報を隠す' : 'デバッグ情報を表示'}
            </span>
          </button>

          {/* デバッグ情報 */}
          {showDebug && (
            <div className="result-section" style={{ background: '#fff' }}>
              <div className="result-section-title">あなたの6軸スコア</div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {Object.entries(userVector).map(([axis, value]) => {
                  const category = categories.find((c) => c.key === axis);
                  return (
                    <div key={axis} className="bg-white p-4 rounded-xl text-center shadow-sm">
                      <div className="text-2xl mb-1">{category?.icon}</div>
                      <div className="text-xs text-gray-600 mb-1">{axis}</div>
                      <div className="text-xl font-bold text-indigo-600">
                        {value >= 0 ? '+' : ''}
                        {value.toFixed(3)}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="result-section-title">トップタイプの座標</div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {Object.entries(topMatch.centroid).map(([axis, value]) => {
                  const category = categories.find((c) => c.key === axis);
                  return (
                    <div key={axis} className="bg-white p-4 rounded-xl text-center shadow-sm">
                      <div className="text-2xl mb-1">{category?.icon}</div>
                      <div className="text-xs text-gray-600 mb-1">{axis}</div>
                      <div className="text-xl font-bold text-purple-600">
                        {value >= 0 ? '+' : ''}
                        {value.toFixed(4)}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="result-section-title">類似度計算詳細</div>
              <div className="bg-white p-4 rounded-xl">
                <p className="text-sm text-gray-700 mb-2">コサイン類似度（上位5件）:</p>
                <div className="space-y-2">
                  {topCandidates.slice(0, 5).map((candidate, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">
                        {idx + 1}. {candidate.archetype.id.substring(0, 30)}...
                      </span>
                      <span className="font-mono font-bold text-indigo-600">
                        {candidate.similarity.toFixed(6)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* リセットボタン */}
          <button onClick={resetDiagnosis} className="restart-button">
            <span className="inline-flex items-center gap-2">
              <RotateCcw className="w-5 h-5" />
              もう一度診断する
            </span>
          </button>
        </div>
      </div>
    );
  }

  // =========================
  // 質問画面
  // =========================
  const currentCategory = categories[currentPage];

  return (
    <div className="min-h-screen bg-gradient-purple-blue">
      {/* 固定ヘッダー（プログレス） */}
      <div className="progress-header">
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${progress}%` }} />
        </div>
        <div className="progress-text px-6">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{currentCategory.icon}</span>
              <span className="font-semibold text-gray-700 hidden md:inline">
                {currentCategory.title}
              </span>
            </div>
            <div className="text-sm font-bold text-emerald-600">
              {currentPage + 1} / {categories.length}
            </div>
          </div>
        </div>
      </div>

      {/* メイン */}
      <div className="main-content">
        <div className="question-card">
          <div className="category-title">
            <div>{currentCategory.title}</div>
            <p className="text-gray-500 text-sm mt-2">あてはまる度合いを選択してください</p>
          </div>

          <div className="questions-list">
            {currentCategory.questions.map((question, qIndex) => {
              const answerKey = `${currentPage}-${qIndex}`;
              const selectedValue = answers[answerKey];

              return (
                <div key={qIndex} className="question-item" id={`question-${qIndex}`}>
                  {/* 質問文 */}
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {qIndex + 1}
                    </span>
                    <p className="question-text">{question.text}</p>
                  </div>

                  {/* 回答ボタン列 */}
                  <div className="answer-container">
                    <span className="answer-label answer-label-yes">はい</span>

                    <div className="button-group">
                      {[3, 2, 1, 0, -1, -2, -3].map((value) => {
                        const isSelected = selectedValue === value;
                        const isAgree = value > 0;
                        const isNeutral = value === 0;

                        // サイズ（あなたのCSSに合わせたクラスを使用）
                        const sizeClass =
                          Math.abs(value) === 3
                            ? 'btn-size-3'
                            : Math.abs(value) === 2
                            ? 'btn-size-2'
                            : Math.abs(value) === 1
                            ? 'btn-size-1'
                            : 'btn-size-0';

                        // 色（あなたのCSSに合わせたクラスを使用）
                        const toneClass = isNeutral
                          ? 'btn-neutral'
                          : isAgree
                          ? 'btn-agree'
                          : 'btn-disagree';

                        return (
                          <button
                            key={value}
                            onClick={() => handleAnswer(currentPage, qIndex, value)}
                            className={`answer-button ${sizeClass} ${toneClass} ${
                              isSelected ? 'selected' : ''
                            }`}
                            aria-label={`answer ${value}`}
                          >
                            {isSelected && (
                              <svg
                                className="check-icon"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="3"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path d="M5 13l4 4L19 7"></path>
                              </svg>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    <span className="answer-label answer-label-no">いいえ</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalityDiagnosis;
