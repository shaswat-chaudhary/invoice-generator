import React from 'react';
import { Formik, Form, Field, FieldArray } from 'formik';
import { useState } from 'react';

export const InvoiceForm = ({ onSubmit }) => {

  const [signatureImage, setSignatureImage] = useState('');

  const handleSelectChange = (e) => {
    setSignatureImage(e.target.files[0]);
  }

  return (

    <div>
      <Formik
        initialValues={{
          sellerDetails: { name: '', address: '', city: '', state: '', pincode: '', panNo: '', gstNo: '' },
          placeOfSupply: '',
          billingDetails: { name: '', address: '', city: '', state: '', pincode: '', stateCode: '' },
          shippingDetails: { name: '', address: '', city: '', state: '', pincode: '', stateCode: '' },
          placeOfDelivery: '',
          orderDetails: { orderNo: '', orderDate: '' },
          invoiceDetails: { invoiceNo: '', invoiceDate: '', invoiceDetails: '' },
          reverseCharge: 'No',
          items: [{ description: '', unitPrice: '', quantity: '', discount: '', taxRate: '18', netAmount: '' }],
          signatureImage: { name: '', type: '' }
        }}
        onSubmit={values => {

          onSubmit(values);
        }}
      >
        {({ values, handleChange, setFieldValue }) => (
          <Form style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px' }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '30px' }}>

              <div>
                <h3>Seller Details</h3>
                <Field name="sellerDetails.name" placeholder="Name" />
                <Field name="sellerDetails.address" placeholder="Address" />
                <Field name="sellerDetails.city" placeholder="City" />
                <Field name="sellerDetails.state" placeholder="State" />
                <Field name="sellerDetails.pincode" placeholder="Pincode" />
                <Field name="sellerDetails.panNo" placeholder="PAN No." />
                <Field name="sellerDetails.gstNo" placeholder="GST No." />
              </div>

              <div >
                <h3>Billing Details</h3>
                <Field name="billingDetails.name" placeholder="Name" />
                <Field name="billingDetails.address" placeholder="Address" />
                <Field name="billingDetails.city" placeholder="City" />
                <Field name="billingDetails.state" placeholder="State" />
                <Field name="billingDetails.pincode" placeholder="Pincode" />
                <Field name="billingDetails.stateCode" placeholder="State/UT Code" />
              </div>
            </div>

            <div>

              <div>
                <h3>Shipping Details</h3>
                <Field name="shippingDetails.name" placeholder="Name" />
                <Field name="shippingDetails.address" placeholder="Address" />
                <Field name="shippingDetails.city" placeholder="City" />
                <Field name="shippingDetails.state" placeholder="State" />
                <Field name="shippingDetails.pincode" placeholder="Pincode" />
                <Field name="shippingDetails.stateCode" placeholder="State/UT Code" />
              </div>
              <div>
                <h3>Place of Delivery</h3>
                <Field name="placeOfDelivery" placeholder="Place of Delivery" />
              </div>

              <div>
                <h3>Place of Supply</h3>
                <Field name="placeOfSupply" placeholder="Place of Supply" />
              </div>

              <div className='invoice-details'>
              <h3>Invoice Details</h3>
              <Field name="invoiceDetails.invoiceNo" placeholder="Invoice No." />
              <Field name="invoiceDetails.invoiceDate" placeholder="Invoice Date" />
              <Field name="invoiceDetails.invoiceDetails" placeholder="Invoice Details" />
            </div>
            </div>


            <div>
              <h3>Order Details</h3>
              <Field name="orderDetails.orderNo" placeholder="Order No." />
              <Field name="orderDetails.orderDate" placeholder="Order Date" />
            </div>
           

            <div>
              <h3>Reverse Charge</h3>
              <Field as="select" name="reverseCharge">
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </Field>
            </div>

            <div>
              <h3>Items</h3>

              <FieldArray name="items">
                {({ push, remove }) => (
                  <div>
                    {values.items.map((item, index) => (
                      <div key={index}>
                        <Field name={`items.${index}.description`} placeholder="Description" />

                        <Field
                          name={`items.${index}.unitPrice`}
                          placeholder="Unit Price"
                          type="number"
                          onChange={(e) => {
                            handleChange(e);
                            const netAmount = (values.items[index].unitPrice * values.items[index].quantity) - values.items[index].discount;
                            setFieldValue(`items.${index}.netAmount`, netAmount);
                          }}
                        />
                        <Field name={`items.${index}.quantity`} placeholder="Quantity" type="number" onChange={(e) => {
                          handleChange(e);
                          const netAmount = (values.items[index].unitPrice * values.items[index].quantity) - values.items[index].discount;
                          setFieldValue(`items.${index}.netAmount`, netAmount);
                        }} />
                        <Field name={`items.${index}.discount`} placeholder="Discount" type="number" onChange={(e) => {
                          handleChange(e);
                          const netAmount = (values.items[index].unitPrice * values.items[index].quantity) - values.items[index].discount;
                          setFieldValue(`items.${index}.netAmount`, netAmount);
                        }} />
                        <Field name={`items.${index}.taxRate`} placeholder="Tax Rate" type="number" />
                        <Field name={`items.${index}.netAmount`} placeholder="Net Amount" type="number" readOnly />
                        <button type="button" onClick={() => remove(index)}>Remove</button>
                      </div>
                    ))}
                    <button type="button" onClick={() => push({ description: '', unitPrice: '', quantity: '', discount: '', taxRate: '18', netAmount: '' })}>
                      Add Item
                    </button>
                  </div>
                )}

              </FieldArray>
            </div>

            <div>
              <h3>Signature Image</h3>
              <Field name="invoiceDetails.signImg" type="file" onChange={(e) => handleSelectChange(e)} />

              {
                signatureImage && (
                  <img className='sign-img' src={URL.createObjectURL(signatureImage)} alt="signature" />
                )

              }

            </div>

            <button className='btn' type="submit">Submit</button>
          </Form>
        )}
      </Formik>
    </div>

  );
};

