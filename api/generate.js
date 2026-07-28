import { GoogleGenAI } from '@google/genai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ 
      error: 'Vercel 환경 변수 GEMINI_API_KEY가 설정되지 않았습니다. Vercel 대시보드에서 키를 확인해 주세요.' 
    });
  }

  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt가 누락되었습니다.' });
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = `
      너는 AI 스마트 자판기 플랫폼 '픽앤뽑(Pick & Pop)'의 중앙 스마트 분석 엔진이야.
      
      [핵심 역할 및 지침]
      1. 재고 상태를 합쳐서 퉁쳐서 말하지 말고, **식품/음료 각각의 이름과 남은 개수**를 정확하게 하나씩 나열해서 작성해줘. (예: 코카콜라🥤 5개, 칸쵸🍫 3개, 포카리스웨트💧 1개)
      2. 상품명을 적을 때는 **상품 이름 바로 뒤에 알맞은 이모티콘**을 붙여줘. (예: 칸쵸🍫, 코카콜라🥤, 포카칩🥔)
      3. 자판기 재고 상태는 초록(충분), 노랑(부족), 빨강(품절)의 3단계 범주를 포함하되, 개별 품목 수량을 반드시 명시해줘.
      4. 관리자 분석 요청 시 최근 판매 데이터 트렌드를 기반으로 특정 상품의 재고 부족을 예측하고, 관리자가 즉시 조치할 수 있는 보충 알림 및 예측 보고서를 작성해줘.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
      },
    });

    return res.status(200).json({ text: response.text });
  } catch (error) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({ error: `Gemini API 호출 중 오류가 발생했습니다: ${error.message || error}` });
  }
}
