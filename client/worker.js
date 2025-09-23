// self.addEventListener('push', event => {
//     const data = event.data ? event.data.json() : { title: 'ไม่มีข้อมูล', body: 'ไม่มีรายละเอียด' };
//     const title = data.title || 'การแจ้งเตือน';
//     const body = data.body || 'ไม่มีรายละเอียด';

//     const options = {
//         body: body,
//         icon: 'icon.png',
//         data: {
//             url: 'http://localhost:3000' // ปรับ URL ให้ตรงกับเซิร์ฟเวอร์
//         }
//     };

//     event.waitUntil(
//         self.registration.showNotification(title, options)
//     );
// });

// self.addEventListener('notificationclick', event => {
//     event.notification.close(); // ปิดการแจ้งเตือน
//     console.log('Notification clicked:', event);

//     // เปิด URL ที่กำหนด
//     event.waitUntil(
//         clients.matchAll().then(clients => {
//             const client = clients.find(c => c.url === event.notification.data.url && 'focus' in c);
//             if (client) {
//                 return client.focus();
//             }
//             return clients.openWindow(event.notification.data.url);
//         })
//     );
// });
// Event listener สำหรับการรับ push notification





// self.addEventListener('push', event => {
//     const data = event.data ? event.data.json() : { title: 'ไม่มีข้อมูล', body: 'ไม่มีรายละเอียด', url: '#' };
    
//     // กำหนดค่าชื่อเรื่องและรายละเอียดการแจ้งเตือน
//     const title = data.title || 'การแจ้งเตือน';
//     const body = data.body || 'ไม่มีรายละเอียด';
    
//     // กำหนดตัวเลือกสำหรับการแจ้งเตือน เช่น ไอคอน และ URL ที่ส่งมาจาก payload
//     const options = {
//         body: body,
//         icon: 'icon.png', // คุณสามารถเปลี่ยนไอคอนได้ที่นี่
//         data: {
//             url: data.url || 'https://global.espn.com/football/' // ใช้ URL ที่ระบุ หรือค่าเริ่มต้น
//         }
//     };

//     // แสดงการแจ้งเตือนพร้อมตัวเลือก
//     event.waitUntil(
//         self.registration.showNotification(title, options)
//     );
// });

// // Event listener สำหรับการคลิกการแจ้งเตือน
// self.addEventListener('notificationclick', event => {
//     event.notification.close(); // ปิดการแจ้งเตือนเมื่อคลิก

//     // กำหนด URL ที่จะเปิดเมื่อคลิกการแจ้งเตือน
//     const url = event.notification.data.url || 'https://global.espn.com/football/';
    
//     // เปิดหน้าต่างเบราว์เซอร์ด้วย URL ที่กำหนด
//     event.waitUntil(
//         clients.openWindow(url)
//     );
// });



//2
// self.addEventListener('push', event => {
//     const data = event.data ? event.data.json() : { title: 'ไม่มีข้อมูล', body: 'ไม่มีรายละเอียด', url: '#' };
    
//     const title = data.title || 'การแจ้งเตือน';
//     const body = data.body || 'ไม่มีรายละเอียด';
    
//     const options = {
//         body: body,
//         icon: 'sports.png',
//         data: {
//             url: data.url || 'https://global.espn.com/football/'
//         }
//     };

//     event.waitUntil(
//         self.registration.showNotification(title, options)
//     );
// });

// // self.addEventListener('notificationclick', event => {
// //     event.notification.close();

// //     const url = event.notification.data.url || 'https://global.espn.com/football/';
// //     event.waitUntil(
// //         clients.openWindow(url)
// //     );
// // });
// self.addEventListener('notificationclick', event => {
//     event.notification.close();

//     const url = event.notification.data.url || 'https://global.espn.com/football/';
//     const clickData = {
//         title: event.notification.title,
//         url: url
//     };

//     // ส่งข้อมูลการคลิกไปยังเซิร์ฟเวอร์
//     fetch('/notification-click', {
//         method: 'POST',
//         body: JSON.stringify(clickData),
//         headers: {
//             'Content-Type': 'application/json'
//         }
//     })
//     .then(response => response.json())
//     .then(data => {
//         // แสดงการแจ้งเตือนใหม่พร้อมกับจำนวนคลิก
//         self.registration.showNotification('จำนวนคลิก', {
//             body: `การแจ้งเตือนนี้ถูกคลิก ${data.count} ครั้งแล้ว`,
//             icon: 'sports.png'
//         });
//     });

//     event.waitUntil(clients.openWindow(url));
// });



// self.addEventListener('pushsubscriptionchange', event => {
//     // หากเกิดการเปลี่ยนแปลงใน subscription
//     event.waitUntil(
//         navigator.serviceWorker.ready.then(registration => {
//             return registration.pushManager.subscribe(event.oldSubscription.options)
//                 .then(newSubscription => {
//                     // ส่งข้อมูลใหม่ไปยังเซิร์ฟเวอร์
//                     fetch('/subscribe', {
//                         method: 'POST',
//                         body: JSON.stringify(newSubscription),
//                         headers: {
//                             'Content-Type': 'application/json'
//                         }
//                     });
//                 });
//         })
//     );
// });

//3
self.addEventListener('push', event => {
    const data = event.data ? event.data.json() : { title: 'ไม่มีข้อมูล', body: 'ไม่มีรายละเอียด', url: '#' };
    
    const title = data.title || 'การแจ้งเตือน';
    const body = data.body || 'ไม่มีรายละเอียด';
    
    const options = {
        body: body,
        icon: 'sports.png',
        data: {
            url: data.url || 'https://global.espn.com/football/'
        }
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

self.addEventListener('notificationclick', event => {
    event.notification.close();

    const url = event.notification.data.url || 'https://global.espn.com/football/';
    const clickData = {
        title: event.notification.title,
        url: url
    };

    // ส่งข้อมูลการคลิกไปยังเซิร์ฟเวอร์
    event.waitUntil(
        fetch('/notification-click', {
            method: 'POST',
            body: JSON.stringify(clickData),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        // .then(data => {
        //     // แสดงการแจ้งเตือนใหม่พร้อมกับจำนวนคลิก
        //     self.registration.showNotification('จำนวนคลิก', {
        //         body: `การแจ้งเตือนนี้ถูกคลิก ${data.count} ครั้งแล้ว`,
        //         icon: 'sports.png'
        //     });
        // })
        .catch(error => {
            console.error('Error sending click data:', error);
        })
    );

    event.waitUntil(clients.openWindow(url));
});

self.addEventListener('pushsubscriptionchange', event => {
    // หากเกิดการเปลี่ยนแปลงใน subscription
    event.waitUntil(
        navigator.serviceWorker.ready.then(registration => {
            return registration.pushManager.subscribe(event.oldSubscription.options)
                .then(newSubscription => {
                    // ส่งข้อมูลการสมัครใหม่ไปยังเซิร์ฟเวอร์
                    return fetch('/subscribe', {
                        method: 'POST',
                        body: JSON.stringify(newSubscription),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                })
                .catch(error => {
                    console.error('Error re-subscribing:', error);
                });
        })
    );
});
