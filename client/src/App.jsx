import { useState } from 'react';
import './App.css';
import React, { useRef } from 'react';
import { Display } from './components/Display';
import { InvoiceForm } from './components/InvoiceForm';


function App() {

  const [invoiceData, setInvoiceData] = useState(null);

  const handleFormSubmit = (data) => {
    fetch('http://localhost:5000/generate-invoice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'invoice.pdf');
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      });

    data.items.forEach(item => {
      item.netAmount = item.unitPrice * item.quantity - item.discount;
      item.taxType = data.placeOfSupply === data.placeOfDelivery ? 'CGST/SGST' : 'IGST';
      item.taxRate = item.taxType === 'CGST/SGST' ? 0.18 : 0.18;
      item.taxAmount = item.netAmount * item.taxRate;
      item.totalAmount = item.netAmount + item.taxAmount;
    });
    setInvoiceData(data);
  };


  return (
    <>
      <div>  
            <InvoiceForm onSubmit={handleFormSubmit} />
     
        {
          invoiceData && <Display  invoiceData={invoiceData} />

        }

      </div>

    </>
  );

}

export default App
