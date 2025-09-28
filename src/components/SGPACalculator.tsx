import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Download, BarChart3, Calculator } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Subject {
  name: string;
  credits: number;
  displayName: string;
}

interface SGPACalculatorProps {
  department: string;
  semester: string;
  onBack: () => void;
}

// Subject configurations for different departments and semesters
const subjectConfigs: Record<string, Record<string, Subject[]>> = {
  cse: {
    'E1S1': [
      { name: 'PSPC', credits: 4, displayName: 'PSPC' },
      { name: 'BEEE', credits: 4, displayName: 'BEEE' },
      { name: 'C&LA', credits: 4, displayName: 'C&LA' },
      { name: 'PSPCLAB', credits: 1.5, displayName: 'PSPC LAB' },
      { name: 'BEEELAB', credits: 1.5, displayName: 'BEEE LAB' },
      { name: 'ENGLISH', credits: 2.5, displayName: 'ENGLISH' },
      { name: 'EGCD', credits: 2.5, displayName: 'EGCD' }
    ]
  }
  // Add more configurations as needed
};

const gradePoints: Record<string, number> = {
  'EX': 0,
  'A': 10,
  'B': 8,
  'C': 6,
  'D': 4,
  'E': 2
};

const gradeOptions = [
  { value: 'EX', label: 'EX (0)', points: 0 },
  { value: 'A', label: 'A (10)', points: 10 },
  { value: 'B', label: 'B (8)', points: 8 },
  { value: 'C', label: 'C (6)', points: 6 },
  { value: 'D', label: 'D (4)', points: 4 },
  { value: 'E', label: 'E (2)', points: 2 }
];

export const SGPACalculator = ({ department, semester, onBack }: SGPACalculatorProps) => {
  const [grades, setGrades] = useState<Record<string, string>>({});
  const [sgpa, setSgpa] = useState<number | null>(null);
  const [resultStatus, setResultStatus] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Get subjects for the current department and semester
  const subjects = subjectConfigs[department.toLowerCase()]?.[semester] || [];

  // Initialize grades
  useEffect(() => {
    const initialGrades: Record<string, string> = {};
    subjects.forEach(subject => {
      initialGrades[subject.name] = 'EX';
    });
    setGrades(initialGrades);
  }, [subjects]);

  // Calculate SGPA whenever grades change
  useEffect(() => {
    calculateSGPA();
  }, [grades, subjects]);

  const calculateSGPA = () => {
    if (subjects.length === 0) return;

    let totalCreditsLost = 0;
    let totalCredits = 0;
    const gradeDistribution: Record<string, number> = {
      EX: 0, A: 0, B: 0, C: 0, D: 0, E: 0
    };

    subjects.forEach(subject => {
      const grade = grades[subject.name] || 'EX';
      const gradePoint = gradePoints[grade];
      const creditsLost = (gradePoint / 10) * subject.credits;
      
      totalCreditsLost += creditsLost;
      totalCredits += subject.credits;
      gradeDistribution[grade]++;
    });

    const calculatedSGPA = totalCredits > 0 ? (totalCredits - totalCreditsLost) / totalCredits * 10 : 0;
    setSgpa(Number(calculatedSGPA.toFixed(2)));

    // Determine result status
    if (calculatedSGPA >= 7.5) {
      setResultStatus('Distinction');
    } else if (calculatedSGPA >= 6.5) {
      setResultStatus('First Class');
    } else if (calculatedSGPA >= 5.0) {
      setResultStatus('Second Class');
    } else {
      setResultStatus('Need Improvement');
    }
  };

  const handleGradeChange = (subjectName: string, grade: string) => {
    setGrades(prev => ({
      ...prev,
      [subjectName]: grade
    }));
  };

  const saveResults = async () => {
    if (!sgpa) {
      toast({
        title: "Error",
        description: "Please calculate SGPA first",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to save your results",
          variant: "destructive"
        });
        return;
      }

      const resultData = {
        user_id: user.id,
        result_type: 'SGPA',
        branch: department,
        semester: semester,
        grade_data: grades,
        calculated_value: sgpa,
        result_status: resultStatus
      };

      const { error } = await supabase
        .from('user_results')
        .insert(resultData);

      if (error) throw error;

      toast({
        title: "✅ Results Saved!",
        description: `Your SGPA of ${sgpa} has been saved successfully`
      });
    } catch (error) {
      console.error('Error saving results:', error);
      toast({
        title: "Error",
        description: "Failed to save results. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const downloadResults = () => {
    toast({
      title: "Download Feature",
      description: "PDF download functionality will be implemented soon",
    });
  };

  const getResultColor = () => {
    if (!sgpa) return 'text-muted-foreground';
    if (sgpa >= 7.5) return 'text-green-500';
    if (sgpa >= 6.5) return 'text-blue-500';
    if (sgpa >= 5.0) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="space-y-4">
        <Button
          variant="ghost"
          onClick={onBack}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Semesters
        </Button>

        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-3">
            <Calculator className="h-8 w-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              {department.toUpperCase()} - {semester}
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            SGPA Calculator
          </p>
        </div>
      </div>

      {/* Calculator Form */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Enter Your Grades</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            {subjects.map((subject) => (
              <div key={subject.name} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div className="flex-1">
                  <Label htmlFor={subject.name} className="text-sm font-medium">
                    {subject.displayName}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Credits: {subject.credits}
                  </p>
                </div>
                <div className="w-32">
                  <Select
                    value={grades[subject.name] || 'EX'}
                    onValueChange={(value) => handleGradeChange(subject.name, value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {gradeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
          </div>

          {/* Results Section */}
          {sgpa !== null && (
            <div className="text-center space-y-4 p-6 bg-muted/20 rounded-lg">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Your SGPA</h3>
                <div className={`text-4xl font-bold ${getResultColor()}`}>
                  {sgpa}
                </div>
                <p className={`text-lg font-medium ${getResultColor()}`}>
                  {resultStatus}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center space-x-4 pt-4">
                <Button
                  onClick={saveResults}
                  disabled={isSaving}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? 'Saving...' : '💾 Save Results'}
                </Button>
                <Button
                  variant="outline"
                  onClick={downloadResults}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Section */}
      <Card className="bg-muted/50 border-border/50">
        <CardContent className="p-6">
          <div className="space-y-3">
            <h3 className="font-semibold">SGPA Grading Scale</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
              <div className="flex justify-between">
                <span>EX (Excellent):</span>
                <span className="font-medium">10 points</span>
              </div>
              <div className="flex justify-between">
                <span>A (Very Good):</span>
                <span className="font-medium">8 points</span>
              </div>
              <div className="flex justify-between">
                <span>B (Good):</span>
                <span className="font-medium">6 points</span>
              </div>
              <div className="flex justify-between">
                <span>C (Average):</span>
                <span className="font-medium">4 points</span>
              </div>
              <div className="flex justify-between">
                <span>D (Below Average):</span>
                <span className="font-medium">2 points</span>
              </div>
              <div className="flex justify-between">
                <span>E (Poor):</span>
                <span className="font-medium">0 points</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};