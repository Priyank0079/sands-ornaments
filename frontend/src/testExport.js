const headers = [
    'fullName',
    'shopName',
    'email',
    'mobileNumber',
    'city',
    'state',
    'firmType',
    'gstNumber',
    'panNumber',
    'status',
    'createdAt'
];
const columnNames = [
    'Seller Name',
    'Shop Name',
    'Email Address',
    'Mobile Number',
    'City',
    'State',
    'Firm Type',
    'GST Number',
    'PAN Number',
    'Status',
    'Registration Date'
];

const data = [
    {
        fullName: "Avinash P. Suman",
        shopName: "kbc",
        email: "test001@gmail.com",
        mobileNumber: "\t620164944",
        city: "jamshedpur",
        state: "Jharkhand",
        firmType: "sole proprietorship",
        gstNumber: "20AIHPR8...",
        panNumber: "DHAPP198...",
        status: "PENDING",
        createdAt: "2026-07-08"
    }
];

const headerRow = columnNames.map(name => `"${String(name).replace(/"/g, '""')}"`).join(',');
console.log("HEADER ROW (" + columnNames.length + " columns):");
console.log(headerRow);

const rows = data.map(item => {
    return headers.map(header => {
        let val = item;
        const parts = header.split('.');
        for (const part of parts) {
            val = val ? val[part] : '';
        }
        if (val === null || val === undefined) val = '';
        return `"${String(val).replace(/"/g, '""')}"`;
    }).join(',');
});
console.log("\nDATA ROW (" + headers.length + " columns):");
console.log(rows[0]);
