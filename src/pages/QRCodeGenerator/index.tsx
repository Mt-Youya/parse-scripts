'use client';
import { useState, useRef } from 'react';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/ui/card';
import { Alert, AlertDescription } from '@/ui/alert';
import { Download, Copy, Share2, RefreshCw } from 'lucide-react';
import { Ecc, QrCode, QrSegment } from '@/lib/QRCode';
import { toast } from 'sonner';

function QRCodeGenerator() {
  const [url, setUrl] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [error, setError] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 验证URL格式
  function isValidUrl(string: URL | string) {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  // 下载二维码
  async function downloadQRCode() {
    if (!qrCodeUrl) return;

    try {
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'qrcode.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      toast("下载失败，请稍后重试")
    }
  };

  // 复制URL到剪贴板
  async function copyUrl() {
    try {
      await navigator.clipboard.writeText(url);
      // 这里可以添加成功提示
    } catch (err) {
      setError('复制失败');
    }
  };

  // 分享功能
  async function shareQRCode() {
    if (!navigator.share) {
      return toast("分享失败", {
        description: <span> 请确认您的浏览器是否具备分享功能</span>
      })
    }
    if (qrCodeUrl) {
      return toast("分享失败", {
        description: <span> 请确认您输入了正确的URL</span>
      })
    }
    try {
      await navigator.share({
        title: 'QR码',
        text: `这是 ${url} 的二维码`,
        url: qrCodeUrl
      });
    } catch (err) {
      toast('分享失败:', {
        description: <span>Invalid URL : {err?.toString()}</span>
      });
    }
  };

  // 清除内容
  function clearAll() {
    setUrl('');
    setQrCodeUrl('');
    setError('');
  };

  function drawQRCode(canvas: HTMLCanvasElement) {
    if (!canvas) {
      return
    }
    const ctx = canvas.getContext("2d")
    if (!ctx) {
      return
    }
    const segs = QrSegment.makeSegments(url);
    const minVer = parseInt("1", 10);
    const maxVer = parseInt("40", 10);
    const mask = parseInt("-1", 10)
    const boostEcc = true
    const ecl = Ecc.LOW
    const qr = QrCode.encodeSegments(segs, ecl, minVer, maxVer, mask, boostEcc);
    const scale = parseInt("6", 10)
    const lightColor = "#fff"
    const darkColor = "#000"
    const border = 0
    const width = qr.size * scale;
    canvas.width = width;
    canvas.height = width;
    for (let y = -border; y < qr.size + border; y++) {
      for (let x = -border; x < qr.size + border; x++) {
        ctx.fillStyle = qr.getModule(x, y) ? darkColor : lightColor;
        ctx.fillRect((x + border) * scale, (y + border) * scale, scale, scale);
      }
    }

    return canvas.toDataURL()
  }

  useEffect(() => {
    if (!url) {
      return
    }
    const valid = isValidUrl(url)
    if (!valid) {
      toast("生成失败", {
        description: <span> 请确认您输入了正确的URL</span>
      })
      return
    }

    const canvas = canvasRef.current
    if (!canvas) {
      return
    }

    const codeURL = drawQRCode(canvas)
    if (!codeURL) {
      return
    }
    setQrCodeUrl(codeURL)
  }, [url])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">URL转二维码</h1>
          <p className="text-gray-600">将任何URL地址快速转换为二维码</p>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="w-5 h-5 text-blue-600" />
              生成二维码
            </CardTitle>
            <CardDescription>
              输入您想要转换的URL地址，点击生成即可创建二维码
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="url"
                placeholder="请输入URL地址 (例如: https://www.example.com)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1"
              />
              <Button onClick={clearAll} variant="outline" size="icon">
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {url && (
              <div className="text-center space-y-4">
                <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-200 inline-block">
                  <canvas ref={canvasRef}>not support</canvas>
                </div>

                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  <strong>目标URL:</strong>
                  <span className="break-all"> {url}</span>
                </div>

                <div className="flex gap-2 justify-center flex-wrap">
                  <Button onClick={downloadQRCode} variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    下载
                  </Button>

                  <Button onClick={copyUrl} variant="outline" size="sm">
                    <Copy className="w-4 h-4 mr-2" />
                    复制URL
                  </Button>

                  {!!navigator.share && (
                    <Button onClick={shareQRCode} variant="outline" size="sm">
                      <Share2 className="w-4 h-4 mr-2" />
                      分享
                    </Button>
                  )}
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="text-center text-sm text-gray-500">
            支持所有标准URL格式，生成的二维码可用于各种扫码应用
          </CardFooter>
        </Card>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-white/60 backdrop-blur-sm border-0">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Share2 className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-1">快速生成</h3>
              <p className="text-sm text-gray-600">输入URL即可快速生成高质量二维码</p>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm border-0">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Download className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-1">一键下载</h3>
              <p className="text-sm text-gray-600">生成后可直接下载PNG格式图片</p>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm border-0">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Copy className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-1">便捷分享</h3>
              <p className="text-sm text-gray-600">支持复制链接和原生分享功能</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QRCodeGenerator;
