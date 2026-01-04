import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { Report } from '@/types/report';

interface UseReportsOptions {
  /** Number of days to fetch reports for */
  days?: number;
  /** Whether to fetch on mount */
  fetchOnMount?: boolean;
  /** Type of reports to fetch: 'trainer' or 'all' */
  type?: 'trainer' | 'all';
}

interface UseReportsReturn {
  reports: Report[];
  loading: boolean;
  error: string | null;
  newReportsCount: number;
  totalCount: number;
  refetch: () => Promise<void>;
}

export function useReports({
  days = 7,
  fetchOnMount = true,
  type = 'trainer'
}: UseReportsOptions = {}): UseReportsReturn {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(fetchOnMount);
  const [error, setError] = useState<string | null>(null);
  const [newReportsCount, setNewReportsCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = type === 'trainer' 
        ? await api.getTrainerReports(days)
        : await api.getAllReports(days);

      if (result.error) {
        setError(result.error.message);
        return;
      }

      if (result.data) {
        setReports(result.data.reports);
        setNewReportsCount(result.data.meta.newCount);
        setTotalCount(result.data.meta.total);
      }
    } catch (err) {
      setError('Failed to load reports. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [days, type]);

  useEffect(() => {
    if (fetchOnMount) {
      fetchReports();
    }
  }, [fetchOnMount, fetchReports]);

  return {
    reports,
    loading,
    error,
    newReportsCount,
    totalCount,
    refetch: fetchReports,
  };
}

