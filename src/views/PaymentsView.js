import React, { useState } from 'react';
import { DollarSign, Shield, Building2, AlertCircle, TrendingUp, Calendar, Check, Plus, Trash2 } from 'lucide-react';

const PaymentsView = ({ 
  students, 
  addPayment, 
  unpaidStudents, 
  payments,
  deletePayment,
  updateStudent 
}) => {
  const [selectedStudent, setSelectedStudent] = useState('');
  const [amount, setAmount] = useState('100');
  const [paymentType, setPaymentType] = useState('training'); // training, insurance, both
  const [insuranceAmount, setInsuranceAmount] = useState('50');

  // حساب الخصم لشراكة OCP (مثلاً 20%)
  const OCP_DISCOUNT = 0.20; // 20% discount
  const INSURANCE_FEE = 50; // رسوم التأمين السنوية

  const handleSubmit = () => {
    if (!selectedStudent) {
      alert('⚠️ Please select a student');
      return;
    }

    const student = students.find(s => s.id === selectedStudent);
    let finalAmount = parseFloat(amount);
    let paymentDescription = 'Monthly Training Fee';

    // إذا كان الطالب لديه شراكة OCP، طبق الخصم
    if (student.hasOCPPartnership) {
      const discount = finalAmount * OCP_DISCOUNT;
      finalAmount = finalAmount - discount;
      paymentDescription += ` (OCP Discount -${(OCP_DISCOUNT * 100)}%)`;
    }

    // إضافة رسوم التأمين إذا تم اختيارها
    if (paymentType === 'insurance' || paymentType === 'both') {
      finalAmount += parseFloat(insuranceAmount);
      paymentDescription += ' + Insurance';
    }

    addPayment(selectedStudent, finalAmount, {
      type: paymentType,
      hasOCPDiscount: student.hasOCPPartnership || false,
      insuranceIncluded: paymentType === 'insurance' || paymentType === 'both',
      originalAmount: parseFloat(amount),
      insuranceAmount: paymentType !== 'training' ? parseFloat(insuranceAmount) : 0,
      description: paymentDescription
    });

    setSelectedStudent('');
    setAmount('100');
    setPaymentType('training');
  };

  const toggleOCPPartnership = async (studentId) => {
    const student = students.find(s => s.id === studentId);
    const newStatus = !student.hasOCPPartnership;
    
    if (updateStudent) {
      await updateStudent(studentId, {
        hasOCPPartnership: newStatus,
        ocpPartnershipDate: newStatus ? new Date().toISOString() : null
      });
    }
  };

  const toggleInsurance = async (studentId) => {
    const student = students.find(s => s.id === studentId);
    const newStatus = !student.hasInsurance;
    
    if (updateStudent) {
      await updateStudent(studentId, {
        hasInsurance: newStatus,
        insuranceDate: newStatus ? new Date().toISOString() : null,
        insuranceExpiryDate: newStatus ? new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString() : null
      });
    }
  };

  // حساب الإحصائيات
  const studentsWithOCP = students.filter(s => s.hasOCPPartnership).length;
  const studentsWithInsurance = students.filter(s => s.hasInsurance).length;
  const totalInsuranceRevenue = payments.filter(p => p.insuranceIncluded).reduce((sum, p) => sum + (p.insuranceAmount || 0), 0);
  const totalOCPDiscounts = payments.filter(p => p.hasOCPDiscount).reduce((sum, p) => {
    return sum + ((p.originalAmount || p.amount) * OCP_DISCOUNT);
  }, 0);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">💰 Payment Management</h2>

      {/* إحصائيات عامة */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <DollarSign size={32} className="opacity-80" />
            <div className="text-right">
              <p className="text-sm opacity-90">Total Revenue</p>
              <p className="text-3xl font-bold">
                ${payments.reduce((sum, p) => sum + (p.amount || 0), 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <Building2 size={32} className="opacity-80" />
            <div className="text-right">
              <p className="text-sm opacity-90">OCP Partners</p>
              <p className="text-3xl font-bold">{studentsWithOCP}</p>
            </div>
          </div>
          <p className="text-xs opacity-75">Discount: ${totalOCPDiscounts.toFixed(2)}</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <Shield size={32} className="opacity-80" />
            <div className="text-right">
              <p className="text-sm opacity-90">Insured Students</p>
              <p className="text-3xl font-bold">{studentsWithInsurance}</p>
            </div>
          </div>
          <p className="text-xs opacity-75">Revenue: ${totalInsuranceRevenue.toFixed(2)}</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <AlertCircle size={32} className="opacity-80" />
            <div className="text-right">
              <p className="text-sm opacity-90">Unpaid</p>
              <p className="text-3xl font-bold">{unpaidStudents.length}</p>
            </div>
          </div>
          <p className="text-xs opacity-75">{students.length > 0 ? Math.round((unpaidStudents.length / students.length) * 100) : 0}% of students</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* نموذج إضافة دفعة */}
        <div className="bg-white p-6 rounded-xl shadow-lg border">
          <h3 className="font-bold text-lg mb-4 flex items-center space-x-2">
            <Plus className="text-green-600" size={22} />
            <span>Record New Payment</span>
          </h3>
          
          <div className="space-y-4">
            {/* اختيار الطالب */}
            <div>
              <label className="block text-sm font-medium mb-1">Select Student *</label>
              <select
                value={selectedStudent}
                onChange={(e) => {
                  setSelectedStudent(e.target.value);
                  const student = students.find(s => s.id === e.target.value);
                  if (student?.hasOCPPartnership) {
                    // عرض رسالة عن الخصم
                    console.log('OCP Partner - 20% discount will be applied');
                  }
                }}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="">Choose a student...</option>
                {students.map(student => (
                  <option key={student.id} value={student.id}>
                    {student.fullName}
                    {student.hasOCPPartnership && ' 🏢 (OCP Partner -20%)'}
                    {student.hasInsurance && ' 🛡️'}
                  </option>
                ))}
              </select>
            </div>

            {/* نوع الدفعة */}
            <div>
              <label className="block text-sm font-medium mb-1">Payment Type *</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setPaymentType('training')}
                  className={`p-3 border-2 rounded-lg text-sm font-medium transition-all ${
                    paymentType === 'training'
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <DollarSign className="mx-auto mb-1" size={20} />
                  Training Only
                </button>
                <button
                  onClick={() => setPaymentType('insurance')}
                  className={`p-3 border-2 rounded-lg text-sm font-medium transition-all ${
                    paymentType === 'insurance'
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Shield className="mx-auto mb-1" size={20} />
                  Insurance Only
                </button>
                <button
                  onClick={() => setPaymentType('both')}
                  className={`p-3 border-2 rounded-lg text-sm font-medium transition-all ${
                    paymentType === 'both'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <TrendingUp className="mx-auto mb-1" size={20} />
                  Both
                </button>
              </div>
            </div>

            {/* مبلغ التدريب */}
            {(paymentType === 'training' || paymentType === 'both') && (
              <div>
                <label className="block text-sm font-medium mb-1">Training Amount ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="100.00"
                />
              </div>
            )}

            {/* مبلغ التأمين */}
            {(paymentType === 'insurance' || paymentType === 'both') && (
              <div>
                <label className="text-sm font-medium mb-1 flex items-center space-x-2">
                  <Shield size={16} className="text-purple-600" />
                  <span>Insurance Amount ($)</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={insuranceAmount}
                  onChange={(e) => setInsuranceAmount(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="50.00"
                />
                <p className="text-xs text-gray-500 mt-1">Annual insurance fee</p>
              </div>
            )}

            {/* عرض المبلغ النهائي */}
            {selectedStudent && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm font-medium text-blue-900 mb-2">Payment Summary:</p>
                {(() => {
                  const student = students.find(s => s.id === selectedStudent);
                  let trainingAmount = paymentType !== 'insurance' ? parseFloat(amount) : 0;
                  let insAmount = paymentType !== 'training' ? parseFloat(insuranceAmount) : 0;
                  let discount = 0;
                  
                  if (student?.hasOCPPartnership && trainingAmount > 0) {
                    discount = trainingAmount * OCP_DISCOUNT;
                    trainingAmount = trainingAmount - discount;
                  }
                  
                  const total = trainingAmount + insAmount;
                  
                  return (
                    <div className="space-y-1 text-sm">
                      {paymentType !== 'insurance' && (
                        <div className="flex justify-between">
                          <span className="text-gray-700">Training Fee:</span>
                          <span className="font-medium">${parseFloat(amount).toFixed(2)}</span>
                        </div>
                      )}
                      {student?.hasOCPPartnership && paymentType !== 'insurance' && (
                        <div className="flex justify-between text-green-700">
                          <span className="flex items-center space-x-1">
                            <Building2 size={14} />
                            <span>OCP Discount (20%):</span>
                          </span>
                          <span className="font-medium">-${discount.toFixed(2)}</span>
                        </div>
                      )}
                      {paymentType !== 'training' && (
                        <div className="flex justify-between">
                          <span className="flex items-center space-x-1">
                            <Shield size={14} />
                            <span>Insurance:</span>
                          </span>
                          <span className="font-medium">${insAmount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="border-t border-blue-300 pt-2 mt-2 flex justify-between font-bold text-blue-900">
                        <span>Total Amount:</span>
                        <span className="text-lg">${total.toFixed(2)}</span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            <button
              onClick={handleSubmit}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 flex items-center justify-center space-x-2 font-medium shadow-md hover:shadow-lg transition-all"
            >
              <DollarSign size={20} />
              <span>Record Payment</span>
            </button>
          </div>
        </div>

        {/* قائمة الطلاب غير المدفوعين */}
        <div className="bg-white p-6 rounded-xl shadow-lg border">
          <h3 className="font-bold text-lg mb-4 flex items-center space-x-2">
            <AlertCircle className="text-orange-600" size={22} />
            <span>Outstanding Payments ({unpaidStudents.length})</span>
          </h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {unpaidStudents.map(student => (
              <div key={student.id} className="flex justify-between items-center p-3 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{student.fullName}</p>
                  <div className="flex items-center space-x-2 text-xs mt-1">
                    {student.hasOCPPartnership && (
                      <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded flex items-center space-x-1">
                        <Building2 size={12} />
                        <span>OCP -20%</span>
                      </span>
                    )}
                    {student.hasInsurance && (
                      <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded flex items-center space-x-1">
                        <Shield size={12} />
                        <span>Insured</span>
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedStudent(student.id);
                    if (student.hasOCPPartnership) {
                      setAmount('100');
                    }
                  }}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors"
                >
                  Pay Now
                </button>
              </div>
            ))}
            {unpaidStudents.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Check size={48} className="mx-auto mb-3 opacity-50" />
                <p>All students have paid for this month! 🎉</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* إدارة الشراكات والتأمين */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* إدارة شراكة OCP */}
        <div className="bg-white p-6 rounded-xl shadow-lg border">
          <h3 className="font-bold text-lg mb-4 flex items-center space-x-2">
            <Building2 className="text-blue-600" size={22} />
            <span>OCP Partnership Management</span>
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Students with OCP partnership get 20% discount on training fees
          </p>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {students.map(student => (
              <div key={student.id} className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50">
                <div className="flex-1">
                  <p className="font-medium">{student.fullName}</p>
                  {student.hasOCPPartnership && student.ocpPartnershipDate && (
                    <p className="text-xs text-gray-500">
                      Since: {new Date(student.ocpPartnershipDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => toggleOCPPartnership(student.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    student.hasOCPPartnership
                      ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {student.hasOCPPartnership ? (
                    <span className="flex items-center space-x-1">
                      <Check size={16} />
                      <span>Active</span>
                    </span>
                  ) : (
                    <span>Activate</span>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* إدارة التأمين */}
        <div className="bg-white p-6 rounded-xl shadow-lg border">
          <h3 className="font-bold text-lg mb-4 flex items-center space-x-2">
            <Shield className="text-purple-600" size={22} />
            <span>Insurance Management</span>
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Annual insurance fee: ${INSURANCE_FEE}
          </p>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {students.map(student => {
              const isExpired = student.insuranceExpiryDate && new Date(student.insuranceExpiryDate) < new Date();
              return (
                <div key={student.id} className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex-1">
                    <p className="font-medium">{student.fullName}</p>
                    {student.hasInsurance && (
                      <p className={`text-xs ${isExpired ? 'text-red-500' : 'text-gray-500'}`}>
                        {isExpired ? 'Expired' : 'Expires'}: {new Date(student.insuranceExpiryDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => toggleInsurance(student.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      student.hasInsurance && !isExpired
                        ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {student.hasInsurance && !isExpired ? (
                      <span className="flex items-center space-x-1">
                        <Check size={16} />
                        <span>Active</span>
                      </span>
                    ) : (
                      <span>{isExpired ? 'Renew' : 'Activate'}</span>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* سجل الدفعات الأخيرة */}
      <div className="bg-white rounded-xl shadow-lg border">
        <div className="p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center space-x-2">
            <Calendar className="text-green-600" size={22} />
            <span>Recent Payments</span>
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {payments.slice(-15).reverse().map(payment => {
                  const student = students.find(s => s.id === payment.studentId);
                  return (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">{new Date(payment.date).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-sm">{student?.fullName || 'Unknown'}</p>
                          <p className="text-xs text-gray-500">{payment.month}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {payment.type === 'training' && (
                            <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700">Training</span>
                          )}
                          {payment.insuranceIncluded && (
                            <span className="text-xs px-2 py-1 rounded bg-purple-100 text-purple-700 flex items-center space-x-1">
                              <Shield size={12} />
                              <span>Insurance</span>
                            </span>
                          )}
                          {payment.hasOCPDiscount && (
                            <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700 flex items-center space-x-1">
                              <Building2 size={12} />
                              <span>OCP</span>
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-bold text-green-600">${payment.amount?.toFixed(2)}</p>
                        {payment.hasOCPDiscount && payment.originalAmount && (
                          <p className="text-xs text-gray-500 line-through">${payment.originalAmount.toFixed(2)}</p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600">
                        {payment.description || payment.status}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => deletePayment && deletePayment(payment.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentsView;