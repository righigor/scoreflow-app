export interface CampeonatoType {
  id: string;
  name: string;
  slug: string;
  location: string | null;
  start_date: string;
  end_date: string;
  status: 'UPCOMING' | 'LIVE' | 'FINISHED';
}