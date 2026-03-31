import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  User, 
  History, 
  MapPin, 
  Settings, 
  LogOut, 
  ChevronRight,
  Mail,
  Lock,
  UserPlus,
  LogIn
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import OrderHistory from './OrderHistory';
import AddressManager from './AddressManager';
import AccountSettings from './AccountSettings';

const ProfilePage: React.FC = () => {
  const { user, loading, login, register, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'settings'>('orders');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsSubmitting(true);
    try {
      if (authMode === 'register') {
        const fullName = `${firstName} ${lastName}`.trim();
        await register(email, password, fullName, firstName, lastName);
      } else {
        await login(email, password);
      }
    } catch (error: any) {
      setLoginError(error.message || 'Authentication failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6 bg-slate-50/50">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100"
        >
          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-3 shadow-lg">
            {authMode === 'login' ? <LogIn className="w-8 h-8 text-white" /> : <UserPlus className="w-8 h-8 text-white" />}
          </div>
          
          <h1 className="text-3xl font-display font-bold text-slate-900 mb-2 text-center">
            {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-slate-500 mb-8 text-center text-sm">
            {authMode === 'login' 
              ? 'Sign in to access your orders and settings' 
              : 'Join Pet Shop for a better shopping experience'}
          </p>

          {loginError && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-xs font-bold animate-in fade-in slide-in-from-top-2">
              {loginError}
            </div>
          )}

          <form onSubmit={handleEmailAuth} className="space-y-4">
            {authMode === 'register' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 ml-1">First Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      required
                      type="text"
                      placeholder="John"
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      value={firstName}
                      onChange={e => setFirstName(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 ml-1">Last Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      required
                      type="text"
                      placeholder="Doe"
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      value={lastName}
                      onChange={e => setLastName(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  required
                  type="email"
                  placeholder="name@example.com"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  required
                  type="password"
                  placeholder="........"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Processing...' : (authMode === 'login' ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          {authMode === 'login' && (
            <div className="mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-500 space-y-1">
              <p className="font-bold text-slate-600 mb-2">Demo accounts</p>
              <p>demo@thonglorpet.com / Demo@1234</p>
              <p>admin@thonglorpet.com / Admin@1234</p>
            </div>
          )}

          <p className="mt-8 text-center text-sm text-slate-500">
            {authMode === 'login' ? "Don't have an account?" : "Already have an account?"}{' '}
            <button 
              onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
              className="text-primary font-bold hover:underline"
            >
              {authMode === 'login' ? 'Register now' : 'Sign in'}
            </button>
          </p>
        </motion.div>
      </div>
    );
  }

  const tabs = [
    { id: 'orders', label: 'Order History', icon: History },
    { id: 'addresses', label: 'Saved Addresses', icon: MapPin },
    { id: 'settings', label: 'Account Settings', icon: Settings },
  ] as const;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Sidebar / Mobile Tabs */}
        <aside className="lg:col-span-3">
          <div className="mb-8 px-4 hidden lg:block">
            <h2 className="text-3xl font-display font-bold text-slate-900">My Account</h2>
            <p className="text-sm text-slate-500">Manage your profile and orders</p>
          </div>
          
          {/* Desktop Sidebar */}
          <div className="hidden lg:block bg-white p-2 rounded-[2rem] border border-slate-100 shadow-sm">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl font-bold transition-all group mb-1 last:mb-0 ${
                  activeTab === tab.id 
                    ? 'bg-primary text-white shadow-lg shadow-secondary/70' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-white' : 'text-slate-400 group-hover:text-slate-900'}`} />
                  {tab.label}
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === tab.id ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}`} />
              </button>
            ))}
            
            <div className="mt-4 pt-4 border-t border-slate-50">
              <button 
                onClick={logout}
                className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl font-bold text-rose-500 hover:bg-rose-50 transition-all"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </div>
          </div>

          {/* Mobile Tabs */}
          <div className="lg:hidden flex overflow-x-auto no-scrollbar gap-2 pb-4 mb-6 -mx-4 px-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 flex items-center gap-2 px-5 py-3 rounded-full font-bold transition-all ${
                  activeTab === tab.id 
                    ? 'bg-primary text-white shadow-md shadow-secondary/55' 
                    : 'bg-white text-slate-500 border border-slate-100'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="whitespace-nowrap">{tab.label}</span>
              </button>
            ))}
          </div>
        </aside>

        {/* Content Area */}
        <section className="lg:col-span-9">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm min-h-[500px]">
                {activeTab === 'orders' && (
                  <div className="space-y-8">
                    <div className="flex items-center gap-4">
                      <div className="p-4 bg-secondary/25 rounded-2xl">
                        <History className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-display font-bold text-slate-900">Order History</h2>
                        <p className="text-sm text-slate-500">View and track your previous purchases</p>
                      </div>
                    </div>
                    <OrderHistory />
                  </div>
                )}

                {activeTab === 'addresses' && (
                  <div className="space-y-8">
                    <div className="flex items-center gap-4">
                      <div className="p-4 bg-secondary/25 rounded-2xl">
                        <MapPin className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-display font-bold text-slate-900">Saved Addresses</h2>
                        <p className="text-sm text-slate-500">Manage your shipping destinations</p>
                      </div>
                    </div>
                    <AddressManager />
                  </div>
                )}

                {activeTab === 'settings' && (
                  <div className="space-y-8">
                    <div className="flex items-center gap-4">
                      <div className="p-4 bg-secondary/25 rounded-2xl">
                        <Settings className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-display font-bold text-slate-900">Account Settings</h2>
                        <p className="text-sm text-slate-500">Update your personal information</p>
                      </div>
                    </div>
                    <AccountSettings />
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </section>
      </div>
    </div>
  );
};

export default ProfilePage;

