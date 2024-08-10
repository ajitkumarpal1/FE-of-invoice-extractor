import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Uplode() {
    const [file, setFile] = useState(null);
    const [invoiceData, setInvoiceData] = useState({});
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

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

        setIsLoading(true); // Start loading
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
        } finally {
            setIsLoading(false); // Stop loading
        }
    };

    // Use useEffect to handle side effects based on invoiceData changes
    useEffect(() => {
        if (Object.keys(invoiceData).length > 0) {
            console.log("Invoice data updated:", invoiceData);
        }
    }, [invoiceData]); // Runs when invoiceData changes

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow-md min-w-96 max-w-5xl">
                <h2 className="text-lg font-bold mb-4">Invoice Extractor</h2>
                <div className="flex-col flex">
                    <input
                        type="file"
                        className="mb-4"
                        accept=".pdf"
                        onChange={handleFileChange}
                        disabled={isLoading}
                    />
                    {error && <p className="text-red-500">{error}</p>}
                    <button
                        className={`bg-blue-500 text-white px-4 py-2 rounded ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700 active:bg-blue-900 active:scale-95'}`}
                        onClick={handleUpload}
                        disabled={!file || isLoading}
                    >
                        {isLoading ? 'Uploading...' : 'Upload'}
                    </button>
                </div>

                <div id="result" className="mt-6">
                    {Object.keys(invoiceData).length > 0 ? (
                        <div className="p-6 bg-white shadow-md rounded-lg text-left">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Invoice Details</h3>
                            <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                                <p className="font-semibold text-gray-700">Customer Name:</p>
                                <p className="text-gray-600">{invoiceData.customerName}</p>
                                <hr className="col-span-2" />

                                <p className="font-semibold text-gray-700">Contact No:</p>
                                <p className="text-gray-600">{invoiceData.customerContactNo}</p>
                                <hr className="col-span-2" />

                                <p className="font-semibold text-gray-700">Address:</p>
                                <p className="text-gray-600">{invoiceData.customerAddress}</p>
                                <hr className="col-span-2" />

                                <p className="font-semibold text-gray-700">Email:</p>
                                <p className="text-gray-600">{invoiceData.customerEmail}</p>
                                <hr className="col-span-2" />

                                <p className="font-semibold text-gray-700">Products:</p>
                                <p className="text-gray-600">{invoiceData.productsName?.join(', ')}</p>
                                <hr className="col-span-2" />

                                <p className="font-semibold text-gray-700">Total Amount:</p>
                                <p className="text-gray-600">₹ {invoiceData.totalAmount}</p>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center">No invoice data available</p>
                    )}
                </div>

            </div>
        </div>
    );
}
