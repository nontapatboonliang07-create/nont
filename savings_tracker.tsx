import React, { useState, useEffect } from 'react';
import { PiggyBank, Target, Plus, TrendingUp, History, Trash2 } from 'lucide-react';

export default function SavingsTracker() {
  // State สำหรับเก็บข้อมูลต่างๆ
  const [goalName, setGoalName] = useState('ซื้อโทรศัพท์ใหม่');
  const [goalAmount, setGoalAmount] = useState(30000);
  const [currentAmount, setCurrentAmount] = useState(0);
  const [transactions, setTransactions] = useState([]);
  
  // State สำหรับฟอร์มเพิ่มเงิน
  const [depositAmount, setDepositAmount] = useState('');
  const [depositNote, setDepositNote] = useState('');

  // โหลดข้อมูลจาก Local Storage เมื่อเปิดแอป
  useEffect(() => {
    const savedData = localStorage.getItem('savingsData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setGoalName(parsedData.goalName || 'ซื้อโทรศัพท์ใหม่');
      setGoalAmount(parsedData.goalAmount || 30000);
      setTransactions(parsedData.transactions || []);
      
      // คำนวณเงินปัจจุบันจากประวัติ
      const total = (parsedData.transactions || []).reduce((sum, t) => sum + t.amount, 0);
      setCurrentAmount(total);
    }
  }, []);

  // บันทึกข้อมูลลง Local Storage เมื่อมีการเปลี่ยนแปลง
  useEffect(() => {
    const dataToSave = {
      goalName,
      goalAmount,
      transactions
    };
    localStorage.setItem('savingsData', JSON.stringify(dataToSave));
  }, [goalName, goalAmount, transactions]);

  // ฟังก์ชันสำหรับเพิ่มเงินเก็บ
  const handleDeposit = (e) => {
    e.preventDefault();
    const amount = parseFloat(depositAmount);
    
    if (isNaN(amount) || amount <= 0) return;

    const newTransaction = {
      id: Date.now(),
      amount: amount,
      note: depositNote || 'ออมเงิน',
      date: new Date().toISOString(),
    };

    setTransactions([newTransaction, ...transactions]);
    setCurrentAmount(prev => prev + amount);
    setDepositAmount('');
    setDepositNote('');
  };

  // ฟังก์ชันสำหรับลบประวัติ
  const handleDeleteTransaction = (id, amount) => {
    setTransactions(transactions.filter(t => t.id !== id));
    setCurrentAmount(prev => prev - amount);
  };

  // คำนวณเปอร์เซ็นต์ความสำเร็จ
  const progressPercentage = Math.min((currentAmount / goalAmount) * 100, 100).toFixed(1);
  const remainingAmount = Math.max(goalAmount - currentAmount, 0);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-800">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <header className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
            <PiggyBank size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">ตัวช่วยเก็บเงิน</h1>
            <p className="text-slate-500">ติดตามเป้าหมายทางการเงินของคุณ</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Left Column - Overview & Goal Setting */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Overview Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">เป้าหมายปัจจุบัน</p>
                  <input 
                    type="text" 
                    value={goalName}
                    onChange={(e) => setGoalName(e.target.value)}
                    className="text-2xl font-bold text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-emerald-500 focus:outline-none transition-colors"
                    placeholder="ชื่อเป้าหมาย..."
                  />
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-500 mb-1">ยอดเป้าหมาย (บาท)</p>
                  <input 
                    type="number" 
                    value={goalAmount}
                    onChange={(e) => setGoalAmount(Number(e.target.value))}
                    className="text-xl font-bold text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-emerald-500 focus:outline-none text-right w-32 transition-colors"
                  />
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-emerald-600">เก็บได้แล้ว: ฿{currentAmount.toLocaleString()}</span>
                  <span className="text-slate-500">{progressPercentage}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-full rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <p className="text-right text-sm text-slate-500">
                  เหลืออีก ฿{remainingAmount.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Add Money Form */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <Plus size={20} className="text-emerald-500" />
                หยอดกระปุกเพิ่ม
              </h2>
              <form onSubmit={handleDeposit} className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="จำนวนเงิน (บาท)"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="บันทึกช่วยจำ (เช่น ค่าขนม, โบนัส)"
                    value={depositNote}
                    onChange={(e) => setDepositNote(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  />
                </div>
                <button 
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <TrendingUp size={20} />
                  บันทึก
                </button>
              </form>
            </div>
          </div>

          {/* Right Column - History */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-[600px] flex flex-col">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-6">
              <History size={20} className="text-emerald-500" />
              ประวัติการออม
            </h2>
            
            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
              {transactions.length === 0 ? (
                <div className="text-center text-slate-400 py-10">
                  <PiggyBank size={48} className="mx-auto mb-3 opacity-20" />
                  <p>ยังไม่มีประวัติการออมเงิน</p>
                  <p className="text-sm mt-1">เริ่มหยอดกระปุกกันเลย!</p>
                </div>
              ) : (
                transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl group border border-slate-100 hover:border-emerald-200 transition-all">
                    <div>
                      <p className="font-medium text-slate-800">{tx.note}</p>
                      <p className="text-xs text-slate-500">
                        {new Date(tx.date).toLocaleDateString('th-TH', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-emerald-600">
                        +฿{tx.amount.toLocaleString()}
                      </span>
                      <button 
                        onClick={() => handleDeleteTransaction(tx.id, tx.amount)}
                        className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                        title="ลบรายการนี้"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}