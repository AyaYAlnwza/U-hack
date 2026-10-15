# คู่มือการเปิดแพลตฟอร์ม CampusBoost สู่สาธารณะ (Production & Testnet Deployment)

> **เอกสารฉบับนี้เว้นช่องว่าง `[กรอกตรงนี้]` ไว้ให้คุณคัดลอกค่าต่างๆ มาใส่ตามลำดับได้ทันที**  
> ทำตาม 3 ขั้นตอนหลักนี้ แพลตฟอร์มของคุณจะเปิดออนไลน์ให้คนภายนอกเข้ามาใช้งานและเชื่อมต่อกระเป๋าจริงได้ทันที!

---

## 🛠️ ขั้นตอนที่ 1: ตั้งค่าและ Deploy Smart Contract ขึ้นบล็อกเชน

### 1.1 รับเหรียญทดสอบฟรี (Testnet Faucet)
ก่อน Deploy คุณต้องมีเหรียญ ETH บนเครือข่าย Base Sepolia เล็กน้อยเพื่อจ่ายค่า Gas:
- เข้าเว็บ Faucet: **https://www.alchemy.com/faucets/base-sepolia** หรือ **https://faucet.quicknode.com/base/sepolia**
- วาง Address กระเป๋าของคุณ แล้วกดรับฟรี ~0.05 - 0.1 ETH

---

### 1.2 สร้างไฟล์ `contracts/.env`
สร้างไฟล์ชื่อ `.env` ในโฟลเดอร์ `contracts/` (คัดลอกจาก `contracts/.env.example`) แล้วกรอกค่าดังนี้:

```bash
# -------------------------------------------------------------
# จุดที่ 1: Private Key กระเป๋าผู้ Deploy (ดึงได้จาก MetaMask -> Account Details -> Show Private Key)
# -------------------------------------------------------------
DEPLOYER_PRIVATE_KEY=[ใส่_PRIVATE_KEY_ตรงนี้_โดยไม่ต้องมี_0x]

# -------------------------------------------------------------
# จุดที่ 2: ที่อยู่กระเป๋าที่จะรับค่าธรรมเนียมแพลตฟอร์ม 2% (Fee Recipient)
# -------------------------------------------------------------
PLATFORM_FEE_RECIPIENT=[ใส่_PUBLIC_WALLET_ADDRESS_เช่น_0x1234...ตรงนี้]

# -------------------------------------------------------------
# จุดที่ 3: RPC URL (มีค่า Default ใช้งานได้ทันที หรือใส่จาก Alchemy)
# -------------------------------------------------------------
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org

# (ไม่บังคับ) ถ้าต้องการ Verify โค้ดบน Basescan
BASESCAN_API_KEY=[ใส่_API_KEY_จาก_basescan.org_ตรงนี้]
```

---

### 1.3 รันคำสั่ง Deploy ขึ้น Base Sepolia
เปิด Terminal แล้วรันคำสั่ง:

```bash
cd contracts
npx hardhat run scripts/deploy.js --network baseSepolia
```

เมื่อรันเสร็จ Terminal จะแสดงผลลัพธ์ประมาณนี้:
```text
=============================================================
🚀 Deploying CampusBoost Smart Contracts
Account: 0xYourDeployerAddress...
Balance: 0.085 ETH
=============================================================

✅ MockUSDC deployed to: 0x[บันทึกที่อยู่นี้ไว้]
✅ CampusBoost deployed to: 0x[บันทึกที่อยู่นี้ไว้]

🎉 DEPLOYMENT COMPLETE!
=============================================================
```

---

## 🌐 ขั้นตอนที่ 2: ตั้งค่า Frontend ให้เชื่อมต่อกับ Contract จริง

### 2.1 สร้างไฟล์ `frontend/.env.local`
สร้างไฟล์ชื่อ `.env.local` ในโฟลเดอร์ `frontend/` (คัดลอกจาก `frontend/.env.example`) แล้วนำค่าที่ได้จากขั้นตอนที่ 1.3 มาใส่:

```bash
# -------------------------------------------------------------
# จุดที่ 4: ที่อยู่ Contract ที่ได้จากการรัน deploy.js ในขั้นตอนที่ 1.3
# -------------------------------------------------------------
NEXT_PUBLIC_CAMPUSBOOST_CONTRACT_ADDRESS=[วางที่อยู่_CampusBoost_Contract_ตรงนี้]
NEXT_PUBLIC_USDC_CONTRACT_ADDRESS=[วางที่อยู่_MockUSDC_Contract_ตรงนี้]

# เครือข่าย Base Sepolia
NEXT_PUBLIC_CHAIN_ID=84532
NEXT_PUBLIC_CHAIN_NAME="Base Sepolia"
NEXT_PUBLIC_RPC_URL=https://sepolia.base.org
NEXT_PUBLIC_BLOCK_EXPLORER_URL=https://sepolia.basescan.org

# -------------------------------------------------------------
# จุดที่ 5: WalletConnect Project ID (สำหรับให้คนสแกนผ่าน Mobile Wallet ได้)
# สมัครรับฟรีได้ที่: https://cloud.reown.com (เดิมคือ cloud.walletconnect.com)
# -------------------------------------------------------------
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=[วาง_PROJECT_ID_ตรงนี้]

# -------------------------------------------------------------
# จุดที่ 6: Pinata IPFS (สำหรับอัปโหลดไฟล์หลักฐานขึ้น IPFS จริง)
# สมัครรับ API Key ฟรีได้ที่: https://pinata.cloud
# -------------------------------------------------------------
PINATA_API_KEY=[วาง_PINATA_API_KEY_ตรงนี้]
PINATA_SECRET_KEY=[วาง_PINATA_SECRET_KEY_ตรงนี้]
NEXT_PUBLIC_PINATA_GATEWAY=https://gateway.pinata.cloud/ipfs/
```

---

## 🚀 ขั้นตอนที่ 3: นำเว็บไซต์ขึ้นออนไลน์สู่สาธารณะ (Deploy to Vercel ฟรี)

วิธีที่ง่ายและเร็วที่สุด (ใช้เวลาไม่เกิน 2 นาที):

1. สมัครหรือเข้าสู่ระบบ **[Vercel](https://vercel.com)**
2. คลิก **"Add New Project"** แล้วเลือก GitHub Repository นี้
3. ในส่วนการตั้งค่า:
   - **Root Directory:** เลือกโฟลเดอร์ `frontend`
   - **Framework Preset:** Next.js
4. ในส่วน **"Environment Variables"**:
   - เพิ่มตัวแปรทั้งหมดจากไฟล์ `frontend/.env.local` ในข้อ 2.1 เข้าไป
5. กดปุ่ม **"Deploy"**

🎉 **ยินดีด้วย! แพลตฟอร์ม CampusBoost จะออนไลน์บนอินเทอร์เน็ตพร้อมโดเมน `.vercel.app` (หรือผูก Custom Domain ได้ฟรี) พร้อมเปิดรับโปรเจกต์นักศึกษาและการสนับสนุนจากแบรนด์ทันที!**
