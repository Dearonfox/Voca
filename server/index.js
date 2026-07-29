const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.TRANSLATE_PORT || 3002;

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

function getPapagoCredentials() {
  return {
    clientId:
      process.env.PAPAGO_CLIENT_ID ||
      process.env.NAVER_CLIENT_ID ||
      process.env.NAVER_CLOUD_CLIENT_ID,
    clientSecret:
      process.env.PAPAGO_CLIENT_SECRET ||
      process.env.NAVER_CLIENT_SECRET ||
      process.env.NAVER_CLOUD_CLIENT_SECRET,
  };
}

function extractTranslatedText(data) {
  return data?.message?.result?.translatedText;
}

async function translateWithNaverCloud(text, clientId, clientSecret) {
  const papagoRes = await fetch(
    "https://papago.apigw.ntruss.com/nmt/v1/translation",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-ncp-apigw-api-key-id": clientId,
        "x-ncp-apigw-api-key": clientSecret,
      },
      body: JSON.stringify({
        source: "en",
        target: "ko",
        text,
      }),
    }
  );
  const data = await papagoRes.json();

  return {
    ok: papagoRes.ok,
    status: papagoRes.status,
    provider: "naver-cloud",
    data,
  };
}

async function translateWithNaverDevelopers(text, clientId, clientSecret) {
  const papagoRes = await fetch("https://openapi.naver.com/v1/papago/n2mt", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      "X-Naver-Client-Id": clientId,
      "X-Naver-Client-Secret": clientSecret,
    },
    body: new URLSearchParams({
      source: "en",
      target: "ko",
      text,
    }),
  });
  const data = await papagoRes.json();

  return {
    ok: papagoRes.ok,
    status: papagoRes.status,
    provider: "naver-developers",
    data,
  };
}

async function translateToKorean(text) {
  const { clientId, clientSecret } = getPapagoCredentials();

  if (!clientId || !clientSecret) {
    return {
      meaning: "",
      provider: null,
      attempts: [{ error: "Papago API credentials are missing." }],
    };
  }

  const preferredProvider = process.env.PAPAGO_PROVIDER || "auto";
  const providers =
    preferredProvider === "naver-cloud"
      ? [translateWithNaverCloud]
      : preferredProvider === "naver-developers"
        ? [translateWithNaverDevelopers]
        : [translateWithNaverCloud, translateWithNaverDevelopers];

  const attempts = [];

  for (const translate of providers) {
    const result = await translate(text, clientId, clientSecret);
    const translatedText = extractTranslatedText(result.data);

    if (result.ok && translatedText) {
      return {
        meaning: translatedText,
        provider: result.provider,
        attempts,
      };
    }

    attempts.push({
      provider: result.provider,
      status: result.status,
      error:
        result.data?.errorMessage ||
        result.data?.error?.message ||
        result.data?.message ||
        "Papago translation failed.",
    });
  }

  return {
    meaning: "",
    provider: null,
    attempts,
  };
}

app.post("/api/translate", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "text is required" });
    }

    const korean = await translateToKorean(text);

    if (korean.meaning) {
      return res.json({
        meaning: korean.meaning,
        provider: korean.provider,
      });
    }

    res.status(401).json({
      message:
        "Papago 인증에 실패했습니다. 네이버 클라우드의 Client ID/Secret과 Papago 권한 설정을 확인해 주세요.",
      attempts: korean.attempts,
    });
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Translation server error.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Translation server running on http://localhost:${PORT}`);
});
