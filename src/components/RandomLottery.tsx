import React, { useState, useRef } from 'react';

interface LotteryNumbers {
  threeDigit: string[];
  twoDigit: string[];
}

const RandomLottery: React.FC = () => {
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [numbers, setNumbers] = useState<LotteryNumbers>({ threeDigit: [], twoDigit: [] });
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
    }, 300);
  };

  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBackgroundImage(e.target?.result as string);
        generateNumbers(); // Auto generate numbers when image is uploaded
      };
      reader.readAsDataURL(file);
    }
  };

  // Draw numbers on canvas and download
  const downloadImage = async () => {
    if (!backgroundImage || !canvasRef.current) return;

    setIsDownloading(true);

    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = new Image();
      img.onload = () => {
        // Set canvas size to match image
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw background image
        ctx.drawImage(img, 0, 0);

        // Setup text styling
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Calculate positions based on image size
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        // Draw semi-transparent background for numbers
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(centerX - 200, centerY - 120, 400, 240);

        // Add border
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 3;
        ctx.strokeRect(centerX - 200, centerY - 120, 400, 240);

        // Draw title
        ctx.font = 'bold 28px Arial';
        ctx.fillStyle = '#FFD700';
        ctx.fillText('🎰 เลขมงคลประจำวัน', centerX, centerY - 80);

        // Draw 3-digit numbers
        ctx.font = 'bold 24px Arial';
        ctx.fillStyle = '#FF6B6B';
        ctx.fillText('เลข 3 ตัว:', centerX - 100, centerY - 30);

        ctx.font = 'bold 32px Arial';
        ctx.fillStyle = '#FFFFFF';
        numbers.threeDigit.forEach((num, index) => {
          ctx.fillText(num, centerX + (index - 0.5) * 80, centerY);
        });

        // Draw 2-digit numbers
        ctx.font = 'bold 24px Arial';
        ctx.fillStyle = '#4ECDC4';
        ctx.fillText('เลข 2 ตัว:', centerX - 100, centerY + 40);

        ctx.font = 'bold 28px Arial';
        ctx.fillStyle = '#FFFFFF';
        numbers.twoDigit.forEach((num, index) => {
          ctx.fillText(num, centerX + (index - 1) * 70, centerY + 70);
        });

        // Draw blessing text
        ctx.font = 'bold 16px Arial';
        ctx.fillStyle = '#FFD700';
        ctx.fillText('🙏 ขอให้โชคดี มีความสุข และร่ำรวย! 🍀💰', centerX, centerY + 110);

        // Download the image
        const link = document.createElement('a');
        link.download = `lottery-overlay-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-4xl">🎰</span>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-800">
              เครื่องสุ่มเลขมงคล
            </h1>
          </div>
          <p className="text-gray-600 text-lg">อัปโหลดภาพพื้นหลัง แล้วสร้างเลขมงคลบนภาพ</p>
        </div>

        {/* Upload Section */}
        {!backgroundImage && (
          <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-dashed border-gray-300 mb-8">
            <div className="text-center">
              <div className="text-6xl mb-4">📸</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-4">อัปโหลดภาพพื้นหลัง</h3>
              <p className="text-gray-500 mb-6">เลือกภาพที่ต้องการใช้เป็นพื้นหลังสำหรับเลขมงคล</p>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                ref={fileInputRef}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200"
              >
                <span className="flex items-center gap-2">
                  <span>📂</span>
                  <span>เลือกภาพ</span>
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Preview Section */}
        {backgroundImage && (
          <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
            <div className="relative">
              <img
                src={backgroundImage}
                alt="Background"
                className="w-full max-h-96 object-contain rounded-lg"
              />

              {/* Overlay Numbers Preview */}
              {numbers.threeDigit.length > 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-black/70 backdrop-blur-sm rounded-lg p-6 border-2 border-yellow-400">
                    <div className="text-center">
                      <div className="text-yellow-400 font-bold text-xl mb-3">
                        🎰 เลขมงคลประจำวัน
                      </div>

                      <div className="mb-4">
                        <div className="text-red-400 font-semibold mb-2">เลข 3 ตัว:</div>
                        <div className="flex gap-4 justify-center">
                          {numbers.threeDigit.map((num, index) => (
                            <div key={index} className="bg-gradient-to-r from-red-500 to-red-600 text-white font-bold text-2xl px-4 py-2 rounded-lg shadow-lg">
                              {num}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="text-teal-400 font-semibold mb-2">เลข 2 ตัว:</div>
                        <div className="flex gap-3 justify-center">
                          {numbers.twoDigit.map((num, index) => (
                            <div key={index} className="bg-gradient-to-r from-teal-500 to-teal-600 text-white font-bold text-xl px-3 py-2 rounded-lg shadow-lg">
                              {num}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="text-yellow-400 font-semibold text-sm">
                        🙏 ขอให้โชคดี มีความสุข และร่ำรวย! 🍀💰
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
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-8">
            <button
              onClick={generateNumbers}
              disabled={isGenerating}
              className={`
                px-8 py-3 text-lg font-semibold text-white rounded-lg shadow-lg
                bg-gradient-to-r from-orange-500 to-red-600
                hover:from-orange-600 hover:to-red-700
                transform hover:scale-105 active:scale-95 transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                ${isGenerating ? 'animate-pulse' : ''}
              `}
            >
              {isGenerating ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>กำลังสุ่ม...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>🎲</span>
                  <span>สุ่มเลขใหม่</span>
                </div>
              )}
            </button>

            <button
              onClick={downloadImage}
              disabled={isDownloading || numbers.threeDigit.length === 0}
              className={`
                px-8 py-3 text-lg font-semibold text-white rounded-lg shadow-lg
                bg-gradient-to-r from-green-500 to-emerald-600
                hover:from-green-600 hover:to-emerald-700
                transform hover:scale-105 active:scale-95 transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                ${isDownloading ? 'animate-pulse' : ''}
              `}
            >
              {isDownloading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>กำลังสร้าง...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>💾</span>
                  <span>ดาวน์โหลดภาพ</span>
                </div>
              )}
            </button>

            <button
              onClick={() => {
                setBackgroundImage(null);
                setNumbers({ threeDigit: [], twoDigit: [] });
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              className="px-8 py-3 text-lg font-semibold text-gray-700 bg-gray-200 rounded-lg shadow-lg hover:bg-gray-300 transform hover:scale-105 active:scale-95 transition-all duration-200"
            >
              <div className="flex items-center gap-2">
                <span>🔄</span>
                <span>เริ่มใหม่</span>
              </div>
            </button>
          </div>
        )}

        {/* Hidden input for file upload */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          ref={fileInputRef}
          className="hidden"
        />

        {/* Hidden canvas for image processing */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};

export default RandomLottery;