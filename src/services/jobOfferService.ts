import { createClient } from '@/lib/supabase/client';
import { JobOfferCreateCommand, JobOfferUpdateCommand } from '@/types';

const supabase = createClient();

export const jobOfferService = {
  async createJobOffer(jobOfferData: JobOfferCreateCommand) {
    const { data, error } = await supabase
      .from('job_offers')
      .insert([jobOfferData])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }
    return data;
  },

  async getJobOffers() {
    const { data, error } = await supabase.from('job_offers').select('*');

    if (error) {
      throw new Error(error.message);
    }
    return data;
  },

  async getJobOfferById(id: number) {
    const { data, error } = await supabase
      .from('job_offers')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      // Supabase returns an error if no rows are found with .single()
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(error.message);
    }
    return data;
  },

  async updateJobOffer(id: number, jobOfferData: JobOfferUpdateCommand) {
    const { data, error } = await supabase
      .from('job_offers')
      .update(jobOfferData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }
    return data;
  },

  async deleteJobOffer(id: number) {
    const { error } = await supabase.from('job_offers').delete().eq('id', id);

    if (error) {
      throw new Error(error.message);
    }
    return true;
  },
};
