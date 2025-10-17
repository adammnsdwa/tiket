# 📋 دليل الإعداد - بوت Respect

## ⚠️ ملاحظة مهمة قبل البدء

عند طلب المتغيرات البيئية، يرجى التأكد من إدخال القيم الصحيحة:

### ❌ خطأ شائع - DISCORD_CLIENT_ID
**لا تضع رابط OAuth2 كامل!** 

مثال خاطئ:
```
https://discord.com/oauth2/authorize?client_id=1428819486135554098&permissions=8...
```

### ✅ الصحيح - DISCORD_CLIENT_ID
**ضع رقم التطبيق فقط!**

مثال صحيح:
```
1428819486135554098
```

---

## 🚀 خطوات الإعداد الكاملة

### 1️⃣ إنشاء البوت في Discord Developer Portal

1. اذهب إلى [Discord Developer Portal](https://discord.com/developers/applications)
2. اضغط على **"New Application"**
3. أعطي التطبيق اسم **"Respect"** (أو أي اسم تريده)
4. اضغط **"Create"**

### 2️⃣ إعداد البوت وتفعيل الصلاحيات

1. من القائمة الجانبية، اذهب إلى **"Bot"**
2. في قسم **"Privileged Gateway Intents"**، فعّل:
   - ✅ **Presence Intent**
   - ✅ **Server Members Intent**
   - ✅ **Message Content Intent**
3. احفظ التغييرات

### 3️⃣ الحصول على Token البوت

1. في نفس صفحة **"Bot"**
2. اضغط على **"Reset Token"**
3. انسخ التوكن الذي يظهر
4. **احفظه في مكان آمن** - هذا هو **DISCORD_BOT_TOKEN**

### 4️⃣ الحصول على Application ID

1. من القائمة الجانبية، اذهب إلى **"General Information"**
2. انسخ **"Application ID"**
3. هذا هو **DISCORD_CLIENT_ID** - **رقم فقط، ليس رابط!**

### 5️⃣ إضافة البوت للسيرفر

1. من القائمة الجانبية، اذهب إلى **"OAuth2"** ثم **"URL Generator"**
2. في **"Scopes"** اختر:
   - ☑️ `bot`
   - ☑️ `applications.commands`
3. في **"Bot Permissions"** اختر:
   - ☑️ Manage Channels
   - ☑️ Send Messages
   - ☑️ Embed Links
   - ☑️ Read Message History
   - ☑️ Manage Messages
   - ☑️ Add Reactions
4. انسخ الرابط الذي يظهر في الأسفل
5. افتح الرابط في المتصفح لإضافة البوت لسيرفرك

### 6️⃣ الحصول على Server ID

1. افتح Discord
2. تأكد من تفعيل **Developer Mode**:
   - اذهب إلى **User Settings** ⚙️
   - **Advanced** (متقدم)
   - فعّل **Developer Mode**
3. اضغط بزر الماوس الأيمن على السيرفر
4. اختر **"Copy Server ID"**
5. هذا هو **DISCORD_GUILD_ID**

### 7️⃣ تسجيل الأوامر في Discord

بعد إدخال جميع المتغيرات البيئية في Replit Secrets، شغّل الأمر التالي **مرة واحدة**:

```bash
node deploy-commands.js
```

ستظهر رسالة: `✅ تم تسجيل الأوامر في السيرفر بنجاح!`

### 8️⃣ تشغيل البوت

البوت سيعمل تلقائياً عبر Workflow. تأكد من ظهور:
```
✅ البوت جاهز! تم تسجيل الدخول كـ [اسم البوت]
```

---

## 📝 ملخص المتغيرات المطلوبة

| المتغير | الوصف | مثال |
|---------|--------|------|
| `DISCORD_BOT_TOKEN` | توكن البوت من صفحة Bot | `MTQyODgxOTQ4NjEzNTU1NDA5OA.G...` |
| `DISCORD_CLIENT_ID` | معرف التطبيق (رقم فقط!) | `1428819486135554098` |
| `DISCORD_GUILD_ID` | معرف السيرفر | `1397066180900163624` |

---

## 🎯 بعد التشغيل

### استخدام الأوامر الإدارية:

1. **`/TTRR`** - عرض نظام التذاكر للجميع (Admin/Moderator فقط)
2. **`/UUUII role:@الرتبة`** - إضافة/إزالة رتبة من رؤية التذاكر
3. **`/kk channel:#القناة`** - تحديد قناة سجل إغلاق التذاكر
4. **`/TEK`** - إدارة التذكرة (يعمل فقط داخل روم التذكرة)

---

## ❓ حل المشاكل الشائعة

### البوت لا يستجيب للأوامر؟
- تأكد من تسجيل الأوامر عبر `node deploy-commands.js`
- تأكد من تفعيل جميع الـ Intents في Developer Portal

### الأوامر لا تظهر؟
- انتظر دقيقة أو دقيقتين (التحديثات تأخذ وقت)
- جرب إعادة تشغيل Discord
- تأكد من أن DISCORD_CLIENT_ID صحيح (رقم فقط!)

### البوت لا يرسل رسائل خاصة؟
- تأكد من أن المستخدم سمح بالرسائل الخاصة من أعضاء السيرفر
- Settings → Privacy & Safety → Allow direct messages from server members

---

## ✨ جاهز للاستخدام!

الآن بوتك جاهز للعمل. استمتع بنظام التذاكر الاحترافي! 🎫
