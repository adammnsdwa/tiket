const {
  Client,
  GatewayIntentBits,
  Partials,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  PermissionFlagsBits,
  ChannelType,
  Emoji,
} = require('discord.js');
const fs = require('fs');
const path = require('path');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMembers,
  ],
  partials: [Partials.Channel, Partials.Message],
});

const CONFIG_FILE = path.join(__dirname, 'config.json');
const TICKETS_DIR = path.join(__dirname, 'tickets');

if (!fs.existsSync(TICKETS_DIR)) {
  fs.mkdirSync(TICKETS_DIR);
}

let config = {
  allowedRoles: [],
  logChannel: null,
  tickets: {},
};

function loadConfig() {
  if (fs.existsSync(CONFIG_FILE)) {
    config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
  }
}

function saveConfig() {
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
}

loadConfig();

const PURPLE_COLOR = 0x9b59b6;

client.once('clientReady', () => {
  console.log(`✅ البوت جاهز! تم تسجيل الدخول كـ ${client.user.tag}`);
  client.user.setPresence({
    activities: [{ name: 'نظام التذاكر - Respect' }],
    status: 'online',
  });
});

client.on('interactionCreate', async (interaction) => {
  try {
    if (interaction.isCommand()) {
      await handleCommand(interaction);
    } else if (interaction.isStringSelectMenu()) {
      await handleSelectMenu(interaction);
    } else if (interaction.isButton()) {
      await handleButton(interaction);
    } else if (interaction.isModalSubmit()) {
      await handleModal(interaction);
    }
  } catch (error) {
    console.error('خطأ في التفاعل:', error);
    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({ content: '❌ حدث خطأ أثناء معالجة طلبك.', ephemeral: true });
    }
  }
});

