import React from 'react';
import { ArrowLeft, GraduationCap, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

interface Department {
  id: string;
  name: string;
  fullName: string;
  description: string;
  semesters: string[];
}

interface SemesterSelectorProps {
  department: Department;
  onSemesterSelect: (semester: string) => void;
  onBack: () => void;
}

export const SemesterSelector = ({ department, onSemesterSelect, onBack }: SemesterSelectorProps) => {
  const getSemesterPairs = () => {
    const pairs = [];
    for (let i = 0; i < department.semesters.length; i += 2) {
      pairs.push(department.semesters.slice(i, i + 2));
    }
    return pairs;
  };

  const getSemesterColor = (semester: string) => {
    if (semester.includes('PUC')) return 'bg-emerald-500/10 border-emerald-500/30 hover:border-emerald-500/50';
    if (semester.includes('E1')) return 'bg-blue-500/10 border-blue-500/30 hover:border-blue-500/50';
    if (semester.includes('E2')) return 'bg-purple-500/10 border-purple-500/30 hover:border-purple-500/50';
    if (semester.includes('E3')) return 'bg-orange-500/10 border-orange-500/30 hover:border-orange-500/50';
    if (semester.includes('E4')) return 'bg-red-500/10 border-red-500/30 hover:border-red-500/50';
    return 'bg-gray-500/10 border-gray-500/30 hover:border-gray-500/50';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="space-y-4">
        <Button
          variant="ghost"
          onClick={onBack}
          className="text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Departments
        </Button>

        <div className="text-center space-y-3">
          <div className="flex items-center justify-center space-x-3">
            <GraduationCap className="h-8 w-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              {department.name} Semesters
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            {department.fullName}
          </p>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            Select a semester to calculate your SGPA. Choose the semester that matches your current academic progress.
          </p>
        </div>
      </div>

      {/* Semester Grid */}
      <div className="space-y-6">
        {getSemesterPairs().map((pair, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pair.map((semester) => (
              <Card
                key={semester}
                className={`group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl bg-card/80 backdrop-blur-sm ${getSemesterColor(semester)}`}
                onClick={() => onSemesterSelect(semester)}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-primary" />
                      <span className="text-lg font-bold">{semester}</span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Click to start calculating SGPA for {semester}
                  </p>
                  <div className="mt-3 pt-3 border-t border-border/30">
                    <p className="text-xs text-muted-foreground">
                      Department: {department.name}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ))}
      </div>

      {/* Info Card */}
      <Card className="bg-muted/50 border-border/50">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <GraduationCap className="h-6 w-6 text-primary mt-0.5" />
            <div>
              <h3 className="font-semibold mb-2">How to Calculate SGPA</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Select your grades for each subject</li>
                <li>• The system will automatically calculate your SGPA</li>
                <li>• You can save your results for future reference</li>
                <li>• Download your results as PDF or image</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};