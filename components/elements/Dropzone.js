'use client';

import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import randomstring from 'randomstring';
import fetch from 'isomorphic-fetch';
import imageCompression from 'browser-image-compression';

const MyDropzone = ({
  disabled,
  label,
  path = '/',
  onUpload,
  multiple = true,
  children,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(undefined);

  const onDrop = async (acceptedFiles) => {
    setLoading(true);
    setError(undefined);

    if (acceptedFiles.length > 0) {
      const uploadPromises = acceptedFiles.map(async (file) => {
        try {
          const imageMimeTypes = [
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/bmp',
            'image/tiff',
            'image/webp',
          ];
          if (!imageMimeTypes.includes(file.type)) {
            setError('Please upload images only.');
            setLoading(false);
            return null;
          }

          // Log original file size in MB
          console.log(
            `Original file size: ${(file.size / 1024 / 1024).toFixed(2)} MB`,
          );

          // Compress the image
          const compressedFile = await imageCompression(file, {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
          });

          // Log compressed file size in MB
          console.log(
            `Compressed file size: ${(
              compressedFile.size /
              1024 /
              1024
            ).toFixed(2)} MB`,
          );

          const fileName = compressedFile.name;
          const fileKey = `${path}${randomstring.generate(3)}-${fileName}`;
          const fileType = compressedFile.type;

          // Send the mutation request
          const response = await fetch('/api/graphql', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              query: `
                mutation SignFileUpload($fileKey: String!, $fileType: String!) {
                  signFileUpload(fileKey: $fileKey, fileType: $fileType) {
                    fileUrl
                    signedUrl
                  }
                }
              `,
              variables: { fileKey, fileType },
            }),
          });

          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.message || 'Upload failed');
          }

          const { signedUrl, fileUrl } = data.data.signFileUpload;

          // Upload the image
          await fetch(signedUrl, {
            method: 'PUT',
            body: compressedFile,
          });

          return {
            fileUrl,
            fileKey,
            fileName,
            fileType,
            fileSize: compressedFile.size,
          };
        } catch (err) {
          console.error('Upload error', err);
          setLoading(false);
          return null;
        }
      });

      Promise.all(uploadPromises).then((uploadedFiles) => {
        const validFiles = uploadedFiles.filter((file) => file !== null);
        onUpload(multiple ? validFiles : validFiles[0]);
        setLoading(false);
      });
      return uploadPromises;
    }
    setLoading(false);
    return [];
  };

  const onDropRejected = (data) => {
    if (data.length > 0) {
      setError('Please upload files smaller than 5mb');
      setLoading(false);
    }
  };

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop,
    onDropRejected,
    accept:
      'image/jpeg, image/jpg, image/png, image/bmp, image/tiff, image/webp',
    maxSize: 105000000,
    multiple,
  });

  const getColor = () => {
    if (isDragAccept) {
      return 'border-green-500';
    }
    if (isDragReject) {
      return 'border-red-500';
    }
    if (isDragActive) {
      return 'border-blue-500';
    }
    return 'border-gray-300';
  };

  if (children) {
    return (
      <span
        {...getRootProps({
          className: `cursor-pointer ${getColor()}`,
        })}
      >
        <input {...getInputProps({ capture: 'environment' })} />
        {children}
      </span>
    );
  }

  return (
    <div className="relative z-[9999]">
      <label className="block text-sm font-medium">{label}</label>
      {!disabled ? (
        <div
          {...getRootProps({
            className: `flex flex-col items-center p-8 border-2 border-dashed rounded-md transition-colors ${getColor()} bg-transparent cursor-pointer `,
          })}
        >
          <input {...getInputProps()} />
          <div className="">+ Drag and capture images</div>
          <small className="">or click to select files</small>
          {loading && <small className="text-red-500">Uploading...</small>}
          {error && <small className="text-red-500">{error}</small>}
        </div>
      ) : (
        <div className="cursor-not-allowed bg-transparent">
          <div className="">+ Drag and drop files here</div>
          <small className="">or click to select files</small>
          {loading && <small className="text-red-500">Uploading...</small>}
          {error && <small className="text-red-500">{error}</small>}
        </div>
      )}
    </div>
  );
};

export default MyDropzone;