async function handleCommand(interaction) {
  const { commandName } = interaction;

  if (commandName === 'ttrr') {
    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator) &&
        !interaction.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
      return interaction.reply({ content: '❌ ليس لديك صلاحية لاستخدام هذا الأمر.', ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setColor(PURPLE_COLOR)
      .setTitle('🎫 نظام التذاكر')
      .setDescription('**اختر نوع تذكرتك !**\n\nالسلام عليكم! نحن هنا لخدمتك ومساعدتك بإذن الله. اختر نوع التذكرة المناسب لاستفسارك.')
      .setThumbnail('https://i.imgur.com/YqXrLQN.png')
      .setFooter({ text: 'Respect - نظام التذاكر' })
      .setTimestamp();

    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId('ticket_type')
      .setPlaceholder('🎟️ اختر نوع التذكرة...')
      .addOptions([
        {
          label: 'متجري',
          description: 'للاستفسار عن الطلبات والمشتريات',
          value: 'store',
          emoji: '🛒',
        },
        {
          label: 'الاستفسار',
          description: 'للأسئلة العامة والاستفسارات',
          value: 'inquiry',
          emoji: '💬',
        },
      ]);
          label: 'الدعم الفني',
          description: 'اي شي يخطر على بالك او شي صارلك',
            value: 'support',
            emoji: '🛠️',
  }
    const row = new ActionRowBuilder().addComponents(selectMenu);

    await interaction.reply({ embeds: [embed], components: [row] });
  }

  if (commandName === 'uuuii') {
    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return interaction.reply({ content: '❌ هذا الأمر للإداريين فقط.', ephemeral: true });
    }

    const role = interaction.options.getRole('role');
    
    if (config.allowedRoles.includes(role.id)) {
      config.allowedRoles = config.allowedRoles.filter(r => r !== role.id);
      saveConfig();
      return interaction.reply({ content: `✅ تم إزالة الرتبة ${role} من قائمة الرتب المسموح لها برؤية التذاكر.`, ephemeral: true });
    } else {
      config.allowedRoles.push(role.id);
      saveConfig();
      return interaction.reply({ content: `✅ تم إضافة الرتبة ${role} إلى قائمة الرتب المسموح لها برؤية التذاكر.`, ephemeral: true });
    }
  }

  if (commandName === 'kk') {
    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return interaction.reply({ content: '❌ هذا الأمر للإداريين فقط.', ephemeral: true });
    }

    const channel = interaction.options.getChannel('channel');
    config.logChannel = channel.id;
    saveConfig();
    await interaction.reply({ content: `✅ تم تعيين ${channel} كقناة لسجل إغلاق التذاكر.`, ephemeral: true });
  }

  if (commandName === 'tek') {
    if (!interaction.channel.name?.startsWith('ticket-')) {
      return interaction.reply({ content: '❌ هذا الأمر يعمل فقط داخل رومات التذاكر.', ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setColor(PURPLE_COLOR)
      .setTitle('🎛️ إدارة التذكرة')
      .setDescription('اختر الإجراء المناسب لإدارة هذه التذكرة:');

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('close_ticket')
        .setLabel('إغلاق التذكرة بسبب')
        .setEmoji('🔒')
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId('add_user')
        .setLabel('إضافة شخص')
        .setEmoji('➕')
        .setStyle(ButtonStyle.Primary)
    );

    await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
  }
}

async function handleSelectMenu(interaction) {
  if (interaction.customId === 'ticket_type') {
    const ticketType = interaction.values[0];

    if (ticketType === 'store') {
      const modal = new ModalBuilder()
        .setCustomId('store_modal')
        .setTitle('🛒 المتجر');

      const titleInput = new TextInputBuilder()
        .setCustomId('title')
        .setLabel('ضع عنوان مختصر لمشكلتك أو ملاحظتك')
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
        .setMaxLength(100);

      const orderInput = new TextInputBuilder()
        .setCustomId('order_number')
        .setLabel('أدخل رقم الطلب (إذا كان متاحاً)')
        .setStyle(TextInputStyle.Short)
        .setRequired(false)
        .setMaxLength(50);

      const firstRow = new ActionRowBuilder().addComponents(titleInput);
      const secondRow = new ActionRowBuilder().addComponents(orderInput);

      modal.addComponents(firstRow, secondRow);
      await interaction.showModal(modal);
    } else if (ticketType === 'inquiry') {
      const modal = new ModalBuilder()
        .setCustomId('inquiry_modal')
        .setTitle('💬 الاستفسار');

      const titleInput = new TextInputBuilder()
        .setCustomId('title')
        .setLabel('ضع عنوان لاستفسارك')
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
        .setMaxLength(100);

      const descInput = new TextInputBuilder()
        .setCustomId('description')
        .setLabel('اكتب وصف مختصر لاستفسارك')
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true)
        .setMaxLength(500);

      const firstRow = new ActionRowBuilder().addComponents(titleInput);
      const secondRow = new ActionRowBuilder().addComponents(descInput);

      modal.addComponents(firstRow, secondRow);
      await interaction.showModal(modal);
    }
  }
}

