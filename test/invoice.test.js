'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const invoice = require('../lib/invoice');
const pricing = require('../lib/pricing');

function figures(result) {
  return {
    subtotal: result.subtotal,
    discount: result.discount,
    tax: result.tax,
    cgst: result.cgst,
    sgst: result.sgst,
    total: result.total
  };
}

test('CURRENT BEHAVIOUR: order #1001 uses explicit 5% and 12% GST rates with no coupon', () => {
  const items = [
    { name: 'Indrayani Basmati Rice 5kg', price: 640, qty: 1, hsn: '1006', gstRate: 5 },
    { name: 'Pasteurized Table Butter 500g', price: 260, qty: 1, hsn: '0405', gstRate: 12 }
  ];
  const order = { id: 1001, coupon: '', items };

  const invoiceResult = invoice.computeInvoiceFigures(order);
  const checkoutResult = pricing.computeTotals(items, order.coupon);

  assert.deepStrictEqual(figures(invoiceResult), {
    subtotal: 900,
    discount: 0,
    tax: 63.2,
    cgst: 31.6,
    sgst: 31.6,
    total: 963.2
  });
  assert.deepStrictEqual(invoiceResult.rows.map((row) => [row.gstPercent, row.lineTax]), [
    [5, 32],
    [12, 31.2]
  ]);
  assert.deepStrictEqual(figures(checkoutResult), figures(invoiceResult));
});

test('CURRENT BEHAVIOUR: order #1002 SAVE10 applies its discount before 5% GST', () => {
  const items = [
    { name: 'Indrayani Basmati Rice 5kg', price: 640, qty: 1, hsn: '1006', gstRate: 5 },
    { name: 'Cold-Pressed Sunflower Oil 1L', price: 190, qty: 2, hsn: '1512', gstRate: 5 }
  ];
  const order = { id: 1002, coupon: 'SAVE10', items };

  const invoiceResult = invoice.computeInvoiceFigures(order);
  const checkoutResult = pricing.computeTotals(items, order.coupon);

  assert.deepStrictEqual(figures(invoiceResult), {
    subtotal: 1020,
    discount: 102,
    tax: 45.9,
    cgst: 22.95,
    sgst: 22.95,
    total: 963.9
  });
  assert.deepStrictEqual(figures(checkoutResult), {
    subtotal: 1020,
    discount: 102,
    tax: 45.9,
    cgst: 22.95,
    sgst: 22.95,
    total: 963.9
  });
});

test('CURRENT BEHAVIOUR: order #1004 applies the 150 rupee SAVE10 cap before GST', () => {
  const items = [
    { name: 'Ghee bulk pack', price: 480, qty: 2, hsn: '0405', gstRate: 12 },
    { name: 'Packaged tea bulk case', price: 320, qty: 4, hsn: '0902', gstRate: 18 }
  ];
  const order = { id: 1004, coupon: 'SAVE10', items };

  const invoiceResult = invoice.computeInvoiceFigures(order);
  const checkoutResult = pricing.computeTotals(items, order.coupon);

  assert.deepStrictEqual(figures(invoiceResult), {
    subtotal: 2240,
    discount: 150,
    tax: 322.46,
    cgst: 161.23,
    sgst: 161.23,
    total: 2412.46
  });
  assert.deepStrictEqual(figures(checkoutResult), {
    subtotal: 2240,
    discount: 150,
    tax: 322.46,
    cgst: 161.23,
    sgst: 161.23,
    total: 2412.46
  });
});

test('invoice matches checkout GST, capped discount, and total for order #1004', () => {
  const items = [
    { name: 'Ghee bulk pack', price: 480, qty: 2, hsn: '0405', gstRate: 12 },
    { name: 'Packaged tea bulk case', price: 320, qty: 4, hsn: '0902', gstRate: 18 }
  ];
  const order = { id: 1004, coupon: 'SAVE10', items };

  const invoiceResult = invoice.computeInvoiceFigures(order);
  const checkoutResult = pricing.computeTotals(items, order.coupon);

  assert.deepStrictEqual(figures(invoiceResult), figures(checkoutResult));
});

test('CURRENT BEHAVIOUR: order #1008 all-18% items match checkout when there is no coupon', () => {
  const items = [
    { name: 'Assam CTC Masala Chai 250g', price: 140, qty: 2, hsn: '0902', gstRate: 18 },
    { name: 'Coffee blend', price: 220, qty: 1, hsn: '0901', gstRate: 18 }
  ];
  const order = { id: 1008, coupon: '', items };

  const invoiceResult = invoice.computeInvoiceFigures(order);
  const checkoutResult = pricing.computeTotals(items, order.coupon);

  assert.deepStrictEqual(figures(invoiceResult), {
    subtotal: 500,
    discount: 0,
    tax: 90,
    cgst: 45,
    sgst: 45,
    total: 590
  });
  assert.deepStrictEqual(invoiceResult.rows.map((row) => [row.gstPercent, row.lineTax]), [
    [18, 50.4],
    [18, 39.6]
  ]);
  assert.deepStrictEqual(figures(checkoutResult), figures(invoiceResult));
});
