import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  Checkbox,
  message,
  Card,
  Row,
  Col,
  Typography,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  TrophyOutlined,
  GlobalOutlined,
  TeamOutlined,
  MailOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import {
  loginUser,
  setEmail,
  setPassword,
  setRememberMe,
  hideModal,
  clearError,
} from "../store/slices/authSlice";
import bg_pattern_1 from "../assets/13683663_Spices sketches set.svg";
import bg_pattern_2 from "../assets/2148761778.jpg";
import img_1 from "../../src/assets/adult-nature-coffee-harvesting.jpg";
import img_2 from "../../src/assets/spices-near-pan.jpg";
import img_3 from "../../src/assets/openair-market-with-traders-selling-spices-herbs-aromatic-colorful.jpg";
import gov_log from "../assets/Emblem_of_Sri_Lanka.svg.png";
import spice_logo from "../assets/spiceLogo.jpg";

const { Title, Paragraph } = Typography;

const Landing = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loginForm] = Form.useForm();

  // Redux state
  const { email, password, rememberMe, loading, error, user } = useSelector(
    (state) => state.auth
  );

  // Local validation state
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Feature card state
  const [activeFeature, setActiveFeature] = useState(0);
  const [hoveredFeature, setHoveredFeature] = useState(null);

  useEffect(() => {
    setEmailError("");
    setPasswordError("");
    dispatch(clearError());
  }, [dispatch]);

  // Clear errors when Redux error changes
  useEffect(() => {
    if (error) {
      message.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  // Auto-loop through features when not hovering
  useEffect(() => {
    if (hoveredFeature === null) {
      const interval = setInterval(() => {
        setActiveFeature((prev) => (prev + 1) % featureCards.length);
      }, 3000); // Change every 3 seconds
      return () => clearInterval(interval);
    }
  }, [hoveredFeature]);

  // Validation functions
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email?.trim()) {
      setEmailError("Please input your email!");
      return false;
    } else if (!re.test(email.trim())) {
      setEmailError("Please enter a valid email!");
      return false;
    }
    setEmailError("");
    return true;
  };

  const validatePassword = (password) => {
    if (!password?.trim()) {
      setPasswordError("Please input your password!");
      return false;
    } else if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters for security!");
      return false;
    }
    setPasswordError("");
    return true;
  };

  // Event handlers
  const handleEmailChange = (e) => {
    const value = e.target.value;
    dispatch(setEmail(value));
    if (emailError && value.trim()) {
      setEmailError("");
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    dispatch(setPassword(value));
    if (passwordError && value.trim()) {
      setPasswordError("");
    }
  };

  const handleRememberMeChange = (e) => {
    dispatch(setRememberMe(e.target.checked));
  };

  const handleSubmit = async (values) => {
    const isEmailValid = validateEmail(values.email || email);
    const isPasswordValid = validatePassword(values.password || password);

    if (isEmailValid && isPasswordValid) {
      try {
        await dispatch(
          loginUser({
            email: (values.email || email).trim(),
            password: (values.password || password).trim(),
          })
        ).unwrap();

        dispatch(hideModal());
        navigate("/dashboard", { replace: true });
        message.success("Welcome to Spice Industry Data System!");
      } catch (err) {
        console.error("Login failed:", err);
        // Error is handled by useEffect above
      }
    }
  };

  const handleForgotPassword = () => {
    // Navigate to forgot password page or show modal
    message.info("Forgot password functionality coming soon!");
  };

  const handleSignUp = () => {
    // Navigate to sign up page
    navigate("/register");
  };

  const featureCards = [
    {
      title: "Entrepreneurs",
      description:
        "Starting a new spice business or already running one? Register your venture to connect with buyers, exporters, and resources.",
      image: img_1,
      gradient: "from-spice-400 to-spice-600",
    },
    {
      title: "Exporters",
      description:
        "Selling Sri Lankan spices to the world? Register your export operations to access trade resources and international connections.",
      image: img_2,
      gradient: "from-earth-400 to-earth-600",
    },
    {
      title: "Intermediary Traders",
      description:
        "Connecting farmers with buyers? Register your trading operations to strengthen your network and increase your market reach.",
      image: img_3,
      gradient: "from-leaf-400 to-leaf-600",
    },
  ];

  const getCurrentFeature = () => {
    return hoveredFeature !== null
      ? featureCards[hoveredFeature]
      : featureCards[activeFeature];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-spice-100 to-earth-100 overflow-hidden">
      <div className="flex min-h-screen">
        {/* Left Side - Features Section */}
        <div className="flex-1 text-white flex flex-col justify-center p-8 relative">
          <div className="absolute inset-0 opacity-100 pointer-events-none">
            <img
              src={bg_pattern_2}
              alt="Spice pattern background"
              className="w-full h-full object-cover object-center"
            />
          </div>
          <div className="p-6 bg-white/10 rounded-full backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <img src={gov_log} alt="Spice logo" className="w-14 h-20" />
              <div>
                <h1 className="text-spice-100 text-lg font-semibold">
                  Spices and Allied Products Marketing Board
                </h1>
                <h3 className="text-lg font-semibold mb-1">
                  Ready to get started?
                </h3>
              </div>
              <img src={spice_logo} alt="Spice logo" className="w-20 h-20" />
            </div>
          </div>

          {/* Spacer to push description to bottom */}
          <div className="flex-1" />
          {/* Dynamic Feature Description - Bottom */}
          <div className="p-4 bg-white/10 rounded-3xl backdrop-blur-sm transition-all duration-500 ease-in-out mb-10">
            <Paragraph className="text-white text-xl leading-relaxed text-center mb-4">
              {getCurrentFeature().description}
            </Paragraph>

            {/* Progress indicators */}
            <div className="flex justify-center space-x-2">
              {featureCards.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    (hoveredFeature !== null
                      ? hoveredFeature
                      : activeFeature) === index
                      ? "bg-white"
                      : "bg-white/40"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Login Section */}
        <div className="flex-1 flex flex-col justify-center p-8 relative">
          {/* SVG Background */}
          <div className="absolute inset-0 opacity-15 pointer-events-none">
            <img
              src={bg_pattern_1}
              alt="Spice pattern background"
              className="w-full h-full object-cover object-center"
            />
          </div>
          <div className="w-full max-w-md mx-auto">
            {/* Logo/Header */}
            <div className="text-center mb-4">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-spice-500 to-earth-600 bg-clip-text text-transparent mb-2">
                Get Started
              </h1>
              <p className="text-earth-600">Sign in to your account</p>
            </div>

            {/* Login Form */}
            <div className="bg-white rounded-xl shadow-xl p-8 mb-6">
              <Form
                form={loginForm}
                name="login"
                onClick={handleSubmit}
                layout="vertical"
                size="large"
                initialValues={{
                  email: email,
                  password: password,
                  remember: rememberMe,
                }}
              >
                <Form.Item
                  name="email"
                  label="Email"
                  validateStatus={emailError ? "error" : ""}
                  help={emailError}
                  rules={[
                    { required: true, message: "Please input your email!" },
                    { type: "email", message: "Please enter a valid email!" },
                  ]}
                >
                  <Input
                    prefix={<MailOutlined className="text-gray-400" />}
                    placeholder="Enter your email"
                    className="rounded-lg h-12"
                    value={email}
                    onChange={handleEmailChange}
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  label="Password"
                  validateStatus={passwordError ? "error" : ""}
                  help={passwordError}
                  rules={[
                    { required: true, message: "Please input your password!" },
                    {
                      min: 8,
                      message: "Password must be at least 8 characters!",
                    },
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined className="text-gray-400" />}
                    placeholder="Enter your password"
                    className="rounded-lg h-12"
                    value={password}
                    onChange={handlePasswordChange}
                  />
                </Form.Item>

                <div className="flex justify-between items-center mb-6">
                  <Form.Item
                    name="remember"
                    valuePropName="checked"
                    className="mb-0"
                  >
                    <Checkbox
                      className="text-earth-700"
                      checked={rememberMe}
                      onChange={handleRememberMeChange}
                    >
                      Remember me
                    </Checkbox>
                  </Form.Item>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-spice-500 hover:text-spice-600 text-sm font-medium transition-colors duration-200 bg-transparent border-none cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>

                <Form.Item className="mb-4">
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="w-full h-12 text-lg font-medium bg-spice-500 hover:bg-spice-600 border-0 rounded-lg transition-all duration-200"
                    loading={loading}
                  >
                    {loading ? "Authenticating..." : "Login"}
                  </Button>
                </Form.Item>

                <div className="text-center">
                  <span className="text-earth-600">
                    Don't have an account?{" "}
                  </span>
                  <button
                    type="button"
                    onClick={handleSignUp}
                    className="text-spice-500 hover:text-spice-600 font-medium transition-colors duration-200 bg-transparent border-none cursor-pointer"
                  >
                    Sign up here
                  </button>
                </div>
              </Form>
            </div>

            {/* Feature Cards - Image and Title only */}
            <div>
              <Row gutter={[12, 12]}>
                {featureCards.map((card, index) => (
                  <Col xs={24} sm={8} key={index}>
                    <Card
                      className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 ${
                        (hoveredFeature !== null
                          ? hoveredFeature
                          : activeFeature) === index
                          ? "ring-2 ring-spice-400 shadow-lg"
                          : ""
                      }`}
                      bodyStyle={{ padding: "12px" }}
                      onMouseEnter={() => setHoveredFeature(index)}
                      onMouseLeave={() => setHoveredFeature(null)}
                    >
                      <div className="text-center">
                        <div className="mb-2">
                          <img
                            src={card.image}
                            alt={`${card.title} illustration`}
                            className="w-full h-20 object-cover rounded-lg mb-2"
                          />
                        </div>
                        <div className="mb-2">{card.icon}</div>
                        {/* <Title level={5} className="text-earth-700 mb-0">
                          {card.title}
                        </Title> */}
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 bg-spice-500 backdrop-blur-sm border-t border-spice-400 p-4">
        <div className="text-center">
          <p className="text-white text-xs">
            © 2025 Ceylon Spice Industry. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
