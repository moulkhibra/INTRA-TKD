// src/components/IDCardHorizontal.js
// نسخة بديلة تشبه الصورة المرفقة تماماً
import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import Barcode from 'react-barcode';

const IDCardHorizontal = ({ student, photo, clubName = "INSTITUTE NAME" }) => {
  const expiryDate = new Date();
  expiryDate.setFullYear(expiryDate.getFullYear() + 1);
  const formattedExpiry = `${expiryDate.getDate().toString().padStart(2, '0')}-${(expiryDate.getMonth() + 1).toString().padStart(2, '0')}-${expiryDate.getFullYear()}`;

  const qrData = JSON.stringify({
    id: student.id,
    name: student.name,
    belt: student.currentBelt,
    type: 'tkd-id-card'
  });

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* البطاقة الأمامية - أفقية */}
      <div 
        className="id-card-front"
        style={{
          width: '340px',
          height: '215px',
          background: 'linear-gradient(to right, #4A90E2 50%, #1e3a5f 50%)',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          marginBottom: '20px',
          position: 'relative'
        }}
      >
        {/* الجزء الأيسر (أزرق) */}
        <div style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '50%',
          height: '100%',
          background: '#4A90E2',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          {/* الشعار والاسم */}
          <div style={{
            background: 'white',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '15px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '8px'
            }}>
              <div style={{
                width: '30px',
                height: '30px',
                background: '#4A90E2',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px'
              }}>
                🥋
              </div>
              <div>
                <div style={{
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: '#1e3a5f',
                  lineHeight: '1.2'
                }}>
                  {clubName}
                </div>
              </div>
            </div>
          </div>

          {/* معلومات النص */}
          <div style={{ color: 'white', fontSize: '11px' }}>
            <div style={{ marginBottom: '8px' }}>
              <div style={{ opacity: 0.8, fontSize: '9px' }}>Name:</div>
              <div style={{ fontWeight: 'bold', fontSize: '12px' }}>
                : {student.name}
              </div>
            </div>
            <div style={{ marginBottom: '8px' }}>
              <div style={{ opacity: 0.8, fontSize: '9px' }}>Program:</div>
              <div style={{ fontWeight: 'bold' }}>: {student.currentBelt}</div>
            </div>
            <div style={{ marginBottom: '8px' }}>
              <div style={{ opacity: 0.8, fontSize: '9px' }}>Member ID:</div>
              <div style={{ fontWeight: 'bold', fontSize: '10px' }}>
                : {student.id.substring(0, 12)}
              </div>
            </div>
            <div>
              <div style={{ opacity: 0.8, fontSize: '9px' }}>Validity:</div>
              <div style={{ fontWeight: 'bold' }}>: {formattedExpiry}</div>
            </div>
          </div>

          {/* الباركود */}
          <div style={{
            background: 'white',
            padding: '4px',
            borderRadius: '4px',
            display: 'flex',
            justifyContent: 'center'
          }}>
            <Barcode 
              value={student.id}
              width={1.2}
              height={25}
              fontSize={8}
              background="transparent"
              displayValue={false}
            />
          </div>
        </div>

        {/* الجزء الأيمن (داكن) */}
        <div style={{
          position: 'absolute',
          right: 0,
          top: 0,
          width: '50%',
          height: '100%',
          background: '#1e3a5f',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* صورة الطالب */}
          <div style={{
            width: '110px',
            height: '140px',
            borderRadius: '8px',
            overflow: 'hidden',
            background: '#e0e0e0',
            border: '3px solid white',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            marginBottom: '10px'
          }}>
            {photo ? (
              <img 
                src={photo} 
                alt={student.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            ) : (
              <div style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '48px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#fff',
                fontWeight: 'bold'
              }}>
                {student.name.charAt(0)}
              </div>
            )}
          </div>

          {/* معلومات إضافية */}
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            padding: '6px 12px',
            borderRadius: '6px',
            fontSize: '10px',
            color: 'white',
            textAlign: 'center'
          }}>
            👤 {student.name}
          </div>
        </div>
      </div>

      {/* البطاقة الخلفية */}
      <div 
        className="id-card-back"
        style={{
          width: '340px',
          height: '215px',
          background: 'white',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px'
        }}
      >
        {/* خلفية زرقاء خفيفة */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '40%',
          background: 'linear-gradient(180deg, #4A90E2 0%, transparent 100%)',
          opacity: 0.1
        }} />

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          {/* الشعار */}
          <div style={{
            width: '50px',
            height: '50px',
            background: 'linear-gradient(135deg, #4A90E2 0%, #1e3a5f 100%)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px',
            margin: '0 auto 10px'
          }}>
            🥋
          </div>

          <h3 style={{
            margin: '0 0 5px 0',
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#1e3a5f'
          }}>
            {clubName}
          </h3>

          <p style={{
            margin: '0 0 15px 0',
            fontSize: '10px',
            color: '#666'
          }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing<br/>
            elit, sed diam
          </p>

          {/* QR Code */}
          <div style={{
            background: '#f8f9fa',
            padding: '15px',
            borderRadius: '10px',
            display: 'inline-block',
            border: '2px solid #e0e0e0'
          }}>
            <QRCodeSVG
              value={qrData}
              size={100}
              level="H"
              includeMargin={false}
            />
          </div>

          {/* التوقيع */}
          <div style={{
            marginTop: '15px',
            paddingTop: '10px',
            borderTop: '1px solid #e0e0e0'
          }}>
            <div style={{
              fontSize: '9px',
              color: '#666',
              marginBottom: '5px'
            }}>
              Authorized Signature
            </div>
            <div style={{
              height: '1px',
              width: '150px',
              background: '#333',
              margin: '0 auto'
            }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default IDCardHorizontal;