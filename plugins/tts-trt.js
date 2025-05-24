const axios = require("axios");
const googleTTS = require("google-tts-api");
const { cmd } = require("../command");

// ⬇️ KAISEN-MD Translation Command
cmd({
  pattern: "trt",
  alias: ["translate"],
  desc: "🌍 Translate any text to your target language",
  react: "🌐",
  category: "tools",
  filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
  try {
    const args = q.split(" ");
    if (args.length < 2) {
      return reply(`❗ Usage:\n.trt [language_code] [text]\n\nExample:\n.trt bn I love you`);
    }

    const targetLang = args[0];
    const textToTranslate = args.slice(1).join(" ");

    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(textToTranslate)}&langpair=en|${targetLang}`;

    const response = await axios.get(url);
    const translation = response.data.responseData.translatedText;

    const replyText = `╭──⭓ 𝐊ąìʂҽղ-𝐌𝐃 Translator
│ 
├ 📝 *Original:* ${textToTranslate}
├ 🌐 *Translated:* ${translation}
├ 🔠 *To Language:* ${targetLang.toUpperCase()}
╰────────────⭑`;

    return reply(replyText);
  } catch (err) {
    console.log(err);
    return reply("❌ Translate করতে সমস্যা হয়েছে! আবার চেষ্টা কর।");
  }
});

// ⬇️ KAISEN-MD TTS Command
cmd({
  pattern: "tts",
  desc: "🔊 Convert text to voice (Google TTS)",
  react: "🎙️",
  category: "tools",
  filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
  try {
    if (!q) return reply("❗ উদাহরণ:\n.tts তোমায় ভালোবাসি");

    const audioUrl = googleTTS.getAudioUrl(q, {
      lang: "hi-IN", // চাইলে তুই bn-IN বা en-US করতে পারিস
      slow: false,
      host: "https://translate.google.com"
    });

    await conn.sendMessage(from, {
      audio: { url: audioUrl },
      mimetype: "audio/mpeg",
      ptt: true
    }, { quoted: mek });

  } catch (err) {
    console.error(err);
    return reply("⚠️ টেক্সট ভয়েসে রূপান্তর করতে সমস্যা হয়েছে!");
  }
});
