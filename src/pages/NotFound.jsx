import { useEffect } from "react";
import { Button, Card } from "antd";
import { HomeOutlined, FileSearchOutlined, ExclamationCircleOutlined } from "@ant-design/icons";

const NotFound = ({ pathname = "/unknown-route" }) => {
  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      pathname
    );
  }, [pathname]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <Card className="text-center shadow-lg border-0">
          <div className="py-8 px-4">
            {/* Government-style header */}
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-orange-100 rounded-full mb-6">
                <ExclamationCircleOutlined 
                  className="text-4xl"
                  style={{ color: '#e67324' }}
                />
              </div>
              
              <div className="mb-4">
                <span className="inline-block px-4 py-2 bg-gray-100 text-gray-600 text-sm font-medium rounded-full uppercase tracking-wide">
                  Error Code: 404
                </span>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Page Not Found
              </h1>
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Spice Registration System
              </h2>
            </div>

            {/* Professional message */}
            <div className="mb-8 text-left bg-gray-50 p-6 rounded-lg border-l-4" style={{ borderLeftColor: '#e67324' }}>
              <h3 className="font-semibold text-gray-900 mb-3">Notice:</h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                The requested page or resource could not be found in the National Spice Registration Database. 
                This may occur due to:
              </p>
              <ul className="text-gray-600 space-y-1 ml-4">
                <li>• Invalid or expired registration URL</li>
                <li>• Moved or archived spice documentation</li>
                <li>• Mistyped web address</li>
                <li>• Insufficient access permissions</li>
              </ul>
            </div>

            {/* Action section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Recommended Actions:
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <Button 
                  type="primary" 
                  size="large" 
                  icon={<HomeOutlined />}
                  className="h-12 font-medium"
                  style={{ 
                    backgroundColor: '#e67324', 
                    borderColor: '#e67324'
                  }}
                  href="/"
                  block
                >
                  Return to Registry Dashboard
                </Button>
                
                <Button 
                  size="large" 
                  icon={<FileSearchOutlined />}
                  className="h-12 font-medium border-2"
                  style={{ 
                    borderColor: '#e67324', 
                    color: '#e67324'
                  }}
                  onClick={() => window.history.back()}
                  block
                >
                  Go Back to Previous Page
                </Button>
              </div>
            </div>

            {/* Contact information */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                <p className="mb-2">
                  <strong>Need assistance?</strong> Contact the Registry Support Team
                </p>
                <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-6">
                  <span>📞 Registry Helpline: 1-800-SPICE-REG</span>
                  <span>📧 support@spiceregistry.gov</span>
                </div>
              </div>
            </div>

            {/* Footer badge */}
            <div className="mt-6 flex justify-center">
              <div className="inline-flex items-center px-4 py-2 bg-white border-2 border-gray-200 rounded-full">
                <div 
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: '#e67324' }}
                ></div>
                <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                  Official Government Portal
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default NotFound;