CampusBoost

> สถานะปัจจุบัน: เว็บเป็นเดโม การสนับสนุนและการสมัครสมาชิกยังไม่มีการชำระเงินจริงหรือธุรกรรมจากหน้าเว็บ โปรดอ่าน [DEPLOY.md](DEPLOY.md) ก่อนนำขึ้นโฮสต์
CampusBoost คือแพลตฟอร์มสนับสนุนโปรเจกต์นักศึกษาที่ทำงานบนบล็อกเชน
ช่วยให้นักศึกษานำโปรเจกต์มานำเสนอ รับเงินสนับสนุนจากผู้ใช้ทั่วไปและแบรนด์
โดยเงินทุนถูกบันทึกและจัดการผ่าน Smart Contract เพื่อความโปร่งใส

แพลตฟอร์มนี้ไม่ใช่การลงทุนซื้อหุ้น
แต่เป็นการ “สนับสนุนโปรเจกต์” แลกกับสิทธิ์พิเศษ เช่น การได้รับการเครดิต โลโก้ หรือการโปรโมต

1. วัตถุประสงค์
สร้าง dApp ที่ช่วยให้:

นักศึกษาสร้างหน้าโปรเจกต์และขอรับการสนับสนุน

ผู้ใช้ทั่วไปสนับสนุนโปรเจกต์ที่สนใจ

แบรนด์หรือองค์กรสนับสนุนโปรเจกต์แลกกับสิทธิ์โปรโมต

เงินทุนถูกเก็บใน Escrow Smart Contract

เงินถูกปล่อยเป็นงวดเมื่อโปรเจกต์ส่งหลักฐานความคืบหน้าและผ่านการยืนยัน

ทุกธุรกรรมสำคัญถูกบันทึกบนบล็อกเชน

2. ผู้ใช้หลัก
Student / Project Owner
นักศึกษาหรือทีมนักศึกษาที่ต้องการทุนสนับสนุนโปรเจกต์

หน้าที่:

สร้างโปรเจกต์

เขียนปัญหา ไอเดีย เป้าหมาย และแผนใช้เงิน

กำหนดยอดเงินที่ต้องการ

แบ่งงานเป็น Milestone

ส่งหลักฐานความคืบหน้า

รับเงินเมื่อ Milestone ผ่าน

Backer
ผู้ใช้ทั่วไปที่ต้องการสนับสนุนโปรเจกต์

หน้าที่:

เลือกโปรเจกต์ที่สนใจ

สนับสนุนเงิน

รับสิทธิ์พิเศษตามระดับการสนับสนุน

ติดตามความคืบหน้า

โหวตยืนยัน Milestone ในบางกรณี

Sponsor / Brand
แบรนด์ บริษัท หรือองค์กรที่ต้องการสนับสนุนนักศึกษาและได้การมองเห็น

หน้าที่:

เลือกโปรเจกต์ที่ตรงกับกลุ่มเป้าหมาย

ซื้อ Sponsor Package

รับสิทธิ์โปรโมต เช่น โลโก้บนหน้าโปรเจกต์ การเครดิต หรือป้ายในงาน

ติดตามผลลัพธ์ของโปรเจกต์

ยืนยัน Milestone สำหรับโปรเจกต์ที่สนับสนุน

Admin / University Partner
ผู้ดูแลระบบหรือมหาวิทยาลัยที่ช่วยตรวจสอบโปรเจกต์

หน้าที่:

ตรวจสอบโปรเจกต์ก่อนเปิดรับเงิน

จัดการกรณีมีข้อพิพาท

ปิดโปรเจกต์ที่ผิดกติกา

ดูรายงานภาพรวม

3. โมเดลธุรกิจ
ระบบใช้คำว่า “Sponsorship” แทน “Investment”

ผู้สนับสนุนไม่ได้ซื้อหุ้นหรือสิทธิ์กำไร
แต่ได้รับสิทธิ์โปรโมตและสิทธิ์พิเศษตามแพ็กเกจ

ตัวอย่างแพ็กเกจ:

แพ็กเกจ	ราคาตัวอย่าง	สิทธิ์
Supporter	100-500 บาท	ชื่อในรายชื่อผู้สนับสนุน
Booster	1,000-5,000 บาท	โลโก้เล็กบนหน้าโปรเจกต์
Sponsor	10,000-50,000 บาท	โลโก้เด่น, ติดป้ายในงาน, โพสต์ขอบคุณ
Title Sponsor	50,000 บาทขึ้นไป	สิทธิ์โปรโมตสูงสุด, ชื่อแบรนด์ในรายงานและงานนำเสนอ
รายได้ของแพลตฟอร์ม:

