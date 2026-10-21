import { useState, useEffect, useCallback } from 'react';

/**
 * Custom Hook useFetch lấy dữ liệu từ API
 * Theo chuẩn slide Buổi 9 - Slide 33
 * @param {string} url - Đường dẫn API (mockapi hoặc endpoint khác)
 * @returns {{ data: any, setData: Function, loading: boolean, error: string|null, refetch: Function }}
 */
export default function useFetch(url) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!url) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const controller = new AbortController();
    const { signal } = controller;

    try {
      const res = await fetch(url, { signal });
      if (!res.ok) {
        throw new Error(`Lỗi kết nối API: HTTP ${res.status} (${res.statusText || 'Không tìm thấy dữ liệu'})`);
      }
      const json = await res.json();
      setData(json);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message || 'Đã có lỗi xảy ra khi tải dữ liệu');
      }
    } finally {
      setLoading(false);
    }

    return () => {
      controller.abort();
    };
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, setData, loading, error, refetch: fetchData };
}
