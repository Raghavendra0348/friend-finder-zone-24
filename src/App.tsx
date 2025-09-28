import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { DepartmentSelector } from './components/DepartmentSelector';
import { SemesterSelector } from './components/SemesterSelector';
import { SGPACalculator } from './components/SGPACalculator';
import { Toaster } from './components/ui/toaster';

interface Department {
  id: string;
  name: string;
  fullName: string;
  description: string;
  semesters: string[];
}

type AppState = 'departments' | 'semesters' | 'calculator';

function App() {
  const [currentState, setCurrentState] = useState<AppState>('departments');
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<string>('');

  const handleDepartmentSelect = (department: Department) => {
    setSelectedDepartment(department);
    setCurrentState('semesters');
  };

  const handleSemesterSelect = (semester: string) => {
    setSelectedSemester(semester);
    setCurrentState('calculator');
  };

  const handleBackToDepartments = () => {
    setCurrentState('departments');
    setSelectedDepartment(null);
    setSelectedSemester('');
  };

  const handleBackToSemesters = () => {
    setCurrentState('semesters');
    setSelectedSemester('');
  };

  return (
    <Layout>
      {currentState === 'departments' && (
        <DepartmentSelector onDepartmentSelect={handleDepartmentSelect} />
      )}
      
      {currentState === 'semesters' && selectedDepartment && (
        <SemesterSelector
          department={selectedDepartment}
          onSemesterSelect={handleSemesterSelect}
          onBack={handleBackToDepartments}
        />
      )}
      
      {currentState === 'calculator' && selectedDepartment && selectedSemester && (
        <SGPACalculator
          department={selectedDepartment.name}
          semester={selectedSemester}
          onBack={handleBackToSemesters}
        />
      )}
      
      <Toaster />
    </Layout>
  );
}

export default App;