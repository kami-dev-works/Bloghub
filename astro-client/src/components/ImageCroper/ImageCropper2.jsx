import React, { useState, useRef } from "react";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { canvasPreview } from "./canvasPreview";
import { useDebounceEffect } from "./useDebounceEffect";
import imageCompression from "browser-image-compression";

function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  );
}

export default function ImageCropper2({
  setFileName,
  setfileContant,
  setfinalImg,
  aspectwidth,
  aspectheight,
  onCropComplete,
}) {
  const [imgSrc, setImgSrc] = useState("");
  const previewCanvasRef = useRef(null);
  const imgRef = useRef(null);
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [statusDataBox, setstatusDataBox] = useState(false);

  function onSelectFile(e) {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined);
      setstatusDataBox(true);
      const file = e.target.files[0];
      setFileName(file.name);
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        setImgSrc(reader.result?.toString() || ""),
      );
      reader.readAsDataURL(file);
    }
  }

  function onImageLoad(e) {
    if (aspectwidth) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspectwidth / aspectheight));
    }
  }

  async function onDownloadCropClick() {
    const image = imgRef.current;
    const previewCanvas = previewCanvasRef.current;
    if (!image || !previewCanvas || !completedCrop) return;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const offscreen = new OffscreenCanvas(
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
    );
    const ctx = offscreen.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(
      previewCanvas,
      0,
      0,
      previewCanvas.width,
      previewCanvas.height,
      0,
      0,
      offscreen.width,
      offscreen.height,
    );

    const blob = await offscreen.convertToBlob({ type: "image/png" });
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 512,
      useWebWorker: true,
    };

    const compressedBlob = await imageCompression(blob, options);

    setfileContant(compressedBlob);
    setstatusDataBox(false);
    setfinalImg(imgSrc);

    if (onCropComplete) {
      const croppedImageUrl = URL.createObjectURL(compressedBlob);
      onCropComplete(croppedImageUrl);
    }
  }

  useDebounceEffect(
    async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        canvasPreview(
          imgRef.current,
          previewCanvasRef.current,
          completedCrop,
          scale,
          rotate,
        );
      }
    },
    100,
    [completedCrop, scale, rotate],
  );

  return (
    <div className="w-full">
      {/* Custom Styled Input */}
      <div className="flex items-center justify-center w-full">
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              className="w-8 h-8 mb-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="mb-2 text-sm text-gray-500 font-semibold text-center px-4">
              Click to upload or drag and drop image
            </p>
          </div>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onSelectFile}
          />
        </label>
      </div>

      {/* Tailwind Modal Overlay */}
      {statusDataBox && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
              <h3 className="text-xl font-bold text-gray-800">
                Crop Your Image
              </h3>
              <button
                onClick={() => setstatusDataBox(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-grow">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Side: Cropper */}
                <div className="flex flex-col items-center bg-gray-100 rounded-xl p-4 min-h-[300px] justify-center">
                  <span className="text-xs font-bold text-gray-400 uppercase mb-3">
                    Adjust Crop Area
                  </span>
                  {!!imgSrc && (
                    <ReactCrop
                      crop={crop}
                      onChange={(_, percentCrop) => setCrop(percentCrop)}
                      onComplete={(c) => setCompletedCrop(c)}
                      aspect={aspectwidth / aspectheight}
                      className="max-h-[500px]"
                    >
                      <img
                        ref={imgRef}
                        alt="Crop me"
                        src={imgSrc}
                        style={{
                          transform: `scale(${scale}) rotate(${rotate}deg)`,
                        }}
                        onLoad={onImageLoad}
                        className="max-w-full"
                      />
                    </ReactCrop>
                  )}
                </div>

                {/* Right Side: Preview */}
                <div className="flex flex-col items-center bg-gray-100 rounded-xl p-4 justify-center">
                  <span className="text-xs font-bold text-gray-400 uppercase mb-3">
                    Live Preview
                  </span>
                  {!!completedCrop ? (
                    <div className="flex flex-col items-center">
                      <canvas
                        ref={previewCanvasRef}
                        className="border-2 border-white shadow-lg bg-white"
                        style={{
                          objectFit: "contain",
                          width: completedCrop.width,
                          height: completedCrop.height,
                          maxWidth: "100%",
                          maxHeight: "400px",
                        }}
                      />
                    </div>
                  ) : (
                    <div className="text-gray-400 italic text-sm">
                      Select an area to see preview
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setstatusDataBox(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-600 font-semibold hover:bg-gray-100 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={onDownloadCropClick}
                className="px-8 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all"
              >
                Apply & Save Crop
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
