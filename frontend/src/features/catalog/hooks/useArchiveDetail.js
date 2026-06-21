import { useEffect, useState } from "react";
import { getBookDetail } from "../services/catalogApi";

export function useArchiveDetail(id) {
  const [book, setBook] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadBook() {
      if (!id) return;
      
      setIsLoading(true);
      setError(null);

      try {
        const data = await getBookDetail(id);
        if (isMounted) setBook(data);
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Gagal memuat detail arsip.");
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadBook();

    return () => {
      isMounted = false;
    };
  }, [id]);

  return { book, error, isLoading };
}
