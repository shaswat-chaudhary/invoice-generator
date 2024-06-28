const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const PDFDocument = require('pdfkit');

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post('/generate-invoice', (req, res) => {
    const data = req.body;

    data.items.forEach(item => {
        item.netAmount = item.unitPrice * item.quantity - item.discount;
        item.taxType = data.placeOfSupply === data.placeOfDelivery ? 'CGST/SGST' : 'IGST';
        item.textRate = item.taxType === 'CGST/SGST' ? 0.18 : 0.18;
        item.taxAmount = item.netAmount * item.taxRate;
        item.totalAmount = item.netAmount + item.taxAmount;

    });

    const total = data.items.reduce((acc, item) => acc + item.totalAmount, 0);

    // Create PDF
    const doc = new PDFDocument();
    let buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
        let pdfData = Buffer.concat(buffers);
        res.writeHead(200, {
            'Content-Length': Buffer.byteLength(pdfData),
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment;filename=invoice.pdf',
        }).end(pdfData);
    });

    doc
        .fontSize(20)
        .text('InVoice Paper', 50, 45)
        .fillColor('#000')
        .fontSize(10)
        .text('Tax Invoice/Bill of Supply/Cash Memo', 200, 50, { align: 'right' })
        .moveDown();

    doc
        .fontSize(12)
        .font('Helvetica-Bold')
        .text('Sold By:', 50, 110, { align: 'left' })
        .font('Helvetica')
        .text(`${data.sellerDetails.name}`, 50, 125, { align: 'left' })
        .text(`${data.sellerDetails.address}`, 50, 140, { align: 'left' })
        .text(`${data.sellerDetails.city}, ${data.sellerDetails.state} - ${data.sellerDetails.pincode}`, 50, 155, { align: 'left' })

        .font('Helvetica-Bold')
        .text('PAN No.:', 50, 175, { align: 'left' })
        .font('Helvetica')
        .text(`${data.sellerDetails.panNo}`, 102, 175, { align: 'left' })

        .font('Helvetica-Bold')
        .text('GST No.:', 50, 190, { align: 'left' })
        .font('Helvetica')
        .text(`${data.sellerDetails.gstNo}`, 102, 190, { align: 'left' })


        .font('Helvetica-Bold')
        .text(`Order No.:`, 50, 315, { align: 'left' })
        .font('Helvetica')
        .text(`${data.orderDetails.orderNo}`, 114, 315, { align: 'left' })

        .font('Helvetica-Bold')
        .text(`Order Date:`, 50, 335, { align: 'left' })
        .font('Helvetica')
        .text(`${data.orderDetails.orderDate}`, 120, 335, { align: 'left' })

        .font('Helvetica-Bold')
        .text('Billing Address:', 200, 110, { align: 'right' })


        .font('Helvetica')
        .text(`${data.billingDetails.name}`, 200, 125, { align: 'right' })
        .text(`${data.billingDetails.address}`, 200, 140, { align: 'right' })
        .text(`${data.billingDetails.city}, ${data.billingDetails.state} - ${data.billingDetails.pincode}`, 200, 155, { align: 'right' })


        .font('Helvetica-Bold')
        .text('Shipping Address:', 200, 200, { align: 'right' })


        .font('Helvetica')
        .text(`${data.shippingDetails.name}`, 200, 215, { align: 'right' })
        .text(`${data.shippingDetails.address}`, 200, 230, { align: 'right' })
        .text(`${data.shippingDetails.city}, ${data.shippingDetails.state} ${data.shippingDetails.pincode}`, 200, 245, { align: 'right' })

        .text(`State/UT Code `, 200, 260, { align: 'right' })
        .text(`Place Of Supply: ${data.placeOfSupply}`, 200, 275, { align: 'right' })
        .text(`Place Of Delivery: ${data.placeOfDelivery}`, 200, 290, { align: 'right' })
        .text(`Invoice Number: ${data.invoiceDetails.invoiceNo}`, 200, 305, { align: 'right' })
        .text(`Invoice Details: ${data.invoiceDetails.invoiceDetails}`, 200, 320, { align: 'right' })
        .text(`Invoice Date: ${data.invoiceDetails.invoiceDate}`, 200, 335, { align: 'right' })
        .moveDown();

        const table = {
            headers: ['Description', 'Unit Price', 'Quantity', 'Discount', 'Net Amount', 'Tax Type', 'Tax Rate', 'Tax Amount', 'Total Amount'],
            rows: [
                ...data.items.map(item => [
                    item.description,
                    item.unitPrice,
                    item.quantity,
                    item.discount,
                    item.netAmount,
                    item.taxType,
                    item.taxRate,
                    item.taxAmount,
                    item.totalAmount
                ]),
                ['', '', '', '', '', '', '', 'Total', total]
            ]
          };
          
          // Start at the top-left corner of the page
          let startX = doc.x;
          let startY = doc.y + 30;
          
          // Draw headers
          table.headers.forEach((header, i) => {
            doc.rect(startX + i * 50, startY, 100, 25).stroke();
            doc.text(header, startX + i * 50 + 10, startY + 5);
          });
          
          // Draw rows
          table.rows.forEach((row, rowIndex) => {
            row.forEach((cell, i) => {
              doc.rect(startX + i * 50, startY + 25 + rowIndex * 25, 100, 25).stroke();
              doc.text(cell, startX + i * 50 + 10, startY + 30 + rowIndex * 25);
            });
          });

    
    doc.end();
});



app.listen(5000, () => {
    console.log('Server is running on port 5000');
});

