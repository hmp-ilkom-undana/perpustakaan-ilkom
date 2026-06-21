import { useEffect, useState } from "react";
import { getBooks } from "../services/catalogApi";

export function useBooks() {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadBooks() {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getBooks();
        if (isMounted) setBooks(data);
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Gagal memuat katalog.");
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadBooks();

    return () => {
      isMounted = false;
    };
  }, []);

  return { books, error, isLoading };
}
