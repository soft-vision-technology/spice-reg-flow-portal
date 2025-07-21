import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
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
  restoreUser,
} from "../store/slices/authSlice";
import bg_pattern_1 from "../assets/13683663_Spices sketches set.svg";
import bg_pattern_2 from "../assets/proxy-image-1-1080x675.jpg";
import img_1 from "../../src/assets/16223.jpg";
import img_2 from "../../src/assets/images.png";
import img_3 from "../../src/assets/openair-market-with-traders-selling-spices-herbs-aromatic-colorful.jpg";
import gov_log from "../assets/Emblem_of_Sri_Lanka.svg.png";
import spice_logo from "../assets/spiceLogo.png";

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
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Feature card state
  const [activeFeature, setActiveFeature] = useState(0);
  const [hoveredFeature, setHoveredFeature] = useState(null);

  // Initialize user from localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Restore user to Redux if valid
        dispatch(restoreUser(parsedUser));
        // Redirect immediately if user is already logged in
        navigate("/dashboard", { replace: true });
        return;
      } catch (error) {
        // Clear invalid data
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
  }, [dispatch, navigate]);

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

  // Handle successful login - redirect immediately
  useEffect(() => {
    if (user && !isRedirecting) {
      setIsRedirecting(true);
      message.success("Welcome to Spice Industry Data System!");
      dispatch(hideModal());
      // Use setTimeout to ensure state updates are processed
      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 100);
    }
  }, [user, navigate, dispatch, isRedirecting]);

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
    // Prevent double submission
    if (loading || isRedirecting) return;

    const isEmailValid = validateEmail(values.email || email);
    const isPasswordValid = validatePassword(values.password || password);

    if (isEmailValid && isPasswordValid) {
      try {
        const resultAction = await dispatch(
          loginUser({
            email: (values.email || email).trim(),
            password: (values.password || password).trim(),
          })
        );

        // Check if login was successful
        if (loginUser.fulfilled.match(resultAction)) {
          // Success case - user effect will handle redirect
          console.log("Login successful");
        } else {
          // Handle login failure
          console.error("Login failed:", resultAction.payload);
        }
      } catch (err) {
        console.error("Unexpected login error:", err);
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
    },
    {
      title: "Exporters",
      description:
        "Selling Sri Lankan spices to the world? Register your export operations to access trade resources and international connections.",
      image: img_2,
    },
    {
      title: "Intermediary Traders",
      description:
        "Connecting farmers with buyers? Register your trading operations to strengthen your network and increase your market reach.",
      image: img_3,
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
            {/* Background image */}
            <img
              src={bg_pattern_2}
              alt="Spice pattern background"
              className="w-full h-full object-cover object-right"
            />

            {/* Overlay on top of image */}
            <div className="absolute inset-0 bg-black/50 opacity-25"></div>
          </div>

          <div className="px-6 py-2 bg-black/10 rounded-2xl backdrop-blur-sm border border-spice-400">
            <div className="flex items-center justify-between">
              {/* Left Logo - Government Emblem */}
              <img
                src={gov_log}
                alt="Government logo"
                className="w-16 h-21 flex-shrink-0"
              />

              {/* Center Content - Trilingual Text */}
              <div className="flex-1 text-center">
                {/* Organization Name - Trilingual */}
                <div>
                  <div className="text-spice-100 text-2xl font-bold">
                    කුළුබඩු හා ඒ ආශ්‍රිත නිෂ්පාදන අලෙවි මණ්ඩලය
                  </div>
                  <div className="text-spice-100 text-xs font-custom">
                    மசாலாவும் அது தொடர்பானது தயாரிப்புகள் சந்தைப்படுத்தல்
                    வாரியம்
                  </div>
                  <div className="text-spice-100 text-lg font-bold">
                    Spices and Allied Products Marketing Board
                  </div>
                </div>

                <div>
                  <div className="text-spice-100 text-lg">
                    වැවිලි සහ ප්‍රජා යටිතල පහසුකම් අමාත්‍යංසය
                  </div>
                  <div className="text-spice-100 text-xs">
                    பெருந்தோட்ட மற்றும் சமூக உட்கட்டமைப்பு வசதிகள் அமைச்சர்
                  </div>
                  <div className="text-spice-100 text-sm">
                    Ministry of Plantation and Community Infrastructure
                  </div>
                </div>
              </div>

              {/* Right Logo - Golden Badge */}
              <img
                src={spice_logo}
                alt="Spice logo"
                className="w-24 h-24 flex-shrink-0"
              />
            </div>
          </div>

          {/* Spacer to push description to bottom */}
          <div className="flex-1" />
          {/* Dynamic Feature Description - Bottom */}
          <div className="p-4 bg-black/10 rounded-3xl backdrop-blur-sm transition-all duration-500 ease-in-out mb-10">
            <Paragraph className="text-white text-xl text-center font-serif mb-4">
              {getCurrentFeature().description}
            </Paragraph>

            {/* Progress indicators */}
            <div className="flex justify-center space-x-2">
              {featureCards.map((_, index) => (
                <div
                  key={index}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
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
              className="w-300 h-300 object-cover object-center"
            />
          </div>
          <div className="w-full max-w-md mx-auto">
            {/* Logo/Header */}
            <div className="text-center mb-4">
              <h1 className="text-3xl font-maharlika bg-gradient-to-r from-spice-500 to-earth-600 bg-clip-text mb-2">
                Get Started
              </h1>
              <p className="text-earth-600 font-maharlika text-lg">
                Sign in to your account
              </p>
            </div>

            {/* Login Form */}
            <div className="bg-white rounded-xl shadow-xl p-8 mb-6">
              <Form
                form={loginForm}
                name="login"
                onFinish={handleSubmit}
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
                  label={
                    <span className="font-serif text-base text-earth-700">
                      Email
                    </span>
                  }
                  validateStatus={emailError ? "error" : ""}
                  help={emailError}
                  rules={[
                    { required: true, message: "Please input your email!" },
                    { type: "email", message: "Please enter a valid email!" },
                  ]}
                  className="font-custom"
                >
                  <Input
                    prefix={<MailOutlined className="text-gray-400" />}
                    placeholder="Enter your email"
                    className="rounded-lg h-12 font-custom text-base text-earth-700 placeholder:text-gray-400"
                    value={email}
                    onChange={handleEmailChange}
                    disabled={loading || isRedirecting}
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  label={
                    <span className="font-serif text-base text-earth-700">
                      Password
                    </span>
                  }
                  validateStatus={passwordError ? "error" : ""}
                  help={passwordError}
                  rules={[
                    { required: true, message: "Please input your password!" },
                    // {
                    //   min: 8,
                    //   message: "Password must be at least 8 characters!",
                    // },
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined className="text-gray-400" />}
                    placeholder="Enter your password"
                    className="rounded-lg h-12"
                    value={password}
                    onChange={handlePasswordChange}
                    disabled={loading || isRedirecting}
                  />
                </Form.Item>

                <div className="flex justify-between items-center mb-6">
                  <Form.Item
                    name="remember"
                    valuePropName="checked"
                    className="mb-0"
                  >
                    <Checkbox
                      className="text-earth-700 font-serif"
                      checked={rememberMe}
                      onChange={handleRememberMeChange}
                      disabled={loading || isRedirecting}
                    >
                      Remember me
                    </Checkbox>
                  </Form.Item>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-spice-500 hover:text-spice-600 text-sm font-semibold font-serif transition-colors duration-200 bg-transparent border-none cursor-pointer"
                    disabled={loading || isRedirecting}
                  >
                    Forgot password?
                  </button>
                </div>

                <Form.Item className="mb-4">
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="w-full h-12 text-lg font-medium font-serif bg-spice-500 hover:bg-spice-600 border-0 rounded-lg transition-all duration-200"
                    loading={loading || isRedirecting}
                    disabled={loading || isRedirecting}
                  >
                    {loading
                      ? "Authenticating..."
                      : isRedirecting
                      ? "Redirecting..."
                      : "Login"}
                  </Button>
                </Form.Item>

                <div className="text-center">
                  <span className="text-earth-600 font-serif">
                    Don't have an account?{" "}
                  </span>
                  <button
                    type="button"
                    onClick={handleSignUp}
                    className="text-spice-500 hover:text-spice-600 font-semibold font-serif transition-colors duration-200 bg-transparent border-none cursor-pointer"
                    disabled={loading || isRedirecting}
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
                      className={`cursor-pointer bg-transparent transition-all duration-300 hover:shadow-lg hover:scale-105 ${
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
                        <div className="">
                          <img
                            src={card.image}
                            alt={`${card.title} illustration`}
                            className="w-full h-20 object-cover rounded-lg"
                          />
                        </div>
                        <h5 className="flex text-sm font-semibold text-earth-700 font-serif justify-center mt-2">
                          {card.title}
                        </h5>
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
      <div className="absolute bottom-0 left-0 right-0 bg-spice-500 backdrop-blur-sm border-t-2 border-white p-4">
        <div className="text-center">
          <p className="text-white text-xs">
            <span className="font-semibold">© 2025 </span>
            <a
              href="http://softvision.lk"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-white/80 transition-colors duration-200"
            >
              <span className="font-custom">
                Soft Vision Technologies (Private) Limited
              </span>
            </a>
            <span className="font-semibold">. All rights reserved.</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
