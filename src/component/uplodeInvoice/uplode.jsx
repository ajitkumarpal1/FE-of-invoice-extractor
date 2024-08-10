import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Uplode() {
    const [file, setFile] = useState(null);
    const [invoiceData, setInvoiceData] = useState({});
    const [error, setError] = useState('');

    // Handle file selection
    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile && selectedFile.type !== 'application/pdf') {
            setError('Please select a PDF file.');
            setFile(null);
        } else {
            setError('');
            setFile(selectedFile);
        }
    };

    // Handle file upload
    const handleUpload = async () => {
        if (!file) {
            alert("Please select a file first.");
            return;
        }

        const formData = new FormData();
        formData.append('pdf', file);

        try {
            const response = await axios.post('https://be-of-invoice-extractor.onrender.com/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setInvoiceData(response.data);
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    };

    // Use useEffect to handle side effects based on invoiceData changes
    useEffect(() => {
        if (Object.keys(invoiceData).length > 0) {
            // Perform any additional side effects or actions when invoiceData changes
            console.log("Invoice data updated:", invoiceData);
        }
    }, [invoiceData]); // Runs when invoiceData changes

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow-md w-96">
                <h2 className="text-lg font-bold mb-4">Invoice Extractor</h2>
                <div className="flex-col flex">
                    <input 
                        type="file" 
                        className="mb-4" 
                        accept=".pdf" 
                        onChange={handleFileChange} 
                    />
                    {error && <p className="text-red-500">{error}</p>}
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 active:bg-blue-900 active:scale-95"
                        onClick={handleUpload}
                        disabled={!file}
                    >
                        Upload
                    </button>
                </div>

                <div id="result" className="mt-6">
                    {Object.keys(invoiceData).length > 0 ? (
                        <div className="p-4 bg-gray-50 border border-gray-200 rounded text-left">
                            <h3 className="text-lg font-semibold mb-2">Invoice Details</h3>
                            <p><strong>Customer Name:</strong> {invoiceData.customerName}</p>
                            <hr />
                            <p><strong>Contact No:</strong> {invoiceData.customerContactNo}</p>
                            <hr />
                            <p><strong>Address:</strong> {invoiceData.customerAddress}</p>
                            <hr />
                            <p><strong>Products:</strong> {invoiceData.productsName?.join(', ')}</p>
                            <hr />
                            <p><strong>Total Amount:</strong> ₹ {invoiceData.totalAmount}</p>
                        </div>
                    ) : (
                        <p>No invoice data available</p>
                    )}
                </div>
            </div>
        </div>
    );
}
