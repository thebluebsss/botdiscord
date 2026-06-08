require("dotenv").config();

const {
  Client,
  GatewayIntentBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
  ],
});
const fs = require("fs");
const sinhNhatData = [
  {
    ten: "Bùi",
    ngay: 26,
    thang: 11,
  },
  {
    ten: "Đạt",
    ngay: 3,
    thang: 9,
  },
  {
    ten: "Long",
    ngay: 9,
    thang: 1,
  },
  {
    ten: "Khánh",
    ngay: 10,
    thang: 9,
  },
  {
    ten: "Tiến",
    ngay: 1,
    thang: 8,
  },
  {
    ten: "Mềm",
    ngay: 24,
    thang: 9,
  },
  {
    ten: "Tày",
    ngay: 20,
    thang: 7,
  },
  {
    ten: "Khang",
    ngay: 20,
    thang: 7,
  },
  {
    ten: "Minh A",
    ngay: 15,
    thang: 1,
  },
  {
    ten: "Quân",
    ngay: 15,
    thang: 4,
  },
  {
    ten: "Thanh",
    ngay: 4,
    thang: 4,
  },
  {
    ten: "An",
    ngay: 22,
    thang: 1,
  },
  {
    ten: "Hoàn",
    ngay: 6,
    thang: 8,
  },
  {
    ten: "Khiêm",
    ngay: 3,
    thang: 5,
  },
];
const doanSessions = new Map();
let currentVote = null;
function loadLineup() {
  try {
    const data = fs.readFileSync("./lineup.json", "utf8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function saveLineup(lineup) {
  fs.writeFileSync("./lineup.json", JSON.stringify(lineup, null, 2), "utf8");
}

let lineup = loadLineup();
client.once("ready", () => {
  console.log("💖 Bot đã online");
});

client.on("messageCreate", async (msg) => {
  if (msg.author.bot) return;

  //mes
  if (msg.content === "!command") {
    return msg.reply(
      "!doanso, !doan, !datn, !sinhnhat, !ai, !bxh, !vote, !lineup, !an, !bui, !dat, !tien, !long, !khanh, !hoan, !tai, !khang",
    );
  }
  if (msg.content === "đạt ơi") {
    return msg.reply("Dạ em đây ạ! ");
  }

  if (msg.content === "top 2 tư duy vn là ai") {
    return msg.reply("cungu");
  }
  if (msg.content === "!an") {
    return msg.reply("địt mẹ mày nghịch ít thôi");
  }
  if (msg.content === "!bui") {
    return msg.reply(
      "goat (gà of all time), no brain, sometime aim, 5060 ti colorful duo gaming",
    );
  }
  if (msg.content === "!dat") {
    return msg.reply(
      "người cụ của discord - bởi sự già dơ và kinh nghiệm của cụ với những cú côn và đoán với sự chính xác cực cao khiến tất cả các cháu đều kính trọng ",
    );
  }
  if (msg.content === "!tien") {
    return msg.reply("sữa nhất ");
  }
  if (msg.content === "!long") {
    return msg.reply("sữa nhị ");
  }
  if (msg.content === "!khanh") {
    return msg.reply("sữa ba, primmie rep 1:1  ");
  }
  if (msg.content === "!hoan") {
    return msg.reply(
      "666 cún milo, no brain, 2% aim, 98% gym, tốt cho cậu thôi",
    );
  }
  if (msg.content === "!tai") {
    return msg.reply(
      "37, 100% aim nên chưa cần dùng đến não,3 nick immo, bạn thân cụ ",
    );
  }
  if (msg.content === "!khang") {
    return msg.reply("mâm 2, no aim, hlv tactics(mọi thể loại game) ");
  }
  //doanso
  if (msg.content.startsWith("!doanso")) {
    const args = msg.content.split(" ");

    if (args.length !== 3) {
      return msg.reply(
        "Cách dùng: `!doanso <số nhỏ> <số lớn>`\nVí dụ: `!doanso 0 100`",
      );
    }

    const min = Number(args[1]);
    const max = Number(args[2]);

    if (isNaN(min) || isNaN(max)) {
      return msg.reply("Hai giá trị phải là số.");
    }

    if (min > max) {
      return msg.reply("Số đầu phải nhỏ hơn hoặc bằng số sau.");
    }

    const ketQua = Math.floor(Math.random() * (max - min + 1)) + min;

    return msg.reply(`Cụ phán con số: **${ketQua}**`);
  }

  //doan
  const session = doanSessions.get(msg.author.id);

  if (session) {
    const options = msg.content
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    if (options.length < 2) {
      return updatePrompt(
        session,
        msg,
        "❌ Nhập ít nhất 2 lựa chọn, cách nhau bởi dấu phẩy (,)",
      );
    }

    const ketQua = options[Math.floor(Math.random() * options.length)];

    try {
      if (session.promptMsg) {
        await session.promptMsg.delete();
      }
    } catch {}

    doanSessions.delete(msg.author.id);

    return msg.channel.send(`Cụ phán: **${ketQua}**`);
  }

  if (msg.content === "!doan") {
    doanSessions.set(msg.author.id, {
      promptMsg: null,
    });

    const session = doanSessions.get(msg.author.id);

    await updatePrompt(
      session,
      msg,
      "Nhập các lựa chọn, cách nhau bởi dấu phẩy (,)",
    );

    return;
  }

  //datn

  if (msg.content === "!datn") {
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("chua_xong")
        .setLabel("Chưa xong")
        .setStyle(ButtonStyle.Danger),

      new ButtonBuilder()
        .setCustomId("dang_viet_quyen")
        .setLabel("Đang viết quyển")
        .setStyle(ButtonStyle.Success),
    );

    return msg.reply({
      content: "ĐATN của cháu thế nào rồi?",
      components: [row],
    });
  }

  //sinhnhat
  if (msg.content === "!sinhnhat") {
    const homNay = new Date();

    const ngayHienTai = homNay.getDate();
    const thangHienTai = homNay.getMonth() + 1;

    const loiChuc = [];
    const sapToi = [];

    for (const nguoi of sinhNhatData) {
      // Đúng sinh nhật
      if (nguoi.ngay === ngayHienTai && nguoi.thang === thangHienTai) {
        loiChuc.push(`🎂 Cụ chúc mừng sinh nhật cháu ${nguoi.ten}!`);
        continue;
      }

      // Tính số ngày còn lại
      const nam = homNay.getFullYear();

      let sinhNhat = new Date(nam, nguoi.thang - 1, nguoi.ngay);

      if (sinhNhat < homNay) {
        sinhNhat = new Date(nam + 1, nguoi.thang - 1, nguoi.ngay);
      }

      const soNgay = Math.ceil((sinhNhat - homNay) / (1000 * 60 * 60 * 24));

      // Chỉ báo các sinh nhật trong vòng 30 ngày
      if (soNgay <= 30) {
        if (nguoi.ten === "Đạt") {
          sapToi.push(
            `🎁 Sắp đến sinh nhật cụ, các cháu chuẩn bị nhé! (${nguoi.ngay}/${nguoi.thang}) còn ${soNgay} ngày nữa`,
          );
        } else {
          sapToi.push(
            `🎁 Sắp đến sinh nhật cháu ${nguoi.ten} (${nguoi.ngay}/${nguoi.thang}) còn ${soNgay} ngày nữa`,
          );
        }
      }
    }

    const ketQua = [...loiChuc, ...sapToi];

    if (ketQua.length === 0) {
      return msg.reply("Chưa gần sinh nhật cháu nào cả");
    }

    return msg.reply(ketQua.join("\n"));
  }

  //ai
  if (msg.content.startsWith("!ai ")) {
    const cauHoi = msg.content.slice(4);

    const nguoi = sinhNhatData[Math.floor(Math.random() * sinhNhatData.length)];

    return msg.reply(`${cauHoi}?\nCụ phán: **${nguoi.ten}**`);
  }
  // bxh
  if (msg.content.startsWith("!bxh ")) {
    const chuDe = msg.content.slice(5).trim();

    if (!chuDe) {
      return msg.reply("Ví dụ: `!bxh chơi game hay nhất`");
    }

    // Lấy tên từ sinhNhatData
    const ds = sinhNhatData.map((nguoi) => nguoi.ten);

    // Xáo ngẫu nhiên
    for (let i = ds.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [ds[i], ds[j]] = [ds[j], ds[i]];
    }

    let ketQua = `🏆 BXH ${chuDe}\n`;

    ds.forEach((ten, index) => {
      if (index === 0) {
        ketQua += `🥇 Top 1: ${ten}\n`;
      } else if (index === 1) {
        ketQua += `🥈 Top 2: ${ten}\n`;
      } else if (index === 2) {
        ketQua += `🥉 Top 3: ${ten}\n`;
      } else {
        ketQua += `${index + 1}. ${ten}\n`;
      }
    });

    return msg.reply(ketQua);
  }

  //lineup
  if (msg.content === "!lineup") {
    let ketQua = "📋 Lineup hiện tại:\n\n";

    for (let i = 0; i < 5; i++) {
      ketQua += `${i + 1}. ${lineup[i] || "Trống"}\n`;
    }

    return msg.reply(ketQua);
  }
  //add
  if (msg.content.startsWith("!add ")) {
    const ten = msg.content.slice(5).trim();

    if (!ten) {
      return msg.reply("Ví dụ: !add Tài");
    }

    if (lineup.includes(ten)) {
      return msg.reply(`${ten} đã có trong đội hình rồi`);
    }

    if (lineup.length >= 5) {
      return msg.reply(" Kick 1 thằng đi");
    }

    lineup.push(ten);

    saveLineup(lineup);

    return msg.reply(` Đã thêm ${ten}`);
  }
  //kick
  if (msg.content.startsWith("!kick ")) {
    const ten = msg.content.slice(6).trim();

    const index = lineup.findIndex(
      (item) => item.toLowerCase() === ten.toLowerCase(),
    );

    if (index === -1) {
      return msg.reply(`${ten} không có trong đội hình`);
    }

    lineup.splice(index, 1);

    saveLineup(lineup);

    return msg.reply(` Đã kick thằng ngu ${ten}`);
  }
  //vote
  if (msg.content.startsWith("!vote ")) {
    const chuDe = msg.content.slice(6).trim();

    if (!chuDe) {
      return msg.reply("Ví dụ: !vote ai ngu nhất");
    }

    const emojis = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];

    const danhSach = sinhNhatData.map((x) => x.ten).slice(0, 10);

    let noiDung = ` Vote: ${chuDe}\n\n`;

    danhSach.forEach((ten, index) => {
      noiDung += `${emojis[index]} ${ten}\n`;
    });

    const voteMsg = await msg.channel.send(noiDung);

    for (let i = 0; i < danhSach.length; i++) {
      await voteMsg.react(emojis[i]);
    }

    currentVote = {
      chuDe,
      danhSach,
      messageId: voteMsg.id,
    };

    return;
  }
  if (msg.content === "!ketqua") {
    if (!currentVote) {
      return msg.reply("Chưa có cuộc vote nào.");
    }

    try {
      const voteMsg = await msg.channel.messages.fetch(currentVote.messageId);

      const emojis = [
        "1️⃣",
        "2️⃣",
        "3️⃣",
        "4️⃣",
        "5️⃣",
        "6️⃣",
        "7️⃣",
        "8️⃣",
        "9️⃣",
        "🔟",
      ];

      let ketQua = ` Kết quả vote: ${currentVote.chuDe}\n\n`;

      const ranking = [];

      for (let i = 0; i < currentVote.danhSach.length; i++) {
        const reaction = voteMsg.reactions.cache.get(emojis[i]);

        const votes = reaction ? reaction.count - 1 : 0;

        ranking.push({
          ten: currentVote.danhSach[i],
          votes,
        });
      }

      ranking.sort((a, b) => b.votes - a.votes);

      ranking.forEach((item, index) => {
        ketQua += `${index + 1}. ${item.ten} - ${item.votes} vote\n`;
      });

      return msg.reply(ketQua);
    } catch (err) {
      console.error(err);
      return msg.reply("Không lấy được kết quả vote.");
    }
  }
});

async function updatePrompt(session, msg, content) {
  try {
    if (session.promptMsg) {
      await session.promptMsg.delete();
    }
  } catch (err) {}

  session.promptMsg = await msg.channel.send(content);
}

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isButton()) return;

  const disabledRow = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("chua_xong")
      .setLabel("Chưa xong")
      .setStyle(ButtonStyle.Danger)
      .setDisabled(true),

    new ButtonBuilder()
      .setCustomId("dang_viet_quyen")
      .setLabel("Đang viết quyển")
      .setStyle(ButtonStyle.Success)
      .setDisabled(true),
  );

  try {
    if (interaction.customId === "chua_xong") {
      await interaction.update({
        content: "ĐATN của cháu thế nào rồi?",
        components: [disabledRow],
      });

      await interaction.followUp({
        content: "Kém 😏",
      });
    }

    if (interaction.customId === "dang_viet_quyen") {
      await interaction.update({
        content: "ĐATN của cháu thế nào rồi?",
        components: [disabledRow],
      });

      await interaction.followUp({
        content: "Thế mà đã viết quyển rồi á 😲",
      });
    }
  } catch (err) {
    console.error(err);
  }
});

client.login(process.env.TOKEN);
