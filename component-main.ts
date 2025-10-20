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
          // 診断を実行
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

  // 結果画面
  if (showResult && diagnosisResult) {
    const { topMatch, topCandidates, userVector } = diagnosisResult;
    
    // タイプ名から動物名を抽出
    const animalMatch = topMatch.id.match(/・(.+)$/);
    const animalName = animalMatch ? animalMatch[1] : '不明';

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 md:p-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 text-center">
              <Sparkles className="w-16 h-16 mx-auto mb-4 text-white" />
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">診断結果</h1>
              <p className="text-indigo-100">あなたの恋愛タイプが判明しました</p>
            </div>

            <div className="p-8 md:p-12 space-y-6">
              {/* メイン結果 */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-2xl border-2 border-indigo-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-5xl">{animalName}</div>
                  <div>
                    <h3 className="text-xl font-bold text-indigo-900">あなたのタイプ</h3>
                    <p className="text-sm text-indigo-600">類似度: {(topCandidates[0].similarity * 100).toFixed(1)}%</p>
                  </div>
                </div>
                <p className="text-2xl text-indigo-800 font-bold">{topMatch.id}</p>
              </div>

              {/* 上位候補 */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-2xl border-2 border-purple-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    📊
                  </div>
                  <h3 className="text-2xl font-bold text-purple-900">上位候補</h3>
                </div>
                <div className="space-y-3">
                  {topCandidates.slice(1, 3).map((candidate, idx) => {
                    const candidateAnimalMatch = candidate.archetype.id.match(/・(.+)$/);
                    const candidateAnimal = candidateAnimalMatch ? candidateAnimalMatch[1] : '不明';
                    return (
                      <div key={idx} className="flex items-center gap-3 bg-white p-4 rounded-xl">
                        <span className="text-3xl">{candidateAnimal}</span>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">{candidate.archetype.id}</p>
                          <p className="text-sm text-gray-500">類似度: {(candidate.similarity * 100).toFixed(1)}%</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* デバッグ情報トグル */}
              <button
                onClick={() => setShowDebug(!showDebug)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
              >
                <Info className="w-5 h-5" />
                <span className="font-medium">
                  {showDebug ? 'デバッグ情報を隠す' : 'デバッグ情報を表示'}
                </span>
              </button>

              {/* デバッグ情報 */}
              {showDebug && (
                <div className="bg-gray-50 p-6 rounded-2xl border-2 border-gray-200 space-y-4">
                  <h4 className="font-bold text-gray-800 text-lg">あなたの6軸スコア</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(userVector).map(([axis, value]) => {
                      const category = categories.find(c => c.key === axis);
                      return (
                        <div key={axis} className="bg-white p-4 rounded-xl text-center">
                          <div className="text-2xl mb-1">{category?.icon}</div>
                          <div className="text-xs text-gray-600 mb-1">{axis}</div>
                          <div className="text-xl font-bold text-indigo-600">
                            {value >= 0 ? '+' : ''}{value.toFixed(3)}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <h4 className="font-bold text-gray-800 text-lg mt-6">トップタイプの座標</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(topMatch.centroid).map(([axis, value]) => {
                      const category = categories.find(c => c.key === axis);
                      return (
                        <div key={axis} className="bg-white p-4 rounded-xl text-center">
                          <div className="text-2xl mb-1">{category?.icon}</div>
                          <div className="text-xs text-gray-600 mb-1">{axis}</div>
                          <div className="text-xl font-bold text-purple-600">
                            {value >= 0 ? '+' : ''}{value.toFixed(4)}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <h4 className="font-bold text-gray-800 text-lg mt-6">類似度計算詳細</h4>
                  <div className="bg-white p-4 rounded-xl">
                    <p className="text-sm text-gray-700 mb-2">コサイン類似度（上位5件）:</p>
                    <div className="space-y-2">
                      {topCandidates.slice(0, 5).map((candidate, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">{idx + 1}. {candidate.archetype.id.substring(0, 30)}...</span>
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
              <button
                onClick={resetDiagnosis}
                className="w-full mt-8 px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-full font-bold text-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                <RotateCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                もう一度診断する
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 質問画面
  const currentCategory = categories[currentPage];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="fixed top-0 left-0 right-0 bg-white shadow-lg z-50">
        <div className="bg-gray-100 h-3">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{currentCategory.icon}</span>
            <span className="font-semibold text-gray-700 hidden md:inline">{currentCategory.title}</span>
          </div>
          <div className="text-sm font-bold text-indigo-600">
            {currentPage + 1} / {categories.length}
          </div>
        </div>
      </div>

      <div className="pt-24 pb-12 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
                {currentCategory.title}
              </h2>
              <p className="text-gray-500 text-sm">あてはまる度合いを選択してください</p>
            </div>

            <div className="space-y-24">
              {currentCategory.questions.map((question, qIndex) => {
                const answerKey = `${currentPage}-${qIndex}`;
                const selectedValue = answers[answerKey];

                return (
                  <div key={qIndex} className="space-y-8" id={`question-${qIndex}`}>
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                        {qIndex + 1}
                      </span>
                      <p className="text-gray-800 text-lg font-medium leading-relaxed pt-1">{question.text}</p>
                    </div>
                    
                    <div className="flex items-center justify-center gap-3">
                      <span className="text-sm font-bold w-20 text-right text-indigo-600">はい</span>
                      
                      <div className="flex items-center gap-2 md:gap-3">
                        {[3, 2, 1, 0, -1, -2, -3].map((value) => {
                          const isSelected = selectedValue === value;
                          const isAgree = value > 0;
                          const isNeutral = value === 0;
                          
                          let sizeClass = '';
                          if (Math.abs(value) === 3) sizeClass = 'w-16 h-16 md:w-18 md:h-18';
                          else if (Math.abs(value) === 2) sizeClass = 'w-13 h-13 md:w-15 md:h-15';
                          else if (Math.abs(value) === 1) sizeClass = 'w-11 h-11 md:w-12 md:h-12';
                          else sizeClass = 'w-12 h-12 md:w-13 md:h-13';

                          let bgClass = 'bg-white';
                          let borderClass = '';
                          let hoverClass = 'hover:scale-110';
                          
                          if (isNeutral) {
                            borderClass = isSelected ? 'border-gray-400' : 'border-gray-300';
                            bgClass = isSelected ? 'bg-gray-400' : 'bg-white';
                          } else if (isAgree) {
                            borderClass = isSelected ? 'border-indigo-500' : 'border-indigo-300';
                            bgClass = isSelected ? 'bg-gradient-to-br from-indigo-500 to-purple-500' : 'bg-white';
                          } else {
                            borderClass = isSelected ? 'border-pink-500' : 'border-pink-300';
                            bgClass = isSelected ? 'bg-gradient-to-br from-pink-500 to-rose-500' : 'bg-white';
                          }

                          return (
                            <button
                              key={value}
                              onClick={() => handleAnswer(currentPage, qIndex, value)}
                              className={`${sizeClass} ${bgClass} ${borderClass} rounded-full border-4 transition-all duration-200 ${hoverClass} flex items-center justify-center shadow-lg ${isSelected ? 'shadow-xl' : ''}`}
                            >
                              {isSelected && (
                                <svg className="w-7 h-7 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="currentColor">
                                  <path d="M5 13l4 4L19 7"></path>
                                </svg>
                              )}
                            </button>
                          );
                        })}
                      </div>
                      
                      <span className="text-sm font-bold w-20 text-left text-pink-600">いいえ</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalityDiagnosis;