async function handleModal(interaction) {
  if (interaction.customId === 'close_reason_modal') {
    const reason = interaction.fields.getTextInputValue('close_reason');
    
    const ticketChannel = interaction.channel;
    const ticketData = config.tickets[ticketChannel.id];
    if (ticketData) {
      ticketData.closeReason = reason;
      saveConfig();
    }
    
    const confirmEmbed = new EmbedBuilder()
      .setColor(PURPLE_COLOR)
      .setTitle('⚠️ تأكيد إغلاق التذكرة')
      .setDescription(`**سبب الإغلاق:** ${reason}\n\nهل أنت متأكد من إغلاق هذه التذكرة؟`);

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('confirm_close_yes')
        .setLabel('نعم، أغلق التذكرة')
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId('confirm_close_no')
        .setLabel('إلغاء')
        .setStyle(ButtonStyle.Secondary)
    );

    await interaction.reply({ embeds: [confirmEmbed], components: [row], ephemeral: true });
    return;
  }

  if (interaction.customId === 'add_user_modal') {
    const userId = interaction.fields.getTextInputValue('user_id');
    
    try {
      const member = await interaction.guild.members.fetch(userId);
      await interaction.channel.permissionOverwrites.create(member, {
        ViewChannel: true,
        SendMessages: true,
        ReadMessageHistory: true,
      });

      await interaction.reply({ content: `✅ تم إضافة ${member} إلى التذكرة.`, ephemeral: true });
    } catch (error) {
      await interaction.reply({ content: '❌ لم يتم العثور على المستخدم. تأكد من صحة الـ ID.', ephemeral: true });
    }
    return;
  }

  if (interaction.customId === 'store_modal' || interaction.customId === 'inquiry_modal') {
    const ticketType = interaction.customId === 'store_modal' ? 'المتجر' : 'الاستفسار';
    const title = interaction.fields.getTextInputValue('title');
    const ticketNumber = Date.now().toString().slice(-6);

    let ticketData = {
      userId: interaction.user.id,
      type: ticketType,
      title: title,
      ticketNumber: ticketNumber,
    };

    if (interaction.customId === 'store_modal') {
      const orderNumber = interaction.fields.getTextInputValue('order_number') || 'غير متوفر';
      ticketData.orderNumber = orderNumber;
    } else {
      const description = interaction.fields.getTextInputValue('description');
      ticketData.description = description;
    }

  const channelName = `ticket-${ticketNumber}`;
  const permissionOverwrites = [
    {
      id: interaction.guild.id,
      deny: [PermissionFlagsBits.ViewChannel],
    },
    {
      id: interaction.user.id,
      allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory],
    },
    {
      id: client.user.id,
      allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory],
    },
  ];

  config.allowedRoles.forEach(roleId => {
    permissionOverwrites.push({
      id: roleId,
      allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory],
    });
  });

  const ticketChannel = await interaction.guild.channels.create({
    name: channelName,
    type: ChannelType.GuildText,
    permissionOverwrites: permissionOverwrites,
  });

  const embed = new EmbedBuilder()
    .setColor(PURPLE_COLOR)
    .setTitle(`🎫 ${ticketType} - #${ticketNumber}`)
    .setDescription(`**العنوان:** ${title}`)
    .setFooter({ text: `تم الإنشاء بواسطة ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
    .setTimestamp();

  if (ticketData.orderNumber) {
    embed.addFields({ name: 'رقم الطلب', value: ticketData.orderNumber, inline: true });
  }
  if (ticketData.description) {
    embed.addFields({ name: 'الوصف', value: ticketData.description, inline: false });
  }

  await ticketChannel.send({ content: `${interaction.user}`, embeds: [embed] });

  config.tickets[ticketChannel.id] = ticketData;
  saveConfig();

  try {
    const dmEmbed = new EmbedBuilder()
      .setColor(PURPLE_COLOR)
      .setTitle('🎫 تم إنشاء تذكرتك بنجاح!')
      .setDescription(`**أهلاً، كيف أقدر أخدمك؟**\n\nتم إنشاء تذكرتك بنجاح. سيتم الرد عليك قريباً من قبل فريق الدعم.\n\n**رقم التذكرة:** #${ticketNumber}\n**النوع:** ${ticketType}\n**العنوان:** ${title}`)
      .setFooter({ text: 'Respect - نظام التذاكر' })
      .setTimestamp();

    await interaction.user.send({ embeds: [dmEmbed] });
  } catch (error) {
    console.error('لا يمكن إرسال رسالة خاصة للمستخدم:', error);
  }

    await interaction.reply({ content: `✅ تم إنشاء تذكرتك بنجاح! ${ticketChannel}`, ephemeral: true });
  }
}

