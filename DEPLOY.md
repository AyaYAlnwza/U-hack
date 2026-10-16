# CampusBoost: อัปขึ้น GitHub และโฮสต์เว็บ

## สถานะของแอป

หน้าเว็บปัจจุบันเป็น **เดโม**: โปรเจกต์ ค่าย และการสนับสนุนส่วนใหญ่เก็บใน `localStorage` ของแต่ละเบราว์เซอร์ และยังไม่มีการชำระเงินจริงหรือธุรกรรม Escrow จากหน้าเว็บ แม้ในรีโปจะมี Smart Contract ก็ตาม อย่าใส่ private key ในตัวแปร `NEXT_PUBLIC_*` หรือใน Git

API ประกาศขายโปรเจกต์และระดับสมาชิกเขียนไฟล์ใน `frontend/data/` จึงไม่บันทึกข้อมูลถาวรบน Vercel การนำสองฟีเจอร์นี้ไปใช้กับผู้ใช้จริงต้องย้ายข้อมูลไปฐานข้อมูล และเพิ่มระบบยืนยันตัวตน/สิทธิ์ก่อน

## GitHub

รีโปใช้ `origin` ที่ตั้งไว้แล้ว ก่อน push ให้ตรวจ `git status` และ `git diff --cached --stat` เพื่อดูไฟล์ทั้งหมด โดยเฉพาะไฟล์ `.env` ซึ่งต้องไม่อยู่ใน commit ไฟล์ `contracts/node_modules`, `contracts/artifacts` และ `contracts/cache` ที่เคยถูกติดตามต้องนำออกจาก Git index ด้วย `git rm -r --cached -- contracts/node_modules contracts/artifacts contracts/cache` (ไฟล์บนเครื่องยังอยู่) จากนั้น `git add -A`, `git commit -m "Prepare CampusBoost demo for hosting"` และ `git push origin main`

## Vercel สำหรับเดโม

1. เชื่อมบัญชี GitHub กับ Vercel และ Import รีโป `AyaYAlnwza/U-hack`
2. ตั้ง **Root Directory** เป็น `frontend` และ **Framework Preset** เป็น Next.js
3. ใช้ Install Command `npm install` และ Build Command `npm run build` หรือค่าเริ่มต้นที่ Vercel ตรวจพบ
4. สำหรับเดโมยังไม่ต้องใส่ตัวแปรสภาพแวดล้อมของ Smart Contract เพราะหน้าเว็บยังไม่ได้ส่งธุรกรรมจริง
5. กด Deploy แล้วทดสอบหน้าแรก `/create`, `/marketplace`, `/subscription` และ `/projects/proj-1`

หากต้องการให้ประกาศขายและสมาชิกใช้ข้ามอุปกรณ์และเก็บข้อมูลถาวร ให้เลือกฐานข้อมูลและระบบล็อกอินก่อนเปิดใช้งานจริง หากต้องการเชื่อมเงินบนบล็อกเชน ต้องเชื่อม frontend กับ contract ที่ deploy แล้วและทดสอบเส้นทางอนุมัติ/ปล่อยเงินอีกครั้ง

**ความปลอดภัย:** ไฟล์ `contracts/.env.example` เคยมีค่าที่มีรูปแบบเหมือน private key ซึ่งถูกลบออกจากเวอร์ชันปัจจุบันแล้ว หากคีย์นั้นเคยถูกใช้ ให้ถือว่าเปิดเผยและเปลี่ยนไปใช้กระเป๋าใหม่ก่อน deploy contract
