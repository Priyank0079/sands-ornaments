export const sellerCustomerService = {
    getCustomers: () => {
        // Mock data
        return [
            {
                id: 'CUST-001',
                name: 'Aryan Sharma',
                email: 'aryan@example.com',
                phone: '+91 98765 43210',
                totalOrders: 15,
                totalSpend: 155000,
                lastOrderDate: '2024-03-10',
                status: 'ACTIVE',
                address: '123, Luxury Heights, South Mumbai, Maharashtra'
            },
            {
                id: 'CUST-002',
                name: 'Priya Patel',
                email: 'priya@example.com',
                phone: '+91 87654 32109',
                totalOrders: 8,
                totalSpend: 82000,
                lastOrderDate: '2024-03-05',
                status: 'ACTIVE',
                address: '45, Diamond Residency, Ahmedabad, Gujarat'
            },
            {
                id: 'CUST-003',
                name: 'Rahul Verma',
                email: 'rahul@example.com',
                phone: '+91 76543 21098',
                totalOrders: 20,
                totalSpend: 320000,
                lastOrderDate: '2024-03-12',
                status: 'ACTIVE',
                address: 'B-12, Green Park, New Delhi'
            },
            {
                id: 'CUST-004',
                name: 'Sneha Reddy',
                email: 'sneha@example.com',
                phone: '+91 65432 10987',
                totalOrders: 3,
                totalSpend: 25000,
                lastOrderDate: '2024-02-28',
                status: 'BLOCKED',
                address: 'Plot 89, Jubilee Hills, Hyderabad, Telangana'
            }
        ];
    },

    getCustomerDetails: (id) => {
        const customers = sellerCustomerService.getCustomers();
        return customers.find(c => c.id === id);
    },

    getCustomerOrders: (id) => {
        // Mock individual orders
        return [
            { id: 'ORD-5501', date: '2024-03-10', items: 'Gold Studs, Oxidized Ring', amount: 45000, status: 'DELIVERED' },
            { id: 'ORD-5290', date: '2024-02-15', items: 'Diamond Pendant', amount: 35000, status: 'DELIVERED' },
            { id: 'ORD-4812', date: '2023-12-01', items: 'Bridal Set (OX)', amount: 75000, status: 'DELIVERED' }
        ];
    },

    updateCustomerStatus: async (id, status) => {
        return { success: true, message: `Customer status updated to ${status}` };
    }
};
