
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Target, Users, Clock } from "lucide-react";
import Header from "@/components/Header";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <Header />
      
      <div className="max-w-4xl mx-auto p-4 space-y-8">
        <div className="text-center space-y-4 py-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            About HackBuddy
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your AI-powered mentor designed to help hackathon participants validate ideas, 
            create structured roadmaps, and build winning MVPs within tight time constraints.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-6 w-6 text-purple-600" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                To empower hackathon participants with AI-driven insights that help them 
                validate their ideas, plan efficiently, and maximize their chances of success 
                within limited timeframes.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-blue-600" />
                How It Works
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                Simply describe your hackathon project, team size, skills, and time constraints. 
                Our AI analyzes feasibility and generates a detailed roadmap with tasks, 
                tools, and timeline recommendations.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-6 w-6 text-green-600" />
                For Teams
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                Whether you're a solo developer or part of a team, HackBuddy adapts its 
                recommendations based on your collective skills and helps coordinate 
                development phases effectively.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-6 w-6 text-orange-600" />
                Time-Aware
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                Our AI understands hackathon time constraints and provides realistic, 
                achievable roadmaps that account for your available time and skill level, 
                ensuring you can deliver a working MVP.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-center">Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <h3 className="font-semibold text-purple-600 mb-2">Idea Validation</h3>
                <p className="text-gray-600 text-sm">
                  Get honest feedback on feasibility and innovation potential
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-blue-600 mb-2">Smart Roadmaps</h3>
                <p className="text-gray-600 text-sm">
                  Receive structured development phases with time estimates
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-green-600 mb-2">Future Planning</h3>
                <p className="text-gray-600 text-sm">
                  Explore expansion opportunities and monetization strategies
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default About;
