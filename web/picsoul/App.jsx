import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Upload,
  Download,
  Grid3X3,
  Pipette,
  Layers,
  Code,
  Image as ImageIcon,
  Zap,
  RefreshCw,
  Eye,
  Maximize,
  Search,
  Hand,
  SlidersHorizontal,
  Box,
  MousePointer2,
  Sun,
  Moon,
  RotateCcw,
  Target,
  Trash2,
  Plus,
  Clock,
  FileImage,
  FileJson,
  CheckCircle2,
  X,
  ChevronRight,
  Settings2,
  EyeOff,
} from "lucide-react";

const workerScript = `
self.onmessage = function(e) {
  const { imageData, width, height, pixelSize, tolerance, isFilterActive, bgColor, protectionZones } = e.data;
  const data = imageData.data;
  const newPixelData = [];
  const resultPixels = new Uint8ClampedArray(width * height * 4);

  function getColorDistance(r1, g1, b1, r2, g2, b2) {
    return Math.sqrt(Math.pow(r1 - r2, 2) + Math.pow(g1 - g2, 2) + Math.pow(b1 - b2, 2));
  }

  const pSize = Math.max(1, pixelSize);

  for (let y = 0; y < height; y += pSize) {
    for (let x = 0; x < width; x += pSize) {
      let r = 0, g = 0, b = 0, count = 0;
      
      for (let sy = y; sy < Math.min(y + pSize, height); sy++) {
        for (let sx = x; sx < Math.min(x + pSize, width); sx++) {
          const idx = (sy * width + sx) * 4;
          r += data[idx]; g += data[idx + 1]; b += data[idx + 2];
          count++;
        }
      }

      const avgR = Math.round(r / count);
      const avgG = Math.round(g / count);
      const avgB = Math.round(b / count);
      const lx = x / pSize;
      const ly = y / pSize;

      let isInProtection = false;
      for (const zone of protectionZones) {
        const minX = Math.min(zone.x1, zone.x2);
        const maxX = Math.max(zone.x1, zone.x2);
        const minY = Math.min(zone.y1, zone.y2);
        const maxY = Math.max(zone.y1, zone.y2);
        if (lx >= minX && lx <= maxX && ly >= minY && ly <= maxY) {
          isInProtection = true;
          break;
        }
      }

      let isTransparent = false;
      if (isFilterActive && !isInProtection) {
        const dist = getColorDistance(avgR, avgG, avgB, bgColor.r, bgColor.g, bgColor.b);
        if (dist <= tolerance) isTransparent = true;
      }

      const alpha = isTransparent ? 0 : 255;
      if (!isTransparent) {
        newPixelData.push({ x: lx, y: ly, hex: "#" + ((1 << 24) + (avgR << 16) + (avgG << 8) + avgB).toString(16).slice(1) });
      }

      for (let sy = y; sy < Math.min(y + pSize, height); sy++) {
        for (let sx = x; sx < Math.min(x + pSize, width); sx++) {
          const idx = (sy * width + sx) * 4;
          resultPixels[idx] = avgR;
          resultPixels[idx + 1] = avgG;
          resultPixels[idx + 2] = avgB;
          resultPixels[idx + 3] = alpha;
        }
      }
    }
  }
  self.postMessage({ pixelData: newPixelData, resultPixels }, [resultPixels.buffer]);
};
`;

const ControlCard = ({ title, onReset, children }) => (
  <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden transition-all">
    <div className="px-4 py-2 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-800/30">
      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
        {title}
      </span>
      {onReset && (
        <button
          onClick={onReset}
          className="text-zinc-400 hover:text-indigo-500 transition-colors"
        >
          <RotateCcw size={12} />
        </button>
      )}
    </div>
    <div className="p-4 space-y-4">{children}</div>
  </div>
);

