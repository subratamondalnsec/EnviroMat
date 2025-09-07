// components/ImageUpload.jsx
import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Upload, X, Camera, Tag } from "lucide-react";
import gsap from "gsap";
import { useSelector } from 'react-redux';

const wasteCategories = {
  plastic: { name: "Plastic", color: "bg-green-100 text-green-800", credits: 5 },
  paper: { name: "Paper", color: "bg-blue-100 text-blue-800", credits: 3 },
  metal: { name: "Metal", color: "bg-gray-100 text-gray-800", credits: 8 },
  organic: { name: "Organic", color: "bg-yellow-100 text-yellow-800", credits: 2 },
  glass: { name: "Glass", color: "bg-purple-100 text-purple-800", credits: 4 },
  electronic: { name: "E-Waste", color: "bg-red-100 text-red-800", credits: 12 },
};

const detectCategory = () => {
  const categories = Object.keys(wasteCategories);
  return categories[Math.floor(Math.random() * categories.length)];
};

const ImageUpload = ({ images, onImagesChange }) => {
  const fileInputRef = useRef(null);
  const containerRef = useRef(null);
  
  // Get theme state from Redux
  const isDarkMode = useSelector(state => state.theme.isDarkMode);

  // Camera state
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);
  const [cameraError, setCameraError] = useState("");
  const [capturing, setCapturing] = useState(false);

  // Theme-based styles
  const themeStyles = {
    container: isDarkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900',
    heading: isDarkMode ? 'text-white' : 'text-gray-900',
    uploadArea: isDarkMode ? 'border-gray-600 hover:border-green-400' : 'border-gray-300 hover:border-green-400',
    button: isDarkMode ? 'bg-green-600 hover:bg-green-700 text-white border-green-500' : 'bg-[#0ae979] hover:bg-[#08DF73] text-gray-600 border-[#08DF73]',
    helpText: isDarkMode ? 'text-gray-400' : 'text-gray-500',
    modalBg: isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900',
    modalCloseBtn: isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-600',
    previewCard: isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900',
    selectInput: isDarkMode ? 'bg-gray-600 text-white border-gray-500' : 'bg-white text-gray-900 border-gray-300'
  };

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }
      );
    }
  }, []);

  // CAMERA: Open
  const handleOpenCamera = async () => {
    setCameraError("");
    setShowCamera(true);
    setCapturing(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setCameraError("Unable to access camera: " + err.message);
    }
  };

  // CAMERA: Clean up
  useEffect(() => {
    if (showCamera && videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [showCamera, stream]);

  // CAMERA: Capture Photo
  const handleCapture = () => {
    if (!videoRef.current) return;
    setCapturing(true);
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL("image/jpeg");
    const category = detectCategory();
    onImagesChange([
      ...images,
      {
        id: `${Date.now()}-camera`,
        file: null,
        preview: dataUrl,
        category,
        credits: wasteCategories[category]?.credits || 5,
        name: `Captured_${new Date().toLocaleTimeString()}.jpg`,
      },
    ]);

    setTimeout(() => {
      setShowCamera(false);
      setCapturing(false);
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
    }, 500);
  };

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    const newImages = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        await new Promise((resolve, reject) => {
          reader.onload = (event) => {
            const category = detectCategory();
            newImages.push({
              id: `${Date.now()}-${i}`,
              file,
              preview: event.target.result,
              category,
              credits: wasteCategories[category]?.credits || 5,
              name: file.name,
            });
            resolve();
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      }
    }
    onImagesChange([...images, ...newImages]);
    e.target.value = "";
  };

  const removeImage = (imageId) => {
    const updatedImages = images.filter((img) => img.id !== imageId);
    onImagesChange(updatedImages);
  };

  const changeCategoryManually = (imageId, newCategory) => {
    const updatedImages = images.map((img) =>
      img.id === imageId
        ? {
            ...img,
            category: newCategory,
            credits: wasteCategories[newCategory].credits,
          }
        : img
    );
    onImagesChange(updatedImages);
  };

  const handleChooseImagesClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div ref={containerRef} className={`${themeStyles.container} rounded-3xl p-6 border shadow-sm mb-6 transition-colors duration-300`}>
      <h2 className={`text-2xl font-bold ${themeStyles.heading} mb-6 flex items-center transition-colors duration-300`}>
        <Camera className="w-6 h-6 mr-3 text-green-500" />
        Upload Waste Images
      </h2>

      {/* Upload and Camera Buttons in a Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Choose Images */}
        <div
          className={`border-2 border-dashed ${themeStyles.uploadArea} rounded-2xl px-0 py-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-300`}
          style={{ minHeight: 168 }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          <motion.button
            type="button"
            onClick={handleChooseImagesClick}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.95 }}
            className={`${themeStyles.button} backdrop-blur-xl px-6 py-3 border rounded-full text-sm font-medium transition-colors duration-300 shadow-lg flex items-center space-x-2 mx-auto`}
          >
            <Upload className="w-5 h-5" />
            <span className="text-lg">Choose Images</span>
          </motion.button>
          <p className={`${themeStyles.helpText} text-sm text-center mt-2 px-2 transition-colors duration-300`}>
            Select multiple images at once<br />(JPG, PNG, GIF up to 10MB each)
          </p>
        </div>

        {/* Take Photo */}
        <div
          className={`border-2 border-dashed ${themeStyles.uploadArea} rounded-2xl px-0 py-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-300`}
          style={{ minHeight: 168 }}
        >
          <motion.button
            type="button"
            onClick={handleOpenCamera}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.95 }}
            className={`${themeStyles.button} backdrop-blur-xl px-6 py-3 border rounded-full text-sm font-medium transition-colors duration-300 shadow-lg flex items-center space-x-2 mx-auto`}
          >
            <Camera className="w-5 h-5" />
            <span className="text-lg">Take Photo</span>
          </motion.button>
          <p className={`${themeStyles.helpText} text-sm text-center mt-2 px-2 transition-colors duration-300`}>
            Directly capture with your camera
          </p>
        </div>
      </div>

      {/* CAMERA UI: Modal with Video and Capture Button */}
      <AnimatePresence>
        {showCamera && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={`${themeStyles.modalBg} rounded-2xl p-6 max-w-xs w-full flex flex-col items-center relative transition-colors duration-300`}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <button
                onClick={() => {
                  setShowCamera(false);
                  if (stream) {
                    stream.getTracks().forEach(track => track.stop());
                    setStream(null);
                  }
                  setCameraError("");
                }}
                className={`absolute top-2 right-2 ${themeStyles.modalCloseBtn} rounded-full p-1 transition-colors duration-200`}
                type="button"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="mb-3 w-full aspect-video rounded-lg bg-black overflow-hidden flex items-center justify-center">
                {cameraError ? (
                  <span className="text-red-600 text-sm text-center">{cameraError}</span>
                ) : (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover rounded-lg"
                    style={{ maxHeight: 260 }}
                  />
                )}
              </div>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleCapture}
                disabled={capturing || !!cameraError}
                className="w-full mt-2 bg-gradient-to-r from-green-400 to-emerald-400 text-white font-semibold py-3 rounded-xl shadow-lg transition-all duration-150 disabled:opacity-60"
              >
                {capturing ? "Capturing..." : "Capture"}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Previews */}
      {images.length > 0 && (
        <div className="space-y-4">
          <h3 className={`text-lg font-semibold ${themeStyles.heading} flex items-center transition-colors duration-300`}>
            <Tag className="w-5 h-5 mr-2 text-purple-500" />
            Uploaded Images ({images.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`relative ${themeStyles.previewCard} rounded-2xl p-4 border hover:shadow-md transition-all duration-300`}
              >
                <button
                  onClick={() => removeImage(image.id)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors z-10"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="relative mb-3">
                  <img
                    src={image.preview}
                    alt={image.name}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium truncate">
                    {image.name}
                  </p>
                  <select
                    value={image.category}
                    onChange={(e) =>
                      changeCategoryManually(image.id, e.target.value)
                    }
                    className={`w-full p-2 text-sm border ${themeStyles.selectInput} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-300`}
                  >
                    {Object.entries(wasteCategories).map(([key, category]) => (
                      <option key={key} value={key}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        wasteCategories[image.category].color
                      }`}
                    >
                      {wasteCategories[image.category].name}
                    </span>
                    <span className="text-green-600 font-bold text-sm">
                      +{image.credits} credits
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
