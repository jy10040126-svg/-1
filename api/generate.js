export default async function handler(req, res) {
  // POST 요청만 허용
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { prompt, vendingData } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY 환경변수가 설정되지 않았습니다.' });
  }

  try {
    const systemPrompt = `
당신은 스마트 자판기 데이터 분석 및 추천 전문 AI입니다.
[역할]
1. 사용자가 찾는 상품/위치 조건 분석
2. 자판기 실시간 재고 및 최근 판매 데이터를 기반으로 품절 임박 예측
3. 가장 적합한 자판기 위치 추천 및 QR 예약 권장

[분석할 자판기 데이터]
${JSON.stringify(vendingData, null, 2)}

[응답 규칙]
- 친절하고 직관적인 한국어로 답변하세요.
- 추천 자판기 이름, 거리, 품절 예상 시간, 추천 이유를 명확히 포함하세요.
- 불필요한 서론 없이 바로 요점 위주로 안내하세요.
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: `${systemPrompt}\n\n[사용자 요청]\n${prompt}` }]
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Gemini API 호출 실패');
    }

    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || '답변을 생성할 수 없습니다.';
    return res.status(200).json({ result: aiResponse });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
