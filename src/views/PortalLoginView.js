// src/views/PortalLoginView.js
import React, { useState } from 'react';
import { Users, GraduationCap, Mail, Lock, ArrowRight } from 'lucide-react';
import { getParentByEmail } from '../api/parents';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const PortalLoginView = ({ onLoginSuccess }) => {
  const [userType, setUserType] = useState('parent'); // 'parent' or 'student'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (userType === 'parent') {
        // تسجيل دخول ولي الأمر
        const parent = await getParentByEmail(email);
        
        if (!parent) {
          setError('البريد الإلكتروني غير مسجل');
          return;
        }

        // تحقق بسيط من كلمة المرور (في الإنتاج استخدم Firebase Auth)
        if (parent.password === password) {
          onLoginSuccess({ type: 'parent', data: parent });
        } else {
          setError('كلمة المرور غير صحيحة');
        }
      } else {
        // تسجيل دخول الطالب
        const studentsRef = collection(db, 'students');
        const q = query(studentsRef, where('email', '==', email));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
          setError('البريد الإلكتروني غير مسجل');
          return;
        }

        const studentDoc = snapshot.docs[0];
        const student = { id: studentDoc.id, ...studentDoc.data() };

        if (student.password === password) {
          onLoginSuccess({ type: 'student', data: student });
        } else {
          setError('كلمة المرور غير صحيحة');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('حدث خطأ أثناء تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* الشعار والعنوان */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
            <span className="text-4xl">🥋</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            بورتال التايكواندو
          </h1>
          <p className="text-blue-100">
            تابع تقدمك وإنجازاتك
          </p>
        </div>

        {/* البطاقة */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* اختيار نوع المستخدم */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setUserType('parent')}
              className={`flex-1 py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 ${
                userType === 'parent'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Users className="w-5 h-5" />
              ولي الأمر
            </button>
            <button
              onClick={() => setUserType('student')}
              className={`flex-1 py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 ${
                userType === 'student'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <GraduationCap className="w-5 h-5" />
              الطالب
            </button>
          </div>

          {/* النموذج */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* البريد الإلكتروني */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="example@email.com"
                />
              </div>
            </div>

            {/* كلمة المرور */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                كلمة المرور
              </label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* رسالة الخطأ */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            {/* زر تسجيل الدخول */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 ${
                userType === 'parent'
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-purple-600 hover:bg-purple-700'
              } text-white shadow-lg hover:shadow-xl disabled:opacity-50`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  تسجيل الدخول
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* روابط إضافية */}
          <div className="mt-6 text-center space-y-2">
            <button 
              className="text-sm text-blue-600 hover:underline block w-full text-center"
              title="نسيت كلمة المرور؟"
            >
              نسيت كلمة المرور؟
            </button>
            <p className="text-xs text-gray-500">
              للحصول على حساب جديد، يرجى التواصل مع إدارة النادي
            </p>
          </div>
        </div>

        {/* معلومات تجريبية */}
        <div className="mt-6 bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4 text-white text-sm">
          <p className="font-semibold mb-2">🔐 حسابات تجريبية:</p>
          <div className="space-y-1 text-xs">
            <p>ولي أمر: parent@test.com / demo123</p>
            <p>طالب: student@test.com / demo123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortalLoginView;
