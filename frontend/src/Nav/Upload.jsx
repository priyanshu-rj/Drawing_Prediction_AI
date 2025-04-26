import React from 'react';

const Upload = () => {
  return (
    <div
      style={{
        paddingTop: '60px', // adjust if navbar height is different
        height: 'calc(100vh - 60px)',
        width: '100%',
        backgroundColor: '#000', // black background
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <iframe
        src="https://priyanshukr-ml-model.hf.space/?__theme=dark"
        title="ML Model"
        width="90%"
        height="95%"
        frameBorder="0"
        style={{ borderRadius: '12px' }}
        allowFullScreen
      />
    </div>
  );
};

export default Upload;