async function handleButton(interaction) {
  if (interaction.customId === 'close_ticket') {
    const modal = new ModalBuilder()
      .setCustomId('close_reason_modal')
      .setTitle('إغلاق التذكرة');

    const reasonInput = new TextInputBuilder()
      .setCustomId('close_reason')
      .setLabel('سبب الإغلاق')
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true);

    const row = new ActionRowBuilder().addComponents(reasonInput);
    modal.addComponents(row);

    await interaction.showModal(modal);
  } else if (interaction.customId === 'add_user') {
    const modal = new ModalBuilder()
      .setCustomId('add_user_modal')
      .setTitle('إضافة شخص للتذكرة');

    const userInput = new TextInputBuilder()
      .setCustomId('user_id')
      .setLabel('ID المستخدم')
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const row = new ActionRowBuilder().addComponents(userInput);
    modal.addComponents(row);

    await interaction.showModal(modal);
  } else if (interaction.customId === 'confirm_close_yes') {
    const ticketChannel = interaction.channel;
    const ticketData = config.tickets[ticketChannel.id];

    if (config.logChannel && ticketData) {
      const logChannel = await interaction.guild.channels.fetch(config.logChannel);
      const closeEmbed = new EmbedBuilder()
        .setColor(PURPLE_COLOR)
        .setTitle('🔒 تم إغلاق تذكرة')
        .addFields(
          { name: 'رقم التذكرة', value: `#${ticketData.ticketNumber}`, inline: true },
          { name: 'النوع', value: ticketData.type, inline: true },
          { name: 'المستخدم', value: `<@${ticketData.userId}>`, inline: true },
          { name: 'العنوان', value: ticketData.title, inline: false },
          { name: 'سبب الإغلاق', value: ticketData.closeReason || 'غير محدد', inline: false },
          { name: 'تم الإغلاق بواسطة', value: interaction.user.tag, inline: true }
        )
        .setTimestamp();

      await logChannel.send({ embeds: [closeEmbed] });
    }

    delete config.tickets[ticketChannel.id];
    saveConfig();

    await interaction.reply({ content: '🔒 سيتم إغلاق التذكرة خلال 5 ثوان...' });
    setTimeout(async () => {
      await ticketChannel.delete();
    }, 5000);
  } else if (interaction.customId === 'confirm_close_no') {
    await interaction.reply({ content: '✅ تم إلغاء إغلاق التذكرة.', ephemeral: true });
  }
}

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  if (message.channel.name?.startsWith('ticket-')) {
    const ticketData = config.tickets[message.channel.id];
    if (!ticketData) return;

    if (message.author.id !== ticketData.userId && !message.author.bot) {
      try {
        const user = await client.users.fetch(ticketData.userId);
        const dmEmbed = new EmbedBuilder()
          .setColor(PURPLE_COLOR)
          .setTitle('📨 رد جديد على تذكرتك')
          .setDescription(message.content)
          .setFooter({ text: `التذكرة #${ticketData.ticketNumber}` })
          .setTimestamp();

        await user.send({ embeds: [dmEmbed] });
      } catch (error) {
        console.error('لا يمكن إرسال الرد للمستخدم:', error);
      }
    }
  }

  if (message.channel.type === ChannelType.DM && !message.author.bot) {
    const userTickets = Object.entries(config.tickets).filter(([_, data]) => data.userId === message.author.id);
    
    if (userTickets.length > 0) {
      const [channelId, ticketData] = userTickets[0];
      try {
        const ticketChannel = await client.channels.fetch(channelId);
        const embed = new EmbedBuilder()
          .setColor(PURPLE_COLOR)
          .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
          .setDescription(message.content)
          .setTimestamp();

        await ticketChannel.send({ embeds: [embed] });
        await message.react('✅');
      } catch (error) {
        console.error('خطأ في إرسال الرسالة للتذكرة:', error);
      }
    }
  }
});

const token = process.env.DISCORD_BOT_TOKEN;
if (!token) {
  console.error('❌ لم يتم العثور على DISCORD_BOT_TOKEN في المتغيرات البيئية!');
  process.exit(1);
}

client.login(token).catch(err => {
  console.error('❌ فشل تسجيل الدخول:', err);
  process.exit(1);
});
