
const sellerData = {
    fullName: "Test Seller",
    shopName: "Test Shop",
    email: "test@seller.com",
    mobileNumber: "1234567890",
    password: "password123",
    status: "PENDING"
};

const sellers = JSON.parse(localStorage.getItem('seller_data') || '[]');
sellers.push({ ...sellerData, id: Date.now().toString(), registrationDate: new Date().toISOString() });
localStorage.setItem('seller_data', JSON.stringify(sellers));

const notifs = JSON.parse(localStorage.getItem('admin_notifications') || '[]');
notifs.unshift({
    id: Date.now(),
    title: 'New Seller Registration Request',
    message: 'Test Seller has applied for a seller account for Test Shop.',
    date: new Date().toISOString(),
    unread: true,
    isRead: false,
    type: 'SELLER_REQUEST',
    link: '/admin/sellers'
});
localStorage.setItem('admin_notifications', JSON.stringify(notifs));
console.log("Mock notification injected!");
