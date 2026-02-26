import React, { useRef, useEffect, useState } from 'react';
import * as faceapi from '@vladmandic/face-api';

const FaceCapture = ({ onCapture, label = "Capture Face" }) => {
    const videoRef = useRef();
    const canvasRef = useRef();
    const [modelsLoaded, setModelsLoaded] = useState(false);
    const [captureComplete, setCaptureComplete] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadModels = async () => {
            const MODEL_URL = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights';
            try {
                await Promise.all([
                    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                    faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
                ]);
                setModelsLoaded(true);
            } catch (err) {
                console.error("Error loading face-api models:", err);
                setError("Failed to load facial recognition models.");
            }
        };
        loadModels();
    }, []);

    const startVideo = () => {
        navigator.mediaDevices.getUserMedia({ video: {} })
            .then(stream => {
                videoRef.current.srcObject = stream;
            })
            .catch(err => {
                console.error("Error accessing webcam:", err);
                setError("Webcam access denied.");
            });
    };

    const handleVideoPlay = () => {
        if (!canvasRef.current || !videoRef.current) return;

        const canvas = canvasRef.current;
        const displaySize = { width: videoRef.current.videoWidth, height: videoRef.current.videoHeight };
        faceapi.matchDimensions(canvas, displaySize);

        const interval = setInterval(async () => {
            if (!videoRef.current) {
                clearInterval(interval);
                return;
            }
            const detections = await faceapi.detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();

            if (detections) {
                const resizedDetections = faceapi.resizeResults(detections, displaySize);
                const ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                faceapi.draw.drawDetections(canvas, resizedDetections);
            }
        }, 100);

        return () => clearInterval(interval);
    };

    const captureFace = async () => {
        if (!videoRef.current) return;

        setError(null);
        const detections = await faceapi.detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();

        if (detections) {
            const descriptor = Array.from(detections.descriptor);
            setCaptureComplete(true);
            onCapture(descriptor);
        } else {
            setError("Face not detected. Please look directly at the camera.");
        }
    };

    if (error) return <div className="text-error text-sm font-medium p-2 bg-error/10 rounded-lg">{error}</div>;

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="relative rounded-2xl overflow-hidden bg-black aspect-video w-full max-w-[320px] shadow-lg">
                {!modelsLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-base-300">
                        <span className="loading loading-spinner text-primary"></span>
                    </div>
                )}
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    onPlay={handleVideoPlay}
                    className="w-full h-full object-cover"
                />
                <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
            </div>

            {!captureComplete ? (
                <button
                    type="button"
                    onClick={modelsLoaded ? (videoRef.current?.srcObject ? captureFace : startVideo) : null}
                    disabled={!modelsLoaded}
                    className="btn btn-primary btn-sm rounded-full px-6"
                >
                    {modelsLoaded ? (videoRef.current?.srcObject ? label : "Enable Camera") : "Loading Models..."}
                </button>
            ) : (
                <div className="flex items-center gap-2 text-success font-bold text-sm">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                    Face Data Captured Successfully
                    <button type="button" onClick={() => setCaptureComplete(false)} className="text-xs text-primary underline ml-2">Retake</button>
                </div>
            )}
        </div>
    );
};

export default FaceCapture;
