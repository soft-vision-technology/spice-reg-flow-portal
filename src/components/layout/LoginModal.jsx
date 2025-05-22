import React, { useState, useEffect } from "react";
import { Button, Modal, Input, Checkbox, message } from "antd";
import { RightOutlined } from "@ant-design/icons";
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

const LoginModal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Get state from Redux store with proper fallbacks
  const {
    isModalOpen,
    email,
    password,
    rememberMe,
    loading,
    error,
    user,
    isAuthenticated
  } = useSelector((state) => state.auth || {});

  // Local state for validation errors
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Handle login error
  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  // Clear errors when modal closes
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
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters!');
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
          password: password.trim() 
        })).unwrap();
        
        // Close modal and navigate after successful login
        dispatch(hideModal());
        navigate('/select');
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

  // Handle Enter key press
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
        Start Registration <RightOutlined />
      </Button>

      <Modal
        title="Login to Continue"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        centered
        maskClosable={false}
        keyboard={false}
        styles={{ 
          backdropFilter: 'blur(8px)', 
          background: 'rgba(0, 0, 0, 0.5)' 
        }}
        className="login-modal"
        destroyOnHidden={true}
      >
        <div className="mt-4">
          <div className="mb-4">
            <div className="mb-1 font-medium">Email</div>
            <Input 
              size="large" 
              placeholder="Enter your email" 
              value={email || ''}
              onChange={handleEmailChange}
              onKeyUp={handleKeyPress}
              status={emailError ? "error" : ""}
              disabled={loading}
              autoComplete="email"
            />
            {emailError && (
              <div className="text-red-500 text-sm mt-1">{emailError}</div>
            )}
          </div>

          <div className="mb-4">
            <div className="mb-1 font-medium">Password</div>
            <Input.Password 
              size="large" 
              placeholder="Enter your password" 
              value={password || ''}
              onChange={handlePasswordChange}
              onKeyUp={handleKeyPress}
              status={passwordError ? "error" : ""}
              disabled={loading}
              name="password"
            />
            {passwordError && (
              <div className="text-red-500 text-sm mt-1">{passwordError}</div>
            )}
          </div>

          <div className="flex justify-between items-center mb-4">
            <Checkbox 
              checked={rememberMe || false}
              onChange={handleRememberMeChange}
              disabled={loading}
            >
              Remember me
            </Checkbox>
            <a 
              className="text-spice-500 hover:text-spice-600" 
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
            className="w-full bg-spice-500 hover:bg-spice-600 border-spice-500 h-10"
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>

          {error && (
            <div className="text-red-500 text-sm mt-2 text-center">
              {error}
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};

export default LoginModal;