ค่าธรรมเนียมเมื่อปล่อยเงินแต่ละงวด เช่น 2%

ค่าธรรมเนียมสำหรับ Sponsor Package

ค่าบริการสำหรับมหาวิทยาลัยหรือคณะที่ต้องการใช้ระบบภายใน

4. Flow หลักของระบบ
4.1 สร้างโปรเจกต์
นักศึกษาเชื่อมต่อ Wallet

กรอกข้อมูลโปรเจกต์

กำหนดเป้ายอดเงิน

สร้าง Milestone เช่น 3 งวด

ระบุการใช้เงินแต่ละงวด

ส่งโปรเจกต์เพื่อรอ Admin อนุมัติ

เมื่ออนุมัติแล้ว โปรเจกต์เปิดรับการสนับสนุน

4.2 รับการสนับสนุน
Backer หรือ Sponsor เลือกโปรเจกต์

เลือกแพ็กเกจหรือระบุจำนวนเงิน

ชำระเงินผ่าน Wallet หรือช่องทาง fiat ที่รองรับ

ระบบบันทึกการสนับสนุนลงบล็อกเชน

เงินเข้า Escrow Contract ไม่ใช่บัญชีนักศึกษาโดยตรง

ผู้สนับสนุนได้รับ Badge หรือสิทธิ์ตามแพ็กเกจ

4.3 ปล่อยเงินตาม Milestone
นักศึกษาส่งหลักฐานความคืบหน้า เช่น รูป วิดีโอ ลิงก์ GitHub หรือรายงาน

Sponsor และ Backer ที่เกี่ยวข้องตรวจสอบ

เมื่อ Milestone ผ่านเงื่อนไข Smart Contract จะปล่อยเงินงวดนั้น

ระบบบันทึกเหตุการณ์ MilestoneReleased ลงบล็อกเชน

หากโปรเจกต์ไม่ผ่าน Milestone ให้เข้าสู่โหมด Dispute หรือคืนเงินตามกติกา

4.4 ระบบ Dispute
เมื่อมีข้อพิพาท:

นักศึกษาหรือผู้สนับสนุนกดเปิด Dispute

ทั้งสองฝ่ายแนบหลักฐาน

Admin หรือผู้พิพากษาชุมชนตรวจสอบ

ระบบตัดสินได้ 3 แบบ:

ปล่อยเงินงวดนั้น

คืนเงินงวดนั้นให้ผู้สนับสนุน

ระงับโปรเจกต์

5. Milestone
โปรเจกต์แต่ละโปรเจกต์ต้องแบ่งเงินเป็น Milestone

ตัวอย่างโปรเจกต์แอปช่วยนักศึกษาหาห้องเช่า:

Milestone	งานที่ต้องทำ	งบประมาณ	เงื่อนไขปล่อยเงิน
1	ทำ Figma และ Flow ของแอป	10,000 บาท	ส่งลิงก์ Figma และผ่านการโหวต
2	พัฒนา MVP	25,000 บาท	ส่งลิงก์ GitHub และ Demo
3	ทดสอบกับผู้ใช้และปรับปรุง	15,000 บาท	ส่งรายงานผลทดสอบ
6. Smart Contract Requirements
สร้าง Smart Contract ชื่อ CampusBoost.sol

โครงสร้างข้อมูล
text
struct Milestone {
    string title;
    string description;
    uint256 amount;
    uint256 deadline;
    MilestoneStatus status;
    string evidenceURI;
}

struct Project {
    uint256 projectId;
    address owner;
    string title;
    string description;
    string category;
    uint256 goalAmount;
    uint256 raisedAmount;
    uint256 deadline;
    ProjectStatus status;
    Milestone[] milestones;
}

enum ProjectStatus {
    Draft,
    PendingReview,
    Active,
    Completed,
    Cancelled,
    Disputed
}

enum MilestoneStatus {
    Pending,
    Submitted,
    Approved,
    Rejected,
    Released
}
Function ที่ต้องมี
text
function createProject(
    string memory title,
    string memory description,
    string memory category,
    uint256 goalAmount,
    uint256 deadline,
    MilestoneInput[] memory milestones
) external returns (uint256 projectId);

function approveProject(uint256 projectId) external onlyAdmin;

function supportProject(uint256 projectId, uint256 packageId) external payable;

function submitMilestoneEvidence(
    uint256 projectId,
    uint256 milestoneIndex,
    string memory evidenceURI
) external onlyProjectOwner;

function approveMilestone(
    uint256 projectId,
    uint256 milestoneIndex
) external onlySponsorOrAdmin;

function releaseMilestoneFunds(
    uint256 projectId,
    uint256 milestoneIndex
) external onlyAdminOrContract;

