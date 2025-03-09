import { Link } from "react-router-dom";
import {
  Brain,
  Sparkles,
  Network,
  Lock,
  ChevronRight,
  ArrowRight,
  ChevronDown,
  Star,
  Zap,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import one from "../assets/1.jpg";
import two from "../assets/2.jpg";
import three from "../assets/3.jpg";
import bg from "../assets/bg.png";

const Home = () => {
  return (
    <div className="bg-background" style={{ height: "calc(100vh - 6rem)" }}>
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-[2.5rem] pb-[3.5rem]">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 space-y-8">
            <div className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-primary mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">AI-Powered Learning</span>
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Transform Concepts into
              <span className="gradient-text block mt-2">Visual Knowledge</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl">
              Short on time before an exam? Want to explore a topic with control
              in your hands? Get your hands dirty with our Quick Concept
              walkthrough solution with additional easy examples.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <Link to="/mindmap">
                <Button className="bg-gradient-to-r from-primary to-purple-400 hover:from-primary/90 hover:to-purple-500 text-white px-8 py-6 text-lg rounded-xl shadow-lg flex items-center gap-2 w-full sm:w-auto">
                  <Sparkles className="w-5 h-5" />
                  Start Exploring
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="https://www.youtube.com/watch?v=kXfbsfRVgq8&list=RDkXfbsfRVgq8&start_radio=1">
                <Button
                  variant="outline"
                  className="text-gray-300 hover:text-white border-white/20 hover:bg-white/5 px-6 text-lg w-full sm:w-auto"
                >
                  Watch Demo
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-4 pt-6">
              <div className="flex items-center -space-x-2">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center ring-2 ring-background">
                  <img
                    src={one || "/placeholder.svg"}
                    alt=""
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center ring-2 ring-background">
                  <img
                    src={two || "/placeholder.svg"}
                    alt=""
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center ring-2 ring-background">
                  <img
                    src={three || "/placeholder.svg"}
                    alt=""
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>
              <p className="text-sm text-gray-400">
                Join <span className="font-semibold text-white">2,000+</span>{" "}
                knowledge explorers
              </p>
            </div>
          </div>
          <div className="flex-1 relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/30 to-purple-400/30 rounded-2xl blur-xl opacity-50 pulse-glow"></div>
            <img
              src={bg || "/placeholder.svg"}
              className="relative rounded-xl object-cover h-[80%] border border-white/10 shadow-2xl"
            />
          </div>
        </div>
      </div>

      {/* Down Arrow */}
      <div className="flex justify-center py-8">
        <ChevronDown className="w-10 h-10 text-primary animate-bounce" />
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-primary mb-4">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              <span className="text-sm font-medium">Key Features</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Everything you need to explore knowledge
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Powerful features to enhance your learning journey
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="glass-card hover-lift border-white/10">
            <CardContent className="p-8 text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-4 bg-gradient-to-br from-blue-500/20 to-blue-500/5 rounded-2xl">
                  <Brain className="w-8 h-8 text-blue-400" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white">
                AI-Powered Mind Maps
              </h3>
              <p className="text-gray-400">
                Generate comprehensive knowledge maps instantly with our
                advanced AI technology. Explore complex topics with ease.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card hover-lift border-white/10">
            <CardContent className="p-8 text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-4 bg-gradient-to-br from-purple-500/20 to-purple-500/5 rounded-2xl">
                  <Network className="w-8 h-8 text-purple-400" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white">
                Interactive Exploration
              </h3>
              <p className="text-gray-400">
                Click any concept to dive deeper with detailed explanations.
                Follow your curiosity and discover connections.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card hover-lift border-white/10">
            <CardContent className="p-8 text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-4 bg-gradient-to-br from-pink-500/20 to-pink-500/5 rounded-2xl">
                  <Lock className="w-8 h-8 text-pink-400" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white">
                Web3 Integration
              </h3>
              <p className="text-gray-400">
                Maintain a streak and get rewarded with tokens and NFTs for your
                consistent learning efforts.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold gradient-text mb-2">2,000+</div>
            <p className="text-gray-400">Active Users</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold gradient-text mb-2">500+</div>
            <p className="text-gray-400">Topics Covered</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold gradient-text mb-2">10,000+</div>
            <p className="text-gray-400">Mind Maps Created</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold gradient-text mb-2">98%</div>
            <p className="text-gray-400">Satisfaction Rate</p>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-primary mb-4">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span className="text-sm font-medium">How It Works</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Simple Process, Powerful Results
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Our platform makes learning complex topics easy and intuitive
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-purple-400 transform -translate-y-1/2 z-0"></div>

          {/* Step 1 */}
          <div className="relative z-10 glass-card p-6 rounded-xl border-white/10">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4 mx-auto">
              <span className="text-xl font-bold text-primary">1</span>
            </div>
            <h3 className="text-xl font-semibold text-white text-center mb-3">
              Enter Your Topic
            </h3>
            <p className="text-gray-400 text-center">
              Simply type in any subject or concept you want to explore and our
              AI will get to work.
            </p>
          </div>

          {/* Step 2 */}
          <div className="relative z-10 glass-card p-6 rounded-xl border-white/10">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4 mx-auto">
              <span className="text-xl font-bold text-primary">2</span>
            </div>
            <h3 className="text-xl font-semibold text-white text-center mb-3">
              Explore Mind Map
            </h3>
            <p className="text-gray-400 text-center">
              Navigate through the generated mind map to see how concepts
              connect and relate to each other.
            </p>
          </div>

          {/* Step 3 */}
          <div className="relative z-10 glass-card p-6 rounded-xl border-white/10">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4 mx-auto">
              <span className="text-xl font-bold text-primary">3</span>
            </div>
            <h3 className="text-xl font-semibold text-white text-center mb-3">
              Dive Deeper
            </h3>
            <p className="text-gray-400 text-center">
              Click on any node to get detailed explanations, examples, and key
              takeaways about that specific concept.
            </p>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-primary mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium">Testimonials</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            What Our Users Say
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="glass-card p-6 rounded-xl border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                <span className="text-xl font-bold text-blue-400">S</span>
              </div>
              <div>
                <h4 className="font-medium text-white">Sarah K.</h4>
                <p className="text-sm text-gray-400">Medical Student</p>
              </div>
            </div>
            <p className="text-gray-300">
              "ConceptBridge helped me understand complex medical concepts by
              breaking them down visually. The explanations are clear and
              concise!"
            </p>
          </div>

          <div className="glass-card p-6 rounded-xl border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                <span className="text-xl font-bold text-purple-400">M</span>
              </div>
              <div>
                <h4 className="font-medium text-white">Michael T.</h4>
                <p className="text-sm text-gray-400">Computer Science Major</p>
              </div>
            </div>
            <p className="text-gray-300">
              "I use this platform to prepare for exams. The mind maps help me
              see connections between different programming concepts that I
              missed before."
            </p>
          </div>

          <div className="glass-card p-6 rounded-xl border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center">
                <span className="text-xl font-bold text-pink-400">J</span>
              </div>
              <div>
                <h4 className="font-medium text-white">Jessica L.</h4>
                <p className="text-sm text-gray-400">High School Teacher</p>
              </div>
            </div>
            <p className="text-gray-300">
              "I recommend ConceptBridge to all my students. It's an incredible
              tool for visual learners and helps them grasp difficult subjects
              quickly."
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-20">
        <Card className="bg-gradient-to-r from-primary/20 to-purple-400/20 border-white/10">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center space-y-6">
            <div className="absolute bg-gradient-to-r from-primary/30 to-purple-400/30 rounded-xl blur-xl opacity-50"></div>
            <div className="relative">
              <h2 className="text-4xl font-bold text-white">
                Ready to transform your learning?
              </h2>
              <p className="text-xl text-gray-300 mt-4 max-w-2xl">
                Join thousands of knowledge explorers and start your journey
                today.
              </p>
              <Link to="/mindmap" className="mt-8 inline-block">
                <Button className="bg-white hover:bg-gray-100 text-primary hover:text-primary/90 px-8 py-6 text-lg rounded-xl shadow-lg flex items-center gap-2">
                  Get Started for Free
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center border-t border-white/10 pt-8">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <span className="text-gray-400">
              © 2024 ConceptBridge. All rights reserved.
            </span>
          </div>
          <div className="flex gap-6 text-gray-400">
            <a href="#" className="hover:text-white transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
