import React, { useState, useEffect } from "react";
import { Button, Modal, Input, Checkbox, message, Select, Divider } from "antd";
import { RightOutlined, UserOutlined, LockOutlined, ShopOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  showModal,
  hideModal,
  setEmail,
  setPassword,
  setRememberMe,
  resetLoginForm,
  loginUser,
  clearError
} from "../../store/slices/authSlice";

const { Option } = Select;

const LoginModal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const {
    isModalOpen,
    email,
    password,
    rememberMe,
    loading,
    error,
  } = useSelector((state) => state.auth || {});

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  useEffect(() => {
    if (!isModalOpen) {
      setEmailError('');
      setPasswordError('');
      dispatch(clearError());
    }
  }, [isModalOpen, dispatch]);

  const handleShowModal = () => {
    dispatch(showModal());
  };

  const handleCancel = () => {
    dispatch(hideModal());
    dispatch(resetLoginForm());
    setEmailError('');
    setPasswordError('');
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email?.trim()) {
      setEmailError('Please input your email!');
      return false;
    } else if (!re.test(email.trim())) {
      setEmailError('Please enter a valid email!');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = (password) => {
    if (!password?.trim()) {
      setPasswordError('Please input your password!');
      return false;
    } else if (password.length < 4) {
      setPasswordError('Password must be at least 8 characters for security!');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleSubmit = async () => {
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (isEmailValid && isPasswordValid) {
      try {
        await dispatch(loginUser({ 
          email: email.trim(), 
          password: password.trim(),
        })).unwrap();
        
        dispatch(hideModal());
        

        
        navigate('/select');
        
        message.success(`Welcome to Spice Industry Data System!`);
      } catch (err) {
        console.error('Login failed:', err);
      }
    }
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    dispatch(setEmail(value));
    if (emailError && value.trim()) {
      setEmailError('');
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    dispatch(setPassword(value));
    if (passwordError && value.trim()) {
      setPasswordError('');
    }
  };

  const handleRememberMeChange = (e) => {
    dispatch(setRememberMe(e.target.checked));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <>
      <Button
        onClick={handleShowModal}
        type="primary"
        size="large"
        className="mt-8 h-12 px-8 text-lg bg-spice-500 hover:bg-spice-600"
      >
        Access Spice Data System <RightOutlined />
      </Button>

      <Modal
        title={
          <div className="flex items-center space-x-2">
            <ShopOutlined className="text-spice-500" />
            <span>Spice Industry Data Collection System</span>
          </div>
        }
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        centered
        maskClosable={false}
        keyboard={false}
        width={450}
        styles={{ 
          backdropFilter: 'blur(8px)', 
          background: 'rgba(0, 0, 0, 0.5)' 
        }}
        className="login-modal"
        destroyOnHidden={true}
      >
        <div className="mt-6">
          <div className="text-center mb-6">
            <div className="text-sm text-gray-600">
              Secure access for spice industry stakeholders
            </div>
          </div>

          <div className="mb-4">
            <div className="mb-2 font-medium flex items-center">
              <UserOutlined className="mr-2 text-spice-500" />
              Email Address
            </div>
            <Input 
              size="large" 
              placeholder="Enter your registered email" 
              value={email || ''}
              onChange={handleEmailChange}
              onKeyUp={handleKeyPress}
              status={emailError ? "error" : ""}
              disabled={loading}
              autoComplete="email"
              prefix={<UserOutlined className="text-gray-400" />}
            />
            {emailError && (
              <div className="text-red-500 text-sm mt-1">{emailError}</div>
            )}
          </div>

          <div className="mb-4">
            <div className="mb-2 font-medium flex items-center">
              <LockOutlined className="mr-2 text-spice-500" />
              Password
            </div>
            <Input.Password 
              size="large" 
              placeholder="Enter your secure password" 
              value={password || ''}
              onChange={handlePasswordChange}
              onKeyUp={handleKeyPress}
              status={passwordError ? "error" : ""}
              disabled={loading}
              name="password"
              prefix={<LockOutlined className="text-gray-400" />}
            />
            {passwordError && (
              <div className="text-red-500 text-sm mt-1">{passwordError}</div>
            )}
          </div>

          <div className="flex justify-between items-center mb-6">
            <Checkbox 
              checked={rememberMe || false}
              onChange={handleRememberMeChange}
              disabled={loading}
            >
              Keep me signed in
            </Checkbox>
            <a 
              className="text-spice-500 hover:text-spice-600 text-sm" 
              href="#"
              onClick={(e) => e.preventDefault()}
            >
              Forgot password?
            </a>
          </div>

          <Button
            type="primary"
            onClick={handleSubmit}
            loading={loading}
            disabled={loading}
            className="w-full bg-spice-500 hover:bg-spice-600 border-spice-500 h-12 text-base font-medium"
          >
            {loading ? 'Authenticating...' : 'Access Data System'}
          </Button>

          <Divider />

          <div className="text-center text-xs text-gray-500">
            Secure data collection system for the spice industry supply chain
          </div>

          {error && (
            <div className="text-red-500 text-sm mt-3 text-center bg-red-50 p-2 rounded">
              {error}
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};

export default LoginModal;