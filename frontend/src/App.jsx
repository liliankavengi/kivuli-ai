import { useState } from 'react'
import { 
  TrendingUp, 
  Shield, 
  Building2, 
  Sparkles, 
  Loader2,
  Wallet,
  LineChart,
  Award,
  Zap,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Star,
  Users,
  Clock,
  BarChart3
} from 'lucide-react'

function App() {
  const [businessId, setBusinessId] = useState('')
  const [trustScore, setTrustScore] = useState(null)
  const [mentorshipAdvice, setMentorshipAdvice] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showResults, setShowResults] = useState(false)

  // Mock data - no backend needed for now
  const mockData = {
    'BIZ-001': { score: 87, advice: 'Excellent transaction consistency! Your M-Pesa records show steady growth of 23% over 3 months. Tip: Consider diversifying your income streams to reach 90+ score.' },
    'BIZ-002': { score: 54, advice: 'Your transaction volume fluctuates significantly. Focus on maintaining daily minimum balance above KES 5,000 for 30 days to improve score.' },
    'BIZ-003': { score: 92, advice: 'Outstanding! You\'re in the top 5% of SMEs. Your repayment behavior is exemplary. You qualify for premium lending rates.' },
    'BIZ-004': { score: 43, advice: 'Low transaction frequency detected. Increase daily M-Pesa activity and reduce cash-based transactions to build digital trust.' },
  }

  const handleSubmit = async () => {
    if (!businessId.trim()) {
      setError('Please enter a Business ID')
      return
    }

    setLoading(true)
    setError('')
    setShowResults(false)

    // Simulate API delay
    setTimeout(() => {
      const result = mockData[businessId.toUpperCase()]
      
      if (result) {
        setTrustScore(result.score)
        setMentorshipAdvice(result.advice)
        setShowResults(true)
        setError('')
      } else {
        setError('Business ID not found. Try: BIZ-001, BIZ-002, BIZ-003, or BIZ-004')
        setTrustScore(null)
        setShowResults(false)
      }
      setLoading(false)
    }, 1500)
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'from-emerald-500 to-teal-500'
    if (score >= 60) return 'from-blue-500 to-cyan-500'
    if (score >= 40) return 'from-yellow-500 to-orange-500'
    return 'from-red-500 to-rose-500'
  }

  const getScoreEmoji = (score) => {
    if (score >= 80) return '🏆'
    if (score >= 60) return '📈'
    if (score >= 40) return '⚠️'
    return '🔴'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sky-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      {/* Header */}
      <header className="relative bg-white/80 backdrop-blur-md border-b border-sky-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-sky-500 to-emerald-500 p-2.5 rounded-xl shadow-lg">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-sky-700 to-emerald-600 bg-clip-text text-transparent">
                  Kivuli AI
                </h1>
                <p className="text-slate-500 text-sm">Trust Score Engine for Kenyan SMEs</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-200">
              <Zap className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-semibold text-emerald-700">Powered by Gemini 3 Flash</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 pt-12 pb-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-yellow-100 px-4 py-2 rounded-full mb-6 border border-yellow-300">
            <Award className="w-4 h-4 text-yellow-700" />
            <span className="text-sm font-semibold text-yellow-800">UN SDG 8 Certified</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-slate-800 mb-4">
            Transform Your{' '}
            <span className="bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent">
              M-Pesa Records
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Get your AI-powered Trust Score in seconds. Bridge the credit gap and unlock financial opportunities.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-6 py-12">
        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { icon: Users, label: 'SMEs Onboarded', value: '2,847', color: 'sky' },
            { icon: Wallet, label: 'Total Transactions', value: 'KES 4.2B', color: 'emerald' },
            { icon: Clock, label: 'Avg Response', value: '2.3s', color: 'purple' },
            { icon: BarChart3, label: 'Trust Accuracy', value: '94.7%', color: 'orange' },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-md border border-slate-200 hover:shadow-xl transition-all">
              <div className={`bg-${stat.color}-100 w-12 h-12 rounded-xl flex items-center justify-center mb-3`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
              <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
              <p className="text-sm text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Input Card - Bright & Vibrant */}
        <div className="bg-gradient-to-br from-sky-500 via-emerald-500 to-teal-500 rounded-3xl p-8 shadow-2xl mb-12">
          <div className="bg-white/95 backdrop-blur rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-sky-500 to-emerald-500 p-2 rounded-xl">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800">Check Your Trust Score</h3>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                value={businessId}
                onChange={(e) => setBusinessId(e.target.value)}
                placeholder="Enter Business ID (e.g., BIZ-001, BIZ-002, BIZ-003, BIZ-004)"
                className="flex-1 px-6 py-4 bg-slate-50 border-2 border-sky-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-400 focus:bg-white transition-all text-lg"
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              />
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-10 py-4 bg-gradient-to-r from-sky-600 to-emerald-600 hover:from-sky-500 hover:to-emerald-500 rounded-xl font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg hover:shadow-xl text-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing M-Pesa Data...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Trust Score
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>

            {error && (
              <div className="mt-6 p-4 bg-rose-50 border-2 border-rose-200 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                <span className="text-rose-800">{error}</span>
              </div>
            )}
          </div>
        </div>

        {/* Results Section */}
        {showResults && trustScore !== null && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Trust Score Card - Dynamic Colors */}
            <div className={`bg-gradient-to-br ${getScoreColor(trustScore)} rounded-3xl p-8 shadow-2xl transform hover:scale-[1.02] transition-all`}>
              <div className="flex items-center justify-between flex-wrap gap-6">
                <div className="text-white">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-6 h-6" />
                    <p className="text-white/90 text-sm uppercase tracking-wider font-semibold">Kivuli Trust Score</p>
                  </div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-7xl md:text-8xl font-black">{trustScore}</span>
                    <span className="text-white/70 text-2xl">/ 100</span>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-2xl">{getScoreEmoji(trustScore)}</span>
                    <span className="text-white/90 font-semibold">
                      {trustScore >= 80 ? 'Excellent Credit Worthiness' :
                       trustScore >= 60 ? 'Good Standing' :
                       trustScore >= 40 ? 'Moderate Risk' : 'High Risk'}
                    </span>
                  </div>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-2xl p-5">
                  <Star className="w-16 h-16 text-white" />
                </div>
              </div>
            </div>

            {/* Mentorship Advice Card */}
            <div className="bg-white rounded-2xl shadow-xl border-2 border-sky-100 overflow-hidden">
              <div className="bg-gradient-to-r from-sky-50 to-emerald-50 px-8 py-5 border-b border-sky-100">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-sky-500 to-emerald-500 p-2 rounded-xl">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-800">AI-Generated Mentorship</h4>
                  <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full ml-2">Powered by Gemini 3 Flash</span>
                </div>
              </div>
              <div className="p-8">
                <p className="text-slate-700 text-lg leading-relaxed">
                  {mentorshipAdvice}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center pt-4">
              <button 
                onClick={() => {
                  setBusinessId('')
                  setShowResults(false)
                  setTrustScore(null)
                }}
                className="px-6 py-3 bg-white border-2 border-sky-200 rounded-xl text-slate-700 font-semibold hover:bg-sky-50 transition-all"
              >
                Check Another Business
              </button>
              <button className="px-6 py-3 bg-gradient-to-r from-sky-600 to-emerald-600 rounded-xl text-white font-semibold hover:shadow-lg transition-all flex items-center gap-2">
                Download Report PDF
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Features Section */}
        {!showResults && !loading && (
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {[
              { icon: Wallet, title: 'M-Pesa Integration', desc: 'Analyzes transaction patterns from your M-Pesa records', color: 'emerald' },
              { icon: LineChart, title: 'Real-time Scoring', desc: 'Instant Trust Score based on 20+ financial metrics', color: 'sky' },
              { icon: Shield, title: 'Secure & Private', desc: 'Your data is encrypted and never shared', color: 'purple' },
            ].map((feature, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-md border border-slate-200 hover:shadow-xl transition-all">
                <div className={`bg-${feature.color}-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4`}>
                  <feature.icon className={`w-7 h-7 text-${feature.color}-600`} />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">{feature.title}</h3>
                <p className="text-slate-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative bg-white border-t border-sky-200 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <span className="text-sm text-slate-600">Supporting UN Sustainable Development Goal 8</span>
            </div>
            <p className="text-sm text-slate-500">© 2026 Kivuli AI — Financial Inclusion for Kenyan SMEs</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App