function openDispute(
    uint256 projectId,
    uint256 milestoneIndex,
    string memory reason
) external;

function resolveDispute(
    uint256 projectId,
    uint256 milestoneIndex,
    bool releaseFunds
) external onlyAdmin;

function refundBackers(uint256 projectId) external;
เงื่อนไขสำคัญ
เงินทุนต้องอยู่ใน Contract จนกว่า Milestone จะผ่าน

ห้าม Project Owner ถอนเงินทั้งหมดก่อนผ่าน Milestone

การปล่อยเงินต้องมีการยืนยันจาก Sponsor หรือ Admin

ทุกครั้งที่มีการสนับสนุนหรือปล่อยเงิน ต้อง emit Event

ต้องป้องกันการเรียกซ้ำและการโจมตี reentrancy

ใช้ OpenZeppelin ReentrancyGuard, Ownable และ Pausable

Events
text
event ProjectCreated(uint256 indexed projectId, address indexed owner, uint256 goalAmount);
event ProjectApproved(uint256 indexed projectId);
event ProjectSupported(uint256 indexed projectId, address indexed supporter, uint256 amount, uint256 packageId);
event MilestoneSubmitted(uint256 indexed projectId, uint256 indexed milestoneIndex, string evidenceURI);
event MilestoneApproved(uint256 indexed projectId, uint256 indexed milestoneIndex);
event MilestoneReleased(uint256 indexed projectId, uint256 indexed milestoneIndex, uint256 amount);
event DisputeOpened(uint256 indexed projectId, uint256 indexed milestoneIndex, string reason);
event DisputeResolved(uint256 indexed projectId, uint256 indexed milestoneIndex, bool releaseFunds);
7. หน้าเว็บที่ต้องมี
7.1 Home
แสดงโปรเจกต์แนะนำ

แสดงโปรเจกต์ยอดนิยม

แสดงหมวดหมู่ เช่น AI, Environment, Health, Education, Community

ปุ่ม “สร้างโปรเจกต์” และ “สนับสนุนโปรเจกต์”

7.2 Project Detail
ชื่อโปรเจกต์

ปัญหาและไอเดีย

ทีมผู้พัฒนา

เป้ายอดเงินและยอดที่ระดมได้

รายการ Milestone

สถานะเงินแต่ละงวด

ปุ่มสนับสนุน

รายชื่อ Sponsor

หลักฐานความคืบหน้า

ประวัติธุรกรรมบนบล็อกเชน

7.3 Create Project
ฟอร์มสร้างโปรเจกต์

อัปโหลดรูปปกและรูปประกอบ

เพิ่ม Milestone ได้หลายอัน

กำหนดงบประมาณแต่ละงวด

ส่งเพื่อขออนุมัติ

7.4 Sponsor Dashboard
โปรเจกต์ที่สนับสนุน

ยอดเงินที่สนับสนุน

สิทธิ์โปรโมตที่ได้รับ

Milestone ที่ต้องยืนยัน

ผลลัพธ์ของโปรเจกต์

7.5 Admin Dashboard
อนุมัติโปรเจกต์

ตรวจสอบ Milestone

จัดการ Dispute

ดูสถิติแพลตฟอร์ม

8. Tech Stack
ส่วนงาน	เทคโนโลยี
Smart Contract	Solidity
Development Framework	Hardhat หรือ Foundry
Blockchain	Base Sepolia หรือ Polygon Amoy Testnet
Frontend	Next.js + React + TypeScript
Wallet Connection	wagmi + viem
Wallet	MetaMask หรือ Smart Wallet
Payment	USDC บน Testnet
File Storage	IPFS หรือ Pinata
Database เสริม	Supabase หรือ Firebase
Styling	Tailwind CSS
Contract Testing	Foundry หรือ Hardhat + Chai
9. ขอบเขต MVP
ต้องทำให้ครบ:

เชื่อมต่อ Wallet

สร้างโปรเจกต์

สร้าง Milestone

สนับสนุนเงินด้วย USDC

เก็บเงินใน Escrow Contract

ส่งหลักฐาน Milestone

อนุมัติ Milestone

ปล่อยเงินเมื่อ Milestone ผ่าน

แสดงประวัติธุรกรรม

หน้าโปรเจกต์และหน้า Sponsor Dashboard

ไม่จำเป็นต้องทำใน MVP:

ระบบ Token ของแพลตฟอร์ม

การซื้อขายหุ้น

การให้ผลตอบแทนทางการเงิน

ระบบ DAO เต็มรูปแบบ

การชำระเงินด้วยบัตรเครดิตจริง

การเชื่อมต่อ PromptPay จริง

