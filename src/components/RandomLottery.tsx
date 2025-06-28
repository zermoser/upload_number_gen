import React, { useState, useRef } from 'react';

interface LotteryNumbers {
  threeDigit: string[];
  twoDigit: string[];
}

const LoginForm: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogging, setIsLogging] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLogging(true);

    setTimeout(() => {
      if (username === 'admin' && password === 'admin@lnwza007') {
        onLogin();
      } else {
        setError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
      }
      setIsLogging(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-100">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-6xl animate-bounce">🎰</span>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            เข้าสู่ระบบ
          </h1>
          <p className="text-gray-500">เครื่องสุ่มเลขมงคลไทย</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Username Field */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              ชื่อผู้ใช้
            </label>
            <div className="relative">
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200 pl-12"
                placeholder="กรอกชื่อผู้ใช้"
                required
              />
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">👤</span>
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              รหัสผ่าน
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200 pl-12 pr-12"
                placeholder="กรอกรหัสผ่าน"
                required
              />
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">🔒</span>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              ❌ {error}
            </div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLogging}
            className={`
              w-full py-3 px-4 text-white font-bold text-lg rounded-xl shadow-lg
              bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-600
              hover:from-purple-600 hover:via-blue-600 hover:to-indigo-700
              transform hover:scale-105 hover:shadow-xl transition-all duration-300
              disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
              ${isLogging ? 'animate-pulse' : ''}
            `}
          >
            {isLogging ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>กำลังเข้าสู่ระบบ...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <span>🚀</span>
                <span>เข้าสู่ระบบ</span>
              </div>
            )}
          </button>
        </form>

        {/* Demo Credentials */}
        <div className="mt-8 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border-l-4 border-yellow-400">
          <p className="text-sm text-gray-700">
            <span className="font-bold">💡 ข้อมูลสำหรับทดสอบ:</span>
          </p>
          <div className="mt-2 space-y-1 text-sm">
            <p><span className="font-medium">ชื่อผู้ใช้:</span> admin</p>
            <p><span className="font-medium">รหัสผ่าน:</span> admin@lnwza007</p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <div className="flex items-center justify-center gap-2">
            <span>🔐</span>
            <span>ระบบปลอดภัย 100%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const ThaiLotteryOverlay: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [numbers, setNumbers] = useState<LotteryNumbers>({ threeDigit: [], twoDigit: [] });
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [imageInfo, setImageInfo] = useState<{ width: number; height: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Login handler
  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  // Logout handler
  const handleLogout = () => {
    setIsLoggedIn(false);
    resetAll();
  };

  // Generate lottery numbers
  const generateNumbers = (): void => {
    setIsGenerating(true);
    setTimeout(() => {
      setNumbers({
        threeDigit: Array.from({ length: 2 }, () =>
          Math.floor(Math.random() * 1000).toString().padStart(3, '0')
        ),
        twoDigit: Array.from({ length: 3 }, () =>
          Math.floor(Math.random() * 100).toString().padStart(2, '0')
        )
      });
      setIsGenerating(false);
    }, 500);
  };

  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          setImageInfo({ width: img.width, height: img.height });
          setBackgroundImage(e.target?.result as string);
          generateNumbers(); // Auto generate numbers when image is uploaded
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle image change (upload new background)
  const handleImageChange = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Draw numbers on canvas and download
  const downloadImage = async () => {
    if (!backgroundImage || !canvasRef.current || !imageInfo) return;

    setIsDownloading(true);

    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = new Image();
      img.onload = () => {
        // Set canvas size to match original image dimensions
        canvas.width = imageInfo.width;
        canvas.height = imageInfo.height;

        // Draw background image
        ctx.drawImage(img, 0, 0, imageInfo.width, imageInfo.height);

        // Setup text styling
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Calculate positions based on image size
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        // Calculate font sizes - 70% of image size as requested
        const baseFontMultiplier = Math.min(canvas.width, canvas.height) * 0.7 / 1000; // Scale based on smaller dimension
        const titleFontSize = Math.max(48 * baseFontMultiplier, 24);
        const labelFontSize = Math.max(36 * baseFontMultiplier, 18);
        const numberFontSize = Math.max(60 * baseFontMultiplier, 30);

        // Add text shadow effect for better visibility
        const addTextShadow = (text: string, x: number, y: number, color: string, shadowColor: string = 'rgba(0,0,0,0.8)') => {
          const shadowOffset = Math.max(baseFontMultiplier * 3, 2);
          // Draw shadow with multiple offsets for better visibility
          ctx.fillStyle = shadowColor;
          for (let dx = -shadowOffset; dx <= shadowOffset; dx++) {
            for (let dy = -shadowOffset; dy <= shadowOffset; dy++) {
              if (dx !== 0 || dy !== 0) {
                ctx.fillText(text, x + dx, y + dy);
              }
            }
          }
          // Draw main text
          ctx.fillStyle = color;
          ctx.fillText(text, x, y);
        };

        // Calculate vertical spacing based on image height
        const verticalSpacing = canvas.height / 8;

        // Draw title
        ctx.font = `bold ${titleFontSize}px Arial, sans-serif`;
        addTextShadow('เลขมงคลประจำวัน', centerX, centerY - verticalSpacing * 2, '#FFD700');

        // Draw 3-digit numbers section
        ctx.font = `bold ${labelFontSize}px Arial, sans-serif`;
        addTextShadow('เลข 3 ตัว:', centerX, centerY - verticalSpacing, '#FF6B6B');

        ctx.font = `bold ${numberFontSize}px Arial, sans-serif`;
        const spacing3Digit = canvas.width / 5;
        numbers.threeDigit.forEach((num, index) => {
          const x = centerX + (index - 0.5) * spacing3Digit;
          addTextShadow(num, x, centerY - verticalSpacing / 2, '#FFFFFF');
        });

        // Draw 2-digit numbers section
        ctx.font = `bold ${labelFontSize}px Arial, sans-serif`;
        addTextShadow('เลข 2 ตัว:', centerX, centerY + verticalSpacing / 2, '#4ECDC4');

        ctx.font = `bold ${numberFontSize * 0.9}px Arial, sans-serif`;
        const spacing2Digit = canvas.width / 6;
        numbers.twoDigit.forEach((num, index) => {
          const x = centerX + (index - 1) * spacing2Digit;
          addTextShadow(num, x, centerY + verticalSpacing, '#FFFFFF');
        });

        // Download the image
        const link = document.createElement('a');
        link.download = `lottery-overlay-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png', 0.95);
        link.click();

        setIsDownloading(false);
      };

      img.src = backgroundImage;
    } catch (error) {
      console.error('Error creating image:', error);
      alert('เกิดข้อผิดพลาดในการสร้างภาพ');
      setIsDownloading(false);
    }
  };

  const resetAll = () => {
    setBackgroundImage(null);
    setNumbers({ threeDigit: [], twoDigit: [] });
    setImageInfo(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Show login form if not logged in
  if (!isLoggedIn) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-5xl mx-auto">
        {/* Header with Logout */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-between mb-4">
            <div></div>
            <div className="flex items-center gap-3">
              <span className="text-5xl animate-bounce">🎰</span>
              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                เครื่องสุ่มเลขมงคล
              </h1>
              <span className="text-5xl animate-bounce">🍀</span>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 flex items-center gap-2"
            >
              <span>🚪</span>
              <span>ออกจากระบบ</span>
            </button>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            อัปโหลดภาพพื้นหลังที่คุณชื่นชอบ แล้วให้เราสร้างเลขมงคลบนภาพให้คุณ
          </p>
        </div>

        {/* Upload Section */}
        {!backgroundImage && (
          <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-dashed border-purple-300 mb-8 hover:border-purple-500 transition-colors duration-300">
            <div className="text-center">
              <div className="text-8xl mb-6 animate-pulse">📸</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">อัปโหลดภาพพื้นหลัง</h3>
              <p className="text-gray-500 mb-8 text-lg">
                เลือกภาพที่ต้องการใช้เป็นพื้นหลังสำหรับเลขมงคลของคุณ
              </p>
              <button
                onClick={handleImageChange}
                className="px-10 py-4 bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-600 text-white font-bold text-lg rounded-xl shadow-lg hover:from-purple-600 hover:via-blue-600 hover:to-indigo-700 transform hover:scale-105 hover:shadow-xl transition-all duration-300"
              >
                <span className="flex items-center gap-3">
                  <span className="text-2xl">📂</span>
                  <span>เลือกภาพ</span>
                </span>
              </button>
              <p className="text-sm text-gray-400 mt-4">รองรับไฟล์ JPG, PNG, WEBP</p>
            </div>
          </div>
        )}

        {/* Preview Section */}
        {backgroundImage && (
          <div className="bg-white rounded-2xl p-6 shadow-xl mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">🖼️ ตัวอย่างภาพ</h3>
              {imageInfo && (
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {imageInfo.width} × {imageInfo.height} px
                </span>
              )}
            </div>
            <div className="relative bg-gray-100 rounded-xl overflow-hidden">
              <img
                src={backgroundImage}
                alt="Background Preview"
                className="w-full max-h-[500px] object-contain"
              />

              {/* Live Overlay Preview */}
              {numbers.threeDigit.length > 0 && (
                <div className="absolute inset-0 flex items-center justify-center p-4 pointer-events-none">
                  <div className="w-full h-full flex flex-col justify-center items-center text-center">
                    {/* Title */}
                    <div className="mb-6">
                      <div
                        className="text-yellow-300 font-bold text-2xl sm:text-3xl md:text-4xl mb-4 drop-shadow-2xl"
                        style={{
                          textShadow: '3px 3px 0px rgba(0,0,0,0.8), -3px -3px 0px rgba(0,0,0,0.8), 3px -3px 0px rgba(0,0,0,0.8), -3px 3px 0px rgba(0,0,0,0.8)'
                        }}
                      >
                        เลขมงคลประจำวัน
                      </div>
                    </div>

                    {/* 3-digit numbers */}
                    <div className="mb-6">
                      <div
                        className="text-red-300 font-bold text-lg sm:text-xl md:text-2xl mb-3 drop-shadow-2xl"
                        style={{
                          textShadow: '2px 2px 0px rgba(0,0,0,0.8), -2px -2px 0px rgba(0,0,0,0.8), 2px -2px 0px rgba(0,0,0,0.8), -2px 2px 0px rgba(0,0,0,0.8)'
                        }}
                      >
                        เลข 3 ตัว:
                      </div>
                      <div className="flex gap-4 sm:gap-6 md:gap-8 justify-center">
                        {numbers.threeDigit.map((num, index) => (
                          <div
                            key={index}
                            className="text-white font-bold text-2xl sm:text-3xl md:text-4xl drop-shadow-2xl"
                            style={{
                              textShadow: '4px 4px 0px rgba(0,0,0,0.8), -4px -4px 0px rgba(0,0,0,0.8), 4px -4px 0px rgba(0,0,0,0.8), -4px 4px 0px rgba(0,0,0,0.8)'
                            }}
                          >
                            {num}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 2-digit numbers */}
                    <div className="mb-6">
                      <div
                        className="text-teal-300 font-bold text-lg sm:text-xl md:text-2xl mb-3 drop-shadow-2xl"
                        style={{
                          textShadow: '2px 2px 0px rgba(0,0,0,0.8), -2px -2px 0px rgba(0,0,0,0.8), 2px -2px 0px rgba(0,0,0,0.8), -2px 2px 0px rgba(0,0,0,0.8)'
                        }}
                      >
                        เลข 2 ตัว:
                      </div>
                      <div className="flex gap-3 sm:gap-4 md:gap-6 justify-center">
                        {numbers.twoDigit.map((num, index) => (
                          <div
                            key={index}
                            className="text-white font-bold text-xl sm:text-2xl md:text-3xl drop-shadow-2xl"
                            style={{
                              textShadow: '3px 3px 0px rgba(0,0,0,0.8), -3px -3px 0px rgba(0,0,0,0.8), 3px -3px 0px rgba(0,0,0,0.8), -3px 3px 0px rgba(0,0,0,0.8)'
                            }}
                          >
                            {num}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {backgroundImage && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Generate Numbers Button */}
            <button
              onClick={generateNumbers}
              disabled={isGenerating}
              className={`
                px-6 py-4 text-lg font-bold text-white rounded-xl shadow-lg
                bg-gradient-to-r from-orange-500 to-red-600
                hover:from-orange-600 hover:to-red-700 hover:shadow-xl
                transform hover:scale-105 active:scale-95 transition-all duration-300
                disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                ${isGenerating ? 'animate-pulse' : ''}
              `}
            >
              {isGenerating ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>กำลังสุ่ม...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span className="text-xl">🎲</span>
                  <span>สุ่มเลขใหม่</span>
                </div>
              )}
            </button>

            {/* Change Background Button */}
            <button
              onClick={handleImageChange}
              className="px-6 py-4 text-lg font-bold text-white rounded-xl shadow-lg bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-300"
            >
              <div className="flex items-center justify-center gap-2">
                <span className="text-xl">🖼️</span>
                <span>เปลี่ยนพื้นหลัง</span>
              </div>
            </button>

            {/* Download Button */}
            <button
              onClick={downloadImage}
              disabled={isDownloading || numbers.threeDigit.length === 0}
              className={`
                px-6 py-4 text-lg font-bold text-white rounded-xl shadow-lg
                bg-gradient-to-r from-green-500 to-emerald-600
                hover:from-green-600 hover:to-emerald-700 hover:shadow-xl
                transform hover:scale-105 active:scale-95 transition-all duration-300
                disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                ${isDownloading ? 'animate-pulse' : ''}
              `}
            >
              {isDownloading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>กำลังสร้าง...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span className="text-xl">💾</span>
                  <span>ดาวน์โหลดภาพ</span>
                </div>
              )}
            </button>

            {/* Reset Button */}
            <button
              onClick={resetAll}
              className="px-6 py-4 text-lg font-bold text-gray-700 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl shadow-lg hover:from-gray-300 hover:to-gray-400 hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-300"
            >
              <div className="flex items-center justify-center gap-2">
                <span className="text-xl">🔄</span>
                <span>เริ่มใหม่</span>
              </div>
            </button>
          </div>
        )}

        {/* Current Numbers Display */}
        {numbers.threeDigit.length > 0 && (
          <div className="bg-gradient-to-r from-yellow-50 via-orange-50 to-red-50 rounded-2xl p-6 shadow-xl mb-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center justify-center gap-2">
                <span>🍀</span>
                <span>เลขมงคลของคุณ</span>
                <span>🍀</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-red-100">
                  <div className="text-red-600 font-bold text-xl mb-3 flex items-center justify-center gap-2">
                    <span>📊</span>
                    <span>เลข 3 ตัว</span>
                  </div>
                  <div className="text-gray-600 mb-4">เลขนำโชคสำหรับหวยรัฐบาล</div>
                  <div className="flex gap-3 justify-center">
                    {numbers.threeDigit.map((num, index) => (
                      <span key={index} className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-xl font-bold text-xl shadow-lg">
                        {num}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-teal-100">
                  <div className="text-teal-600 font-bold text-xl mb-3 flex items-center justify-center gap-2">
                    <span>🎯</span>
                    <span>เลข 2 ตัว</span>
                  </div>
                  <div className="text-gray-600 mb-4">เลขนำโชคสำหรับหวยท้าย 2 ตัว</div>
                  <div className="flex gap-2 justify-center">
                    {numbers.twoDigit.map((num, index) => (
                      <span key={index} className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-4 py-2 rounded-xl font-bold text-lg shadow-lg">
                        {num}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-white rounded-2xl p-6 shadow-xl">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span>📖</span>
            <span>วิธีใช้งาน</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-600">
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl">
                <span className="bg-blue-500 text-white font-bold text-lg w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">1</span>
                <span className="text-lg">อัปโหลดภาพพื้นหลังที่ต้องการ</span>
              </div>
              <div className="flex items-start gap-4 p-4 bg-green-50 rounded-xl">
                <span className="bg-green-500 text-white font-bold text-lg w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">2</span>
                <span className="text-lg">ระบบจะสุ่มเลขมงคลโดยอัตโนมัติ</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-orange-50 rounded-xl">
                <span className="bg-orange-500 text-white font-bold text-lg w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">3</span>
                <span className="text-lg">สุ่มเลขใหม่หรือเปลี่ยนพื้นหลังได้ตามต้องการ</span>
              </div>
              <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-xl">
                <span className="bg-purple-500 text-white font-bold text-lg w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">4</span>
                <span className="text-lg">ดาวน์โหลดภาพที่มีเลขมงคลแล้ว</span>
              </div>
            </div>
          </div>
          <div className="mt-6 p-4 bg-yellow-50 rounded-xl border-l-4 border-yellow-400">
            <p className="text-gray-700">
              <span className="font-bold">💡 เคล็ดลับ:</span>
              ภาพที่มีคุณภาพสูงจะให้ผลลัพธ์ที่ดีกว่า และตัวอักษรจะปรับขนาดให้เหมาะสมกับภาพโดยอัตโนมัติ
            </p>
          </div>
        </div>

        {/* Hidden elements */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          ref={fileInputRef}
          className="hidden"
        />
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};

export default ThaiLotteryOverlay;