import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Sparkles, Users, Clock, Lightbulb, Copy, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import AuthDialog from "@/components/AuthDialog";

interface FormData {
  idea: string;
  timeFrame: string;
  skillSet: string;
  teamSize: string;
}

interface AIResponse {
  validation: {
    isFeasible: boolean;
    reasoning: string;
    score: number;
  };
  roadmap: {
    phase: string;
    tasks: string[];
    estimatedTime: string;
    tools: string[];
  }[];
  futureScope: {
    expansion: string[];
    monetization: string[];
  };
}

const Index = () => {
  const [formData, setFormData] = useState<FormData>({
    idea: "",
    timeFrame: "",
    skillSet: "",
    teamSize: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AIResponse | null>(null);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generatePrompt = (data: FormData) => {
    return `You are HackBuddy, an AI mentor for hackathon participants. Analyze this hackathon project and provide a structured response in JSON format.

Project Details:
- Idea: ${data.idea}
- Time Available: ${data.timeFrame}
- Team Size: ${data.teamSize} people
- Skill Set: ${data.skillSet}

Please respond with a JSON object containing:
1. "validation" object with:
   - "isFeasible" (boolean)
   - "reasoning" (string explaining why feasible/not feasible)
   - "score" (number 1-10 for overall project viability)

2. "roadmap" array with phases containing:
   - "phase" (string - phase name)
   - "tasks" (array of specific tasks)
   - "estimatedTime" (string - time estimate)
   - "tools" (array of recommended tools/technologies)

3. "futureScope" object with:
   - "expansion" (array of future feature ideas)
   - "monetization" (array of potential revenue streams)

Consider beginner-friendly approaches and realistic time constraints. Be encouraging but honest about feasibility.`;
  };

  const analyzeProject = async () => {
    if (!formData.idea.trim() || !formData.timeFrame.trim() || !formData.skillSet.trim() || !formData.teamSize.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields before analyzing your project.",
        variant: "destructive"
      });
      return;
    }

    // Check if user is authenticated
    if (!user) {
      setAuthDialogOpen(true);
      toast({
        title: "Authentication Required",
        description: "Please sign in to analyze your project.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyCdJSfrUN8DIZZta1N8oOvddW3ZwC_uSgc`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: generatePrompt(formData)
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to analyze project');
      }

      const data = await response.json();
      const aiText = data.candidates[0].content.parts[0].text;
      
      // Extract JSON from the response
      const jsonMatch = aiText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsedResult = JSON.parse(jsonMatch[0]);
        setResult(parsedResult);
        toast({
          title: "Analysis Complete!",
          description: "Your project has been analyzed by HackBuddy AI.",
        });
      } else {
        throw new Error('Could not parse AI response');
      }
    } catch (error) {
      console.error('Error analyzing project:', error);
      toast({
        title: "Analysis Failed",
        description: "There was an error analyzing your project. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const exportAsMarkdown = () => {
    if (!result) return;

    const markdown = `# HackBuddy Analysis Report

## Project Idea
${formData.idea}

## Project Details
- **Time Frame:** ${formData.timeFrame}
- **Team Size:** ${formData.teamSize} people
- **Skill Set:** ${formData.skillSet}

## Validation Results
**Feasibility:** ${result.validation.isFeasible ? '✅ Feasible' : '❌ Not Feasible'}
**Score:** ${result.validation.score}/10

**Reasoning:** ${result.validation.reasoning}

## Development Roadmap
${result.roadmap.map(phase => `
### ${phase.phase}
**Estimated Time:** ${phase.estimatedTime}

**Tasks:**
${phase.tasks.map(task => `- ${task}`).join('\n')}

**Recommended Tools:**
${phase.tools.map(tool => `- ${tool}`).join('\n')}
`).join('\n')}

## Future Scope

### Expansion Ideas
${result.futureScope.expansion.map(idea => `- ${idea}`).join('\n')}

### Monetization Opportunities
${result.futureScope.monetization.map(opportunity => `- ${opportunity}`).join('\n')}

---
*Generated by HackBuddy - Your Hackathon AI Mentor*`;

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hackbuddy-analysis.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Exported!",
      description: "Your analysis has been downloaded as a Markdown file.",
    });
  };

  const copyToClipboard = () => {
    if (!result) return;
    
    const text = `HackBuddy Analysis Report\n\nValidation: ${result.validation.isFeasible ? 'Feasible' : 'Not Feasible'} (${result.validation.score}/10)\nReasoning: ${result.validation.reasoning}\n\nRoadmap:\n${result.roadmap.map(phase => `${phase.phase}: ${phase.tasks.join(', ')}`).join('\n')}`;
    
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Analysis copied to clipboard.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <Header />
      
      <div className="max-w-4xl mx-auto p-4 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 py-8">
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your Hackathon AI Mentor - Validate ideas and get structured roadmaps to build winning MVPs
          </p>
        </div>

        {/* Form */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Tell us about your hackathon project</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="idea" className="flex items-center gap-2 text-lg font-medium">
                <Lightbulb className="h-5 w-5" />
                What is your hackathon idea?
              </Label>
              <Textarea
                id="idea"
                placeholder="Describe your project idea in detail..."
                value={formData.idea}
                onChange={(e) => handleInputChange('idea', e.target.value)}
                className="min-h-[120px] resize-none"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="timeFrame" className="flex items-center gap-2 font-medium">
                  <Clock className="h-4 w-4" />
                  Time Available
                </Label>
                <Input
                  id="timeFrame"
                  placeholder="e.g., 48 hours, 3 days"
                  value={formData.timeFrame}
                  onChange={(e) => handleInputChange('timeFrame', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="teamSize" className="flex items-center gap-2 font-medium">
                  <Users className="h-4 w-4" />
                  Team Size
                </Label>
                <Input
                  id="teamSize"
                  type="number"
                  placeholder="Number of people"
                  value={formData.teamSize}
                  onChange={(e) => handleInputChange('teamSize', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="skillSet" className="font-medium">
                  Skill Set
                </Label>
                <Textarea
                  id="skillSet"
                  placeholder="List your team's skills..."
                  value={formData.skillSet}
                  onChange={(e) => handleInputChange('skillSet', e.target.value)}
                  className="resize-none"
                  rows={3}
                />
              </div>
            </div>

            <Button 
              onClick={analyzeProject}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-6 text-lg font-medium"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing your project...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Analyze Project with AI
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        {result && (
          <div className="space-y-6">
            {/* Validation */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {result.validation.isFeasible ? '✅' : '❌'}
                  Validation Results
                  <span className="ml-auto text-lg font-bold text-purple-600">
                    {result.validation.score}/10
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{result.validation.reasoning}</p>
              </CardContent>
            </Card>

            {/* Roadmap */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Development Roadmap</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {result.roadmap.map((phase, index) => (
                    <div key={index} className="border-l-4 border-purple-500 pl-6 space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold text-gray-800">{phase.phase}</h3>
                        <span className="text-sm font-medium text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
                          {phase.estimatedTime}
                        </span>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">Tasks:</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-600">
                          {phase.tasks.map((task, taskIndex) => (
                            <li key={taskIndex}>{task}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">Recommended Tools:</h4>
                        <div className="flex flex-wrap gap-2">
                          {phase.tools.map((tool, toolIndex) => (
                            <span key={toolIndex} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Future Scope */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Future Scope</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Expansion Ideas</h3>
                    <ul className="space-y-2">
                      {result.futureScope.expansion.map((idea, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-green-500 mt-1">•</span>
                          <span className="text-gray-700">{idea}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Monetization Opportunities</h3>
                    <ul className="space-y-2">
                      {result.futureScope.monetization.map((opportunity, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-blue-500 mt-1">•</span>
                          <span className="text-gray-700">{opportunity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Export Options */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="flex justify-center gap-4">
                  <Button onClick={copyToClipboard} variant="outline" className="flex items-center gap-2">
                    <Copy className="h-4 w-4" />
                    Copy to Clipboard
                  </Button>
                  <Button onClick={exportAsMarkdown} className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700">
                    <Download className="h-4 w-4" />
                    Export as Markdown
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Auth Dialog for when user tries to analyze without being logged in */}
      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen}>
        <div />
      </AuthDialog>
    </div>
  );
};

export default Index;
