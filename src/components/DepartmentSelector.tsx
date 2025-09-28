import React, { useState } from 'react';
import { Search, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface Department {
  id: string;
  name: string;
  fullName: string;
  description: string;
  semesters: string[];
}

const departments: Department[] = [
  {
    id: 'puc-mpc',
    name: 'MPC',
    fullName: 'Mathematics, Physics, Chemistry',
    description: 'Pre-University Course with MPC',
    semesters: ['PUC 1st Year', 'PUC 2nd Year']
  },
  {
    id: 'puc-mbipc',
    name: 'MBIPC',
    fullName: 'Mathematics, Biology, Physics, Chemistry',
    description: 'Pre-University Course with MBIPC',
    semesters: ['PUC 1st Year', 'PUC 2nd Year']
  },
  {
    id: 'cse',
    name: 'CSE',
    fullName: 'Computer Science Engineering',
    description: 'Bachelor of Technology in Computer Science',
    semesters: ['E1S1', 'E1S2', 'E2S1', 'E2S2', 'E3S1', 'E3S2', 'E4S1', 'E4S2']
  },
  {
    id: 'ece',
    name: 'ECE',
    fullName: 'Electronics & Communication Engineering',
    description: 'Bachelor of Technology in Electronics',
    semesters: ['E1S1', 'E1S2', 'E2S1', 'E2S2', 'E3S1', 'E3S2', 'E4S1', 'E4S2']
  },
  {
    id: 'civil',
    name: 'CIVIL',
    fullName: 'Civil Engineering',
    description: 'Bachelor of Technology in Civil Engineering',
    semesters: ['E1S1', 'E1S2', 'E2S1', 'E2S2', 'E3S1', 'E3S2', 'E4S1', 'E4S2']
  },
  {
    id: 'mech',
    name: 'MECH',
    fullName: 'Mechanical Engineering',
    description: 'Bachelor of Technology in Mechanical Engineering',
    semesters: ['E1S1', 'E1S2', 'E2S1', 'E2S2', 'E3S1', 'E3S2', 'E4S1', 'E4S2']
  },
  {
    id: 'mme',
    name: 'MME',
    fullName: 'Metallurgical & Materials Engineering',
    description: 'Bachelor of Technology in Metallurgy',
    semesters: ['E1S1', 'E1S2', 'E2S1', 'E2S2', 'E3S1', 'E3S2', 'E4S1', 'E4S2']
  },
  {
    id: 'chemical',
    name: 'CHEMICAL',
    fullName: 'Chemical Engineering',
    description: 'Bachelor of Technology in Chemical Engineering',
    semesters: ['E1S1', 'E1S2', 'E2S1', 'E2S2', 'E3S1', 'E3S2', 'E4S1', 'E4S2']
  },
  {
    id: 'eee',
    name: 'EEE',
    fullName: 'Electrical & Electronics Engineering',
    description: 'Bachelor of Technology in Electrical Engineering',
    semesters: ['E1S1', 'E1S2', 'E2S1', 'E2S2', 'E3S1', 'E3S2', 'E4S1', 'E4S2']
  }
];

interface DepartmentSelectorProps {
  onDepartmentSelect: (department: Department) => void;
}

export const DepartmentSelector = ({ onDepartmentSelect }: DepartmentSelectorProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const filteredDepartments = departments.filter(dept =>
    dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dept.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dept.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query && !searchHistory.includes(query)) {
      const newHistory = [query, ...searchHistory.slice(0, 4)];
      setSearchHistory(newHistory);
      localStorage.setItem('rgukt-searches', JSON.stringify(newHistory));
    }
  };

  const handleDepartmentClick = (department: Department) => {
    handleSearch(department.name.toLowerCase());
    onDepartmentSelect(department);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Search Section */}
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            Select Department
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose your academic department to calculate SGPA and CGPA with precision
          </p>
        </div>

        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search departments..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 h-12 text-base bg-background/50 backdrop-blur-sm border-border/50"
          />
        </div>

        {/* Search History */}
        {searchHistory.length > 0 && searchQuery === '' && (
          <div className="flex flex-wrap gap-2 justify-center">
            {searchHistory.map((item, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="cursor-pointer hover:bg-secondary/80 transition-colors"
                onClick={() => handleSearch(item)}
              >
                {item}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDepartments.map((department) => (
          <Card
            key={department.id}
            className="group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl bg-card/80 backdrop-blur-sm border-border/50 hover:border-primary/50"
            onClick={() => handleDepartmentClick(department)}
          >
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-lg">
                <span className="font-bold text-primary">{department.name}</span>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <h3 className="font-semibold text-foreground">{department.fullName}</h3>
                <p className="text-sm text-muted-foreground mt-1">{department.description}</p>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">Available Semesters:</p>
                <div className="flex flex-wrap gap-1">
                  {department.semesters.slice(0, 4).map((semester, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {semester}
                    </Badge>
                  ))}
                  {department.semesters.length > 4 && (
                    <Badge variant="outline" className="text-xs">
                      +{department.semesters.length - 4} more
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDepartments.length === 0 && searchQuery && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">
            No departments found for "{searchQuery}"
          </p>
          <Button
            variant="ghost"
            onClick={() => setSearchQuery('')}
            className="mt-4 text-primary hover:text-primary/80"
          >
            Clear search
          </Button>
        </div>
      )}
    </div>
  );
};