import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [copied, setCopied] = useState('');

  const paymentMethods = [
    {
      name: 'DANA',
      status: 'ON',
      number: '082240211377',
      accountName: 'UCUP SUPIANAH',
      icon: '💳'
    },
    {
      name: 'GOPAY',
      status: 'ON',
      number: '082240211377',
      accountName: 'AXX••',
      icon: '💳'
    },
    {
      name: 'SEABANK',
      status: 'ON',
      number: '901809320744',
      accountName: 'ATING',
      icon: '🏦'
    },
    {
      name: 'QRIS',
      status: 'MINTA ADMIN',
      number: '',
      accountName: '',
      icon: '📱'
    }
  ];

  const copyToClipboard = (text, method) => {
    if (text) {
      navigator.clipboard.writeText(text);
      setCopied(method);
      setTimeout(() => setCopied(''), 2000);
    }
  };

  return (
    <>
      <Head>
        <title>BALZX STR Payment</title>
        <meta name="description" content="BALZX STR Payment Gateway" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Header */}
        <header className="bg-blue-900 text-white py-8 px-4 shadow-xl">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-black tracking-wider">
              PAYMENT BALZX STR [0310]💥💸
            </h1>
            <p className="mt-2 text-blue-200 text-sm md:text-base">
              Sistem Pembayaran Terpercaya
            </p>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="grid gap-6 md:grid-cols-2">
            {paymentMethods.map((method, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
              >
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{method.icon}</span>
                      <div>
                        <h2 className="text-xl font-bold">{method.name}</h2>
                        <span className="inline-block px-2 py-1 bg-green-500 text-xs font-semibold rounded-full mt-1">
                          [{method.status}]
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  {method.name === 'QRIS' ? (
                    <div className="text-center py-4">
                      <p className="text-gray-700 font-medium text-lg">
                        QRIS = {method.status}
                      </p>
                      <p className="text-gray-500 text-sm mt-2">
                        Hubungi admin untuk mendapatkan QRIS
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-600 font-medium">NO</span>
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-gray-900 font-semibold">
                              {method.number}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-600 font-medium">A/N</span>
                          <span className="text-gray-900 font-semibold">
                            {method.accountName}
                          </span>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => copyToClipboard(method.number, method.name)}
                        className="w-full mt-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105 active:scale-95"
                      >
                        {copied === method.name ? (
                          <span className="flex items-center justify-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            Tersalin!
                          </span>
                        ) : (
                          <span className="flex items-center justify-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                            </svg>
                            Copy Nomor
                          </span>
                        )}
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Warning Note */}
          <div className="mt-12 bg-red-50 border-2 border-red-200 rounded-xl p-6 shadow-md">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-red-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-red-900 mb-2">
                  PENTING! 📌
                </h3>
                <p className="text-red-800 font-medium leading-relaxed">
                  ALL TRANSAKSI WAJIB BERISIKAN BUKTI TRANSFER, 
                  <br />
                  JIKA TIDAK ADA BUKTI MAKA SAYA TEGASKAN 
                  <br />
                  BAHWA KALIAN BELUM TRANFER KE SAYA
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-12 text-center text-gray-600 pb-8">
            <p className="text-sm">
              © 2024 Balxz - Just TF Without Words 
            </p>
            <p className="text-xs mt-2 text-gray-500">
              Powered by Balxz
            </p>
          </footer>
        </main>
      </div>
    </>
  );
}
