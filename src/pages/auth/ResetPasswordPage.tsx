import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, AlertCircle, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export const ResetPasswordPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    
    if (!token) return;
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await axios.post(`http://localhost:5000/api/auth/reset-password/${token}`, { password });
      
      setSuccessMessage(response.data.message || "Password reset successful!");
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to reset password");
      setIsLoading(false);
    }
  };
  
  // ... (Keep the rest of your original Return statements for !token and main render, just add the {error} and {successMessage} blocks above the form exactly like the LoginPage)
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 max-w-md mx-auto w-full">
        
        {error && (
          <div className="mb-4 bg-error-50 border border-error-500 text-error-700 px-4 py-3 rounded-md flex items-start">
            <AlertCircle size={18} className="mr-2 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 bg-green-50 border border-green-500 text-green-700 px-4 py-3 rounded-md flex items-start">
            <CheckCircle size={18} className="mr-2 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <Input label="New password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required fullWidth startAdornment={<Lock size={18} />} />
          <Input label="Confirm new password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required fullWidth startAdornment={<Lock size={18} />} />
          <Button type="submit" fullWidth isLoading={isLoading}>Reset password</Button>
        </form>
      </div>
    </div>
  );
};