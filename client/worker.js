
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
