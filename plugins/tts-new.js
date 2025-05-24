const { cmd } = require("../command");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

cmd({
  pattern: "tts4",
  desc: "𝐀𝐝𝐯𝐚𝐧𝐜𝐞𝐝 𝐓𝐞𝐱𝐭 𝐓𝐨 𝐒𝐩𝐞𝐞𝐜𝐡 𝐖𝐢𝐭𝐡 𝐇𝐃 𝐕𝐨𝐢𝐜𝐞",
  category: "fun",
  react: "🎧",
  filename: __filename
}, 
async (conn, mek, m, { from, quoted, q, args, reply }) => {
  try {
    if (!q) return reply("🔊 লিখো তো আগে! যেমন: `.tts4 hello I love you`");

    // ডিফল্ট ভয়েস (তুই চাইলে অন্য ভাষাও যোগ করতে পারবি)
    let voice = "en-US-Wavenet-D";

    // যদি ইউজার 'female' লেখে তাহলে ফিমেল কণ্ঠ
    if (args[0] === "female") {
      voice = "en-US-Wavenet-C";
      q = args.slice(1).join(" ");
    }

    // যদি ইউজার 'bangla' লেখে তাহলে বাংলা কণ্ঠ (যদি available থাকে)
    if (args[0] === "bangla" || args[0] === "bn") {
      voice = "bn-BD-Wavenet-A";
      q = args.slice(1).join(" ");
    }

    const apiUrl = `https://voicer.dev/api/tts?text=${encodeURIComponent(q)}&voice=${voice}`;

    const response = await axios({
      url: apiUrl,
      method: "GET",
      responseType: "arraybuffer"
    });

    const tempAudioPath = path.join(__dirname, "../temp_tts4.mp3");
    fs.writeFileSync(tempAudioPath, response.data);

    await conn.sendMessage(from, {
      audio: { url: tempAudioPath },
      mimetype: "audio/mpeg",
      ptt: true
    }, { quoted: mek });

    fs.unlinkSync(tempAudioPath);

  } catch (err) {
    console.error(err);
    reply("❌ দোস্ত, কিছু একটা সমস্যা হয়েছে! আবার ট্রাই কর।");
  }
});