10. Acceptance Criteria
ระบบถือว่าเสร็จเมื่อ:

นักศึกษาสร้างโปรเจกต์และ Milestone ได้

Admin อนุมัติโปรเจกต์ได้

Backer สนับสนุนเงินเข้า Escrow Contract ได้

Sponsor สนับสนุนผ่าน Sponsor Package ได้

นักศึกษาส่งหลักฐาน Milestone ได้

Sponsor หรือ Admin อนุมัติ Milestone ได้

Smart Contract ปล่อยเงินเมื่อ Milestone ผ่าน

ผู้ใช้เห็นประวัติธุรกรรมบนบล็อกเชน

หากโปรเจกต์ถูกยกเลิก ผู้สนับสนุนสามารถขอคืนเงินได้

Contract ผ่านการทดสอบพื้นฐาน เช่น การสร้างโปรเจกต์ สนับสนุนเงิน และปล่อยเงิน

11. ข้อควรระวัง
ห้ามใช้คำว่า “ลงทุน” ในลักษณะซื้อหุ้นหรือหวังผลตอบแทนทางการเงิน

ต้องระบุชัดว่าเป็นการสนับสนุนโปรเจกต์แลกกับสิทธิ์โปรโมต

ต้องมีข้อตกลงว่าโปรเจกต์อาจไม่สำเร็จ

ต้องมีระบบตรวจสอบโปรเจกต์ก่อนเปิดรับเงิน

ต้องมีระบบ Dispute เพื่อป้องกันการใช้เงินผิดวัตถุประสงค์

12. ประโยคนำเสนอ
CampusBoost ช่วยให้นักศึกษาที่มีไอเดียดีแต่ขาดทุน สามารถนำโปรเจกต์มาเปิดรับการสนับสนุนได้
แบรนด์และผู้ใช้สามารถสนับสนุนโปรเจกต์ได้อย่างโปร่งใส เพราะเงินถูกเก็บใน Smart Contract
และจะปล่อยเป็นงวดเมื่อโปรเจกต์ส่งหลักฐานความคืบหน้าจริง
แบรนด์ยังได้รับสิทธิ์โปรโมตตามระดับการสนับสนุน ทำให้เกิดประโยชน์ทั้งนักศึกษา แบรนด์ และชุมชน

## ตลาดประกาศขายโปรเจกต์

ผู้ใช้ทั่วไปลงประกาศได้ที่ `/sell` โดยระบุชื่อ หมวดหมู่ คำอธิบายสั้น ราคา (หรือให้สอบถามราคา) ชื่อผู้ขาย และ LINE ID หรืออีเมล รายการจะแสดงที่ `/marketplace` พร้อมปุ่มติดต่อผู้ขายโดยตรง ผู้สนใจสอบถามรายละเอียด ซอร์สโค้ด และเงื่อนไขการซื้อกับผู้ขายเอง เว็บไซต์ไม่มีระบบชำระเงินหรือส่งมอบซอร์สโค้ดสำหรับประกาศเหล่านี้

ประกาศถูกเก็บใน `frontend/data/sale-listings.json` บนเครื่องที่รัน Next.js และไฟล์นี้ถูกละเว้นจาก Git การเก็บข้อมูลวิธีนี้เหมาะกับการทดลองบนเซิร์ฟเวอร์เครื่องเดียว หากนำขึ้นระบบที่ไฟล์เขียนไม่ได้หรือมีหลายอินสแตนซ์ ต้องเปลี่ยนเป็นฐานข้อมูลถาวรก่อน

## ระดับสมาชิก (เดโม)

หน้า `/subscription` มีระดับ 1 **Boost** และระดับ 2 **Boost Plus** ทั้งสองระดับทำให้ประกาศขายที่เชื่อมกับโปรไฟล์เดโมแสดงก่อนรายการทั่วไป และทำให้โปรเจกต์ขอรับการสนับสนุนของเจ้าของแสดงก่อนรายการทั่วไปในเบราว์เซอร์เดโมเดียวกัน ระดับ 2 เพิ่มการเลือกธีมสีฟ้า/น้ำเงินและข้อความหน้าปกในหน้า `/profile` เมื่อกลับสู่ระดับทั่วไป สิทธิ์เพิ่มการมองเห็นจะหยุดทันที

การสลับระดับยังเป็นการทดลอง ไม่มีราคา การชำระเงิน หรือการต่ออายุอัตโนมัติ สถานะสมาชิกของประกาศขายเก็บใน `frontend/data/subscriptions.json` ซึ่งถูกละเว้นจาก Git และต้องใช้ฐานข้อมูลถาวรพร้อมระบบยืนยันตัวตนก่อนเปิดให้ชำระเงินจริง
