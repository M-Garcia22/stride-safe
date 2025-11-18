import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Database } from '@/lib/supabase';

type Horse = Database['public']['Tables']['horses']['Row'];
type HorseInsert = Database['public']['Tables']['horses']['Insert'];
type HorseUpdate = Database['public']['Tables']['horses']['Update'];

interface HorseWithRelations extends Horse {
  trainer?: {
    id: string;
    name: string;
    email: string;
  };
  vet?: {
    id: string;
    name: string;
    email: string;
  } | null;
  track?: {
    id: string;
    name: string;
  } | null;
}

/**
 * Hook to fetch all horses with related trainer, vet, and track data
 */
export const useHorses = () => {
  return useQuery({
    queryKey: ['horses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('horses')
        .select(`
          *,
          trainer:users!horses_trainer_id_fkey(id, name, email),
          vet:users!horses_vet_id_fkey(id, name, email),
          track:tracks(id, name)
        `)
        .order('name', { ascending: true });

      if (error) throw error;
      return data as HorseWithRelations[];
    },
  });
};

/**
 * Hook to fetch a single horse by ID
 */
export const useHorse = (horseId: string | null) => {
  return useQuery({
    queryKey: ['horses', horseId],
    queryFn: async () => {
      if (!horseId) return null;

      const { data, error } = await supabase
        .from('horses')
        .select(`
          *,
          trainer:users!horses_trainer_id_fkey(id, name, email),
          vet:users!horses_vet_id_fkey(id, name, email),
          track:tracks(id, name)
        `)
        .eq('id', horseId)
        .single();

      if (error) throw error;
      return data as HorseWithRelations;
    },
    enabled: !!horseId,
  });
};

/**
 * Hook to create a new horse
 */
export const useCreateHorse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (horse: HorseInsert) => {
      const { data, error } = await supabase
        .from('horses')
        .insert(horse)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['horses'] });
    },
  });
};

/**
 * Hook to update a horse
 */
export const useUpdateHorse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: HorseUpdate }) => {
      const { data, error } = await supabase
        .from('horses')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['horses'] });
      queryClient.invalidateQueries({ queryKey: ['horses', variables.id] });
    },
  });
};

/**
 * Hook to delete a horse
 */
export const useDeleteHorse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (horseId: string) => {
      const { error } = await supabase
        .from('horses')
        .delete()
        .eq('id', horseId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['horses'] });
    },
  });
};

