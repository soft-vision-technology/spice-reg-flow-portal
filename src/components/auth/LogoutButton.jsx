import { Button, Modal } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../store/slices/authSlice';
import { useState } from 'react';

const LogoutButton = ({ className = "" }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogout = () => {
    setShowConfirm(true);
  };

  const confirmLogout = () => {
    // Clear token from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem("user");
    
    // Clear Redux state
    dispatch(logout());
    
    // Navigate to home page and replace history
    navigate('/', { replace: true });
    
    // Clear browser history to prevent back navigation
    window.history.replaceState(null, '', '/');
    
    setShowConfirm(false);
  };

  const cancelLogout = () => {
    setShowConfirm(false);
  };

  return (
    <>
      <Button
        type="primary"
        icon={<LogoutOutlined />}
        onClick={handleLogout}
        className={`bg-[#e67324] hover:bg-[#d65d1e] ${className}`}
      >
        Logout
      </Button>

      <Modal
        title="Confirm Logout"
        open={showConfirm}
        onOk={confirmLogout}
        onCancel={cancelLogout}
        okText="Yes, Logout"
        cancelText="Cancel"
        okButtonProps={{ className: "bg-[#e67324] hover:bg-[#d65d1e] text-white" }}
      >
        <p>Are you sure you want to logout? You will need to login again to access the system.</p>
      </Modal>
    </>
  );
};

export default LogoutButton;