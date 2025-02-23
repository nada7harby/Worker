class NotificationSystem {
    constructor() {
        this.notifications = [];
        this.init();
    }

    init() {
        this.loadNotifications();
        this.setupWebSocket();
    }

    addNotification(notification) {
        this.notifications.unshift({
            id: Date.now(),
            ...notification,
            read: false,
            date: new Date()
        });

        this.saveNotifications();
        this.showNotificationPopup(notification);
    }

    markAsRead(notificationId) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification) {
            notification.read = true;
            this.saveNotifications();
        }
    }

    showNotificationPopup(notification) {
        // إظهار إشعار منبثق
        const popup = document.createElement('div');
        popup.className = 'notification-popup';
        popup.innerHTML = `
            <i class="fas ${notification.icon}"></i>
            <div class="notification-content">
                <h6>${notification.title}</h6>
                <p>${notification.message}</p>
            </div>
        `;

        document.body.appendChild(popup);
        setTimeout(() => popup.remove(), 5000);
    }
} 