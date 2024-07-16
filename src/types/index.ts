export interface Prefecture {
  prefCode: number;
  prefName: string;
}

export type PopulationCategory = '総人口' | '年少人口' | '生産年齢人口' | '老年人口';

export interface PopulationData {
  year: number;
  value: number;
}

export interface CategoryPopulationData {
  year: number;
  総人口: number;
  年少人口: number;
  生産年齢人口: number;
  老年人口: number;
}

export interface PrefecturePopulation {
  prefName: string;
  data: PopulationData[];
}

export interface PrefectureCategoryPopulation {
  prefName: string;
  data: CategoryPopulationData[];
}