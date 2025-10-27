import { Category } from '../types';

export const categories: Category[] = [
  {
    title: '外向性 / 内向性',
    key: 'EX',
    icon: '👥',
    questions: [
      { text: '初対面の人とでもすぐに打ち解けられる方だ。', axis: 'EX', direction: 1 },
      { text: '大勢で過ごすより、一人の時間の方が落ち着く。', axis: 'EX', direction: -1 },
      { text: 'パーティーやイベントの雰囲気が好き。', axis: 'EX', direction: 1 },
      { text: '休日は誰かと会う予定を入れたくなる。', axis: 'EX', direction: 1 },
      { text: '自分から話題を振るのが得意だ。', axis: 'EX', direction: 1 },
      { text: 'SNSなどで自分の考えを発信するのが苦にならない。', axis: 'EX', direction: 1 }
    ]
  },
  {
    title: '感情型 / 論理型',
    key: 'TF',
    icon: '🧠',
    questions: [
      { text: '人の気持ちに共感しすぎて疲れることがある。', axis: 'TF', direction: -1 },
      { text: '感情よりも「正しいかどうか」で判断することが多い。', axis: 'TF', direction: 1 },
      { text: '誰かの言葉よりも、自分の感覚を信じるタイプだ。', axis: 'TF', direction: -1 },
      { text: '恋愛でも「好き」より「相性」や「安定感」で考える。', axis: 'TF', direction: 1 },
      { text: '議論になると、感情的になるよりも冷静に考えようとする。', axis: 'TF', direction: 1 },
      { text: '物事を決めるときに、ついデータや根拠を探してしまう。', axis: 'TF', direction: 1 }
    ]
  },
  {
    title: '主導型 / 協調型',
    key: 'LD',
    icon: '⚡',
    questions: [
      { text: 'グループでは自然とリーダー的な立場になる。', axis: 'LD', direction: 1 },
      { text: '相手の意見よりも、自分の意見を通したくなることが多い。', axis: 'LD', direction: 1 },
      { text: '「みんなに合わせる」のが少しストレスに感じる。', axis: 'LD', direction: 1 },
      { text: '誰かが迷っているとき、つい決断してあげたくなる。', axis: 'LD', direction: 1 },
      { text: '恋愛では主導権を握りたいタイプだ。', axis: 'LD', direction: 1 },
      { text: '自分の提案が通らないとモヤモヤする。', axis: 'LD', direction: 1 }
    ]
  },
  {
    title: '直感型 / 慎重型',
    key: 'IN',
    icon: '✨',
    questions: [
      { text: 'なんとなくの「フィーリング」で決めることが多い。', axis: 'IN', direction: 1 },
      { text: '計画を立てずに行動して後から考えるタイプだ。', axis: 'IN', direction: 1 },
      { text: '相手の第一印象で、その人を好きになるかどうかが決まる。', axis: 'IN', direction: 1 },
      { text: '新しいことを試すのに抵抗はない。', axis: 'IN', direction: 1 },
      { text: '「とりあえずやってみよう」と思うことが多い。', axis: 'IN', direction: 1 },
      { text: '大きな決断でも、直感を信じて動く方だ。', axis: 'IN', direction: 1 }
    ]
  },
  {
    title: 'マイペース / ルール型',
    key: 'MP',
    icon: '🎨',
    questions: [
      { text: '自分のやり方にこだわりがある。', axis: 'MP', direction: 1 },
      { text: 'スケジュールやルールに縛られるのが苦手。', axis: 'MP', direction: 1 },
      { text: '約束の時間に少し遅れることがあっても気にしない。', axis: 'MP', direction: 1 },
      { text: '周囲に合わせて動くより、自分のペースを守りたい。', axis: 'MP', direction: 1 },
      { text: '恋愛でも「干渉されすぎる」と距離を置きたくなる。', axis: 'MP', direction: 1 },
      { text: '計画よりもその日の気分で動くことが多い。', axis: 'MP', direction: 1 }
    ]
  },
  {
    title: '行動スピード',
    key: 'SP',
    icon: '🚀',
    questions: [
      { text: '思いついたらすぐに行動するタイプだ。', axis: 'SP', direction: 1 },
      { text: '返信やレスポンスは早い方だと思う。', axis: 'SP', direction: 1 },
      { text: '決断を先延ばしにするとストレスを感じる。', axis: 'SP', direction: 1 },
      { text: '恋愛でも「好き」と思ったら早めに伝えたい。', axis: 'SP', direction: 1 },
      { text: '行動よりもまず考えてから動くタイプだ。', axis: 'SP', direction: -1 },
      { text: 'スピード感のある人と一緒にいると心地よい。', axis: 'SP', direction: 1 }
    ]
  }
];