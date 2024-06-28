import React, { useRef } from 'react';
import { toWords } from 'number-to-words';

export const Display = ({ invoiceData }) => {

  const invoiceRef = useRef();

  const totalPrice = invoiceData && invoiceData.items.reduce((acc, item) => acc + item.totalAmount, 0).toFixed(2);

  const handlePrint = () => {
    const printContents = invoiceRef.current.innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;

  }

  return (
    <>
      <div className='invoice' ref={invoiceRef}>

        <div className='invoice-details'>

          <div className='header-details'>
            <h1>InVoice Paper</h1>
            <h4>Tax Invoice/Bill of Supply/Cash Memo</h4>
          </div>


          <div className='seller-billing-details'>

            <div className='seller-details'>

              <h4>
                Sold By:
              </h4>
              <p>
                {invoiceData.sellerDetails.name}
              </p>
              <p>
                {invoiceData.sellerDetails.address}{', '}
                {invoiceData.sellerDetails.city}{', '}
                {invoiceData.sellerDetails.state}{', '}
                {invoiceData.sellerDetails.pincode}
              </p>
            </div>

            <div className='billing-details'>

              <h4>
                Billing Address:
              </h4>

              <p>

                {invoiceData.billingDetails.name}
              </p>

              <p>
                {invoiceData.billingDetails.address}{', '}
                {invoiceData.billingDetails.city}{', '}
                {invoiceData.billingDetails.state}{', '}
                {invoiceData.billingDetails.pincode}{', '}
                {invoiceData.billingDetails.stateCode}
              </p>
            </div>
          </div>

          <div className='shipping-details'>

            <div className='left-side'>
              <div>
                <h4>PAN No:
                  <span>{invoiceData.sellerDetails.panNo}</span>
                </h4>

                <h4>GST Registration No:
                  <span>{invoiceData.sellerDetails.gstNo}</span>
                </h4>

              </div>

              <div>

                <h4>
                  Order Number: {invoiceData.orderDetails.orderNo}
                </h4>

                <h4>
                  Order Date: {invoiceData.orderDetails.orderDate}
                </h4>
              </div>

            </div>

            <div className='right-side'>
              <h4>
                Shipping Address:
              </h4>
              <p>
                {invoiceData.shippingDetails.name}
              </p>
              <p>
                {invoiceData.shippingDetails.address}
                {invoiceData.shippingDetails.city}
                {invoiceData.shippingDetails.state}
                {invoiceData.shippingDetails.pincode}
                {invoiceData.shippingDetails.stateCode}
              </p>

              <h4>
                Place Of Supply: {invoiceData.placeOfSupply}
              </h4>
              <h4>
                Place Of Delivery: {invoiceData.placeOfDelivery}
              </h4>
              <h4>
                Invoice Number: {invoiceData.invoiceDetails.invoiceNo}
              </h4>

              <h4>
                Invoice Details: {invoiceData.invoiceDetails.invoiceDetails}
              </h4>

              <h4>
                Invoice Date: {invoiceData.invoiceDetails.invoiceDate}
              </h4>
            </div>

          </div>

        </div>

        <div className='invoice-item-details'>

          <table className='table-body'>
            <thead>
              <tr>
                <th>Description</th>
                <th>Unit Price</th>
                <th>Quantity</th>
                <th>Discount</th>
                <th>Net Amount</th>
                <th>Tax Rate</th>
                <th>Tax Amount</th>
                <th>Total Amount</th>
              </tr>
            </thead>

            <tbody>
              {invoiceData.items.map((item, index) => (
                <tr key={index}>
                  <td>{item.description}</td>
                  <td>{item.unitPrice}</td>
                  <td>{item.quantity}</td>
                  <td>{item.discount}</td>
                  <td>{item.netAmount}</td>
                  <td>{item.taxRate}</td>
                  <td>{item.taxAmount.toFixed(2)}</td>
                  <td>{item.totalAmount}</td>
                </tr>

              ))}
            </tbody>
          </table>

          <div className='total-price'>
            <p>TOTAL:</p>
            <p>{totalPrice}</p>
          </div>

          <p>
            Amount in Words:
          </p>
          <p>
            {toWords(totalPrice)} {''} Rupees Only
          </p>

          <div className='sign-details'>
            <img src={invoiceData.signatureImage} alt='signature' />
            <h4>
              Authorized Signature
            </h4>
          </div>

        </div>

      </div>

      <button className='print-btn' onClick={handlePrint}>
        Print Invoice
      </button>

    </>
  );
};

