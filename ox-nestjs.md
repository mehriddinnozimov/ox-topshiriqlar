### ✅ OX GROUP uchun NestJS backend test task

**Muhim:**
Avval quyidagilarni barchasini diqqat bilan o'qing.

**Maqsad:**
Nomzodning NestJS, autentifikatsiya, DTO validatsiya, custom decoratorlar, hamda tashqi API (ox-sys.com) bilan ishlash bo‘yicha ko‘nikmalarini baholash.

---

### 🔧 Texnologiyalar (Majburiy)

- `NestJS` – asosiy framework
- `Prisma ORM` – ma’lumotlar bazasi bilan ishlash uchun
- `DTO Validation` – `class-validator` bilan
- JWT orqali autentifikatsiya
- Custom Auth Decoratorlar: `@AdminOnly()`, `@ManagerOnly()`

---

### 📌 Topshiriq Tavsifi

1. **Login:**

   - `POST /auth/login`
   - Body: `email`
   - Agar foydalanuvchi mavjud bo‘lmasa, yaratilsin.
   - OTP generatsiya qilinib, javobda qaytarilsin (real yuborish shart emas).
   - Default role: `manager`

2. **Verify OTP:**

   - `POST /auth/verify`
   - Body: `email`, `otp`
   - Agar OTP to‘g‘ri bo‘lsa, JWT token qaytarilsin.

3. **OX loyihasiga tegishli kompaniyani qo‘shish:**
   OX API lari bilan ishlash uchun OX'ga tegishli subdomain va JWT token kerak bo'ladi. Bular biz beramiz.

   - `POST /register-company`
   - Body:

     ```json
     {
       "token": "Bearer xyz",
       "subdomain": "demo"
     }
     ```

   - Bu API:

     - `OX`dagi `/profile` endpointga `token` orqali so‘rov yuborib, tokenni validatsiya qiladi.
     - Kompaniya subdomain bo‘yicha bazada mavjud bo'lmasa:

       - Kompaniya qo‘shiladi.
       - Foydalanuvchiga `admin` roli beriladi.

     - Agar kompaniya mavjud bo‘lsa:

       - Shu kompaniyaga `manager` sifatida biriktiriladi (admin emas).

4. **Kompaniyani o‘chirish:**

   - `DELETE /company/:id`
   - Faqat `admin` o‘zi qo‘shgan kompaniyani o‘chira oladi.

5. **Mahsulotlar ro‘yxatini olish:**

   - `GET /products?page=1&size=10`
   - Faqat `manager` roldagi foydalanuvchilar foydalanishi mumkin.
   - Foydalanuvchiga biriktirilgan kompaniya subdomain va token orqali OX'dagi `/variations` endpointga so‘rov yuboriladi.
   - `page` va `size` query’lari forward qilinadi.
   - `size` 20 dan katta bo‘lsa, 400 qaytarsin.

---

### 🌐 `ox-sys.com` API bilan integratsiya

- Endpoint: `https://{subdomain}.ox-sys.com/{endpoint}`
- Header:

  ```http
  Accept: application/json
  Authorization: Bearer <token>
  ```

---

### 💡 Qo‘shimcha

- Frontend kerak emas. API’lar JSON response qaytarishi kifoya.
- Projectni minimal, lekin toza struktura bilan yozish.
- Kodni GitHub’ga joylang.
- README faylga qisqacha sozlash ko‘rsatmasi yozing (env, setup).
- AI ishlatish mumkin. Lekin oshiqcha narsa bo'lmasligi shart
- Loyiha ishaydigan bo'lishi shart!

---

Muddat 48 soat.
Ishlatish uchun sizga subdomain va token beriladi.
Tayyor bo‘lgach, GitHub linkni yuboring.
Savollar bo‘lsa, issue qoldiring.
