import { Navigation } from "@/components/Navigation";
import { Stats } from "@/components/Stats";
import Link from "next/link";
import { 
  ArrowRight, 
  BarChart3,
  Shield, 
  Zap
} from "lucide-react";

const features = [
  {
    icon: BarChart3,
    title: "Create Polls",
    description: "Create engaging polls with multiple options and real-time results",
    color: "blue"
  },
  {
    icon: Zap,
    title: "Real-time Results",
    description: "See results update instantly as votes come in with beautiful visualizations",
    color: "purple"
  },
  {
    icon: Shield,
    title: "Secure Voting",
    description: "Secure voting system with duplicate vote prevention and session tracking",
    color: "green"
  }
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-20 animate-fade-in">
          <div className="mb-8">
            <h1 className="text-6xl md:text-7xl font-bold text-center mb-6 leading-relaxed">
              <div className="flex flex-col items-center justify-center gap-2">
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 dark:from-blue-400 dark:via-purple-400 dark:to-blue-600 bg-clip-text text-transparent leading-tight">
                  Create & Manage
                </span>
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent leading-tight pb-2">
                  Polls
                </span>
              </div>
            </h1>
          </div>
          
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Build engaging polls with real-time results, beautiful visualizations, and secure voting. Perfect for teams, events, and community engagement.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/auth/register"
              className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300 flex items-center"
            >
              Get Started
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
            <Link
              href="/auth/login"
              className="px-8 py-4 rounded-2xl font-semibold text-lg border-2 border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-600 transition-all duration-300"
            >
              Sign In
            </Link>
          </div>
        </section>

        {/* Stats Section */}
        <div className="animate-fade-in animate-fade-in-200">
          <Stats />
        </div>

        {/* Features Section */}
        <section className="mb-20 animate-fade-in animate-fade-in-400">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Why Choose PollVault?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Built with modern technology and user experience in mind
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 border border-white/20 dark:border-gray-700/20 shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <div className={`w-16 h-16 bg-gradient-to-br from-${feature.color}-100 to-${feature.color}-200 dark:from-${feature.color}-900 dark:to-${feature.color}-800 rounded-2xl flex items-center justify-center mb-6`}>
                  <feature.icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white animate-fade-in animate-fade-in-400">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Ready to Get Started?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto text-white">
              Join thousands of users who are already creating engaging polls and gathering valuable insights
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/auth/register"
                className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-semibold text-lg shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300 flex items-center"
              >
                Start Creating Polls
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link
                href="/polls"
                className="border-2 border-white text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300"
              >
                Browse Polls
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