const CompactToggle = ({ label, active, onClick, icon: Icon }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${active ? "bg-indigo-600/10 border-indigo-500/40 text-indigo-600 dark:text-indigo-400" : "bg-transparent border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400"}`}
  >
    <div className="flex items-center gap-3">
      <Icon size={14} />
      <span className="text-[11px] font-bold uppercase tracking-tight">
        {label}
      </span>
    </div>
    <div
      className={`w-8 h-4 rounded-full relative transition-colors ${active ? "bg-indigo-500" : "bg-zinc-300 dark:bg-zinc-700"}`}
    >
      <div
        className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all shadow-sm ${active ? "right-0.5" : "left-0.5"}`}
      />
    </div>
  </button>
);

const App = () => {
  const [theme, setTheme] = useState("dark");
  const [image, setImage] = useState(null);
  const [originalSize, setOriginalSize] = useState({ width: 0, height: 0 });
  const [pixelSize, setPixelSize] = useState(10);
  const [tolerance, setTolerance] = useState(30);
  const [contrast, setContrast] = useState(0);
  const [saturation, setSaturation] = useState(0);
  const [bgColor, setBgColor] = useState({ r: 255, g: 255, b: 255 });
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [activeTab, setActiveTab] = useState("sampling");
  const [isDropperActive, setIsDropperActive] = useState(false);
  const [computeTime, setComputeTime] = useState(0);

  const [isSelectingROI, setIsSelectingROI] = useState(false);
  const [protectionZones, setProtectionZones] = useState([]);
  const [currentDragZone, setCurrentDragZone] = useState(null);
  const [dragStart, setDragStart] = useState(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });

  const canvasRef = useRef(null);
  const viewportRef = useRef(null);
  const workerRef = useRef(null);
  const startTimeRef = useRef(0);
  const fileInputRef = useRef(null);

  const [pixelDataPoints, setPixelData] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const renderGridOnCanvas = useCallback(
    (ctx) => {
      if (originalSize.width <= 0) return;
      ctx.strokeStyle =
        theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)";
      ctx.lineWidth = 1 / (scale || 1);
      ctx.beginPath();
      for (let x = 0; x <= originalSize.width; x += pixelSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, originalSize.height);
      }
      for (let y = 0; y <= originalSize.height; y += pixelSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(originalSize.width, y);
      }
      ctx.stroke();
    },
    [originalSize, theme, scale, pixelSize],
  );

  useEffect(() => {
    const blob = new Blob([workerScript], { type: "text/javascript" });
    const worker = new Worker(URL.createObjectURL(blob));
    worker.onmessage = (e) => {
      const { pixelData, resultPixels } = e.data;
      setPixelData(pixelData);
      const canvas = canvasRef.current;
      if (canvas && originalSize.width > 0) {
        const ctx = canvas.getContext("2d", { alpha: true });
        const imgData = new ImageData(
          resultPixels,
          originalSize.width,
          originalSize.height,
        );
        ctx.clearRect(0, 0, originalSize.width, originalSize.height);
        ctx.putImageData(imgData, 0, 0);
        if (showGrid) renderGridOnCanvas(ctx);
      }
      setIsProcessing(false);
      setComputeTime(performance.now() - startTimeRef.current);
    };
    workerRef.current = worker;
    return () => worker.terminate();
  }, [originalSize, showGrid, renderGridOnCanvas]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!image || !workerRef.current || originalSize.width <= 0) return;
      setIsProcessing(true);
      startTimeRef.current = performance.now();

      const tempCanvas = document.createElement("canvas");
      const tempCtx = tempCanvas.getContext("2d");
      tempCanvas.width = originalSize.width;
      tempCanvas.height = originalSize.height;
      tempCtx.filter = `contrast(${100 + contrast}%) saturate(${100 + saturation}%)`;
      tempCtx.drawImage(image, 0, 0);
      const imageData = tempCtx.getImageData(
        0,
        0,
        originalSize.width,
        originalSize.height,
      );

      workerRef.current.postMessage({
        imageData,
        width: originalSize.width,
        height: originalSize.height,
        pixelSize,
        tolerance,
        isFilterActive,
        bgColor,
        protectionZones,
      });
    }, 150);
    return () => clearTimeout(timer);
  }, [
    image,
    originalSize,
    pixelSize,
    tolerance,
    isFilterActive,
    bgColor,
    protectionZones,
    contrast,
    saturation,
  ]);

  const fitToScreen = useCallback((w, h) => {
    if (!w || !h || !viewportRef.current) return;
    const vW = viewportRef.current.clientWidth;
    const vH = viewportRef.current.clientHeight;
    const pad = 80;
    const s = Math.min((vW - pad) / w, (vH - pad) / h, 1.5);
    setScale(s || 1);
    setOffset({ x: 0, y: 0 });
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const img = new Image();
      img.onload = () => {
        setImage(img);
        setOriginalSize({ width: img.width, height: img.height });
        setProtectionZones([]);
        fitToScreen(img.width, img.height);
      };
      img.src = URL.createObjectURL(file);
    }
  };

  const getCanvasCoords = (clientX, clientY) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    if (rect.width === 0) return { x: 0, y: 0 };
    const x = ((clientX - rect.left) / rect.width) * originalSize.width;
    const y = ((clientY - rect.top) / rect.height) * originalSize.height;
    return { x, y };
  };

  const handleGlobalMouseDown = (e) => {
    if (!image) return;

    if (isDropperActive || isSelectingROI) {
      const { x, y } = getCanvasCoords(e.clientX, e.clientY);
      if (isDropperActive) {
        const ctx = canvasRef.current.getContext("2d", {
          willReadFrequently: true,
        });
        const p = ctx.getImageData(x, y, 1, 1).data;
        setBgColor({ r: p[0], g: p[1], b: p[2] });
        setIsFilterActive(true);
        setIsDropperActive(false);
      } else {
        const lx = x / (pixelSize || 1);
        const ly = y / (pixelSize || 1);
        setDragStart({ x: lx, y: ly });
        setCurrentDragZone({
          id: Date.now(),
          x1: lx,
          y1: ly,
          x2: lx,
          y2: ly,
        });
      }
      return;
    }

    if (e.button === 0) {
      setIsDragging(true);
      setLastMousePos({ x: e.clientX, y: e.clientY });
    }
  };

  const handleGlobalMouseMove = (e) => {
    if (isSelectingROI && dragStart) {
      const { x, y } = getCanvasCoords(e.clientX, e.clientY);
      const lx = x / (pixelSize || 1);
      const ly = y / (pixelSize || 1);
      setCurrentDragZone((prev) =>
        prev ? { ...prev, x2: lx, y2: ly } : null,
      );
    } else if (isDragging && image) {
      const dx = e.clientX - lastMousePos.x;
      const dy = e.clientY - lastMousePos.y;
      setOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
      setLastMousePos({ x: e.clientX, y: e.clientY });
    }
  };

  const handleGlobalMouseUp = () => {
    setIsDragging(false);
    if (isSelectingROI && currentDragZone) {
      setProtectionZones((p) => [...p, currentDragZone]);
      setCurrentDragZone(null);
      setIsSelectingROI(false);
    }
  };

  const onWheel = (e) => {
    if (!image) return;
    e.preventDefault();
    const zoomSpeed = 0.0015;
    setScale((prev) => {
      const next = prev * (1 - e.deltaY * zoomSpeed);
      return Math.min(Math.max(next, 0.01), 100);
    });
  };

  const downloadPNG = () => {
    if (!canvasRef.current) return;
    const wasGrid = showGrid;
    if (wasGrid) setShowGrid(false);

    setTimeout(() => {
      const exportCanvas = document.createElement("canvas");
      exportCanvas.width = originalSize.width;
      exportCanvas.height = originalSize.height;
      const ctx = exportCanvas.getContext("2d");
      ctx.drawImage(canvasRef.current, 0, 0);
      const a = document.createElement("a");
      a.download = "picsoul_export.png";
      a.href = exportCanvas.toDataURL("image/png");
      a.click();
      if (wasGrid) setShowGrid(true);
    }, 100);
  };

  return (
    <div
      className={`${theme} h-screen flex flex-col font-sans transition-colors duration-300 bg-white dark:bg-[#09090b] text-zinc-900 dark:text-zinc-50 overflow-hidden`}
    >
      <header className="h-14 border-b flex items-center justify-between px-6 z-40 bg-white dark:bg-[#09090b] border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="flex items-center gap-4">
          <div
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => fitToScreen(originalSize.width, originalSize.height)}
          >
            <div className="bg-indigo-600 p-1.5 rounded-lg shadow-lg shadow-indigo-600/20 group-hover:scale-110 transition-transform">
              <Box size={18} className="text-white" />
            </div>
            <span className="font-black text-sm uppercase tracking-tighter text-zinc-900 dark:text-zinc-100">
              PicSoul
            </span>
          </div>
          {image && (
            <div className="hidden md:flex items-center gap-4 text-[10px] font-bold uppercase text-zinc-400 border-l border-zinc-200 dark:border-zinc-800 pl-4 ml-2">
              <div className="flex flex-col">
                <span className="text-indigo-500 font-mono tracking-tighter">
                  {(originalSize.width / pixelSize).toFixed(0)}x
                  {(originalSize.height / pixelSize).toFixed(0)}
                </span>
                <span>Asset Res</span>
              </div>
              <div className="flex flex-col">
                <span className="text-emerald-500 font-mono tracking-tighter">
                  {pixelDataPoints.length}
                </span>
                <span>Data Points</span>
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
            className="p-2 rounded-xl transition-all hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          {!image ? (
            <button
              onClick={() => fileInputRef.current.click()}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-lg active:scale-95"
            >
              <Upload size={14} /> 导入资产
            </button>
          ) : (
            <button
              onClick={() => fileInputRef.current.click()}
              className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl text-zinc-400"
              title="更换图片"
            >
              <RefreshCw size={18} />
            </button>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept="image/*"
          />
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden">
        <aside className="w-[320px] border-r flex flex-col bg-zinc-50/50 dark:bg-[#09090b] border-zinc-200 dark:border-zinc-800 z-30 shadow-2xl transition-colors">
          <div className="grid grid-cols-4 p-1 m-4 rounded-2xl bg-zinc-200/50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-inner">
            {[
              { id: "sampling", icon: Grid3X3, label: "采样" },
              { id: "filter", icon: Zap, label: "过滤" },
              { id: "enhance", icon: SlidersHorizontal, label: "增强" },
              { id: "export", icon: Download, label: "导出" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center justify-center py-2.5 rounded-xl text-[9px] font-black uppercase tracking-tighter transition-all ${activeTab === tab.id ? "bg-white dark:bg-[#1c1c1f] text-indigo-600 dark:text-indigo-400 shadow-md" : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"}`}
              >
                <tab.icon size={14} className="mb-1" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto px-6 space-y-6 custom-scrollbar pb-10">
            {image ? (
              <div className="animate-in fade-in slide-in-from-left-4 duration-500 space-y-6">
                {activeTab === "sampling" && (
                  <>
                    <ControlCard
                      title="网格步长控制"
                      onReset={() => setPixelSize(10)}
                    >
                      <div className="flex justify-between text-[11px] font-mono text-zinc-500">
                        <span>步长尺寸</span>
                        <span className="text-indigo-500 font-bold">
                          {pixelSize}px
                        </span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="60"
                        value={pixelSize}
                        onChange={(e) => setPixelSize(parseInt(e.target.value))}
                        className="pixel-range"
                      />
                    </ControlCard>
                    <CompactToggle
                      label="显示网格辅助线"
                      icon={Eye}
                      active={showGrid}
                      onClick={() => setShowGrid(!showGrid)}
                    />
                  </>
                )}

                {activeTab === "filter" && (
                  <>
                    <CompactToggle
                      label="开启透明度过滤"
                      icon={Zap}
                      active={isFilterActive}
                      onClick={() => setIsFilterActive(!isFilterActive)}
                    />
                    <div
                      className={`space-y-6 transition-all ${!isFilterActive && "opacity-40 pointer-events-none grayscale"}`}
                    >
                      <ControlCard title="目标基准色">
                        <div className="flex justify-between items-center text-[10px] font-bold text-zinc-400 uppercase">
                          <span>颜色状态</span>
                          <div
                            className="w-8 h-8 rounded-lg border border-zinc-200 dark:border-zinc-700 shadow-sm"
                            style={{
                              background: `rgb(${bgColor.r},${bgColor.g},${bgColor.b})`,
                            }}
                          />
                        </div>
                        <button
                          onClick={() => setIsDropperActive(!isDropperActive)}
                          className={`w-full py-2.5 rounded-xl border text-[11px] font-bold flex items-center justify-center gap-2 transition-all ${isDropperActive ? "bg-indigo-600 border-indigo-400 text-white animate-pulse" : "bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300"}`}
                        >
                          <Pipette size={14} />
                          {isDropperActive ? "选取中..." : "启动吸管工具"}
                        </button>
                        <div className="space-y-4 pt-2">
                          <div className="flex justify-between text-[11px] font-mono text-zinc-500">
                            <span>过滤容差</span>
                            <span className="text-indigo-500 font-bold">
                              {tolerance}
                            </span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="150"
                            value={tolerance}
                            onChange={(e) =>
                              setTolerance(parseInt(e.target.value))
                            }
                            className="pixel-range"
                          />
                        </div>
                      </ControlCard>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-zinc-400 font-black uppercase text-[10px] tracking-widest pl-1">
                        <span>多选区保护 (ROI)</span>
                        <span className="text-amber-500">
                          {protectionZones.length}
                        </span>
                      </div>
                      <button
                        onClick={() => setIsSelectingROI(!isSelectingROI)}
                        className={`w-full py-3 rounded-2xl border text-[11px] font-bold flex items-center justify-center gap-2 transition-all shadow-sm ${isSelectingROI ? "bg-amber-500 border-amber-400 text-white animate-pulse" : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400"}`}
                      >
                        <Target size={14} />
                        {isSelectingROI ? "正在画布绘制..." : "添加保护选区"}
                      </button>
                      <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                        {protectionZones.map((z, i) => (
                          <div
                            key={z.id}
                            className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-sm group"
                          >
                            <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-zinc-500">
                              <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                              Zone #{i + 1}
                            </div>
                            <button
                              onClick={() =>
                                setProtectionZones((p) =>
                                  p.filter((x) => x.id !== z.id),
                                )
                              }
                              className="text-zinc-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {activeTab === "enhance" && (
                  <ControlCard
                    title="后处理渲染"
                    onReset={() => {
                      setContrast(0);
                      setSaturation(0);
                    }}
                  >
                    <div className="space-y-6 py-2">
                      <div className="space-y-3">
                        <div className="flex justify-between text-[11px] font-mono text-zinc-500">
                          <span>对比度</span>
                          <span className="text-indigo-500 font-bold">
                            {contrast}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min="-50"
                          max="100"
                          value={contrast}
                          onChange={(e) =>
                            setContrast(parseInt(e.target.value))
                          }
                          className="pixel-range"
                        />
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between text-[11px] font-mono text-zinc-500">
                          <span>饱和度</span>
                          <span className="text-indigo-500 font-bold">
                            {saturation}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min="-100"
                          max="100"
                          value={saturation}
                          onChange={(e) =>
                            setSaturation(parseInt(e.target.value))
                          }
                          className="pixel-range"
                        />
                      </div>
                    </div>
                  </ControlCard>
                )}

                {activeTab === "export" && (
                  <div className="space-y-4">
                    <button
                      onClick={downloadPNG}
                      className="w-full flex flex-col items-center justify-center gap-4 p-8 bg-indigo-600 hover:bg-indigo-500 text-white rounded-3xl transition-all group shadow-xl active:scale-95"
                    >
                      <FileImage
                        size={32}
                        className="group-hover:scale-110 transition-transform"
                      />
                      <span className="text-xs font-black uppercase tracking-widest italic">
                        导出高清像素图 (PNG)
                      </span>
                    </button>
                    <button
                      onClick={() => {
                        const json = JSON.stringify(
                          { metadata: originalSize, pixels: pixelDataPoints },
                          null,
                          2,
                        );
                        const blob = new Blob([json], {
                          type: "application/json",
                        });
                        const a = document.createElement("a");
                        a.href = URL.createObjectURL(blob);
                        a.download = "pixel_data.json";
                        a.click();
                      }}
                      className="w-full flex flex-col items-center justify-center gap-4 p-8 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-3xl border border-zinc-700 transition-all group shadow-lg active:scale-95"
                    >
                      <FileJson
                        size={32}
                        className="group-hover:scale-110 transition-transform"
                      />
                      <span className="text-xs font-black uppercase tracking-widest italic">
                        导出点阵数据 (JSON)
                      </span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl text-zinc-300 dark:text-zinc-700 mt-4 animate-pulse">
                <ImageIcon size={40} className="mb-2 opacity-20" />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  等待导入图像
                </span>
              </div>
            )}
          </div>
          <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 text-zinc-400 dark:text-zinc-500 text-[9px] font-black uppercase tracking-widest flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock size={12} />
              延迟: {computeTime.toFixed(1)}ms
            </div>
            <span className="font-mono">V3.9.9</span>
          </div>
        </aside>

        <div
          ref={viewportRef}
          className="flex-1 relative overflow-hidden flex items-center justify-center bg-[#f0f0f2] dark:bg-[#0c0c0e] transition-colors group/viewport"
          onMouseDown={handleGlobalMouseDown}
          onMouseMove={handleGlobalMouseMove}
          onMouseUp={handleGlobalMouseUp}
          onMouseLeave={handleGlobalMouseUp}
          onWheel={onWheel}
        >
          <div
            className={`absolute inset-0 transition-opacity pointer-events-none ${theme === "dark" ? "opacity-[0.05]" : "opacity-[0.03]"}`}
            style={{
              backgroundImage: `conic-gradient(${theme === "dark" ? "#333 90deg, #000 90deg 180deg, #333 180deg 270deg, #000 270deg" : "#aaa 90deg, #fff 90deg 180deg, #aaa 180deg 270deg, #fff 270deg"})`,
              backgroundSize: "12px 12px",
            }}
          />

          {!image ? (
            <div
              onClick={() => fileInputRef.current.click()}
              className="flex flex-col items-center gap-6 cursor-pointer group/upload transition-all active:scale-95"
            >
              <div className="relative w-32 h-32 rounded-[3rem] border-2 flex items-center justify-center bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-2xl group-hover/upload:border-indigo-500 group-hover/upload:scale-105 transition-all text-zinc-200 dark:text-zinc-800 group-hover/upload:text-indigo-500">
                <Upload size={40} />
              </div>
              <div className="text-center font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-700 italic">
                <h2 className="text-xl">Initialization Required</h2>
                <p className="text-[10px] mt-2 tracking-[0.4em]">
                  Engine Standby
                </p>
              </div>
            </div>
          ) : (
            <div
              className="relative select-none will-change-transform"
              style={{
                transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale || 1})`,
                transformOrigin: "center center",
              }}
            >
              <div
                className="relative shadow-[0_0_120px_rgba(0,0,0,0.5)] rounded-sm overflow-visible border border-black/10 dark:border-white/5 bg-zinc-900"
                style={{ imageRendering: "pixelated" }}
              >
                <canvas
                  ref={canvasRef}
                  width={originalSize.width || 1}
                  height={originalSize.height || 1}
                  className={`block transition-opacity duration-300 ${isProcessing ? "opacity-40" : "opacity-100"} ${isDropperActive || isSelectingROI ? "cursor-crosshair" : isDragging ? "cursor-grabbing" : "cursor-grab"}`}
                />

                {currentDragZone && (
                  <div
                    className="absolute border-2 border-amber-400 bg-amber-400/20 pointer-events-none z-20 shadow-[0_0_15px_rgba(251,191,36,0.3)]"
                    style={{
                      left:
                        Math.min(currentDragZone.x1, currentDragZone.x2) *
                          pixelSize || 0,
                      top:
                        Math.min(currentDragZone.y1, currentDragZone.y2) *
                          pixelSize || 0,
                      width:
                        Math.abs(currentDragZone.x2 - currentDragZone.x1) *
                          pixelSize || 0,
                      height:
                        Math.abs(currentDragZone.y2 - currentDragZone.y1) *
                          pixelSize || 0,
                    }}
                  />
                )}
                {protectionZones.map((z) => (
                  <div
                    key={z.id}
                    className="absolute border border-dashed border-amber-500/40 bg-amber-500/5 pointer-events-none z-10"
                    style={{
                      left: Math.min(z.x1, z.x2) * pixelSize || 0,
                      top: Math.min(z.y1, z.y2) * pixelSize || 0,
                      width: Math.abs(z.x2 - z.x1) * pixelSize || 0,
                      height: Math.abs(z.y2 - z.y1) * pixelSize || 0,
                    }}
                  />
                ))}

                {isProcessing && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/20 backdrop-blur-[1px] z-50 transition-all">
                    <div className="w-12 h-0.5 bg-zinc-800 rounded-full overflow-hidden mb-4">
                      <div className="h-full bg-indigo-500 animate-[loading_1.5s_infinite]" />
                    </div>
                    <span className="text-[9px] font-black tracking-[0.4em] text-white uppercase opacity-70">
                      Async Computing...
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {image && (
            <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-3 px-4 py-1.5 rounded-full border bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-zinc-200 dark:border-zinc-800 shadow-lg text-[9px] font-bold text-zinc-500 opacity-0 group-viewport/hover:opacity-100 transition-opacity">
              <Hand size={12} /> 按住并拖拽可平移视图{" "}
              <div className="w-[1px] h-3 bg-zinc-200 dark:bg-zinc-800 mx-2" />{" "}
              <Search size={12} /> 滚轮缩放
            </div>
          )}

          {image && (
            <div className="absolute bottom-12 right-8 flex items-center gap-3 px-4 py-2.5 rounded-2xl border bg-white/95 dark:bg-zinc-900/90 backdrop-blur-xl border-zinc-200 dark:border-zinc-800 shadow-2xl z-40 transition-all scale-90 md:scale-100">
              <div className="flex items-center gap-3 pr-4 border-r border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-200">
                <Search size={14} />
                <span className="text-[11px] font-mono font-black min-w-[40px] text-right">
                  {(scale * 100).toFixed(0)}%
                </span>
              </div>
              <div className="flex gap-2 text-zinc-500 dark:text-zinc-400">
                <button
                  onClick={() => setScale((s) => Math.min(s * 1.2, 50))}
                  className="p-1 hover:text-indigo-500"
                >
                  <Plus size={16} />
                </button>
                <button
                  onClick={() => setScale((s) => Math.max(s / 1.2, 0.05))}
                  className="p-1 hover:text-indigo-500"
                >
                  <X size={16} className="rotate-45" />
                </button>
                <button
                  onClick={() =>
                    fitToScreen(originalSize.width, originalSize.height)
                  }
                  className="p-1 hover:text-indigo-500 ml-1"
                  title="复位"
                >
                  <Maximize size={15} />
                </button>
              </div>
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 h-8 border-t flex items-center justify-between px-6 z-40 bg-white dark:bg-[#09090b] border-zinc-200 dark:border-zinc-800 shadow-lg transition-colors text-zinc-500 dark:text-zinc-400 text-[9px] font-black uppercase tracking-widest">
            <div className="flex items-center gap-4">
              <MousePointer2 size={10} />
              <span>
                {isDropperActive
                  ? "Dropper Tool"
                  : isSelectingROI
                    ? "ROI Designer"
                    : isDragging
                      ? "Panning View"
                      : "Engine Ready"}
              </span>
            </div>
            <div className="flex items-center gap-4">
              {protectionZones.length > 0 && (
                <span className="text-amber-500 flex items-center gap-1">
                  <Target size={10} /> ROI Active
                </span>
              )}
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Kernel v3.99-Stable
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
