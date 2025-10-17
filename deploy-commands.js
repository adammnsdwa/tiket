const { REST, Routes, ApplicationCommandOptionType } = require('discord.js');

const commands = [
  {
    name: 'ttrr',
    description: 'عرض نظام التذاكر للجميع (Admin/Moderator فقط)',
  },
  {
    name: 'uuuii',
    description: 'إضافة أو إزالة رتبة من قائمة الرتب المسموح لها برؤية التذاكر',
    options: [
      {
        name: 'role',
        type: ApplicationCommandOptionType.Role,
        description: 'الرتبة المراد إضافتها أو إزالتها',
        required: true,
      },
    ],
  },
  {
    name: 'tek',
    description: 'عرض قائمة إدارة التذكرة (يعمل فقط داخل روم التذكرة)',
  },
  {
    name: 'kk',
    description: 'تحديد القناة التي يتم إرسال سجل إغلاق التذاكر فيها',
    options: [
      {
        name: 'channel',
        type: ApplicationCommandOptionType.Channel,
        description: 'القناة المراد تعيينها لسجل الإغلاق',
        required: true,
      },
    ],
  },
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN);

(async () => {
  try {
    console.log('بدء تسجيل الأوامر...');

    const clientId = process.env.DISCORD_CLIENT_ID;
    const guildId = process.env.DISCORD_GUILD_ID;

    if (!clientId) {
      console.error('❌ DISCORD_CLIENT_ID غير موجود في المتغيرات البيئية!');
      process.exit(1);
    }

    if (guildId) {
      await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
        body: commands,
      });
      console.log('✅ تم تسجيل الأوامر في السيرفر بنجاح!');
    } else {
      await rest.put(Routes.applicationCommands(clientId), {
        body: commands,
      });
      console.log('✅ تم تسجيل الأوامر عالمياً بنجاح!');
    }
  } catch (error) {
    console.error('❌ خطأ في تسجيل الأوامر:', error);
    process.exit(1);
  }
})();
