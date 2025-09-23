
//3
import express from 'express';
import webPush from 'web-push';
import bodyParser from 'body-parser';
import fetch from 'node-fetch'; // สำหรับดึงข้อมูลข่าวกีฬาแบบเรียลไทม์
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs'; // สำหรับจัดการไฟล์

const app = express();
app.use(bodyParser.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ใส่ VAPID Keys ของคุณ
const publicVapidKey = 'BF5t8lkXk4dbgAS7BJDfPmsQTmICQhjDJ_IKKuKMXus0rUL8hr9e4FqMusr7LUEpxRUFweooXV6ken-r_664f50';
const privateVapidKey = 'EzQ6k-eI0rZCRmyzedstkvMLX3E6x5jJo6vTiz-GslI';

webPush.setVapidDetails(
  'mailto:alaudindadek@gmail.com',
  publicVapidKey,
  privateVapidKey
);

// เสิร์ฟไฟล์ frontend
app.use(express.static(path.join(__dirname, 'client')));

// โหลดข้อมูลการสมัครสมาชิกจากไฟล์ subscriptions.json
let subscriptions = [];
const subscriptionsFilePath = path.join(__dirname, 'subscriptions.json');

// ฟังก์ชันบันทึกการสมัครสมาชิกลงในไฟล์
const saveSubscriptionsToFile = () => {
  fs.writeFileSync(subscriptionsFilePath, JSON.stringify(subscriptions, null, 2));
};

// ฟังก์ชันโหลดการสมัครสมาชิกจากไฟล์
const loadSubscriptionsFromFile = () => {
  if (fs.existsSync(subscriptionsFilePath)) {
    const data = fs.readFileSync(subscriptionsFilePath);
    subscriptions = JSON.parse(data);
  }
};

// โหลดการสมัครสมาชิกเมื่อเซิร์ฟเวอร์เริ่มต้น
loadSubscriptionsFromFile();

// เส้นทางสำหรับการสมัครสมาชิก
app.post('/subscribe', (req, res) => {
  const subscription = req.body;

  // ตรวจสอบว่าการสมัครนี้มีอยู่แล้วหรือไม่
  const isExisting = subscriptions.find(
    (sub) => sub.endpoint === subscription.endpoint
  );

  if (!isExisting) {
    subscriptions.push(subscription);
    saveSubscriptionsToFile(); // บันทึกการสมัครสมาชิกลงในไฟล์
    console.log('มีคนสมัครรับการแจ้งเตือน:', subscription.endpoint); // เพิ่ม console log ที่นี่
  }

  res.status(201).json({});
});

// เส้นทางสำหรับการยกเลิกการสมัครสมาชิก
app.post('/unsubscribe', (req, res) => {
  const subscription = req.body;

  // ลบการสมัครสมาชิกออกจากอาร์เรย์
  subscriptions = subscriptions.filter(
    (sub) => sub.endpoint !== subscription.endpoint
  );

  saveSubscriptionsToFile(); // บันทึกการอัพเดตลงในไฟล์
  console.log('มีคนยกเลิกการสมัครรับการแจ้งเตือน:', subscription.endpoint); // เพิ่ม console log ที่นี่
  res.status(200).json({ message: 'Unsubscribed successfully' });
});

// เส้นทางสำหรับการเข้าถึง '/'
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

// ดึงข้อมูลข่าวกีฬาแบบเรียลไทม์จาก API
async function getSportsNews() {
  try {
    const response = await fetch('https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/news');
    const data = await response.json();

    if (data.articles && Array.isArray(data.articles)) {
      return data.articles.map(article => ({
        title: article.headline,
        body: article.description,
        url: article.links && article.links.web ? article.links.web.href : 'https://global.espn.com/football/'
      }));
    } else {
      throw new Error('ไม่พบ articles ในการตอบสนอง');
    }
  } catch (error) {
    console.error('เกิดข้อผิดพลาดขณะดึงข้อมูลข่าวกีฬา:', error.message);
    return [];
  }
}

// ฟังก์ชันส่งการแจ้งเตือนให้กับผู้ใช้ทุกคน
async function sendNotifications() {
  const news = await getSportsNews();

  subscriptions.forEach(subscription => {
    news.forEach(article => {
      const payload = JSON.stringify(article);
      webPush.sendNotification(subscription, payload).catch(error => {
        console.error('Error sending notification:', error);
      });
    });
  });
}

let notificationClicks = {};
const notificationClicksFilePath = path.join(__dirname, 'notificationClicks.json');

// ฟังก์ชันบันทึกจำนวนการคลิกลงไฟล์
const saveNotificationClicksToFile = () => {
  try {
    console.log('กำลังบันทึกข้อมูลการคลิกลงไฟล์...');
    fs.writeFileSync(notificationClicksFilePath, JSON.stringify(notificationClicks, null, 2));
    console.log('บันทึกข้อมูลการคลิกสำเร็จ');
  } catch (error) {
    console.error('เกิดข้อผิดพลาดขณะบันทึกไฟล์:', error);
  }
};

// ฟังก์ชันโหลดจำนวนการคลิกจากไฟล์
const loadNotificationClicksFromFile = () => {
  if (fs.existsSync(notificationClicksFilePath)) {
    const data = fs.readFileSync(notificationClicksFilePath);
    notificationClicks = JSON.parse(data);
  }
};

// โหลดข้อมูลจำนวนการคลิกเมื่อเซิร์ฟเวอร์เริ่มทำงาน
loadNotificationClicksFromFile();

// เส้นทางเพื่อบันทึกการคลิกการแจ้งเตือน
app.post('/notification-click', (req, res) => {
  const { title, url } = req.body;

  // ตรวจสอบว่ามีข้อมูลที่ส่งมาหรือไม่
  console.log('ได้รับข้อมูลการคลิก:', { title, url });

  // เพิ่มจำนวนการคลิกสำหรับการแจ้งเตือนนั้น ๆ
  const key = title || url;
  if (notificationClicks[key]) {
    notificationClicks[key]++;
  } else {
    notificationClicks[key] = 1;
  }

  saveNotificationClicksToFile(); // บันทึกจำนวนครั้งที่อัปเดตลงไฟล์

  console.log(`การแจ้งเตือน "${key}" ถูกคลิก ${notificationClicks[key]} ครั้ง`);

  res.status(200).json({ message: 'บันทึกการคลิกสำเร็จ', count: notificationClicks[key] });
});

// เส้นทางดึงข้อมูลจำนวนคลิก
app.get('/click-counts', (req, res) => {
  res.json(notificationClicks);
});

// เส้นทางล้างข้อมูลจำนวนการคลิก
app.post('/clear-click-counts', (req, res) => {
  notificationClicks = {}; // ล้างข้อมูลในตัวแปร
  saveNotificationClicksToFile(); // บันทึกไฟล์ที่ล้างข้อมูลแล้ว

  subscriptions.forEach(subscription => {
    console.log(subscription.endpoint, 'ได้ลบประวัติการคลิกแล้ว');
  });
  
  res.status(200).json({ message: 'ประวัติการคลิกถูกล้างแล้ว' });
});


// ตั้งเวลาสำหรับการดึงข่าวใหม่ทุกๆ 2นาที
setInterval(() => {
  console.log('Fetching the latest sports news...');
  sendNotifications();
}, 2 * 60 * 1000); // 2 นาที

// เริ่มเซิร์ฟเวอร์
const port = 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
