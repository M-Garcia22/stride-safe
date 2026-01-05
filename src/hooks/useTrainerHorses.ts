import { useState, useEffect, useCallback, useMemo } from 'react';
import { api } from '@/lib/api';
import { TrainerHorse } from '@/types/horse';

interface UseTrainerHorsesOptions {
  /** Whether to fetch on mount */
  fetchOnMount?: boolean;
}

interface UseTrainerHorsesReturn {
  horses: TrainerHorse[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  trainerCode: string | null;
  refetch: () => Promise<void>;
  findByName: (name: string) => TrainerHorse | undefined;
  findById: (id: string) => TrainerHorse | undefined;
}

export function useTrainerHorses({
  fetchOnMount = true,
}: UseTrainerHorsesOptions = {}): UseTrainerHorsesReturn {
  const [horses, setHorses] = useState<TrainerHorse[]>([]);
  const [loading, setLoading] = useState(fetchOnMount);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [trainerCode, setTrainerCode] = useState<string | null>(null);

  const fetchHorses = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await api.getTrainerHorses();

      if (result.error) {
        setError(result.error.message);
        return;
      }

      if (result.data) {
        setHorses(result.data.horses);
        setTotalCount(result.data.meta.total);
        setTrainerCode(result.data.meta.trainerCode);
      }
    } catch (err) {
      setError('Failed to load horses. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (fetchOnMount) {
      fetchHorses();
    }
  }, [fetchOnMount, fetchHorses]);

  // Memoized lookup helpers
  const findByName = useCallback(
    (name: string) => horses.find(h => h.name.toLowerCase() === name.toLowerCase()),
    [horses]
  );

  const findById = useCallback(
    (id: string) => horses.find(h => h.id === id),
    [horses]
  );

  return {
    horses,
    loading,
    error,
    totalCount,
    trainerCode,
    refetch: fetchHorses,
    findByName,
    findById,
  };
}

