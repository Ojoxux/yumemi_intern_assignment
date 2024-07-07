export interface Prefecture {
    prefCode: number;
    prefName: string;
  }
  
  export interface PopulationData {
    year: number;
    value: number;
  }
  
  export interface PrefecturePopulation {
    prefName: string;
    data: PopulationData[];
  }