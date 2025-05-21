import React, { useState } from "react";
import { Button, Modal, Input, Checkbox, message } from "antd";
import { RightOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const LoginModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setEmailError('');
    setPasswordError('');
    setRememberMe(false);
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('Please input your email!');
      return false;
    } else if (!re.test(email)) {
      setEmailError('Please enter a valid email!');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = (password) => {
    if (!password) {
      setPasswordError('Please input your password!');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleSubmit = () => {
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (isEmailValid && isPasswordValid) {
      setLoading(true);
      // Simulate API call for login
      setTimeout(() => {
        setLoading(false);
        message.success('Login successful!');
        setIsModalOpen(false);
        resetForm();
        // Redirect to /select after successful login
        navigate('/select');
      }, 1500);
    }
  };

  return (
    <>
      <Button
        onClick={showModal}
        type="primary"
        size="large"
        className="mt-8 h-12 px-8 text-lg bg-spice-500 hover:bg-spice-600"
      >
        Start Registration <RightOutlined />
      </Button>

      {/* Modal Overlay with Blur Effect */}
      <Modal
        title="Login to Continue"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        centered
        maskStyle={{ backdropFilter: 'blur(8px)', background: 'rgba(0, 0, 0, 0.5)' }}
        className="login-modal"
      >
        <div className="mt-4">
          <div className="mb-4">
            <div className="mb-1 font-medium">Email</div>
            <Input 
              size="large" 
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              status={emailError ? "error" : ""}
            />
            {emailError && <div className="text-red-500 text-sm mt-1">{emailError}</div>}
          </div>

          <div className="mb-4">
            <div className="mb-1 font-medium">Password</div>
            <Input.Password 
              size="large" 
              placeholder="Enter your password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              status={passwordError ? "error" : ""}
            />
            {passwordError && <div className="text-red-500 text-sm mt-1">{passwordError}</div>}
          </div>

          <div className="flex justify-between items-center mb-4">
            <Checkbox 
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            >
              Remember me
            </Checkbox>
            <a className="text-spice-500 hover:text-spice-600" href="#">
              Forgot password?
            </a>
          </div>

          <Button
            type="primary"
            onClick={handleSubmit}
            loading={loading}
            className="w-full bg-spice-500 hover:bg-spice-600 border-spice-500 h-10"
          >
            Login
          </Button>

          <div className="text-center mt-4">
            <p>
              Don't have an account?{' '}
              <a className="text-spice-500 hover:text-spice-600" href="#">
                Register now
              </a>
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default LoginModal;