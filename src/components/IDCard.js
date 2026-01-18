// src/components/IDCard.js
import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import Barcode from 'react-barcode';

const IDCard = ({ student, photo, clubName = "أكاديمية التايكواندو" }) => {
  const cardRef = useRef(null);

  // حساب تاريخ الصلاحية (سنة من الآن)
  const expiryDate = new Date();
  expiryDate.setFullYear(expiryDate.getFullYear() + 1);
  const formattedExpiry = expiryDate.toLocaleDateString('ar-MA', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  });

  // بيانات QR Code
  const qrData = JSON.stringify({
    id: student.id,
    name: student.name,
    belt: student.currentBelt,
    type: 'tkd-id-card',
    expiry: formattedExpiry
  });

  return (
    <div className="id-card-container" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* البطاقة الأمامية */}
      <div 
        ref={cardRef}
        className="id-card-front"
        style={{
          width: '340px',
          height: '215px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '15px',
          padding: '20px',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          marginBottom: '20px'
        }}
      >
        {/* زخرفة الخلفية */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '200px',
          height: '200px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '50%'
        }} />
        
        <div style={{
          position: 'absolute',
          bottom: '-30px',
          left: '-30px',
          width: '150px',
          height: '150px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '50%'
        }} />

        {/* المحتوى */}
        <div style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* الرأس */}
          <div style={{ 
            background: 'rgba(255,255,255,0.95)',
            padding: '10px 15px',
            borderRadius: '10px',
            marginBottom: '15px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px'
            }}>
              🥋
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ 
                margin: 0, 
                fontSize: '16px', 
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                {clubName}
              </h3>
              <p style={{ margin: 0, fontSize: '10px', color: '#666' }}>
                TAEKWONDO ACADEMY
              </p>
            </div>
          </div>

          {/* معلومات الطالب */}
          <div style={{ 
            display: 'flex', 
            gap: '15px',
            background: 'rgba(255,255,255,0.95)',
            padding: '15px',
            borderRadius: '10px',
            flex: 1
          }}>
            {/* الصورة */}
            <div style={{
              width: '80px',
              height: '100px',
              borderRadius: '8px',
              overflow: 'hidden',
              background: '#e0e0e0',
              border: '3px solid #fff',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
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
                  fontSize: '32px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: '#fff',
                  fontWeight: 'bold'
                }}>
                  {student.name.charAt(0)}
                </div>
              )}
            </div>

            {/* البيانات */}
            <div style={{ flex: 1, fontSize: '11px' }}>
              <div style={{ marginBottom: '8px' }}>
                <div style={{ color: '#666', fontSize: '9px', marginBottom: '2px' }}>Name / الاسم</div>
                <div style={{ fontWeight: 'bold', color: '#333', fontSize: '13px' }}>
                  {student.name}
                </div>
              </div>

              <div style={{ marginBottom: '8px' }}>
                <div style={{ color: '#666', fontSize: '9px', marginBottom: '2px' }}>Program / البرنامج</div>
                <div style={{ fontWeight: '600', color: '#555' }}>
                  {student.currentBelt}
                </div>
              </div>

              <div style={{ marginBottom: '8px' }}>
                <div style={{ color: '#666', fontSize: '9px', marginBottom: '2px' }}>Member ID / الرقم</div>
                <div style={{ fontWeight: '600', color: '#555', fontSize: '10px' }}>
                  {student.id.substring(0, 10)}
                </div>
              </div>

              <div>
                <div style={{ color: '#666', fontSize: '9px', marginBottom: '2px' }}>Validity / الصلاحية</div>
                <div style={{ fontWeight: '600', color: '#e74c3c', fontSize: '10px' }}>
                  {formattedExpiry}
                </div>
              </div>
            </div>
          </div>

          {/* الباركود في الأسفل */}
          <div style={{ 
            marginTop: '10px',
            background: '#fff',
            borderRadius: '8px',
            padding: '5px',
            display: 'flex',
            justifyContent: 'center'
          }}>
            <Barcode 
              value={student.id}
              width={1.5}
              height={30}
              fontSize={10}
              background="transparent"
              displayValue={false}
            />
          </div>
        </div>
      </div>

      {/* البطاقة الخلفية */}
      <div 
        className="id-card-back"
        style={{
          width: '340px',
          height: '215px',
          background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
          borderRadius: '15px',
          padding: '20px',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
      >
        {/* زخرفة */}
        <div style={{
          position: 'absolute',
          top: '-30px',
          left: '-30px',
          width: '150px',
          height: '150px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '50%'
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* الشعار والعنوان */}
          <div style={{ textAlign: 'center', marginBottom: '15px' }}>
            <div style={{ 
              fontSize: '32px', 
              marginBottom: '5px' 
            }}>
              🥋
            </div>
            <h3 style={{ 
              margin: 0, 
              color: '#fff', 
              fontSize: '16px',
              fontWeight: 'bold',
              textShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}>
              {clubName}
            </h3>
          </div>

          {/* QR Code */}
          <div style={{
            background: '#fff',
            padding: '15px',
            borderRadius: '12px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <QRCodeSVG
              value={qrData}
              size={120}
              level="H"
              includeMargin={false}
            />
            <p style={{ 
              margin: '8px 0 0 0', 
              fontSize: '10px', 
              color: '#666',
              textAlign: 'center'
            }}>
              Scan for verification
            </p>
          </div>
        </div>

        {/* التوقيع في الأسفل */}
        <div style={{
          position: 'relative',
          zIndex: 1,
          background: 'rgba(255,255,255,0.2)',
          padding: '10px',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.5)',
            paddingTop: '5px',
            fontSize: '10px',
            color: '#fff'
          }}>
            Authorized Signature / التوقيع المعتمد
          </div>
        </div>
      </div>
    </div>
  );
};

export default IDCard;