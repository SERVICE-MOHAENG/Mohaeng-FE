import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface RegionData {
  region: string;
  start_date: string;
  end_date: string;
}

export interface SurveyData {
  start_date: string | null;
  end_date: string | null;
  regions: RegionData[];
  people_count: number;
  companion_type: string[];
  travel_themes: string[];
  pace_preference: string;
  planning_preference: string;
  destination_preference: string;
  activity_preference: string;
  priority_preference: string;
  budget_range: string;
  notes: string;
}

interface SurveyContextType {
  surveyData: SurveyData;
  updateSurveyData: (newData: Partial<SurveyData>) => void;
  resetSurvey: () => void;
}

const initialData: SurveyData = {
  start_date: null,
  end_date: null,
  regions: [],
  people_count: 1,
  companion_type: [],
  travel_themes: [],
  pace_preference: 'DENSE',
  planning_preference: 'PLANNED',
  destination_preference: 'TOURIST_SPOTS',
  activity_preference: 'ACTIVE',
  priority_preference: 'EFFICIENCY',
  budget_range: 'LOW',
  notes: '',
};

const SurveyContext = createContext<SurveyContextType | undefined>(undefined);

export const SurveyProvider = ({ children }: { children: ReactNode }) => {
  const [surveyData, setSurveyData] = useState<SurveyData>(initialData);

  const updateSurveyData = (newData: Partial<SurveyData>) => {
    setSurveyData((prev) => ({ ...prev, ...newData }));
  };

  const resetSurvey = () => {
    setSurveyData(initialData);
  };

  return (
    <SurveyContext.Provider
      value={{ surveyData, updateSurveyData, resetSurvey }}
    >
      {children}
    </SurveyContext.Provider>
  );
};

export const useSurvey = () => {
  const context = useContext(SurveyContext);
  if (context === undefined) {
    throw new Error('useSurvey must be used within a SurveyProvider');
  }
  return context;
};
