import React, { useState, useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import { SvgXml } from 'react-native-svg';

const SvgFromUri = ({ uri, width = 50, height = 50 }) => {
  const [svgXml, setSvgXml] = useState(null);

  useEffect(() => {
    if (!uri) return;

    const fetchSvg = async () => {
      try {
        const response = await fetch(uri);
        const text = await response.text();
        setSvgXml(text);
      } catch (error) {
        console.error('Error fetching SVG:', error);
      }
    };

    fetchSvg();
  }, [uri]);

  if (!svgXml) {
    return <ActivityIndicator size="small" color="#999" />;
  }

  return <SvgXml xml={svgXml} width={width} height={height} />;
};

export default SvgFromUri;
