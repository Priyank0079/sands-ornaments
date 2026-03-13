export const sellerProductService = {
  getSellerProducts: () => {
    return JSON.parse(localStorage.getItem('sellerProducts') || '[]');
  },
  addProduct: (product) => {
    const products = JSON.parse(localStorage.getItem('sellerProducts') || '[]');
    const newProduct = {
      ...product,
      id: Date.now().toString(),
      barcodes: generateBarcodes(product.name, parseInt(product.quantity || 0))
    };
    products.push(newProduct);
    localStorage.setItem('sellerProducts', JSON.stringify(products));
    return Promise.resolve(newProduct);
  },
  updateBarcodeStatus: (productId, barcodeNumber, status) => {
    const products = JSON.parse(localStorage.getItem('sellerProducts') || '[]');
    const updatedProducts = products.map(p => {
      if (p.id === productId) {
        return {
          ...p,
          barcodes: p.barcodes.map(b => b.number === barcodeNumber ? { ...b, status } : b)
        };
      }
      return p;
    });
    localStorage.setItem('sellerProducts', JSON.stringify(updatedProducts));
    return Promise.resolve(true);
  },
  sellByBarcode: (barcodeNumber, isOnline = false) => {
    const products = JSON.parse(localStorage.getItem('sellerProducts') || '[]');
    let found = false;
    const updatedProducts = products.map(p => {
      const barcodeIndex = p.barcodes.findIndex(b => b.number === barcodeNumber && b.status === 'AVAILABLE');
      if (barcodeIndex !== -1 && !found) {
        p.barcodes[barcodeIndex].status = isOnline ? 'SOLD ONLINE' : 'SOLD OFFLINE';
        p.availableStock = (parseInt(p.availableStock) - 1).toString();
        p.soldItems = (parseInt(p.soldItems || 0) + 1).toString();
        found = true;
      }
      return p;
    });
    if (found) {
      localStorage.setItem('sellerProducts', JSON.stringify(updatedProducts));
      return Promise.resolve({ success: true });
    }
    return Promise.resolve({ success: false, message: 'Barcode not found or already sold' });
  }
};

const generateBarcodes = (productName, quantity) => {
  const prefix = productName.substring(0, 4).toUpperCase();
  const barcodes = [];
  for (let i = 1; i <= quantity; i++) {
    barcodes.push({
      number: `${prefix}${String(i).padStart(3, '0')}`,
      status: 'AVAILABLE'
    });
  }
  return barcodes;
};
