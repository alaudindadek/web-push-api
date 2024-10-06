// import express from 'express';
// import webPush from 'web-push';
// import bodyParser from 'body-parser';
// import fetch from 'node-fetch'; // สำหรับดึงข้อมูลข่าวกีฬาแบบเรียลไทม์
// import path from 'path';
// import { fileURLToPath } from 'url';

// // ไม่มีการใช้ __filename และ __dirname ใน ES Module
// const app = express();
// app.use(bodyParser.json());

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);


// // ใส่ VAPID Keys ของคุณ
// const publicVapidKey = 'BF5t8lkXk4dbgAS7BJDfPmsQTmICQhjDJ_IKKuKMXus0rUL8hr9e4FqMusr7LUEpxRUFweooXV6ken-r_664f50';
// const privateVapidKey = 'EzQ6k-eI0rZCRmyzedstkvMLX3E6x5jJo6vTiz-GslI';

// webPush.setVapidDetails(
//   'mailto:alaudindadek@gmail.com',
//   publicVapidKey,
//   privateVapidKey
// );

// // เสิร์ฟไฟล์ frontend
// app.use(express.static(path.join(path.dirname(import.meta.url), 'client'))); // ใช้ path.dirname(import.meta.url)
// app.use(express.static(path.join(__dirname, 'client')));

// // เก็บข้อมูลการสมัครสมาชิก
// let subscriptions = [];

// // เส้นทางสำหรับการสมัครสมาชิก
// app.post('/subscribe', (req, res) => {
//   const subscription = req.body;
//   subscriptions.push(subscription);
//   res.status(201).json({});
// });

// // เส้นทางสำหรับการเข้าถึง '/'
// // app.get('/', (req, res) => {
// //   res.send('Hello, World!');  // ส่งข้อความ "Hello, World!" 
// // });
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'client', 'index.html')); // ส่ง index.html
// });

// // ดึงข้อมูลข่าวกีฬาแบบเรียลไทม์จาก API
// // async function getSportsNews() {
// //   // const response = await fetch('https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/news'); // URL API ข่าวกีฬา
// //   const response = await fetch('https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard'); // URL API ข่าวกีฬา
// //   const data = await response.json();
// //   return data.articles.map(article => ({
// //     title: article.headline,
// //     body: article.description
    
// //   }));
// // }
// async function getSportsNews() {
//   try {
//     const response = await fetch('https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/news');
//     const data = await response.json();

//     // ตรวจสอบว่ามี 'articles' ในการตอบสนองหรือไม่
//     if (data.articles && Array.isArray(data.articles)) {
//       return data.articles.map(article => ({
//         title: article.headline,
//         body: article.description,
//         url: article.links && article.links.web ? article.links.web.href : 'https://global.espn.com/football/' // ใส่ URL ของข่าว
//       }));
//     } else {
//       throw new Error('ไม่พบ articles ในการตอบสนอง');
//     }
//   } catch (error) {
//     console.error('เกิดข้อผิดพลาดขณะดึงข้อมูลข่าวกีฬา:', error.message);
//     return []; // ส่งคืนอาร์เรย์ว่างถ้ามีข้อผิดพลาด
//   }
// }


// // ฟังก์ชันส่งการแจ้งเตือนให้กับผู้ใช้ทุกคน
// async function sendNotifications() {
//   const news = await getSportsNews();

//   subscriptions.forEach(subscription => {
//     news.forEach(article => {
//       const payload = JSON.stringify(article);
//       webPush.sendNotification(subscription, payload).catch(error => {
//         console.error('Error sending notification:', error);
//       });
//     });
//   });
// }

// // ตั้งเวลาสำหรับการดึงข่าวใหม่ทุกๆ 30 นาที
// setInterval(() => {
//   console.log('Fetching the latest sports news...');
//   sendNotifications();
// }, 15 * 60 * 1000); // 30 นาที

// // เริ่มเซิร์ฟเวอร์
// const port = 3000;
// app.listen(port, () => {
//   console.log(`Server started on port ${port}`);
// });





import express from 'express';
import webPush from 'web-push';
import bodyParser from 'body-parser';
import fetch from 'node-fetch'; // สำหรับดึงข้อมูลข่าวกีฬาแบบเรียลไทม์
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs'; // สำหรับจัดการไฟล์
import cors from 'cors';
app.use(cors());

// ไม่มีการใช้ __filename และ __dirname ใน ES Module
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
// app.use(express.static(path.join(__dirname, 'client')));
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

// ตั้งเวลาสำหรับการดึงข่าวใหม่ทุกๆ 15 นาที
setInterval(() => {
  console.log('Fetching the latest sports news...');
  sendNotifications();
}, 15 * 60 * 1000); // 15 นาที

// เริ่มเซิร์ฟเวอร์
const port = 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});


